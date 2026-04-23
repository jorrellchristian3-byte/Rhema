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
  Bookmark,
  PenLine,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Curriculum } from "@/types";
import { BookmarkRecord } from "@/hooks/useBookmarks";

type Tab = "my-curriculum" | "in-progress" | "bookmarks" | "notes";

interface ProgressRecord {
  id: string;
  curriculum_id: string;
  current_step: number;
  completed_steps: number[];
  started_at: string;
  last_activity_at: string;
}

interface StudyNoteRecord {
  id: string;
  book: string;
  chapter: number;
  title: string;
  content: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("my-curriculum");
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);

  // Extra data for new tabs
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [notes, setNotes] = useState<StudyNoteRecord[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [progressCurricula, setProgressCurricula] = useState<Record<string, Curriculum>>({});
  const [progressLoading, setProgressLoading] = useState(false);

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
        const res = await fetch(`/api/curricula?limit=100`);
        if (res.ok) {
          const data = await res.json();
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

  // Fetch bookmarks when tab selected
  useEffect(() => {
    if (tab !== "bookmarks" || !user || bookmarks.length > 0) return;
    setBookmarksLoading(true);
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((d) => setBookmarks(d.bookmarks ?? []))
      .catch(console.error)
      .finally(() => setBookmarksLoading(false));
  }, [tab, user, bookmarks.length]);

  // Fetch notes when tab selected
  useEffect(() => {
    if (tab !== "notes" || !user || notes.length > 0) return;
    setNotesLoading(true);
    fetch("/api/study-notes")
      .then((r) => r.json())
      .then((d) => setNotes(d.notes ?? []))
      .catch(console.error)
      .finally(() => setNotesLoading(false));
  }, [tab, user, notes.length]);

  // Fetch progress when tab selected
  useEffect(() => {
    if (tab !== "in-progress" || !user || progress.length > 0) return;
    setProgressLoading(true);
    fetch("/api/progress")
      .then((r) => r.json())
      .then(async (d) => {
        const records: ProgressRecord[] = d.progress ?? [];
        setProgress(records);
        // Fetch curriculum details for each
        const curricMap: Record<string, Curriculum> = {};
        await Promise.all(
          records.map(async (p) => {
            try {
              const cr = await fetch(`/api/curricula/${p.curriculum_id}`);
              if (cr.ok) {
                const cd = await cr.json();
                if (cd.curriculum) curricMap[p.curriculum_id] = cd.curriculum;
              }
            } catch { /* ignore */ }
          })
        );
        setProgressCurricula(curricMap);
      })
      .catch(console.error)
      .finally(() => setProgressLoading(false));
  }, [tab, user, progress.length]);

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

  const handleDeleteBookmark = async (id: string) => {
    try {
      await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Delete bookmark failed:", err);
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
            Dashboard
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-20 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex items-center gap-1 overflow-x-auto">
          {([
            { id: "my-curriculum" as Tab, label: "My Curriculum", icon: BookOpen },
            { id: "in-progress" as Tab, label: "In Progress", icon: Clock },
            { id: "bookmarks" as Tab, label: "Bookmarks", icon: Bookmark },
            { id: "notes" as Tab, label: "Study Notes", icon: PenLine },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? "border-[var(--primary-500)] text-[var(--primary-700)]"
                  : "border-transparent text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        {/* ═══ My Curriculum Tab ═══ */}
        {tab === "my-curriculum" && (
          <>
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
                {drafts.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] mb-3">
                      Drafts
                    </h3>
                    <div className="space-y-2">
                      {drafts.map((c) => (
                        <CurriculumRow key={c.id} curriculum={c} onDelete={() => handleDelete(c.id)} />
                      ))}
                    </div>
                  </div>
                )}
                {published.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] mb-3">
                      Published
                    </h3>
                    <div className="space-y-2">
                      {published.map((c) => (
                        <CurriculumRow key={c.id} curriculum={c} onDelete={() => handleDelete(c.id)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ═══ In Progress Tab ═══ */}
        {tab === "in-progress" && (
          <>
            {progressLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[var(--primary-400)]" />
              </div>
            ) : progress.length === 0 ? (
              <div className="text-center py-20">
                <Clock size={48} className="mx-auto mb-4 text-[var(--neutral-300)]" />
                <p className="text-[var(--neutral-500)] mb-2">No curriculum in progress yet.</p>
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
            ) : (
              <div className="space-y-3">
                {progress.map((p) => {
                  const c = progressCurricula[p.curriculum_id];
                  const totalSteps = c?.steps?.length ?? 0;
                  const pct = totalSteps > 0 ? Math.round((p.completed_steps.length / totalSteps) * 100) : 0;
                  return (
                    <Link
                      key={p.id}
                      href={`/curricula/${p.curriculum_id}`}
                      className="flex items-center gap-4 bg-[var(--surface)] rounded-lg border border-[var(--border)] px-4 py-3 hover:border-[var(--primary-200)] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[var(--primary-800)] truncate">
                          {c?.title ?? "Curriculum"}
                        </h4>
                        <p className="text-xs text-[var(--neutral-400)] mt-0.5">
                          {p.completed_steps.length} of {totalSteps} steps · Last active{" "}
                          {new Date(p.last_activity_at).toLocaleDateString()}
                        </p>
                        <div className="mt-2 h-1.5 bg-[var(--neutral-100)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[var(--neutral-400)]" />
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══ Bookmarks Tab ═══ */}
        {tab === "bookmarks" && (
          <>
            {bookmarksLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[var(--primary-400)]" />
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-20">
                <Bookmark size={48} className="mx-auto mb-4 text-[var(--neutral-300)]" />
                <p className="text-[var(--neutral-500)] mb-2">No bookmarks yet.</p>
                <p className="text-sm text-[var(--neutral-400)]">
                  Tap any verse while reading to save a bookmark.
                </p>
                <Link
                  href="/read/genesis/1"
                  className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-lg text-sm font-medium text-[var(--primary-600)] border border-[var(--primary-200)] hover:bg-[var(--primary-50)] transition-colors"
                >
                  Start Reading
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-[var(--neutral-500)] mb-4">
                  {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
                </p>
                {bookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-start gap-3 bg-[var(--surface)] rounded-lg border border-[var(--border)] px-4 py-3"
                  >
                    <span
                      className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: b.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/read/${b.book.toLowerCase().replace(/\s+/g, "-")}/${b.chapter}`}
                        className="text-sm font-medium text-[var(--primary-700)] hover:text-[var(--primary-900)]"
                      >
                        {b.book} {b.chapter}
                        {b.verse_start ? `:${b.verse_start}` : ""}
                        {b.verse_end && b.verse_end !== b.verse_start ? `-${b.verse_end}` : ""}
                      </Link>
                      {b.note && (
                        <p className="text-xs text-[var(--neutral-500)] mt-1 line-clamp-2">
                          {b.note}
                        </p>
                      )}
                      <p className="text-xs text-[var(--neutral-400)] mt-1">
                        {new Date(b.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteBookmark(b.id)}
                      className="p-1 text-[var(--neutral-400)] hover:text-red-500 transition-colors flex-shrink-0"
                      title="Remove bookmark"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══ Study Notes Tab ═══ */}
        {tab === "notes" && (
          <>
            {notesLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[var(--primary-400)]" />
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-20">
                <PenLine size={48} className="mx-auto mb-4 text-[var(--neutral-300)]" />
                <p className="text-[var(--neutral-500)] mb-2">No study notes yet.</p>
                <p className="text-sm text-[var(--neutral-400)]">
                  Open the Study view on any chapter to start taking notes.
                </p>
                <Link
                  href="/study/john/1"
                  className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-lg text-sm font-medium text-[var(--primary-600)] border border-[var(--primary-200)] hover:bg-[var(--primary-50)] transition-colors"
                >
                  Start Studying
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-[var(--neutral-500)] mb-4">
                  {notes.length} note{notes.length !== 1 ? "s" : ""}
                </p>
                {notes.map((n) => (
                  <Link
                    key={n.id}
                    href={`/study/${n.book.toLowerCase().replace(/\s+/g, "-")}/${n.chapter}`}
                    className="flex items-start gap-3 bg-[var(--surface)] rounded-lg border border-[var(--border)] px-4 py-3 hover:border-[var(--primary-200)] transition-colors"
                  >
                    <PenLine size={16} className="mt-0.5 text-[var(--primary-400)] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[var(--primary-800)] truncate">
                        {n.title || `${n.book} ${n.chapter} Notes`}
                      </h4>
                      {n.content && (
                        <p className="text-xs text-[var(--neutral-500)] mt-1 line-clamp-2">
                          {n.content.slice(0, 150)}
                        </p>
                      )}
                      <p className="text-xs text-[var(--neutral-400)] mt-1">
                        {n.book} {n.chapter} · Updated {new Date(n.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight size={16} className="mt-0.5 text-[var(--neutral-400)] flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </>
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
