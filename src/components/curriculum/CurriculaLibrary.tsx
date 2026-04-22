"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Clock,
  User,
  Tag,
  BookOpen,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Curriculum, CurriculumCategory } from "@/types";
import { THEOLOGICAL_TOPICS, TOPIC_CATEGORIES } from "@/lib/theology/topics";

const CATEGORIES: { value: CurriculumCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "book-study", label: "Book Study" },
  { value: "topical", label: "Topical" },
  { value: "character-study", label: "Character Study" },
  { value: "devotional", label: "Devotional" },
  { value: "theology", label: "Theology" },
  { value: "history", label: "History" },
  { value: "practical-living", label: "Practical Living" },
  { value: "apologetics", label: "Apologetics" },
];

export default function CurriculaLibrary() {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CurriculumCategory | "all">("all");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const fetchCurricula = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (search.trim()) params.set("search", search.trim());
      if (selectedTopic) params.set("topic", selectedTopic);
      params.set("limit", "20");

      const res = await fetch(`/api/curricula?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCurricula(data.curricula ?? []);
        setTotalCount(data.count ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch curricula:", err);
    } finally {
      setLoading(false);
    }
  }, [category, search, selectedTopic]);

  useEffect(() => {
    const timer = setTimeout(() => fetchCurricula(), 300);
    return () => clearTimeout(timer);
  }, [fetchCurricula]);

  const categoryLabel = (cat: string) =>
    CATEGORIES.find((c) => c.value === cat)?.label ?? cat;

  return (
    <div className="bg-[var(--background)]">
      {/* Hero */}
      <div className="bg-[var(--primary-900)] text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Curriculum Library
          </h1>
          <p className="text-[var(--primary-200)] max-w-xl">
            Explore Bible study curriculum built by the community. Find your next
            deep dive, devotional series, or group study.
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="sticky top-16 z-20 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-400)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search curriculum..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-400)]"
            />
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as CurriculumCategory | "all")
              }
              className="pl-8 pr-8 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--neutral-800)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] appearance-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--neutral-400)] pointer-events-none"
            />
          </div>

          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--primary-600)] hover:bg-[var(--primary-700)] transition-colors"
          >
            Create Curriculum
          </Link>
        </div>
      </div>

      {/* Topic pills */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] mb-3">
          Browse by Topic
        </p>
        <div className="flex flex-wrap gap-2">
          {THEOLOGICAL_TOPICS.slice(0, 16).map((topic) => (
            <button
              key={topic.id}
              onClick={() =>
                setSelectedTopic(selectedTopic === topic.id ? null : topic.id)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedTopic === topic.id
                  ? "bg-[var(--primary-500)] text-white"
                  : "bg-[var(--neutral-100)] text-[var(--neutral-600)] hover:bg-[var(--primary-50)] hover:text-[var(--primary-600)]"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2
              size={24}
              className="animate-spin text-[var(--primary-400)]"
            />
          </div>
        ) : curricula.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen
              size={48}
              className="mx-auto mb-4 text-[var(--neutral-300)]"
            />
            <p className="text-[var(--neutral-500)] mb-2">
              No curriculum found.
            </p>
            <p className="text-sm text-[var(--neutral-400)]">
              {search || category !== "all"
                ? "Try adjusting your search or filters."
                : "Be the first to create one!"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--neutral-400)] mb-6">
              {totalCount} curriculum{totalCount !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {curricula.map((c) => (
                <CurriculumCard key={c.id} curriculum={c} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Card ──

function CurriculumCard({ curriculum }: { curriculum: Curriculum }) {
  const categoryLabel: Record<string, string> = {
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
    <Link
      href={`/curricula/${curriculum.id}`}
      className="group bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--primary-300)] hover:shadow-md transition-all overflow-hidden"
    >
      {/* Color accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)]" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="text-base font-semibold text-[var(--primary-800)] group-hover:text-[var(--primary-600)] transition-colors line-clamp-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {curriculum.title}
          </h3>
        </div>

        <p className="text-sm text-[var(--neutral-500)] line-clamp-2 mb-4">
          {curriculum.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-[var(--neutral-400)]">
          <span className="flex items-center gap-1">
            <User size={12} />
            {curriculum.author_name}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {curriculum.estimated_duration_minutes}m
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)]">
            {categoryLabel[curriculum.category] ?? curriculum.category}
          </span>
          {curriculum.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs bg-[var(--neutral-100)] text-[var(--neutral-500)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
