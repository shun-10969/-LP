import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  TrialEntry,
  Enrollment,
  CoachApplication,
  SponsorInquiry,
  Withdrawal,
  SubmissionCategory,
} from "@/lib/types";

export interface AdminData {
  trial: TrialEntry[];
  enrollment: Enrollment[];
  coach: CoachApplication[];
  sponsor: SponsorInquiry[];
  withdrawal: Withdrawal[];
  lastSeen: Record<SubmissionCategory, string | null>;
}

/**
 * Loads every submission category plus this staff user's "last seen"
 * timestamps (for unread badges). Requires an authenticated staff session;
 * RLS guarantees a non-staff user gets nothing.
 */
export async function loadAdminData(): Promise<AdminData> {
  const db = await createSupabaseServerClient();

  const [trial, enrollment, coach, sponsor, withdrawal, views] =
    await Promise.all([
      db.from("trial_entries").select("*").order("created_at", { ascending: false }),
      db.from("enrollments").select("*").order("created_at", { ascending: false }),
      db.from("coach_applications").select("*").order("created_at", { ascending: false }),
      db.from("sponsor_inquiries").select("*").order("created_at", { ascending: false }),
      db.from("withdrawals").select("*").order("created_at", { ascending: false }),
      db.from("admin_views").select("category,last_seen_at"),
    ]);

  const lastSeen: Record<SubmissionCategory, string | null> = {
    trial: null,
    enrollment: null,
    coach: null,
    sponsor: null,
    withdrawal: null,
  };
  for (const v of views.data ?? []) {
    lastSeen[v.category as SubmissionCategory] = v.last_seen_at;
  }

  return {
    trial: trial.data ?? [],
    enrollment: enrollment.data ?? [],
    coach: coach.data ?? [],
    sponsor: sponsor.data ?? [],
    withdrawal: withdrawal.data ?? [],
    lastSeen,
  };
}

/** Count of records newer than the staff user's last-seen time for a category. */
export function unreadCount(
  rows: { created_at: string }[],
  lastSeen: string | null,
): number {
  if (!lastSeen) return rows.length;
  const t = new Date(lastSeen).getTime();
  return rows.filter((r) => new Date(r.created_at).getTime() > t).length;
}

/** Marks a category as seen (now) for the current staff user. */
export async function markCategorySeen(category: SubmissionCategory) {
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return;
  await db
    .from("admin_views")
    .upsert(
      { user_id: user.id, category, last_seen_at: new Date().toISOString() },
      { onConflict: "user_id,category" },
    );
}
