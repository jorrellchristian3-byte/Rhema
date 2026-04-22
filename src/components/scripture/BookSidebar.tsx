"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/bible/books";
import { BibleBook } from "@/types";

interface BookSidebarProps {
  currentBook: string;
  currentChapter: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookSidebar({
  currentBook,
  currentChapter,
  isOpen,
  onClose,
}: BookSidebarProps) {
  const otBooks = BIBLE_BOOKS.filter((b) => b.testament === "OT");
  const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === "NT");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-[var(--surface)] border-r border-[var(--border)]
          z-50 transform transition-transform duration-200 overflow-y-auto
          lg:relative lg:translate-x-0 lg:z-0 lg:top-auto lg:h-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] lg:hidden">
          <span
            className="text-sm font-semibold text-[var(--primary-800)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Books of the Bible
          </span>
          <button onClick={onClose} className="p-1 text-[var(--neutral-400)]">
            <X size={18} />
          </button>
        </div>

        <div className="p-3">
          <TestamentSection
            label="Old Testament"
            books={otBooks}
            currentBook={currentBook}
            currentChapter={currentChapter}
            onNavigate={onClose}
          />
          <TestamentSection
            label="New Testament"
            books={ntBooks}
            currentBook={currentBook}
            currentChapter={currentChapter}
            onNavigate={onClose}
          />
        </div>
      </aside>
    </>
  );
}

function TestamentSection({
  label,
  books,
  currentBook,
  currentChapter,
  onNavigate,
}: {
  label: string;
  books: BibleBook[];
  currentBook: string;
  currentChapter: number;
  onNavigate: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 w-full px-2 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] hover:text-[var(--neutral-600)]"
      >
        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {label}
      </button>
      {isExpanded && (
        <div className="space-y-0.5">
          {books.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              isActive={book.id === currentBook}
              currentChapter={currentChapter}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BookItem({
  book,
  isActive,
  currentChapter,
  onNavigate,
}: {
  book: BibleBook;
  isActive: boolean;
  currentChapter: number;
  onNavigate: () => void;
}) {
  const [showChapters, setShowChapters] = useState(isActive);

  return (
    <div>
      <button
        onClick={() => setShowChapters(!showChapters)}
        className={`
          flex items-center justify-between w-full px-3 py-1.5 rounded-md text-sm transition-colors
          ${
            isActive
              ? "bg-[var(--primary-50)] text-[var(--primary-700)] font-medium"
              : "text-[var(--neutral-600)] hover:bg-[var(--neutral-100)]"
          }
        `}
      >
        <span>{book.name}</span>
        {showChapters ? (
          <ChevronDown size={12} className="text-[var(--neutral-400)]" />
        ) : (
          <ChevronRight size={12} className="text-[var(--neutral-400)]" />
        )}
      </button>

      {showChapters && (
        <div className="grid grid-cols-6 gap-1 px-3 py-2">
          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => (
            <Link
              key={ch}
              href={`/read/${book.id}/${ch}`}
              onClick={onNavigate}
              className={`
                flex items-center justify-center w-8 h-8 rounded text-xs transition-colors
                ${
                  isActive && ch === currentChapter
                    ? "bg-[var(--primary-500)] text-white font-semibold"
                    : "text-[var(--neutral-500)] hover:bg-[var(--neutral-100)] hover:text-[var(--primary-600)]"
                }
              `}
            >
              {ch}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
