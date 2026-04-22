"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Plus,
  Save,
  Eye,
  Check,
  Loader2,
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  BookOpen,
  FileText,
  Video,
  MessageCircle,
  GitCompareArrows,
  Landmark,
  X,
} from "lucide-react";
import {
  CurriculumCategory,
  CurriculumStep,
  StepBlock,
  ScriptureBlock,
  TeachingBlock,
  VideoBlock,
  DiscussionBlock,
  CrossReferenceBlock,
  ContextualFrameworkBlock,
} from "@/types";
import ScriptureBlockEditor from "./blocks/ScriptureBlockEditor";
import TeachingBlockEditor from "./blocks/TeachingBlockEditor";
import VideoBlockEditor from "./blocks/VideoBlockEditor";
import DiscussionBlockEditor from "./blocks/DiscussionBlockEditor";
import CrossReferenceBlockEditor from "./blocks/CrossReferenceBlockEditor";
import ContextualFrameworkBlockEditor from "./blocks/ContextualFrameworkBlockEditor";
import {
  THEOLOGICAL_TOPICS,
  TOPIC_CATEGORIES,
  getTopic,
  getRelatedTopics,
  searchTopics,
  type TheologicalTopic,
} from "@/lib/theology/topics";
import { CURRICULUM_TEMPLATES, getTemplate } from "@/lib/curriculum/templates";

// ── Category options ──

const CATEGORIES: { value: CurriculumCategory; label: string }[] = [
  { value: "book-study", label: "Book Study" },
  { value: "topical", label: "Topical" },
  { value: "character-study", label: "Character Study" },
  { value: "devotional", label: "Devotional" },
  { value: "theology", label: "Theology" },
  { value: "history", label: "History" },
  { value: "practical-living", label: "Practical Living" },
  { value: "apologetics", label: "Apologetics" },
];

// ── Block type menu ──

const BLOCK_TYPES = [
  { type: "scripture" as const, label: "Scripture", icon: BookOpen, color: "var(--primary-600)" },
  { type: "teaching" as const, label: "Teaching", icon: FileText, color: "var(--accent-600)" },
  { type: "video" as const, label: "Video", icon: Video, color: "#7c3aed" },
  { type: "discussion" as const, label: "Discussion", icon: MessageCircle, color: "#059669" },
  { type: "cross-reference" as const, label: "Cross Reference", icon: GitCompareArrows, color: "#0284c7" },
  { type: "context" as const, label: "Context", icon: Landmark, color: "#e11d48" },
];

// ── Default blocks ──

function createDefaultBlock(type: StepBlock["type"]): StepBlock {
  switch (type) {
    case "scripture":
      return { type: "scripture", reference: { book: "John", chapter: 1, verseStart: 1, verseEnd: 5 } };
    case "teaching":
      return { type: "teaching", content: "" };
    case "video":
      return { type: "video", url: "", title: "" };
    case "discussion":
      return { type: "discussion", questions: [""] };
    case "cross-reference":
      return { type: "cross-reference", references: [{ book: "Genesis", chapter: 1, verseStart: 1 }, { book: "John", chapter: 1, verseStart: 1 }] };
    case "context":
      return { type: "context" };
  }
}

// ── Local step type (before saving to DB) ──

interface LocalStep {
  localId: string;
  title: string;
  blocks: StepBlock[];
  isExpanded: boolean;
}

let stepCounter = 0;
function newLocalId() {
  return `local-${++stepCounter}-${Date.now()}`;
}

// ═══════════════════════════════════════════
// Main Builder Component
// ═══════════════════════════════════════════

export default function CurriculumBuilder() {
  const { user } = useAuth();

  // ── Curriculum metadata ──
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CurriculumCategory>("book-study");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [authorName, setAuthorName] = useState("");

  // ── Topics ──
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topicSearch, setTopicSearch] = useState("");
  const [showTopicPicker, setShowTopicPicker] = useState(false);

  // ── Steps ──
  const [steps, setSteps] = useState<LocalStep[]>([]);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ── Auto-save ──
  const [savedCurriculumId, setSavedCurriculumId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedData = useRef<string>("");

  // Build a snapshot of current data for comparison
  const currentDataSnapshot = JSON.stringify({ title, description, category, tags, authorName, steps: steps.map((s) => ({ title: s.title, blocks: s.blocks })) });

  // Auto-save effect: debounce saves after initial creation
  useEffect(() => {
    if (!savedCurriculumId) return; // only auto-save after first manual save
    if (!title.trim()) return; // need at least a title
    if (currentDataSnapshot === lastSavedData.current) return; // nothing changed

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        // Update curriculum metadata
        await fetch(`/api/curricula/${savedCurriculumId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category,
            tags,
            estimated_duration_minutes: steps.length * 15,
          }),
        });

        lastSavedData.current = currentDataSnapshot;
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 3000);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [currentDataSnapshot, savedCurriculumId, title, description, category, tags, steps]);

  // ── Tag handling ──
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // ── Topic operations ──
  const addTopic = (topicId: string) => {
    if (!selectedTopics.includes(topicId)) {
      setSelectedTopics([...selectedTopics, topicId]);
      // Also add topic as a tag for searchability
      const topic = getTopic(topicId);
      if (topic && !tags.includes(topicId)) {
        setTags([...tags, topicId]);
      }
    }
    setTopicSearch("");
    setShowTopicPicker(false);
  };

  const removeTopic = (topicId: string) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topicId));
  };

  // Computed: all suggested passages from selected topics
  const suggestedPassages = selectedTopics
    .map((id) => getTopic(id))
    .filter((t): t is TheologicalTopic => t !== undefined)
    .flatMap((t) => t.keyPassages.map((p) => ({ ...p, topicLabel: t.label })));

  const suggestedQuestions = selectedTopics
    .map((id) => getTopic(id))
    .filter((t): t is TheologicalTopic => t !== undefined)
    .flatMap((t) => t.suggestedQuestions.map((q) => ({ question: q, topicLabel: t.label })));

  const suggestedContexts = selectedTopics
    .map((id) => getTopic(id))
    .filter((t): t is TheologicalTopic => t !== undefined)
    .filter((t) => t.contextNotes.historical || t.contextNotes.theological)
    .map((t) => ({ topicLabel: t.label, ...t.contextNotes }));

  const filteredTopics = topicSearch.trim()
    ? searchTopics(topicSearch)
    : THEOLOGICAL_TOPICS.slice(0, 12);

  // ── Step operations ──
  const addStep = () => {
    setSteps([
      ...steps,
      {
        localId: newLocalId(),
        title: `Step ${steps.length + 1}`,
        blocks: [],
        isExpanded: true,
      },
    ]);
  };

  const applyTemplate = (templateId: string) => {
    const template = getTemplate(templateId);
    if (!template) return;

    setCategory(template.category);
    if (template.suggestedTopics.length > 0) {
      setSelectedTopics(template.suggestedTopics);
      // Add topic IDs as tags
      const newTags = [...tags];
      template.suggestedTopics.forEach((t) => {
        if (!newTags.includes(t)) newTags.push(t);
      });
      setTags(newTags);
    }
    setSteps(
      template.steps.map((s) => ({
        localId: newLocalId(),
        title: s.title,
        blocks: s.blocks,
        isExpanded: false,
      }))
    );
    setShowSuggestions(true);
  };

  const removeStep = (localId: string) => {
    setSteps(steps.filter((s) => s.localId !== localId));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const toggleStep = (localId: string) => {
    setSteps(
      steps.map((s) =>
        s.localId === localId ? { ...s, isExpanded: !s.isExpanded } : s
      )
    );
  };

  const updateStepTitle = (localId: string, newTitle: string) => {
    setSteps(
      steps.map((s) => (s.localId === localId ? { ...s, title: newTitle } : s))
    );
  };

  // ── Block operations within a step ──
  const addBlock = (stepLocalId: string, blockType: StepBlock["type"]) => {
    setSteps(
      steps.map((s) =>
        s.localId === stepLocalId
          ? { ...s, blocks: [...s.blocks, createDefaultBlock(blockType)] }
          : s
      )
    );
  };

  const updateBlock = useCallback(
    (stepLocalId: string, blockIndex: number, updatedBlock: StepBlock) => {
      setSteps((prev) =>
        prev.map((s) =>
          s.localId === stepLocalId
            ? {
                ...s,
                blocks: s.blocks.map((b, i) =>
                  i === blockIndex ? updatedBlock : b
                ),
              }
            : s
        )
      );
    },
    []
  );

  const removeBlock = (stepLocalId: string, blockIndex: number) => {
    setSteps(
      steps.map((s) =>
        s.localId === stepLocalId
          ? { ...s, blocks: s.blocks.filter((_, i) => i !== blockIndex) }
          : s
      )
    );
  };

  // ── Save curriculum ──
  const handleSave = async (publish = false) => {
    if (!title.trim()) {
      alert("Please add a title for your curriculum.");
      return;
    }
    if (!authorName.trim()) {
      alert("Please add your name as the author.");
      return;
    }

    setSaving(true);
    try {
      // 1. Create the curriculum
      const res = await fetch("/api/curricula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          author_id: user?.id ?? null,
          author_name: authorName.trim(),
          category,
          tags,
          estimated_duration_minutes: steps.length * 15,
        }),
      });

      if (!res.ok) throw new Error("Failed to create curriculum");
      const curriculum = await res.json();

      // 2. Create each step
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await fetch(`/api/curricula/${curriculum.id}/steps`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: i + 1,
            title: step.title,
            blocks: step.blocks,
          }),
        });
      }

      // Track saved ID for auto-save
      setSavedCurriculumId(curriculum.id);
      lastSavedData.current = currentDataSnapshot;

      // 3. Optionally publish
      if (publish) {
        await fetch(`/api/curricula/${curriculum.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_published: true }),
        });
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);

      alert(
        publish
          ? "Curriculum published!"
          : "Curriculum saved as draft! Changes will auto-save from now on."
      );
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong saving your curriculum.");
    } finally {
      setSaving(false);
    }
  };

  // ── Computed ──
  const totalBlocks = steps.reduce((sum, s) => sum + s.blocks.length, 0);

  return (
    <div className="bg-[var(--background)]">
      {/* Top toolbar */}
      <header className="sticky top-16 z-30 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 md:px-8 h-14">
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-semibold text-[var(--primary-800)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Curriculum Builder
            </span>
            <span className="text-xs text-[var(--neutral-400)]">
              {steps.length} step{steps.length !== 1 ? "s" : ""} · {totalBlocks} block{totalBlocks !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Save status indicator */}
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1 text-xs text-[var(--neutral-400)]">
                <Loader2 size={12} className="animate-spin" />
                Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <Check size={12} />
                Saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-xs text-red-500">Save failed</span>
            )}

            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] transition-colors"
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] transition-colors"
            >
              <Save size={16} />
              {savedCurriculumId ? "Save" : "Save Draft"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium text-white bg-[var(--primary-600)] hover:bg-[var(--primary-700)] transition-colors"
            >
              {saving ? "Saving..." : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* ── Metadata Section ── */}
        <section className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 md:p-8 mb-8">
          <h2
            className="text-lg font-semibold text-[var(--primary-800)] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Curriculum Details
          </h2>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Gospel of John: A Deep Dive"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-transparent text-sm"
              />
            </div>

            {/* Author + Category row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CurriculumCategory)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--neutral-800)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-transparent text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will people learn from this curriculum?"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-transparent text-sm resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-200)]"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-[var(--primary-900)]"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-transparent text-sm"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 rounded-lg text-sm text-[var(--primary-600)] hover:bg-[var(--primary-50)] border border-[var(--border)] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-[var(--neutral-600)] mb-1.5">
                Theological Topics
              </label>
              <p className="text-xs text-[var(--neutral-400)] mb-2">
                Select topics to get suggested passages, discussion questions, and context.
              </p>
              <div className="flex gap-2 mb-2 flex-wrap">
                {selectedTopics.map((topicId) => {
                  const topic = getTopic(topicId);
                  return topic ? (
                    <span
                      key={topicId}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--accent-50)] text-[var(--accent-700)] border border-[var(--accent-200)]"
                    >
                      {topic.label}
                      <button
                        onClick={() => removeTopic(topicId)}
                        className="hover:text-[var(--accent-900)]"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={topicSearch}
                  onChange={(e) => {
                    setTopicSearch(e.target.value);
                    setShowTopicPicker(true);
                  }}
                  onFocus={() => setShowTopicPicker(true)}
                  placeholder="Search topics (e.g. Justification, Trinity, Sanctification)..."
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-300)] focus:border-transparent text-sm"
                />
                {showTopicPicker && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-lg z-20 max-h-64 overflow-y-auto">
                    {filteredTopics.filter((t) => !selectedTopics.includes(t.id)).length === 0 ? (
                      <div className="px-4 py-3 text-sm text-[var(--neutral-400)]">
                        No matching topics
                      </div>
                    ) : (
                      filteredTopics
                        .filter((t) => !selectedTopics.includes(t.id))
                        .map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => addTopic(topic.id)}
                            className="w-full text-left px-4 py-2.5 hover:bg-[var(--neutral-50)] transition-colors border-b border-[var(--border)] last:border-0"
                          >
                            <span className="text-sm font-medium text-[var(--primary-800)]">
                              {topic.label}
                            </span>
                            <span className="block text-xs text-[var(--neutral-400)] mt-0.5 line-clamp-1">
                              {topic.description}
                            </span>
                          </button>
                        ))
                    )}
                    <button
                      onClick={() => setShowTopicPicker(false)}
                      className="w-full px-4 py-2 text-xs text-[var(--neutral-400)] hover:text-[var(--neutral-600)] text-center border-t border-[var(--border)]"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Suggestions Panel (when topics selected) ── */}
        {selectedTopics.length > 0 && (
          <section className="bg-[var(--accent-50)] rounded-xl border border-[var(--accent-200)] p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-semibold text-[var(--accent-700)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Suggestions
              </h2>
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-xs text-[var(--accent-600)] hover:text-[var(--accent-800)]"
              >
                {showSuggestions ? "Hide" : "Show"} suggestions
              </button>
            </div>

            {showSuggestions && (
              <div className="space-y-6">
                {/* Suggested Passages */}
                {suggestedPassages.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-600)] mb-2">
                      Key Passages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {suggestedPassages.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            // Add a scripture block to the last step (or create one)
                            if (steps.length === 0) addStep();
                            const targetStep = steps[steps.length - 1] ?? { localId: "" };
                            if (targetStep.localId) {
                              addBlock(targetStep.localId, "scripture");
                              // Update the just-added block with this reference
                              const stepIdx = steps.findIndex((s) => s.localId === targetStep.localId);
                              if (stepIdx >= 0) {
                                const blockIdx = steps[stepIdx].blocks.length; // new block index
                                updateBlock(targetStep.localId, blockIdx, {
                                  type: "scripture",
                                  reference: { book: p.book, chapter: p.chapter, verseStart: p.verseStart, verseEnd: p.verseEnd },
                                });
                              }
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-[var(--primary-700)] border border-[var(--accent-200)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)] transition-colors"
                          title={`From: ${p.topicLabel}`}
                        >
                          {p.book} {p.chapter}
                          {p.verseStart ? `:${p.verseStart}` : ""}
                          {p.verseEnd ? `-${p.verseEnd}` : ""}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--accent-500)] mt-2">
                      Click a passage to add it as a scripture block in your last step.
                    </p>
                  </div>
                )}

                {/* Suggested Questions */}
                {suggestedQuestions.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-600)] mb-2">
                      Discussion Questions
                    </h3>
                    <div className="space-y-2">
                      {suggestedQuestions.map((q, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 px-3 py-2 bg-white rounded-lg border border-[var(--accent-100)]"
                        >
                          <p className="flex-1 text-sm text-[var(--neutral-700)]">
                            {q.question}
                          </p>
                          <button
                            onClick={() => {
                              // Add to last step's discussion block or create one
                              if (steps.length === 0) addStep();
                              const targetStep = steps[steps.length - 1];
                              if (targetStep) {
                                const existingDiscussion = targetStep.blocks.findIndex((b) => b.type === "discussion");
                                if (existingDiscussion >= 0) {
                                  const block = targetStep.blocks[existingDiscussion] as DiscussionBlock;
                                  updateBlock(targetStep.localId, existingDiscussion, {
                                    ...block,
                                    questions: [...block.questions.filter(Boolean), q.question],
                                  });
                                } else {
                                  addBlock(targetStep.localId, "discussion");
                                }
                              }
                            }}
                            className="flex-shrink-0 px-2 py-1 rounded text-xs text-[var(--primary-600)] hover:bg-[var(--primary-50)]"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context Notes */}
                {suggestedContexts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-600)] mb-2">
                      Context &amp; Background
                    </h3>
                    <div className="space-y-2">
                      {suggestedContexts.map((ctx, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 bg-white rounded-lg border border-[var(--accent-100)]"
                        >
                          <span className="text-xs font-medium text-[var(--accent-600)]">
                            {ctx.topicLabel}
                          </span>
                          {ctx.historical && (
                            <p className="text-sm text-[var(--neutral-600)] mt-1">
                              <strong className="text-[var(--neutral-700)]">Historical:</strong>{" "}
                              {ctx.historical}
                            </p>
                          )}
                          {ctx.theological && (
                            <p className="text-sm text-[var(--neutral-600)] mt-1">
                              <strong className="text-[var(--neutral-700)]">Theological:</strong>{" "}
                              {ctx.theological}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ── Steps Section ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-semibold text-[var(--primary-800)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Steps
            </h2>
            <button
              onClick={addStep}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--primary-600)] hover:bg-[var(--primary-50)] border border-[var(--primary-200)] transition-colors"
            >
              <Plus size={16} />
              Add Step
            </button>
          </div>

          {steps.length === 0 ? (
            <div className="bg-[var(--surface)] rounded-xl border border-dashed border-[var(--border)] p-8">
              <div className="text-center mb-8">
                <BookOpen
                  size={40}
                  className="mx-auto mb-3 text-[var(--neutral-300)]"
                />
                <p className="text-[var(--neutral-500)] text-sm mb-4">
                  Start from a template or build from scratch.
                </p>
                <button
                  onClick={addStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--primary-600)] hover:bg-[var(--primary-700)] transition-colors"
                >
                  <Plus size={16} />
                  Blank Step
                </button>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)] mb-3 text-center">
                  Or start from a template
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CURRICULUM_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template.id)}
                      className="text-left p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)] transition-all group"
                    >
                      <span
                        className="text-sm font-semibold text-[var(--primary-800)] group-hover:text-[var(--primary-600)]"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {template.name}
                      </span>
                      <span className="block text-xs text-[var(--neutral-500)] mt-1">
                        {template.description}
                      </span>
                      <span className="block text-xs text-[var(--primary-400)] mt-2">
                        {template.steps.length} steps pre-configured
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <StepEditor
                  key={step.localId}
                  step={step}
                  index={index}
                  totalSteps={steps.length}
                  onToggle={() => toggleStep(step.localId)}
                  onTitleChange={(t) => updateStepTitle(step.localId, t)}
                  onRemove={() => removeStep(step.localId)}
                  onMoveUp={() => moveStep(index, "up")}
                  onMoveDown={() => moveStep(index, "down")}
                  onAddBlock={(type) => addBlock(step.localId, type)}
                  onUpdateBlock={(bi, block) => updateBlock(step.localId, bi, block)}
                  onRemoveBlock={(bi) => removeBlock(step.localId, bi)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Step Editor
// ═══════════════════════════════════════════

function StepEditor({
  step,
  index,
  totalSteps,
  onToggle,
  onTitleChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
}: {
  step: LocalStep;
  index: number;
  totalSteps: number;
  onToggle: () => void;
  onTitleChange: (title: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBlock: (type: StepBlock["type"]) => void;
  onUpdateBlock: (blockIndex: number, block: StepBlock) => void;
  onRemoveBlock: (blockIndex: number) => void;
}) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Step header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--neutral-50)] border-b border-[var(--border)]">
        <GripVertical
          size={16}
          className="text-[var(--neutral-300)] cursor-grab flex-shrink-0"
        />
        <span className="text-xs font-bold text-[var(--primary-500)] flex-shrink-0 w-6">
          {index + 1}
        </span>
        <input
          type="text"
          value={step.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="flex-1 bg-transparent text-sm font-medium text-[var(--neutral-800)] focus:outline-none"
          placeholder="Step title..."
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1 text-[var(--neutral-400)] hover:text-[var(--neutral-600)] disabled:opacity-30"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === totalSteps - 1}
            className="p-1 text-[var(--neutral-400)] hover:text-[var(--neutral-600)] disabled:opacity-30"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={onToggle}
            className="p-1 text-[var(--neutral-400)] hover:text-[var(--neutral-600)]"
          >
            {step.isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-[var(--neutral-400)] hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Step body (expanded) */}
      {step.isExpanded && (
        <div className="p-4 space-y-3">
          {/* Existing blocks */}
          {step.blocks.map((block, bi) => (
            <div key={bi} className="relative group">
              <button
                onClick={() => onRemoveBlock(bi)}
                className="absolute -top-2 -right-2 z-10 p-1 rounded-full bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>

              {block.type === "scripture" && (
                <ScriptureBlockEditor
                  block={block}
                  onChange={(b) => onUpdateBlock(bi, b)}
                />
              )}
              {block.type === "teaching" && (
                <TeachingBlockEditor
                  block={block}
                  onChange={(b) => onUpdateBlock(bi, b)}
                />
              )}
              {block.type === "video" && (
                <VideoBlockEditor
                  block={block}
                  onChange={(b) => onUpdateBlock(bi, b)}
                />
              )}
              {block.type === "discussion" && (
                <DiscussionBlockEditor
                  block={block}
                  onChange={(b) => onUpdateBlock(bi, b)}
                />
              )}
              {block.type === "cross-reference" && (
                <CrossReferenceBlockEditor
                  block={block}
                  onChange={(b) => onUpdateBlock(bi, b)}
                />
              )}
              {block.type === "context" && (
                <ContextualFrameworkBlockEditor
                  block={block}
                  onChange={(b) => onUpdateBlock(bi, b)}
                />
              )}
            </div>
          ))}

          {/* Add block */}
          <div className="relative">
            <button
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className="flex items-center gap-1.5 w-full px-4 py-3 rounded-lg border border-dashed border-[var(--border)] text-sm text-[var(--neutral-400)] hover:text-[var(--primary-600)] hover:border-[var(--primary-300)] transition-colors"
            >
              <Plus size={16} />
              Add a block
            </button>

            {showBlockMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-lg z-10 p-2 grid grid-cols-2 gap-1">
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => {
                      onAddBlock(bt.type);
                      setShowBlockMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-[var(--neutral-700)] hover:bg-[var(--neutral-50)] transition-colors"
                  >
                    <bt.icon size={16} style={{ color: bt.color }} />
                    {bt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
