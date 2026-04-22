import Link from "next/link";
import { BookOpen } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Create Account — Rhema",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <BookOpen size={28} className="text-[var(--primary-500)] group-hover:text-[var(--accent-500)] transition-colors" />
        <span className="text-2xl tracking-wide text-[var(--primary-800)]" style={{ fontFamily: "var(--font-serif)" }}>
          Rhema
        </span>
      </Link>
      <AuthForm mode="signup" />
    </main>
  );
}
