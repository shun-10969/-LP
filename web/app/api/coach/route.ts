import { NextResponse } from "next/server";
import { createCoachApplication } from "@/lib/submissions";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_JSON" }, { status: 400 });
  }
  const res = await createCoachApplication(body);
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}
