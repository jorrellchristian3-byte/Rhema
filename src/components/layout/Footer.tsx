import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--neutral-50)] mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={20} className="text-[var(--primary-500)]" />
              <span
                className="text-lg tracking-wide text-[var(--primary-800)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Rhema
              </span>
            </div>
            <p className="text-sm text-[var(--neutral-500)] leading-relaxed">
              Free, open-source Bible study and curriculum platform. Built for
              the church, by the church.
            </p>
          </div>

          {/* Study */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] mb-3">
              Study
            </h4>
            <div className="space-y-2">
              <Link href="/read/genesis/1" className="block text-sm text-[var(--neutral-600)] hover:text-[var(--primary-600)]">Read Scripture</Link>
              <Link href="/curricula" className="block text-sm text-[var(--neutral-600)] hover:text-[var(--primary-600)]">Browse Curriculum</Link>
              <Link href="/library" className="block text-sm text-[var(--neutral-600)] hover:text-[var(--primary-600)]">Resource Library</Link>
            </div>
          </div>

          {/* Create */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] mb-3">
              Create
            </h4>
            <div className="space-y-2">
              <Link href="/curricula/create" className="block text-sm text-[var(--neutral-600)] hover:text-[var(--primary-600)]">Build a Curriculum</Link>
              <Link href="/signup" className="block text-sm text-[var(--neutral-600)] hover:text-[var(--primary-600)]">Create Account</Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] mb-3">
              About
            </h4>
            <div className="space-y-2">
              <span className="block text-sm text-[var(--neutral-600)]">Open Source</span>
              <span className="block text-sm text-[var(--neutral-600)]">Free Forever</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--neutral-400)] text-center">
            Rhema is free and open-source software. Scripture text provided by
            public domain and openly licensed translations.
          </p>
        </div>
      </div>
    </footer>
  );
}
