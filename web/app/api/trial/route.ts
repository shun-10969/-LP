import { NextResponse } from "next/server";
import { createTrial, trialBookedCount } from "@/lib/submissions";
import { DAILY_TRIAL_LIMIT } from "@/lib/types";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_JSON" }, { status: 400 });
  }
  const event_date = typeof body.event_date === "string" ? body.event_date : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event_date)) {
    return NextResponse.json(
      { ok: false, error: "DATE_REQUIRED" },
      { status: 400 },
    );
  }
  const res = await createTrial({ ...body, event_date });
  if (!res.ok) {
    const status = res.error === "FULL" ? 409 : 500;
    return NextResponse.json(res, { status });
  }
  return NextResponse.json(res);
}

// Availability: GET /api/trial?date=YYYY-MM-DD -> remaining slots
export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { ok: false, error: "DATE_REQUIRED" },
      { status: 400 },
    );
  }
  const booked = await trialBookedCount(date);
  return NextResponse.json({
    ok: true,
    date,
    booked,
    limit: DAILY_TRIAL_LIMIT,
    remaining: Math.max(0, DAILY_TRIAL_LIMIT - booked),
  });
}
