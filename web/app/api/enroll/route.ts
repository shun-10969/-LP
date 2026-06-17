import { NextResponse } from "next/server";
import { createEnrollment } from "@/lib/submissions";
import { COURSE_PLANS } from "@/lib/types";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_JSON" }, { status: 400 });
  }
  const plan_name = typeof body.plan_name === "string" ? body.plan_name : "";
  // Resolve price from the server-side catalogue so the client can't set it.
  const plan = COURSE_PLANS.find((p) => p.title === plan_name);
  if (!plan) {
    return NextResponse.json(
      { ok: false, error: "UNKNOWN_PLAN" },
      { status: 400 },
    );
  }
  const res = await createEnrollment({
    plan_name: plan.title,
    monthly_yen: plan.monthlyYen,
    first_month_yen: plan.firstMonthYen,
    card_name: typeof body.card_name === "string" ? body.card_name : undefined,
  });
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}
