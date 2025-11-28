import { NextRequest, NextResponse } from "next/server";

const ENGINE_URL = process.env.REC_ENGINE_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${ENGINE_URL}/api/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    // Try to parse JSON from the backend
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      // Backend didn't return JSON
      console.error("Engine non-JSON response:", text);
      return NextResponse.json(
        { error: "Recommendation engine returned a non-JSON response." },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error calling rec engine:", err);
    return NextResponse.json(
      { error: "Failed to reach recommendation engine." },
      { status: 500 },
    );
  }
}
