"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isLogin = mode === "login";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        setSuccess("Signed in successfully. Redirecting...");
        router.push("/read");
        router.refresh();
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/read`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      setSuccess("Account created. Check your email to verify your account.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
      <div>
        <h1
          className="text-2xl font-bold text-[var(--primary-800)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-[var(--neutral-500)]">
          {isLogin
            ? "Sign in to save bookmarks and create curriculum."
            : "Join Rhema to build curriculum, track progress, and save bookmarks."}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-transparent text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-transparent text-sm"
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-[var(--primary-600)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-700)] transition-colors disabled:opacity-60"
        >
          {submitting ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
        </button>
      </form>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <p className="text-sm text-[var(--neutral-500)] text-center">
        {isLogin ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </section>
  );
}
