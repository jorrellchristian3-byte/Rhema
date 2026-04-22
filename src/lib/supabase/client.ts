/**
 * Rhema — Supabase Client (Browser)
 *
 * Used in client components for auth and real-time features.
 */

import { createBrowserClient } from "@supabase/ssr";
import { assertAppEnv } from "@/lib/env";

export function createClient() {
  const env = assertAppEnv();

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
