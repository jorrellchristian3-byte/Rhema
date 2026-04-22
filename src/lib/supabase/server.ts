/**
 * Rhema — Supabase Client (Server)
 *
 * Used in server components, API routes, and server actions.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertAppEnv } from "@/lib/env";

export async function createClient() {
  const env = assertAppEnv();
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from Server Components where cookies
            // can't be set — this is expected and safe to ignore
          }
        },
      },
    }
  );
}
