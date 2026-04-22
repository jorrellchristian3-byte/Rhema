"use client";

import { MessageCircle, Plus, X } from "lucide-react";
import { DiscussionBlock } from "@/types";

interface Props {
  block: DiscussionBlock;
  onChange: (block: DiscussionBlock) => void;
}

export default function DiscussionBlockEditor({ block, onChange }: Props) {
  const updateQuestion = (index: number, value: string) => {
    const updated = [...block.questions];
    updated[index] = value;
    onChange({ ...block, questions: updated });
  };

  const addQuestion = () => {
    onChange({ ...block, questions: [...block.questions, ""] });
  };

  const removeQuestion = (index: number) => {
    if (block.questions.length <= 1) return;
    onChange({ ...block, questions: block.questions.filter((_, i) => i !== index) });
  };

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={14} className="text-emerald-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Discussion Questions
        </span>
      </div>

      <div className="space-y-2">
        {block.questions.map((q, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-xs font-bold text-emerald-500 mt-2.5 w-5 flex-shrink-0">
              Q{i + 1}
            </span>
            <input
              type="text"
              value={q}
              onChange={(e) => updateQuestion(i, e.target.value)}
              placeholder="Type a discussion question..."
              className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button
              onClick={() => removeQuestion(i)}
              disabled={block.questions.length <= 1}
              className="p-2 text-[var(--neutral-400)] hover:text-red-500 disabled:opacity-30"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
        >
          <Plus size={14} />
          Add Question
        </button>
      </div>

      {/* Facilitator guidance */}
      <textarea
        value={block.guidance ?? ""}
        onChange={(e) => onChange({ ...block, guidance: e.target.value || undefined })}
        placeholder="Facilitator guidance notes (optional)"
        rows={2}
        className="w-full mt-3 px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
      />
    </div>
  );
}
