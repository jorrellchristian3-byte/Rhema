// ============================================
// Rhema — Core Type Definitions
// ============================================

// --- Scripture Types ---

export interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
  testament: "OT" | "NT";
  order: number;
  chapters: number;
}

export interface ScriptureReference {
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface Chapter {
  book: string;
  chapter: number;
  verses: Verse[];
  translation: string;
}

export type TranslationId = "KJV" | "ESV" | "ASV" | "YLT";

export interface Translation {
  id: TranslationId;
  name: string;
  abbreviation: string;
  language: string;
  isPublicDomain: boolean;
  apiSource: "free-bible-api" | "esv-api" | "local";
}

// --- Curriculum Types ---

export interface Curriculum {
  id: string;
  title: string;
  description: string;
  author_id: string | null;
  author_name: string;
  cover_image_url?: string;
  category: CurriculumCategory;
  tags: string[];
  estimated_duration_minutes: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  steps?: CurriculumStep[];
}

export type CurriculumCategory =
  | "book-study"
  | "topical"
  | "character-study"
  | "devotional"
  | "theology"
  | "history"
  | "practical-living"
  | "apologetics";

export interface CurriculumStep {
  id: string;
  curriculum_id: string;
  order: number;
  title: string;
  blocks: StepBlock[];
  created_at: string;
  updated_at: string;
}

// A step is composed of ordered blocks — each block is one content type
export type StepBlock =
  | ScriptureBlock
  | TeachingBlock
  | VideoBlock
  | DiscussionBlock
  | CrossReferenceBlock
  | ContextualFrameworkBlock;

export interface ScriptureBlock {
  type: "scripture";
  reference: ScriptureReference;
  translation?: TranslationId;
  note?: string; // optional creator note about this passage
}

export interface TeachingBlock {
  type: "teaching";
  content: string; // markdown content
  author?: string; // attribution if quoting someone
}

export interface VideoBlock {
  type: "video";
  url: string;
  title: string;
  description?: string;
  duration_seconds?: number;
}

export interface DiscussionBlock {
  type: "discussion";
  questions: string[];
  guidance?: string; // optional facilitator notes
}

export interface CrossReferenceBlock {
  type: "cross-reference";
  references: ScriptureReference[];
  translations?: TranslationId[]; // one per reference, or falls back to KJV
  note?: string; // explanation of how these passages connect
  theme?: string; // e.g. "Pre-existence of Christ", "Covenant Promises"
}

export interface ContextualFrameworkBlock {
  type: "context";
  historical_context?: string;   // time period, political climate, major events
  cultural_context?: string;     // customs, social norms, daily life
  literary_context?: string;     // genre, structure, literary devices
  author_and_audience?: string;  // who wrote it, to whom, and why
  geographic_context?: string;   // location, significance of place
  theological_context?: string;  // where this fits in the arc of redemption history
}

// --- Resource Library Types ---

export interface Commentary {
  id: string;
  author: string;
  title: string;
  book: string;
  chapter_start: number;
  chapter_end?: number;
  verse_start?: number;
  verse_end?: number;
  content: string; // markdown
  source_url?: string;
  is_public_domain: boolean;
}

export interface TheologianQuote {
  id: string;
  author: string;
  author_era?: string;
  text: string;
  source_title?: string;
  source_url?: string;
  scripture_references: ScriptureReference[];
  tags: string[];
}

export interface VideoResource {
  id: string;
  title: string;
  url: string;
  provider: "youtube" | "vimeo" | "other";
  channel: string;
  description?: string;
  duration_seconds?: number;
  scripture_references: ScriptureReference[];
  tags: string[];
  thumbnail_url?: string;
}

export interface ArticleResource {
  id: string;
  title: string;
  author: string;
  url: string;
  source: string; // e.g. "CCEL", "DTS", "BiblicalTraining"
  description?: string;
  scripture_references: ScriptureReference[];
  tags: string[];
  is_free: boolean;
}

// --- User Types ---

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  reference: ScriptureReference;
  note?: string;
  color?: string;
  created_at: string;
}

export interface CurriculumProgress {
  id: string;
  user_id: string;
  curriculum_id: string;
  current_step: number;
  completed_steps: number[];
  started_at: string;
  last_activity_at: string;
}

// --- Study Notes Types ---

export interface StudyNote {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  title: string;
  content: string; // markdown / rich text content
  tags: string[];
  created_at: string;
  updated_at: string;
}

// --- Search Types ---

export interface SearchResult {
  type: "curriculum" | "commentary" | "quote" | "video" | "article";
  id: string;
  title: string;
  snippet: string;
  score: number;
}

export interface SearchFilters {
  type?: SearchResult["type"][];
  tags?: string[];
  category?: CurriculumCategory;
  book?: string;
}
