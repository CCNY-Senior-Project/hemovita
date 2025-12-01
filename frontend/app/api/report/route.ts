// frontend/app/api/report/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";

const REC_ENGINE_URL =
  process.env.REC_ENGINE_URL ?? "http://127.0.0.1:8000";

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();

    const body = await req.json();
    const { labs, patient, diet_filter } = body ?? {};

    if (!labs || typeof labs !== "object") {
      return NextResponse.json(
        { error: "Missing labs payload" },
        { status: 400 }
      );
    }

    // ---- 1) Call FastAPI backend ----
    const backendRes = await fetch(`${REC_ENGINE_URL}/api/report`, {
      // 👆 IMPORTANT: /api/report (not /report)
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        labs,
        patient,
        diet_filter: diet_filter ?? null,
      }),
    });

    if (!backendRes.ok) {
      const text = await backendRes.text();
      return new NextResponse(
        text || `Backend error (status ${backendRes.status})`,
        { status: backendRes.status }
      );
    }

    const reportJson = await backendRes.json();

    // ---- 2) Save lab entry for logged-in user ----
    if (session?.user?.id) {
      await prisma.labEntry.create({
        data: {
          userId: session.user.id,

          // match schema.prisma fields
          Hemoglobin: labs.Hemoglobin ?? null,
          MCV: labs.MCV ?? null,
          ferritin: labs.ferritin ?? null,
          vitamin_B12: labs.vitamin_B12 ?? null,
          folate_plasma: labs.folate_plasma ?? null,
          vitamin_D: labs.vitamin_D ?? null,
          magnesium: labs.magnesium ?? null,
          zinc: labs.zinc ?? null,
          calcium: labs.calcium ?? null,
          vitamin_C: labs.vitamin_C ?? null,
          vitamin_A: labs.vitamin_A ?? null,
          vitamin_E: labs.vitamin_E ?? null,
          vitamin_B6: labs.vitamin_B6 ?? null,
          homocysteine: labs.homocysteine ?? null,
        },
      });
    }

    // ---- 3) Return backend response to the client ----
    return NextResponse.json(reportJson);
  } catch (err) {
    console.error("Error in /api/report:", err);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
