import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client — used by the admin login form (Client Component)
 * to sign in with email/password and establish the session cookie.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
