"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { markCategorySeen } from "@/lib/admin";
import type { SubmissionCategory } from "@/lib/types";

const VALID: SubmissionCategory[] = [
  "trial",
  "enrollment",
  "coach",
  "sponsor",
  "withdrawal",
];

/** Marks a category as seen for the current staff user (clears the new dot). */
export async function markSeenAction(category: SubmissionCategory) {
  if (!VALID.includes(category)) return;
  await markCategorySeen(category);
}

/** Signs the staff user out and returns to the login screen. */
export async function logoutAction() {
  const db = await createSupabaseServerClient();
  await db.auth.signOut();
  redirect("/admin/login");
}
