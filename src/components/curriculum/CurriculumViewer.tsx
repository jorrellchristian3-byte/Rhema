"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Video,
  MessageCircle,
  GitCompareArrows,
  Landmark,
  Clock,
  Tag,
  User,
  Loader2,
} from "lucide-react";
import {
  Curriculum,
  CurriculumStep,
  StepBlock,
  ScriptureBlock,
  TeachingBlock,
  VideoBlock,
  DiscussionBlock,
  CrossReferenceBlock,
  ContextualFrameworkBlock,
  Verse,
} from "@/types";

// ── Main Viewer ──

export default function CurriculumViewer({
  curriculum,
}: {
  curriculum: Curriculum;
}) {
  const steps = curriculum.steps ?? [];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  const categoryLabels: Record<string, string> = {
    "book-study": "Book Study",
    topical: "Topical",
    "character-study": "Character Study",
    devotional: "Devotional",
    theology: "Theology",
    history: "History",
    "practical-living": "Practical Living",
    apologetics: "Apologetics",
  };

  return (
    <div className="bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[var(--primary-900)] text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
          <Link
            href="/curricula"
            className="inline-flex items-center gap-1 text-sm text-[var(--primary-200)] hover:text-white mb-4"
          >
            <ChevronLeft size={16} />
            All Curriculum
          </Link>
          <h1
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {curriculum.title}
          </h1>
          <p className="text-[var(--primary-200)] text-sm md:text-base max-w-2xl">
            {curriculum.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--primary-300)]">
            <span className="flex items-center gap-1">
              <User size={14} />
              {curriculum.author_name}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {curriculum.estimated_duration_minutes} min
            </span>
            <span className="flex items-center gap-1">
              <Tag size={14} />
              {categoryLabels[curriculum.category] ?? curriculum.category}
            </span>
          </div>
        </div>
      </header>

      {/* Step navigation bar */}
      {steps.length > 0 && (
        <div className="sticky top-16 z-20 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--border)]">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-1 py-2 overflow-x-auto">
              {steps.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(i)}
                  className={`
                    flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                    ${
                      i === currentStepIndex
                        ? "bg-[var(--primary-500)] text-white"
                        : "text-[var(--neutral-500)] hover:bg-[var(--neutral-100)]"
                    }
                  `}
                >
                  {i + 1}. {step.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step content */}
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        {steps.length === 0 ? (
          <div className="text-center py-20 text-[var(--neutral-400)]">
            This curriculum has no steps yet.
          </div>
        ) : currentStep ? (
          <div>
            <h2
              className="text-xl font-bold text-[var(--primary-800)] mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {currentStep.title}
            </h2>

            <div className="space-y-6">
              {currentStep.blocks.map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))}
            </div>

            {/* Prev/Next */}
            <nav className="flex items-center justify-between mt-16 pt-8 border-t border-[var(--border)]">
              {currentStepIndex > 0 ? (
                <button
                  onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                  className="flex items-center gap-2 text-sm text-[var(--neutral-500)] hover:text-[var(--primary-600)] transition-colors"
                >
                  <ChevronLeft size={16} />
                  {steps[currentStepIndex - 1].title}
                </button>
              ) : (
                <div />
              )}
              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                  className="flex items-center gap-2 text-sm text-[var(--neutral-500)] hover:text-[var(--primary-600)] transition-colors"
                >
                  {steps[currentStepIndex + 1].title}
                  <ChevronRight size={16} />
                </button>
              ) : (
                <div className="text-sm text-emerald-600 font-medium">
                  Curriculum complete
                </div>
              )}
            </nav>
          </div>
        ) : null}
      </main>
    </div>
  );
}

// ── Block Renderer ──

function BlockRenderer({ block }: { block: StepBlock }) {
  switch (block.type) {
    case "scripture":
      return <ScriptureRenderer block={block} />;
    case "teaching":
      return <TeachingRenderer block={block} />;
    case "video":
      return <VideoRenderer block={block} />;
    case "discussion":
      return <DiscussionRenderer block={block} />;
    case "cross-reference":
      return <CrossReferenceRenderer block={block} />;
    case "context":
      return <ContextualFrameworkRenderer block={block} />;
    default:
      return null;
  }
}

// ── Scripture Renderer (fetches verses live) ──

function ScriptureRenderer({ block }: { block: ScriptureBlock }) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  const ref = block.reference;
  const translation = block.translation ?? "KJV";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/scripture/${encodeURIComponent(ref.book)}/${ref.chapter}?translation=${translation}`
        );
        if (res.ok) {
          const data = await res.json();
          let v: Verse[] = data.verses ?? [];
          if (ref.verseStart) {
            v = v.filter(
              (verse) =>
                verse.verse >= (ref.verseStart ?? 1) &&
                verse.verse <= (ref.verseEnd ?? 999)
            );
          }
          setVerses(v);
        }
      } catch (err) {
        console.error("Failed to load scripture:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ref.book, ref.chapter, ref.verseStart, ref.verseEnd, translation]);

  const label = `${ref.book} ${ref.chapter}${ref.verseStart ? `:${ref.verseStart}` : ""}${ref.verseEnd ? `-${ref.verseEnd}` : ""} (${translation})`;

  return (
    <div className="rounded-xl border border-[var(--primary-200)] bg-[var(--primary-50)]/40 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-[var(--primary-600)]" />
        <span
          className="text-sm font-semibold text-[var(--primary-700)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {label}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="animate-spin text-[var(--primary-400)]" />
        </div>
      ) : (
        <div className="scripture-text text-[var(--neutral-700)] leading-relaxed">
          {verses.map((v) => (
            <span key={v.verse}>
              <sup className="verse-number text-[var(--primary-400)] mr-0.5">
                {v.verse}
              </sup>
              {v.text}{" "}
            </span>
          ))}
        </div>
      )}

      {block.note && (
        <p className="mt-3 pt-3 border-t border-[var(--primary-200)] text-sm italic text-[var(--neutral-500)]">
          {block.note}
        </p>
      )}
    </div>
  );
}

// ── Teaching Renderer ──

function TeachingRenderer({ block }: { block: TeachingBlock }) {
  // Simple markdown-to-HTML (bold, italic, headings, lists)
  const html = block.content
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-4 mb-2 text-[var(--neutral-800)]">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-4 mb-2 text-[var(--neutral-800)]">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/\n/g, "<br/>");

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={16} className="text-amber-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          Teaching Notes
        </span>
        {block.author && (
          <span className="text-xs text-[var(--neutral-400)]">
            — {block.author}
          </span>
        )}
      </div>
      <div
        className="prose prose-sm max-w-none text-[var(--neutral-700)] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

// ── Video Renderer ──

function VideoRenderer({ block }: { block: VideoBlock }) {
  // Extract YouTube embed ID
  let embedUrl = block.url;
  const ytMatch = block.url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <Video size={16} className="text-purple-600" />
        <span className="text-sm font-semibold text-purple-700">
          {block.title}
        </span>
      </div>

      {ytMatch ? (
        <div className="relative pb-[56.25%] rounded-lg overflow-hidden bg-black">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 underline"
        >
          Watch Video
        </a>
      )}

      {block.description && (
        <p className="mt-3 text-sm text-[var(--neutral-500)]">
          {block.description}
        </p>
      )}
    </div>
  );
}

// ── Discussion Renderer ──

function DiscussionRenderer({ block }: { block: DiscussionBlock }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={16} className="text-emerald-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Discussion Questions
        </span>
      </div>

      <ol className="space-y-3">
        {block.questions.map((q, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span
              className="text-[var(--neutral-700)] leading-relaxed pt-0.5"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {q}
            </span>
          </li>
        ))}
      </ol>

      {block.guidance && (
        <div className="mt-4 pt-3 border-t border-emerald-200">
          <p className="text-xs text-emerald-600 font-semibold mb-1">
            Facilitator Notes
          </p>
          <p className="text-sm text-[var(--neutral-500)] italic">
            {block.guidance}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Cross Reference Renderer ──

function CrossReferenceRenderer({ block }: { block: CrossReferenceBlock }) {
  const [allVerses, setAllVerses] = useState<{ ref: string; verses: Verse[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const results = await Promise.all(
        block.references.map(async (ref, i) => {
          const translation = block.translations?.[i] ?? "KJV";
          const label = `${ref.book} ${ref.chapter}${ref.verseStart ? `:${ref.verseStart}` : ""}${ref.verseEnd ? `-${ref.verseEnd}` : ""} (${translation})`;
          try {
            const res = await fetch(
              `/api/scripture/${encodeURIComponent(ref.book)}/${ref.chapter}?translation=${translation}`
            );
            if (res.ok) {
              const data = await res.json();
              let v: Verse[] = data.verses ?? [];
              if (ref.verseStart) {
                v = v.filter(
                  (verse) =>
                    verse.verse >= (ref.verseStart ?? 1) &&
                    verse.verse <= (ref.verseEnd ?? 999)
                );
              }
              return { ref: label, verses: v };
            }
          } catch (err) {
            console.error("Failed to load cross-ref:", err);
          }
          return { ref: label, verses: [] };
        })
      );
      setAllVerses(results);
      setLoading(false);
    }
    loadAll();
  }, [block.references, block.translations]);

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-1">
        <GitCompareArrows size={16} className="text-sky-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          Cross Reference
        </span>
      </div>
      {block.theme && (
        <p
          className="text-sm font-semibold text-sky-800 mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {block.theme}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="animate-spin text-sky-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {allVerses.map((entry, i) => (
            <div
              key={i}
              className="bg-white/70 rounded-lg border border-sky-100 p-4"
            >
              <p
                className="text-xs font-semibold text-sky-700 mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {entry.ref}
              </p>
              <div className="scripture-text text-[var(--neutral-700)] leading-relaxed text-sm">
                {entry.verses.map((v) => (
                  <span key={v.verse}>
                    <sup className="verse-number text-sky-400 mr-0.5">
                      {v.verse}
                    </sup>
                    {v.text}{" "}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {block.note && (
        <div className="mt-4 pt-3 border-t border-sky-200">
          <p className="text-sm text-[var(--neutral-600)] italic leading-relaxed">
            {block.note}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Contextual Framework Renderer ──

const CONTEXT_SECTIONS: {
  key: keyof Omit<ContextualFrameworkBlock, "type">;
  label: string;
  icon: string;
}[] = [
  { key: "historical_context", label: "Historical Context", icon: "🏛" },
  { key: "cultural_context", label: "Cultural Context", icon: "🌍" },
  { key: "author_and_audience", label: "Author & Audience", icon: "✍" },
  { key: "literary_context", label: "Literary Context", icon: "📜" },
  { key: "geographic_context", label: "Geographic Context", icon: "🗺" },
  { key: "theological_context", label: "Theological Context", icon: "⛪" },
];

function ContextualFrameworkRenderer({
  block,
}: {
  block: ContextualFrameworkBlock;
}) {
  const filledSections = CONTEXT_SECTIONS.filter(
    (s) => block[s.key]
  );

  if (filledSections.length === 0) return null;

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Landmark size={16} className="text-rose-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          Contextual Framework
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filledSections.map((section) => (
          <div
            key={section.key}
            className="bg-white/70 rounded-lg border border-rose-100 p-4"
          >
            <p className="text-xs font-semibold text-rose-700 mb-2 flex items-center gap-1.5">
              <span>{section.icon}</span>
              {section.label}
            </p>
            <p className="text-sm text-[var(--neutral-600)] leading-relaxed">
              {block[section.key] as string}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
