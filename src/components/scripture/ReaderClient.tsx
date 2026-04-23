"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Verse, TranslationId } from "@/types";
import { getBook, BIBLE_BOOKS } from "@/lib/bible/books";
import BookSidebar from "./BookSidebar";
import TranslationPicker from "./TranslationPicker";
import VerseDisplay from "./VerseDisplay";

interface ReaderClientProps {
  bookId: string;
  chapter: number;
  initialVerses: Verse[];
  initialTranslation: TranslationId;
}

export default function ReaderClient({
  bookId,
  chapter,
  initialVerses,
  initialTranslation,
}: ReaderClientProps) {
  const [verses, setVerses] = useState<Verse[]>(initialVerses);
  const [translation, setTranslation] =
    useState<TranslationId>(initialTranslation);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const book = getBook(bookId);
  const bookName = book?.name ?? bookId;
  const totalChapters = book?.chapters ?? 1;

  // Find prev/next for navigation
  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
  const prevChapter =
    chapter > 1
      ? { book: bookId, chapter: chapter - 1 }
      : bookIndex > 0
        ? {
            book: BIBLE_BOOKS[bookIndex - 1].id,
            chapter: BIBLE_BOOKS[bookIndex - 1].chapters,
          }
        : null;
  const nextChapter =
    chapter < totalChapters
      ? { book: bookId, chapter: chapter + 1 }
      : bookIndex < BIBLE_BOOKS.length - 1
        ? { book: BIBLE_BOOKS[bookIndex + 1].id, chapter: 1 }
        : null;

  // Refetch when translation changes (client-side)
  const fetchTranslation = useCallback(async (newTranslation: TranslationId) => {
    if (newTranslation === initialTranslation && initialVerses.length > 0) {
      setVerses(initialVerses);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/scripture/${encodeURIComponent(bookName)}/${chapter}?translation=${newTranslation}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.verses && data.verses.length > 0) {
          setVerses(data.verses);
        } else {
          // Translation returned no verses — fall back to initial
          console.warn(`No verses returned for ${newTranslation}, keeping current`);
        }
      }
    } catch (err) {
      console.error("Failed to fetch translation:", err);
    } finally {
      setLoading(false);
    }
  }, [bookName, chapter, initialTranslation, initialVerses]);

  useEffect(() => {
    fetchTranslation(translation);
  }, [translation, fetchTranslation]);

  return (
    <div className="flex bg-[var(--background)]">
      {/* Book sidebar */}
      <BookSidebar
        currentBook={bookId}
        currentChapter={chapter}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main reading area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-16 z-20 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--border)]">
          <div className="flex items-center justify-between px-4 md:px-8 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-[var(--neutral-500)] hover:text-[var(--primary-600)]"
              >
                <Menu size={20} />
              </button>
              <Link
                href="/"
                className="text-sm text-[var(--neutral-400)] hover:text-[var(--primary-600)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Rhema
              </Link>
              <span className="text-[var(--neutral-300)]">/</span>
              <span
                className="text-sm font-medium text-[var(--primary-800)]"
              >
                {bookName} {chapter}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/study/${bookId}/${chapter}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
              >
                Study
              </Link>
              <TranslationPicker
                current={translation}
                onChange={setTranslation}
              />
            </div>
          </div>
        </header>

        {/* Scripture content */}
        <main className="flex-1 px-6 md:px-12 lg:px-20 py-10 max-w-3xl mx-auto w-full">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                size={24}
                className="animate-spin text-[var(--primary-400)]"
              />
            </div>
          ) : (
            <VerseDisplay
              verses={verses}
              bookName={bookName}
              chapter={chapter}
            />
          )}

          {/* Chapter navigation */}
          <nav className="flex items-center justify-between mt-16 pt-8 border-t border-[var(--border)]">
            {prevChapter ? (
              <Link
                href={`/read/${prevChapter.book}/${prevChapter.chapter}`}
                className="flex items-center gap-2 text-sm text-[var(--neutral-500)] hover:text-[var(--primary-600)] transition-colors"
              >
                <ChevronLeft size={16} />
                <span>
                  {getBook(prevChapter.book)?.name} {prevChapter.chapter}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextChapter ? (
              <Link
                href={`/read/${nextChapter.book}/${nextChapter.chapter}`}
                className="flex items-center gap-2 text-sm text-[var(--neutral-500)] hover:text-[var(--primary-600)] transition-colors"
              >
                <span>
                  {getBook(nextChapter.book)?.name} {nextChapter.chapter}
                </span>
                <ChevronRight size={16} />
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}
