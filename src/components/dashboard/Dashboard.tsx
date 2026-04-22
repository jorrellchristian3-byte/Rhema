"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileEdit,
  Globe,
  Clock,
  Trash2,
  Eye,
  BookOpen,
  Loader2,
  User,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Curriculum } from "@/types";

type Tab = "my-curriculum" | "in-progress";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("my-curriculum");
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch user's curriculum
  useEffect(() => {
    if (!user) return;

    async function fetchMyCurriculum() {
      setLoading(true);
      try {
        // Fetch all curriculum (we'll filter client-side for now)
        const res = await fetch(`/api/curricula?limit=100`);
        if (res.ok) {
          const data = await res.json();
          // Filter to only this user's curriculum
          const mine = (data.curricula ?? []).filter(
            (c: Curriculum) => c.author_id === user?.id
          );
          setCurricula(mine);
        }
      } catch (err) {
        console.error("Failed to fetch curriculum:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyCurriculum();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[var(--primary-400)]" />
      </div>
    );
  }

  if (!user) return null;

  const drafts = curricula.filter((c) => !c.is_published);
  const published = curricula.filter((c) => c.is_published);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this curriculum?")) return;
    try {
      await fetch(`/api/curricula/${id}`, { method: "DELETE" });
      setCurricula(curricula.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--primary-900)] text-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-[var(--primary-300)]" />
            <span className="text-sm text-[var(--primary-300)]">
              {user.email}
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            My Curriculum
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-20 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex items-center gap-1">
          <button
            onClick={() => setTab("my-curriculum")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "my-curriculum"
                ? "border-[var(--primary-500)] text-[var(--primary-700)]"
                : "border-transparent text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
            }`}
          >
            My Curriculum
          </button>
          <button
            onClick={() => setTab("in-progress")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "in-progress"
                ? "border-[var(--primary-500)] text-[var(--primary-700)]"
                : "border-transparent text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {tab === "my-curriculum" && (
          <>
            {/* Action bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[var(--neutral-500)]">
                {drafts.length} draft{drafts.length !== 1 ? "s" : ""} · {published.length} published
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--primary-600)] hover:bg-[var(--primary-700)] transition-colors"
              >
                <Plus size={16} />
                New Curriculum
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[var(--primary-400)]" />
              </div>
            ) : curricula.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={48} className="mx-auto mb-4 text-[var(--neutral-300)]" />
                <p className="text-[var(--neutral-500)] mb-2">
                  You haven't created any curriculum yet.
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-lg text-sm font-medium text-white bg-[var(--primary-600)] hover:bg-[var(--primary-700)] transition-colors"
                >
                  <Plus size={16} />
                  Create Your First
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Drafts */}
                {drafts.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] mb-3">
                      Drafts
                    </h3>
                    <div className="space-y-2">
                      {drafts.map((c) => (
                        <CurriculumRow
                          key={c.id}
                          curriculum={c}
                          onDelete={() => handleDelete(c.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Published */}
                {published.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] mb-3">
                      Published
                    </h3>
                    <div className="space-y-2">
                      {published.map((c) => (
                        <CurriculumRow
                          key={c.id}
                          curriculum={c}
                          onDelete={() => handleDelete(c.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {tab === "in-progress" && (
          <div className="text-center py-20">
            <Clock size={48} className="mx-auto mb-4 text-[var(--neutral-300)]" />
            <p className="text-[var(--neutral-500)] mb-2">
              No curriculum in progress yet.
            </p>
            <p className="text-sm text-[var(--neutral-400)]">
              Start following a curriculum from the library and your progress will show here.
            </p>
            <Link
              href="/curricula"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-lg text-sm font-medium text-[var(--primary-600)] border border-[var(--primary-200)] hover:bg-[var(--primary-50)] transition-colors"
            >
              Browse Curriculum
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Row Component ──

function CurriculumRow({
  curriculum,
  onDelete,
}: {
  curriculum: Curriculum;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-4 bg-[var(--surface)] rounded-lg border border-[var(--border)] px-4 py-3 hover:border-[var(--primary-200)] transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-[var(--primary-800)] truncate">
            {curriculum.title}
          </h4>
          <span
            className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
              curriculum.is_published
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            {curriculum.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="text-xs text-[var(--neutral-400)] mt-0.5">
          {curriculum.category.replace("-", " ")} · Updated{" "}
          {new Date(curriculum.updated_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Link
          href={`/curricula/${curriculum.id}`}
          className="p-2 text-[var(--neutral-400)] hover:text-[var(--primary-600)] transition-colors"
          title="View"
        >
          <Eye size={16} />
        </Link>
        <Link
          href={`/create?edit=${curriculum.id}`}
          className="p-2 text-[var(--neutral-400)] hover:text-[var(--primary-600)] transition-colors"
          title="Edit"
        >
          <FileEdit size={16} />
        </Link>
        <button
          onClick={onDelete}
          className="p-2 text-[var(--neutral-400)] hover:text-red-500 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
