import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  ESV_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ESV_API_KEY: process.env.ESV_API_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten());
}

export const env = parsed.success ? parsed.data : null;

export function assertAppEnv() {
  if (!env) {
    throw new Error("Missing or invalid required environment variables");
  }

  return env;
}
