"use client";

import { useState } from "react";
import { Verse } from "@/types";
import { Bookmark, BookmarkCheck, X, Trash2 } from "lucide-react";
import { BookmarkRecord } from "@/hooks/useBookmarks";

// Bookmark color presets
const BOOKMARK_COLORS = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#EF4444", label: "Red" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
];

interface VerseDisplayProps {
  verses: Verse[];
  bookName: string;
  chapter: number;
  /** Current bookmarks for this chapter — undefined means bookmarks not loaded / user not authed */
  bookmarks?: BookmarkRecord[];
  onAddBookmark?: (verseNum: number, note?: string, color?: string) => Promise<unknown>;
  onRemoveBookmark?: (bookmarkId: string) => Promise<unknown>;
  isAuthenticated?: boolean;
}

export default function VerseDisplay({
  verses,
  bookName,
  chapter,
  bookmarks,
  onAddBookmark,
  onRemoveBookmark,
  isAuthenticated = false,
}: VerseDisplayProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [bookmarkColor, setBookmarkColor] = useState("#3B82F6");
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Find bookmark for a verse
  const getVerseBookmark = (verseNum: number): BookmarkRecord | undefined => {
    if (!bookmarks) return undefined;
    return bookmarks.find(
      (b) =>
        b.verse_start !== null &&
        b.verse_start <= verseNum &&
        (b.verse_end ?? b.verse_start) >= verseNum
    );
  };

  const handleBookmarkClick = () => {
    if (!selectedVerse || !isAuthenticated) return;

    const existing = getVerseBookmark(selectedVerse);
    if (existing) {
      // Remove existing bookmark
      onRemoveBookmark?.(existing.id);
    } else {
      // Show form to add bookmark
      setBookmarkNote("");
      setBookmarkColor("#3B82F6");
      setShowBookmarkForm(true);
    }
  };

  const handleSaveBookmark = async () => {
    if (!selectedVerse || !onAddBookmark) return;
    setSaving(true);
    await onAddBookmark(selectedVerse, bookmarkNote || undefined, bookmarkColor);
    setSaving(false);
    setShowBookmarkForm(false);
    setBookmarkNote("");
  };

  if (verses.length === 0) {
    return (
      <div className="text-center py-20 text-[var(--neutral-400)]">
        <p className="text-lg">No verses found</p>
        <p className="text-sm mt-2">
          This chapter may not be available in the selected translation.
        </p>
      </div>
    );
  }

  return (
    <div className="scripture-text text-[var(--primary-900)]">
      {/* Chapter heading */}
      <h2
        className="text-2xl md:text-3xl text-[var(--primary-800)] mb-8"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {bookName} {chapter}
      </h2>

      {/* Verse text */}
      <div className="text-lg leading-[1.9] space-y-0">
        {verses.map((verse) => {
          const bm = getVerseBookmark(verse.verse);
          return (
            <span
              key={verse.verse}
              className={`
                relative inline cursor-pointer rounded-sm transition-colors
                ${
                  selectedVerse === verse.verse
                    ? "bg-[var(--accent-100)]"
                    : bm
                      ? "bg-opacity-15"
                      : "hover:bg-[var(--neutral-100)]"
                }
              `}
              style={
                bm && selectedVerse !== verse.verse
                  ? { backgroundColor: `${bm.color}18` }
                  : undefined
              }
              onClick={() =>
                setSelectedVerse(
                  selectedVerse === verse.verse ? null : verse.verse
                )
              }
            >
              {bm && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-0.5 align-middle"
                  style={{ backgroundColor: bm.color }}
                />
              )}
              <sup className="verse-number">{verse.verse}</sup>
              {verse.text}{" "}
            </span>
          );
        })}
      </div>

      {/* Verse action bar */}
      {selectedVerse && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-bottom-4">
          {/* Main bar */}
          <div className="bg-[var(--primary-800)] text-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-4">
            <span className="text-sm text-[var(--primary-200)]">
              {bookName} {chapter}:{selectedVerse}
            </span>
            <div className="w-px h-5 bg-[var(--primary-600)]" />

            {/* Bookmark button */}
            {isAuthenticated ? (
              (() => {
                const existing = getVerseBookmark(selectedVerse);
                return existing ? (
                  <button
                    className="flex items-center gap-1.5 text-sm text-[var(--accent-400)] hover:text-[var(--accent-300)] transition-colors"
                    title="Remove bookmark"
                    onClick={handleBookmarkClick}
                  >
                    <BookmarkCheck size={14} />
                    <span>Bookmarked</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-1.5 text-sm hover:text-[var(--accent-400)] transition-colors"
                    title="Bookmark this verse"
                    onClick={handleBookmarkClick}
                  >
                    <Bookmark size={14} />
                    <span>Bookmark</span>
                  </button>
                );
              })()
            ) : (
              <span className="text-sm text-[var(--primary-400)]" title="Sign in to bookmark">
                <Bookmark size={14} className="inline mr-1" />
                Sign in
              </span>
            )}

            <button
              className="flex items-center gap-1.5 text-sm hover:text-[var(--accent-400)] transition-colors"
              onClick={() => {
                const verse = verses.find((v) => v.verse === selectedVerse);
                if (verse) {
                  navigator.clipboard.writeText(
                    `"${verse.text}" — ${bookName} ${chapter}:${verse.verse} (${verse.translation})`
                  );
                }
              }}
            >
              Copy
            </button>
            <button
              className="text-sm text-[var(--primary-400)] hover:text-white transition-colors"
              onClick={() => {
                setSelectedVerse(null);
                setShowBookmarkForm(false);
              }}
            >
              Close
            </button>
          </div>

          {/* Bookmark form popover */}
          {showBookmarkForm && (
            <div className="mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl p-4 w-80 mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--primary-800)]">
                  Bookmark {bookName} {chapter}:{selectedVerse}
                </span>
                <button
                  onClick={() => setShowBookmarkForm(false)}
                  className="text-[var(--neutral-400)] hover:text-[var(--neutral-600)]"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Color picker */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-[var(--neutral-500)]">Color:</span>
                {BOOKMARK_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setBookmarkColor(c.value)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      bookmarkColor === c.value
                        ? "border-[var(--primary-600)] scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>

              {/* Note */}
              <textarea
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                placeholder="Add a note (optional)..."
                className="w-full h-16 px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--primary-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-400)] resize-none"
                maxLength={500}
              />

              {/* Save */}
              <button
                onClick={handleSaveBookmark}
                disabled={saving}
                className="mt-2 w-full py-2 rounded-lg text-sm font-medium text-white bg-[var(--primary-600)] hover:bg-[var(--primary-700)] disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Bookmark"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
