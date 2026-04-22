"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const navLinks = [
  { href: "/read/genesis/1", label: "Read" },
  { href: "/study/john/1", label: "Study" },
  { href: "/curricula", label: "Curriculum" },
  { href: "/library", label: "Library" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <BookOpen
            size={24}
            className="text-[var(--primary-500)] group-hover:text-[var(--accent-500)] transition-colors"
          />
          <span
            className="text-xl tracking-wide text-[var(--primary-800)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Rhema
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--neutral-500)] hover:text-[var(--primary-600)] transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {!loading && !user && (
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--primary-500)] hover:text-[var(--primary-700)] transition-colors"
            >
              Sign in
            </Link>
          )}

          {!loading && user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-[var(--neutral-600)] hover:text-[var(--primary-600)] transition-colors"
              >
                <User size={16} />
                <span className="max-w-[120px] truncate">
                  {user.email?.split("@")[0]}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-lg py-1 z-50">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--neutral-600)] hover:bg-[var(--neutral-50)]"
                  >
                    My Curriculum
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--neutral-600)] hover:bg-[var(--neutral-50)] flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          <Link
            href="/create"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] transition-colors"
          >
            Create Curriculum
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[var(--neutral-500)] hover:text-[var(--primary-600)]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-[var(--neutral-600)] hover:text-[var(--primary-600)] py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
            {!loading && !user && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[var(--primary-500)] py-2"
              >
                Sign in
              </Link>
            )}
            {!loading && user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-[var(--neutral-600)] py-2"
                >
                  My Curriculum
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="text-left text-sm font-medium text-[var(--neutral-600)] py-2"
                >
                  Sign out
                </button>
              </>
            )}
            <Link
              href="/create"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium px-4 py-2.5 rounded-lg bg-[var(--primary-500)] text-white text-center"
            >
              Create Curriculum
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
