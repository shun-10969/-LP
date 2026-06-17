#!/usr/bin/env node
/**
 * Creates (or updates) a staff login for the admin dashboard.
 *
 * The dashboard authenticates via Supabase Auth. Staff log in with an ID
 * (e.g. "Miyata") which maps to an internal pseudo-email
 * `<id>@<STAFF_EMAIL_DOMAIN>`. This script creates that auth user and marks
 * it as staff in public.staff. Safe to re-run (idempotent).
 *
 * Usage (from repo root):
 *   node supabase/setup-staff.mjs
 *
 * Reads from environment (or web/.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   STAFF_ID            (default "Miyata")
 *   STAFF_PASSWORD      (default "Miyata0305")
 *   NEXT_PUBLIC_STAFF_EMAIL_DOMAIN (default "staff.miyata-athlete.jp")
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve @supabase/supabase-js from the web app's node_modules.
const require = createRequire(join(__dirname, "..", "web", "package.json"));
const { createClient } = require("@supabase/supabase-js");

// Light .env.local loader (no dependency) — env vars take precedence.
function loadEnv() {
  const env = { ...process.env };
  try {
    const file = readFileSync(join(__dirname, "..", "web", ".env.local"), "utf8");
    for (const line of file.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on process.env */
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const id = env.STAFF_ID || "Miyata";
const password = env.STAFF_PASSWORD || "Miyata0305";
const domain = env.NEXT_PUBLIC_STAFF_EMAIL_DOMAIN || "staff.miyata-athlete.jp";

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Fill web/.env.local first.",
  );
  process.exit(1);
}

const email = `${id.toLowerCase()}@${domain}`;
const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(targetEmail) {
  // paginate listUsers until we find it
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email === targetEmail);
    if (hit) return hit;
    if (data.users.length < 200) break;
  }
  return null;
}

async function main() {
  console.log(`Setting up staff "${id}" → ${email}`);
  let user = await findUserByEmail(email);

  if (user) {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
    });
    if (error) throw error;
    console.log("Updated existing auth user password.");
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
    console.log("Created auth user.");
  }

  const { error: staffErr } = await admin
    .from("staff")
    .upsert({ user_id: user.id, display_name: id }, { onConflict: "user_id" });
  if (staffErr) throw staffErr;

  console.log("✓ Staff ready. Login with ID:", id, "/ password: (the one you set)");
}

main().catch((e) => {
  console.error("Setup failed:", e.message || e);
  process.exit(1);
});
