"use client";

import { Landmark } from "lucide-react";
import { ContextualFrameworkBlock } from "@/types";

interface Props {
  block: ContextualFrameworkBlock;
  onChange: (block: ContextualFrameworkBlock) => void;
}

const FIELDS: {
  key: keyof Omit<ContextualFrameworkBlock, "type">;
  label: string;
  placeholder: string;
  rows: number;
}[] = [
  {
    key: "historical_context",
    label: "Historical Context",
    placeholder: "Time period, political climate, major events happening at the time...",
    rows: 3,
  },
  {
    key: "cultural_context",
    label: "Cultural Context",
    placeholder: "Customs, social norms, daily life that inform the passage...",
    rows: 3,
  },
  {
    key: "author_and_audience",
    label: "Author & Audience",
    placeholder: "Who wrote this, to whom, under what circumstances, and why...",
    rows: 2,
  },
  {
    key: "literary_context",
    label: "Literary Context",
    placeholder: "Genre, structure, literary devices, position within the larger book...",
    rows: 2,
  },
  {
    key: "geographic_context",
    label: "Geographic Context",
    placeholder: "Location, significance of the place, relevant geography...",
    rows: 2,
  },
  {
    key: "theological_context",
    label: "Theological Context",
    placeholder: "Where this fits in the arc of redemption history, key doctrines...",
    rows: 2,
  },
];

export default function ContextualFrameworkBlockEditor({ block, onChange }: Props) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4">
      <div className="flex items-center gap-2 mb-1">
        <Landmark size={14} className="text-rose-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          Contextual Framework
        </span>
      </div>
      <p className="text-xs text-[var(--neutral-400)] mb-4">
        Set the historical, cultural, and literary backdrop. Fill in whichever sections are relevant — you don't need all of them.
      </p>

      <div className="space-y-3">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-rose-700 mb-1">
              {field.label}
            </label>
            <textarea
              value={(block[field.key] as string) ?? ""}
              onChange={(e) =>
                onChange({ ...block, [field.key]: e.target.value || undefined })
              }
              placeholder={field.placeholder}
              rows={field.rows}
              className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-y"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
