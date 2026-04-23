"use client";

import { BookOpen } from "lucide-react";
import { ScriptureBlock, TranslationId } from "@/types";
import { BIBLE_BOOKS } from "@/lib/bible/books";

interface Props {
  block: ScriptureBlock;
  onChange: (block: ScriptureBlock) => void;
}

export default function ScriptureBlockEditor({ block, onChange }: Props) {
  const selectedBook = BIBLE_BOOKS.find((b) => b.name === block.reference.book);
  const maxChapters = selectedBook?.chapters ?? 150;

  return (
    <div className="rounded-lg border border-[var(--primary-200)] bg-[var(--primary-50)]/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={14} className="text-[var(--primary-600)]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-600)]">
          Scripture Passage
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {/* Book */}
        <select
          value={block.reference.book}
          onChange={(e) =>
            onChange({
              ...block,
              reference: { ...block.reference, book: e.target.value, chapter: 1, verseStart: 1, verseEnd: undefined },
            })
          }
          className="col-span-2 px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
        >
          {BIBLE_BOOKS.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Chapter */}
        <input
          type="number"
          min={1}
          max={maxChapters}
          value={block.reference.chapter}
          onChange={(e) =>
            onChange({
              ...block,
              reference: { ...block.reference, chapter: parseInt(e.target.value) || 1 },
            })
          }
          placeholder="Ch"
          className="px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
        />

        {/* Verse start */}
        <input
          type="number"
          min={1}
          value={block.reference.verseStart ?? ""}
          onChange={(e) =>
            onChange({
              ...block,
              reference: {
                ...block.reference,
                verseStart: e.target.value ? parseInt(e.target.value) : undefined,
              },
            })
          }
          placeholder="From"
          className="px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
        />

        {/* Verse end */}
        <input
          type="number"
          min={block.reference.verseStart ?? 1}
          value={block.reference.verseEnd ?? ""}
          onChange={(e) =>
            onChange({
              ...block,
              reference: {
                ...block.reference,
                verseEnd: e.target.value ? parseInt(e.target.value) : undefined,
              },
            })
          }
          placeholder="To"
          className="px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
        />
      </div>

      {/* Translation + Note */}
      <div className="mt-3 flex flex-col md:flex-row gap-2">
        <select
          value={block.translation ?? "KJV"}
          onChange={(e) =>
            onChange({ ...block, translation: e.target.value as TranslationId })
          }
          className="px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] w-32"
        >
          <option value="KJV">KJV</option>
          <option value="ESV">ESV</option>
          <option value="ASV">ASV</option>
          <option value="YLT">YLT</option>
        </select>
        <input
          type="text"
          value={block.note ?? ""}
          onChange={(e) => onChange({ ...block, note: e.target.value })}
          placeholder="Optional note about this passage..."
          className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
        />
      </div>
    </div>
  );
}
