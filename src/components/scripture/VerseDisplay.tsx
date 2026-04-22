"use client";

import { useState } from "react";
import { Verse } from "@/types";
import { Bookmark } from "lucide-react";

interface VerseDisplayProps {
  verses: Verse[];
  bookName: string;
  chapter: number;
}

export default function VerseDisplay({
  verses,
  bookName,
  chapter,
}: VerseDisplayProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

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
        {verses.map((verse) => (
          <span
            key={verse.verse}
            className={`
              relative inline cursor-pointer rounded-sm transition-colors
              ${
                selectedVerse === verse.verse
                  ? "bg-[var(--accent-100)]"
                  : "hover:bg-[var(--neutral-100)]"
              }
            `}
            onClick={() =>
              setSelectedVerse(
                selectedVerse === verse.verse ? null : verse.verse
              )
            }
          >
            <sup className="verse-number">{verse.verse}</sup>
            {verse.text}{" "}
          </span>
        ))}
      </div>

      {/* Verse action bar */}
      {selectedVerse && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--primary-800)] text-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-4 z-30 animate-in slide-in-from-bottom-4">
          <span className="text-sm text-[var(--primary-200)]">
            {bookName} {chapter}:{selectedVerse}
          </span>
          <div className="w-px h-5 bg-[var(--primary-600)]" />
          <button
            className="flex items-center gap-1.5 text-sm hover:text-[var(--accent-400)] transition-colors"
            title="Bookmark this verse"
          >
            <Bookmark size={14} />
            <span>Bookmark</span>
          </button>
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
            onClick={() => setSelectedVerse(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
