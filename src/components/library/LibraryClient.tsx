"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  MessageSquareQuote,
  Landmark,
} from "lucide-react";
import {
  THEOLOGICAL_TOPICS,
  TOPIC_CATEGORIES,
  type TheologicalTopic,
  type TopicCategory,
} from "@/lib/theology/topics";

export default function LibraryClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TopicCategory | "all">(
    "all"
  );
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const filteredTopics = useMemo(() => {
    let topics = THEOLOGICAL_TOPICS;

    if (activeCategory !== "all") {
      topics = topics.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      topics = topics.filter(
        (t) =>
          t.label.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.contextNotes.theological?.toLowerCase().includes(q) ||
          t.contextNotes.historical?.toLowerCase().includes(q)
      );
    }

    return topics;
  }, [searchQuery, activeCategory]);

  const toggleTopic = (id: string) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[var(--primary-50)] to-[var(--background)]">
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-8">
          <h1
            className="text-3xl md:text-4xl text-[var(--primary-900)] mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Theological Library
          </h1>
          <p className="text-[var(--neutral-600)] max-w-2xl leading-relaxed">
            Explore {THEOLOGICAL_TOPICS.length} theological topics with key
            scripture passages, historical context, and discussion questions to
            deepen your study.
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-400)]"
            />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-[var(--primary-500)] text-white"
                : "bg-[var(--neutral-100)] text-[var(--neutral-600)] hover:bg-[var(--neutral-200)]"
            }`}
          >
            All Topics ({THEOLOGICAL_TOPICS.length})
          </button>
          {TOPIC_CATEGORIES.map((cat) => {
            const count = THEOLOGICAL_TOPICS.filter(
              (t) => t.category === cat.value
            ).length;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat.value
                    ? "bg-[var(--primary-500)] text-white"
                    : "bg-[var(--neutral-100)] text-[var(--neutral-600)] hover:bg-[var(--neutral-200)]"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Topics list */}
        {filteredTopics.length === 0 ? (
          <div className="text-center py-16 text-[var(--neutral-400)]">
            <Lightbulb size={32} className="mx-auto mb-3 opacity-50" />
            <p>No topics match your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isExpanded={expandedTopic === topic.id}
                onToggle={() => toggleTopic(topic.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TopicCard({
  topic,
  isExpanded,
  onToggle,
}: {
  topic: TheologicalTopic;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const categoryLabel =
    TOPIC_CATEGORIES.find((c) => c.value === topic.category)?.label ?? "";

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-[var(--neutral-50)] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--accent-600)] bg-[var(--accent-50)] px-2 py-0.5 rounded">
              {categoryLabel}
            </span>
          </div>
          <h3
            className="text-lg text-[var(--primary-900)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {topic.label}
          </h3>
          <p className="text-sm text-[var(--neutral-500)] mt-1 line-clamp-2">
            {topic.description}
          </p>
        </div>
        <div className="mt-1 text-[var(--neutral-400)]">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-[var(--border-subtle)] pt-5 space-y-6">
          {/* Key Passages */}
          {topic.keyPassages.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--primary-700)] mb-3">
                <BookOpen size={15} />
                Key Passages
              </h4>
              <div className="flex flex-wrap gap-2">
                {topic.keyPassages.map((passage, i) => {
                  const ref = passage.verseStart
                    ? `${passage.book} ${passage.chapter}:${passage.verseStart}${passage.verseEnd && passage.verseEnd !== passage.verseStart ? `-${passage.verseEnd}` : ""}`
                    : `${passage.book} ${passage.chapter}`;
                  const bookId = passage.book
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  return (
                    <Link
                      key={i}
                      href={`/read/${bookId}/${passage.chapter}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--primary-50)] text-[var(--primary-700)] hover:bg-[var(--primary-100)] transition-colors"
                    >
                      {ref}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Context Notes */}
          {(topic.contextNotes.theological ||
            topic.contextNotes.historical) && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--primary-700)] mb-3">
                <Landmark size={15} />
                Context
              </h4>
              {topic.contextNotes.theological && (
                <div className="mb-3">
                  <span className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    Theological
                  </span>
                  <p className="text-sm text-[var(--neutral-700)] mt-1 leading-relaxed">
                    {topic.contextNotes.theological}
                  </p>
                </div>
              )}
              {topic.contextNotes.historical && (
                <div>
                  <span className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    Historical
                  </span>
                  <p className="text-sm text-[var(--neutral-700)] mt-1 leading-relaxed">
                    {topic.contextNotes.historical}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Discussion Questions */}
          {topic.suggestedQuestions.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--primary-700)] mb-3">
                <MessageSquareQuote size={15} />
                Discussion Questions
              </h4>
              <ol className="space-y-2">
                {topic.suggestedQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="text-sm text-[var(--neutral-700)] leading-relaxed pl-5 relative"
                  >
                    <span className="absolute left-0 text-[var(--primary-400)] font-medium">
                      {i + 1}.
                    </span>
                    {q}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Related Topics */}
          {topic.relatedTopics.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider mb-2">
                Related Topics
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {topic.relatedTopics.map((relId) => {
                  const relTopic = THEOLOGICAL_TOPICS.find(
                    (t) => t.id === relId
                  );
                  return relTopic ? (
                    <span
                      key={relId}
                      className="px-2 py-1 rounded text-xs bg-[var(--neutral-100)] text-[var(--neutral-600)]"
                    >
                      {relTopic.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
