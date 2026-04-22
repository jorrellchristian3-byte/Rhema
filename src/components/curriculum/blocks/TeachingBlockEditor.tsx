"use client";

import { FileText } from "lucide-react";
import { TeachingBlock } from "@/types";

interface Props {
  block: TeachingBlock;
  onChange: (block: TeachingBlock) => void;
}

export default function TeachingBlockEditor({ block, onChange }: Props) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={14} className="text-amber-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          Teaching Notes
        </span>
      </div>

      {/* Author attribution */}
      <input
        type="text"
        value={block.author ?? ""}
        onChange={(e) => onChange({ ...block, author: e.target.value || undefined })}
        placeholder="Attribution (optional, e.g. C.S. Lewis)"
        className="w-full mb-2 px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
      />

      {/* Content (markdown) */}
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="Write your teaching notes here... (Markdown supported)"
        rows={6}
        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-y font-mono"
      />
      <p className="text-xs text-[var(--neutral-400)] mt-1">
        Supports Markdown: **bold**, *italic*, ## headings, - lists
      </p>
    </div>
  );
}
