import { NextResponse } from "next/server";

import { buildRecommendations } from "@/lib/recommendations";
import { toLabInputs } from "@/lib/validators/labs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const labs = toLabInputs(body);
    const payload = buildRecommendations(labs);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[RECOMMEND]", error);
    return NextResponse.json({ error: "Unable to process lab inputs." }, { status: 400 });
  }
}
