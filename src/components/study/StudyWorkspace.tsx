"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PenLine,
  Lightbulb,
  Loader2,
  Save,
  Check,
  Plus,
  Trash2,
  FileText,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { Verse, TranslationId, StudyNote } from "@/types";
import { getBook, BIBLE_BOOKS } from "@/lib/bible/books";
import TranslationPicker from "@/components/scripture/TranslationPicker";
import { getTopicsForBook, type TheologicalTopic } from "@/lib/theology/topics";
import { useAuth } from "@/components/auth/AuthProvider";

// ── Props ──

interface StudyWorkspaceProps {
  bookId: string;
  bookName: string;
  chapter: number;
  totalChapters: number;
  initialVerses: Verse[];
}

// ── Panel type ──

type RightPanel = "notes" | "resources";

export default function StudyWorkspace({
  bookId,
  bookName,
  chapter,
  totalChapters,
  initialVerses,
}: StudyWorkspaceProps) {
  const { user } = useAuth();

  // ── Scripture state ──
  const [verses, setVerses] = useState<Verse[]>(initialVerses);
  const [translation, setTranslation] = useState<TranslationId>("KJV");
  const [loading, setLoading] = useState(false);

  // ── Panel state ──
  const [rightPanel, setRightPanel] = useState<RightPanel>("notes");
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  // ── Notes state ──
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteSaveStatus, setNoteSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [notesLoading, setNotesLoading] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Resources state ──
  const [relatedTopics, setRelatedTopics] = useState<TheologicalTopic[]>([]);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  // ── Navigation ──
  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
  const prevChapter =
    chapter > 1
      ? { book: bookId, chapter: chapter - 1 }
      : bookIndex > 0
        ? { book: BIBLE_BOOKS[bookIndex - 1].id, chapter: BIBLE_BOOKS[bookIndex - 1].chapters }
        : null;
  const nextChapter =
    chapter < totalChapters
      ? { book: bookId, chapter: chapter + 1 }
      : bookIndex < BIBLE_BOOKS.length - 1
        ? { book: BIBLE_BOOKS[bookIndex + 1].id, chapter: 1 }
        : null;

  // ── Fetch translation ──
  const fetchTranslation = useCallback(
    async (newTranslation: TranslationId) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/scripture/${encodeURIComponent(bookName)}/${chapter}?translation=${newTranslation}`
        );
        if (res.ok) {
          const data = await res.json();
          setVerses(data.verses ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch translation:", err);
      } finally {
        setLoading(false);
      }
    },
    [bookName, chapter]
  );

  useEffect(() => {
    if (translation !== "KJV") {
      fetchTranslation(translation);
    }
  }, [translation, fetchTranslation]);

  // ── Load related topics ──
  useEffect(() => {
    const topics = getTopicsForBook(bookName);
    setRelatedTopics(topics);
  }, [bookName]);

  // ── Load notes ──
  useEffect(() => {
    if (!user) return;

    async function loadNotes() {
      setNotesLoading(true);
      try {
        const res = await fetch(
          `/api/study-notes?book=${encodeURIComponent(bookName)}&chapter=${chapter}`
        );
        if (res.ok) {
          const data = await res.json();
          setNotes(data.notes ?? []);
          // Auto-select the most recent note
          if (data.notes?.length > 0) {
            const latest = data.notes[0];
            setActiveNoteId(latest.id);
            setNoteTitle(latest.title);
            setNoteContent(latest.content);
          }
        }
      } catch (err) {
        console.error("Failed to load notes:", err);
      } finally {
        setNotesLoading(false);
      }
    }

    loadNotes();
  }, [user, bookName, chapter]);

  // ── Create new note ──
  const createNote = async () => {
    if (!user) return;

    try {
      const res = await fetch("/api/study-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: bookName,
          chapter,
          title: `${bookName} ${chapter} Notes`,
          content: "",
        }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes([note, ...notes]);
        setActiveNoteId(note.id);
        setNoteTitle(note.title);
        setNoteContent(note.content);
      }
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  // ── Auto-save note ──
  const saveNote = useCallback(
    async (id: string, title: string, content: string) => {
      setNoteSaveStatus("saving");
      try {
        await fetch(`/api/study-notes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        setNoteSaveStatus("saved");
        setTimeout(() => setNoteSaveStatus("idle"), 2000);
      } catch {
        setNoteSaveStatus("idle");
      }
    },
    []
  );

  const handleNoteChange = (field: "title" | "content", value: string) => {
    if (field === "title") setNoteTitle(value);
    else setNoteContent(value);

    if (!activeNoteId) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      saveNote(
        activeNoteId,
        field === "title" ? value : noteTitle,
        field === "content" ? value : noteContent
      );
    }, 1500);
  };

  // ── Delete note ──
  const deleteNote = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      await fetch(`/api/study-notes/${id}`, { method: "DELETE" });
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      if (activeNoteId === id) {
        if (remaining.length > 0) {
          setActiveNoteId(remaining[0].id);
          setNoteTitle(remaining[0].title);
          setNoteContent(remaining[0].content);
        } else {
          setActiveNoteId(null);
          setNoteTitle("");
          setNoteContent("");
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ── Switch active note ──
  const switchNote = (note: StudyNote) => {
    setActiveNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[var(--background)]">
      {/* ── Study toolbar ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 h-11 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLeftCollapsed(!leftCollapsed)}
            className="p-1 text-[var(--neutral-400)] hover:text-[var(--primary-600)]"
            title={leftCollapsed ? "Show scripture" : "Hide scripture"}
          >
            <PanelLeftClose size={16} />
          </button>
          <span className="text-sm font-medium text-[var(--primary-800)]" style={{ fontFamily: "var(--font-serif)" }}>
            {bookName} {chapter}
          </span>
          <div className="flex items-center gap-1">
            {prevChapter && (
              <Link
                href={`/study/${prevChapter.book}/${prevChapter.chapter}`}
                className="p-1 text-[var(--neutral-400)] hover:text-[var(--primary-600)]"
              >
                <ChevronLeft size={16} />
              </Link>
            )}
            {nextChapter && (
              <Link
                href={`/study/${nextChapter.book}/${nextChapter.chapter}`}
                className="p-1 text-[var(--neutral-400)] hover:text-[var(--primary-600)]"
              >
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
          <TranslationPicker current={translation} onChange={setTranslation} />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setRightPanel("notes")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              rightPanel === "notes"
                ? "bg-[var(--primary-50)] text-[var(--primary-700)]"
                : "text-[var(--neutral-500)] hover:text-[var(--primary-600)]"
            }`}
          >
            <PenLine size={14} />
            Notes
          </button>
          <button
            onClick={() => setRightPanel("resources")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              rightPanel === "resources"
                ? "bg-[var(--accent-50)] text-[var(--accent-700)]"
                : "text-[var(--neutral-500)] hover:text-[var(--accent-600)]"
            }`}
          >
            <Lightbulb size={14} />
            Resources
          </button>
        </div>
      </header>

      {/* ── Split pane body ── */}
      <div className="flex-1 flex min-h-0">
        {/* ── Left: Scripture ── */}
        {!leftCollapsed && (
          <div className="w-1/2 border-r border-[var(--border)] flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={24} className="animate-spin text-[var(--primary-400)]" />
                </div>
              ) : (
                <div className="max-w-xl mx-auto">
                  <h2
                    className="text-xl text-[var(--primary-900)] mb-6"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {bookName} {chapter}
                  </h2>
                  <div className="scripture-text text-[var(--primary-900)] text-base leading-[1.9]">
                    {verses.map((v) => (
                      <span key={v.verse} className="group">
                        <span className="verse-number">{v.verse}</span>
                        {v.text}{" "}
                      </span>
                    ))}
                  </div>

                  {/* Chapter nav */}
                  <nav className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--border)]">
                    {prevChapter ? (
                      <Link
                        href={`/study/${prevChapter.book}/${prevChapter.chapter}`}
                        className="flex items-center gap-1 text-sm text-[var(--neutral-500)] hover:text-[var(--primary-600)]"
                      >
                        <ChevronLeft size={14} />
                        {getBook(prevChapter.book)?.name} {prevChapter.chapter}
                      </Link>
                    ) : <div />}
                    {nextChapter ? (
                      <Link
                        href={`/study/${nextChapter.book}/${nextChapter.chapter}`}
                        className="flex items-center gap-1 text-sm text-[var(--neutral-500)] hover:text-[var(--primary-600)]"
                      >
                        {getBook(nextChapter.book)?.name} {nextChapter.chapter}
                        <ChevronRight size={14} />
                      </Link>
                    ) : <div />}
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Right: Notes or Resources ── */}
        <div className={`${leftCollapsed ? "w-full" : "w-1/2"} flex flex-col min-h-0`}>
          {rightPanel === "notes" && (
            <NotesPanel
              user={user}
              notes={notes}
              activeNoteId={activeNoteId}
              noteTitle={noteTitle}
              noteContent={noteContent}
              noteSaveStatus={noteSaveStatus}
              notesLoading={notesLoading}
              onCreateNote={createNote}
              onSwitchNote={switchNote}
              onDeleteNote={deleteNote}
              onNoteChange={handleNoteChange}
            />
          )}

          {rightPanel === "resources" && (
            <ResourcesPanel
              bookName={bookName}
              chapter={chapter}
              relatedTopics={relatedTopics}
              expandedTopic={expandedTopic}
              onToggleTopic={(id) =>
                setExpandedTopic(expandedTopic === id ? null : id)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Notes Panel
// ═══════════════════════════════════════════

function NotesPanel({
  user,
  notes,
  activeNoteId,
  noteTitle,
  noteContent,
  noteSaveStatus,
  notesLoading,
  onCreateNote,
  onSwitchNote,
  onDeleteNote,
  onNoteChange,
}: {
  user: { id: string; email?: string } | null;
  notes: StudyNote[];
  activeNoteId: string | null;
  noteTitle: string;
  noteContent: string;
  noteSaveStatus: "idle" | "saving" | "saved";
  notesLoading: boolean;
  onCreateNote: () => void;
  onSwitchNote: (note: StudyNote) => void;
  onDeleteNote: (id: string) => void;
  onNoteChange: (field: "title" | "content", value: string) => void;
}) {
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <PenLine size={32} className="mx-auto mb-3 text-[var(--neutral-300)]" />
          <p className="text-sm text-[var(--neutral-500)] mb-2">
            Sign in to take study notes
          </p>
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)]"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Notes header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--neutral-50)]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)]">
            Notes
          </span>
          {noteSaveStatus === "saving" && (
            <span className="flex items-center gap-1 text-xs text-[var(--neutral-400)]">
              <Loader2 size={10} className="animate-spin" /> Saving...
            </span>
          )}
          {noteSaveStatus === "saved" && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <Check size={10} /> Saved
            </span>
          )}
        </div>
        <button
          onClick={onCreateNote}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-[var(--primary-600)] hover:bg-[var(--primary-50)]"
        >
          <Plus size={12} /> New Note
        </button>
      </div>

      {/* Notes tabs (when multiple notes) */}
      {notes.length > 1 && (
        <div className="flex-shrink-0 flex items-center gap-1 px-4 py-1.5 border-b border-[var(--border)] bg-[var(--surface)] overflow-x-auto">
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => onSwitchNote(n)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                activeNoteId === n.id
                  ? "bg-[var(--primary-50)] text-[var(--primary-700)] font-medium"
                  : "text-[var(--neutral-500)] hover:bg-[var(--neutral-100)]"
              }`}
            >
              <FileText size={11} />
              {n.title || "Untitled"}
              {activeNoteId === n.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(n.id);
                  }}
                  className="ml-1 p-0.5 text-[var(--neutral-400)] hover:text-red-500"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      {notesLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-[var(--primary-400)]" />
        </div>
      ) : activeNoteId ? (
        <div className="flex-1 flex flex-col min-h-0 p-4">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => onNoteChange("title", e.target.value)}
            placeholder="Note title..."
            className="text-lg font-semibold text-[var(--primary-800)] bg-transparent border-none focus:outline-none mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          />
          <textarea
            value={noteContent}
            onChange={(e) => onNoteChange("content", e.target.value)}
            placeholder="Start writing your study notes...

Use this space to record insights, questions, observations, and application points as you study this passage.

Tips:
• Note key themes and repeated words
• Write down questions that arise
• Record cross-references you discover
• Note how this passage connects to Christ
• Write personal application points"
            className="flex-1 w-full bg-transparent text-sm text-[var(--neutral-800)] leading-relaxed resize-none focus:outline-none placeholder:text-[var(--neutral-300)]"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <PenLine size={32} className="mx-auto mb-3 text-[var(--neutral-300)]" />
            <p className="text-sm text-[var(--neutral-500)] mb-3">
              No notes for this passage yet.
            </p>
            <button
              onClick={onCreateNote}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--primary-600)] hover:bg-[var(--primary-700)] transition-colors"
            >
              <Plus size={14} /> Start a Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// Resources Panel
// ═══════════════════════════════════════════

function ResourcesPanel({
  bookName,
  chapter,
  relatedTopics,
  expandedTopic,
  onToggleTopic,
}: {
  bookName: string;
  chapter: number;
  relatedTopics: TheologicalTopic[];
  expandedTopic: string | null;
  onToggleTopic: (id: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0 px-4 py-2 border-b border-[var(--border)] bg-[var(--accent-50)]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-600)]">
          Study Resources — {bookName} {chapter}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {relatedTopics.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb size={32} className="mx-auto mb-3 text-[var(--neutral-300)]" />
            <p className="text-sm text-[var(--neutral-500)]">
              No specific topics mapped to {bookName} yet.
            </p>
            <p className="text-xs text-[var(--neutral-400)] mt-1">
              Context resources are growing — check back soon.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-[var(--neutral-500)]">
              {relatedTopics.length} topic{relatedTopics.length !== 1 ? "s" : ""} related to {bookName}
            </p>

            {relatedTopics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
              >
                <button
                  onClick={() => onToggleTopic(topic.id)}
                  className="w-full text-left px-4 py-3 flex items-start justify-between gap-2 hover:bg-[var(--neutral-50)] transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium text-[var(--primary-800)]">
                      {topic.label}
                    </span>
                    <span className="block text-xs text-[var(--neutral-500)] mt-0.5 line-clamp-2">
                      {topic.description}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`flex-shrink-0 mt-0.5 text-[var(--neutral-400)] transition-transform ${
                      expandedTopic === topic.id ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedTopic === topic.id && (
                  <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)]">
                    {/* Key passages */}
                    <div className="pt-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-600)] mb-2">
                        Key Passages
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {topic.keyPassages.map((p, i) => (
                          <Link
                            key={i}
                            href={`/study/${p.book.toLowerCase().replace(/\s+/g, "+")}/${p.chapter}`}
                            className="px-2 py-1 rounded text-xs font-medium bg-[var(--primary-50)] text-[var(--primary-600)] hover:bg-[var(--primary-100)] transition-colors"
                          >
                            {p.book} {p.chapter}
                            {p.verseStart ? `:${p.verseStart}` : ""}
                            {p.verseEnd ? `-${p.verseEnd}` : ""}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Context notes */}
                    {(topic.contextNotes.historical || topic.contextNotes.theological) && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-600)] mb-2">
                          Background
                        </h4>
                        {topic.contextNotes.historical && (
                          <p className="text-xs text-[var(--neutral-600)] mb-2 leading-relaxed">
                            <strong className="text-[var(--neutral-700)]">Historical:</strong>{" "}
                            {topic.contextNotes.historical}
                          </p>
                        )}
                        {topic.contextNotes.theological && (
                          <p className="text-xs text-[var(--neutral-600)] leading-relaxed">
                            <strong className="text-[var(--neutral-700)]">Theological:</strong>{" "}
                            {topic.contextNotes.theological}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Discussion questions */}
                    {topic.suggestedQuestions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-600)] mb-2">
                          Study Questions
                        </h4>
                        <div className="space-y-1.5">
                          {topic.suggestedQuestions.map((q, i) => (
                            <p key={i} className="text-xs text-[var(--neutral-600)] leading-relaxed pl-3 border-l-2 border-[var(--accent-200)]">
                              {q}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
