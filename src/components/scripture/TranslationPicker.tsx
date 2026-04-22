"use client";

import { TranslationId } from "@/types";
import { getAvailableTranslations } from "@/lib/bible/translations";

interface TranslationPickerProps {
  current: TranslationId;
  onChange: (id: TranslationId) => void;
}

export default function TranslationPicker({
  current,
  onChange,
}: TranslationPickerProps) {
  const translations = getAvailableTranslations();

  return (
    <div className="flex items-center gap-1 bg-[var(--neutral-100)] rounded-lg p-1">
      {translations.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`
            px-3 py-1.5 rounded-md text-xs font-medium transition-all
            ${
              current === t.id
                ? "bg-[var(--surface)] text-[var(--primary-700)] shadow-sm"
                : "text-[var(--neutral-500)] hover:text-[var(--primary-600)]"
            }
          `}
          title={t.name}
        >
          {t.abbreviation}
        </button>
      ))}
    </div>
  );
}
