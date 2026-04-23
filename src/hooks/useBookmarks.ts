"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Shape returned by GET /api/bookmarks — matches the Supabase row
 */
export interface BookmarkRecord {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse_start: number | null;
  verse_end: number | null;
  note: string | null;
  color: string;
  created_at: string;
}

interface UseBookmarksOptions {
  /** Only load bookmarks for this book+chapter (perf optimization) */
  book?: string;
  chapter?: number;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

export function useBookmarks({ book, chapter, isAuthenticated }: UseBookmarksOptions) {
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Load bookmarks
  const loadBookmarks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const data = await res.json();
        let all: BookmarkRecord[] = data.bookmarks ?? [];
        // Filter to current chapter if specified
        if (book && chapter) {
          all = all.filter(
            (b) => b.book === book && b.chapter === chapter
          );
        }
        setBookmarks(all);
      }
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, book, chapter]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Check if a specific verse is bookmarked
  const isVerseBookmarked = useCallback(
    (verseNum: number): BookmarkRecord | undefined => {
      return bookmarks.find(
        (b) =>
          b.verse_start !== null &&
          b.verse_start <= verseNum &&
          (b.verse_end ?? b.verse_start) >= verseNum
      );
    },
    [bookmarks]
  );

  // Add bookmark
  const addBookmark = useCallback(
    async (opts: {
      book: string;
      chapter: number;
      verseStart?: number;
      verseEnd?: number;
      note?: string;
      color?: string;
    }) => {
      try {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            book: opts.book,
            chapter: opts.chapter,
            verseStart: opts.verseStart,
            verseEnd: opts.verseEnd,
            note: opts.note,
            color: opts.color ?? "#3B82F6",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarks((prev) => [data.bookmark, ...prev]);
          return data.bookmark as BookmarkRecord;
        }
      } catch (err) {
        console.error("Failed to add bookmark:", err);
      }
      return null;
    },
    []
  );

  // Remove bookmark
  const removeBookmark = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
    return false;
  }, []);

  return {
    bookmarks,
    loading,
    isVerseBookmarked,
    addBookmark,
    removeBookmark,
    reload: loadBookmarks,
  };
}
