import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { notifyStaffLine } from "@/lib/notify/line";
import { DAILY_TRIAL_LIMIT } from "@/lib/types";

// ---- input shapes (validated at the API boundary) ----
export interface TrialInput {
  event_date: string;
  gakunen?: string;
  sei?: string;
  mei?: string;
  furi_sei?: string;
  furi_mei?: string;
  tel?: string;
  email?: string;
}
export interface EnrollInput {
  plan_name: string;
  monthly_yen: number;
  first_month_yen: number;
  card_name?: string;
}
export interface CoachInput {
  name?: string;
  age?: string;
  experience?: string;
  contact?: string;
  motivation?: string;
}
export interface SponsorInput {
  company?: string;
  person?: string;
  contact?: string;
  message?: string;
}
export interface WithdrawInput {
  member_name?: string;
  course?: string;
  desired_month?: string;
  contact?: string;
  reason?: string;
}

const s = (v: unknown) =>
  typeof v === "string" ? v.trim().slice(0, 2000) : undefined;

/** Booked trial count for a given YYYY-MM-DD (used for capacity + availability). */
export async function trialBookedCount(eventDate: string): Promise<number> {
  const db = createSupabaseAdminClient();
  const { count } = await db
    .from("trial_entries")
    .select("id", { count: "exact", head: true })
    .eq("event_date", eventDate);
  return count ?? 0;
}

export async function createTrial(input: TrialInput) {
  const db = createSupabaseAdminClient();
  const booked = await trialBookedCount(input.event_date);
  if (booked >= DAILY_TRIAL_LIMIT) {
    return { ok: false as const, error: "FULL" as const };
  }
  const row = {
    event_date: input.event_date,
    gakunen: s(input.gakunen),
    sei: s(input.sei),
    mei: s(input.mei),
    furi_sei: s(input.furi_sei),
    furi_mei: s(input.furi_mei),
    tel: s(input.tel),
    email: s(input.email),
  };
  const { data, error } = await db
    .from("trial_entries")
    .insert(row)
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };
  await notifyStaffLine(
    `【体験・見学予約】\n日付: ${input.event_date}\nお名前: ${row.sei ?? ""} ${row.mei ?? ""}\n区分: ${row.gakunen ?? "-"}\n連絡先: ${row.tel || row.email || "-"}`,
  );
  return { ok: true as const, data };
}

export async function createEnrollment(input: EnrollInput) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("enrollments")
    .insert({
      plan_name: s(input.plan_name) ?? "",
      monthly_yen: input.monthly_yen,
      first_month_yen: input.first_month_yen,
      card_name: s(input.card_name),
    })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };
  await notifyStaffLine(
    `【入会申込】\nプラン: ${input.plan_name}\n初月: ¥${input.first_month_yen.toLocaleString()}\nお名前: ${s(input.card_name) ?? "-"}`,
  );
  return { ok: true as const, data };
}

export async function createCoachApplication(input: CoachInput) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("coach_applications")
    .insert({
      name: s(input.name),
      age: s(input.age),
      experience: s(input.experience),
      contact: s(input.contact),
      motivation: s(input.motivation),
    })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };
  await notifyStaffLine(
    `【コーチ応募】\nお名前: ${s(input.name) ?? "-"}\n年齢: ${s(input.age) ?? "-"}\n連絡先: ${s(input.contact) ?? "-"}`,
  );
  return { ok: true as const, data };
}

export async function createSponsorInquiry(input: SponsorInput) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("sponsor_inquiries")
    .insert({
      company: s(input.company),
      person: s(input.person),
      contact: s(input.contact),
      message: s(input.message),
    })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };
  await notifyStaffLine(
    `【スポンサーお問い合わせ】\n会社: ${s(input.company) ?? "-"}\nご担当: ${s(input.person) ?? "-"}\n連絡先: ${s(input.contact) ?? "-"}`,
  );
  return { ok: true as const, data };
}

export async function createWithdrawal(input: WithdrawInput) {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("withdrawals")
    .insert({
      member_name: s(input.member_name),
      course: s(input.course),
      desired_month: s(input.desired_month),
      contact: s(input.contact),
      reason: s(input.reason),
    })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };
  await notifyStaffLine(
    `【退会申請】\n会員: ${s(input.member_name) ?? "-"}\nコース: ${s(input.course) ?? "-"}\n希望月: ${s(input.desired_month) ?? "-"}`,
  );
  return { ok: true as const, data };
}
