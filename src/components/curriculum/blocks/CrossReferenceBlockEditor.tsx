"use client";

import { GitCompareArrows, Plus, X } from "lucide-react";
import { CrossReferenceBlock, ScriptureReference, TranslationId } from "@/types";
import { BIBLE_BOOKS } from "@/lib/bible/books";

interface Props {
  block: CrossReferenceBlock;
  onChange: (block: CrossReferenceBlock) => void;
}

function emptyRef(): ScriptureReference {
  return { book: "Genesis", chapter: 1, verseStart: 1 };
}

export default function CrossReferenceBlockEditor({ block, onChange }: Props) {
  const addReference = () => {
    onChange({
      ...block,
      references: [...block.references, emptyRef()],
    });
  };

  const removeReference = (index: number) => {
    if (block.references.length <= 2) return; // minimum 2 to cross-reference
    onChange({
      ...block,
      references: block.references.filter((_, i) => i !== index),
    });
  };

  const updateReference = (index: number, ref: ScriptureReference) => {
    const updated = [...block.references];
    updated[index] = ref;
    onChange({ ...block, references: updated });
  };

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <GitCompareArrows size={14} className="text-sky-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          Cross Reference
        </span>
      </div>

      {/* Theme */}
      <input
        type="text"
        value={block.theme ?? ""}
        onChange={(e) => onChange({ ...block, theme: e.target.value || undefined })}
        placeholder="Theme (e.g. Pre-existence of Christ, Covenant Promises)"
        className="w-full mb-3 px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
      />

      {/* References */}
      <div className="space-y-2 mb-3">
        {block.references.map((ref, i) => {
          const selectedBook = BIBLE_BOOKS.find((b) => b.name === ref.book);
          const maxChapters = selectedBook?.chapters ?? 150;

          return (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-xs font-bold text-sky-500 w-5 flex-shrink-0">
                {i + 1}
              </span>
              <select
                value={ref.book}
                onChange={(e) =>
                  updateReference(i, { ...ref, book: e.target.value, chapter: 1, verseStart: 1, verseEnd: undefined })
                }
                className="flex-[2] px-2 py-1.5 rounded-md border border-[var(--border)] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                {BIBLE_BOOKS.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={maxChapters}
                value={ref.chapter}
                onChange={(e) =>
                  updateReference(i, { ...ref, chapter: parseInt(e.target.value) || 1 })
                }
                placeholder="Ch"
                className="w-16 px-2 py-1.5 rounded-md border border-[var(--border)] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              <input
                type="number"
                min={1}
                value={ref.verseStart ?? ""}
                onChange={(e) =>
                  updateReference(i, { ...ref, verseStart: e.target.value ? parseInt(e.target.value) : undefined })
                }
                placeholder="From"
                className="w-16 px-2 py-1.5 rounded-md border border-[var(--border)] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              <input
                type="number"
                min={ref.verseStart ?? 1}
                value={ref.verseEnd ?? ""}
                onChange={(e) =>
                  updateReference(i, { ...ref, verseEnd: e.target.value ? parseInt(e.target.value) : undefined })
                }
                placeholder="To"
                className="w-16 px-2 py-1.5 rounded-md border border-[var(--border)] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              <button
                onClick={() => removeReference(i)}
                disabled={block.references.length <= 2}
                className="p-1 text-[var(--neutral-400)] hover:text-red-500 disabled:opacity-30"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={addReference}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-sky-600 hover:bg-sky-100 rounded-md transition-colors mb-3"
      >
        <Plus size={14} />
        Add Passage
      </button>

      {/* Connection note */}
      <textarea
        value={block.note ?? ""}
        onChange={(e) => onChange({ ...block, note: e.target.value || undefined })}
        placeholder="Explain how these passages connect..."
        rows={3}
        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-y"
      />
    </div>
  );
}
