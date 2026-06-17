import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * The prototype logs staff in with an ID (e.g. "Miyata") rather than an
 * email. Supabase Auth keys on email, so we map an ID to an internal
 * pseudo-email under a non-deliverable domain. No mail is ever sent here —
 * it's purely the auth identifier. If the input already looks like an email,
 * it's used as-is.
 */
export const STAFF_EMAIL_DOMAIN =
  process.env.NEXT_PUBLIC_STAFF_EMAIL_DOMAIN ?? "staff.miyata-athlete.jp";

export function idToEmail(input: string): string {
  const v = input.trim();
  if (v.includes("@")) return v.toLowerCase();
  return `${v.toLowerCase()}@${STAFF_EMAIL_DOMAIN}`;
}

/**
 * Server-side guard for /admin pages: returns the authenticated staff user
 * or redirects to the login screen. A logged-in user who is not in
 * public.staff is treated as unauthorized.
 */
export async function requireStaff() {
  // Gather auth + staff status defensively: any failure (missing env,
  // network, no session) resolves to "not staff" and we redirect to login.
  // redirect() throws NEXT_REDIRECT, so it must run OUTSIDE the try/catch.
  let user: { id: string } | null = null;
  let staff: { user_id: string; display_name: string | null } | null = null;
  try {
    const db = await createSupabaseServerClient();
    const res = await db.auth.getUser();
    user = res.data.user ?? null;
    if (user) {
      const { data } = await db
        .from("staff")
        .select("user_id,display_name")
        .eq("user_id", user.id)
        .maybeSingle();
      staff = data ?? null;
    }
  } catch {
    user = null;
    staff = null;
  }

  if (!user || !staff) redirect("/admin/login");
  return { user, staff };
}
