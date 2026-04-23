/**
 * Rhema — Bible API Integration Layer
 *
 * Unified interface for fetching scripture:
 * - bolls.life — KJV, ASV, YLT, and 100+ translations (free, no key required)
 * - ESV API (api.esv.org) — ESV translation (requires API key)
 *
 * All providers are normalized to a common Verse/Chapter format.
 */

import { Chapter, Verse, TranslationId } from "@/types";
import { getTranslation } from "./translations";
import { getBookByName, BIBLE_BOOKS } from "./books";

// ============================================
// Provider Interfaces
// ============================================

interface BibleProvider {
  fetchChapter(book: string, chapter: number): Promise<Verse[]>;
  fetchVerses(
    book: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number
  ): Promise<Verse[]>;
}

// ============================================
// Book name → bolls.life book number mapping
// bolls.life uses standard 1-66 Protestant canon ordering
// ============================================

function getBookNumber(bookName: string): number {
  const book = getBookByName(bookName);
  if (book) return book.order;

  // Fallback: try matching against BIBLE_BOOKS more loosely
  const normalized = bookName.toLowerCase().replace(/\s+/g, "");
  const match = BIBLE_BOOKS.find(
    (b) =>
      b.name.toLowerCase().replace(/\s+/g, "") === normalized ||
      b.id.replace(/-/g, "") === normalized
  );
  if (match) return match.order;

  throw new Error(`Unknown book: ${bookName}`);
}

// ============================================
// bolls.life Provider
// Docs: https://bolls.life/api/
// Free, no API key, 100+ translations
// Endpoint: GET /get-chapter/{translation}/{bookNum}/{chapter}/
// ============================================

class BollsLifeProvider implements BibleProvider {
  private translationId: string;

  constructor(translationId: string) {
    this.translationId = translationId;
  }

  async fetchChapter(book: string, chapter: number): Promise<Verse[]> {
    const bookNum = getBookNumber(book);
    const url = `https://bolls.life/get-chapter/${this.translationId}/${bookNum}/${chapter}/`;

    const response = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${book} ${chapter} (${this.translationId}): ${response.status}`
      );
    }

    const data = await response.json();
    return this.parseResponse(data, book, chapter);
  }

  async fetchVerses(
    book: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number
  ): Promise<Verse[]> {
    // bolls.life doesn't have a verse-range endpoint, so fetch the chapter
    // and filter to the requested range
    const allVerses = await this.fetchChapter(book, chapter);
    const end = verseEnd ?? verseStart;
    return allVerses.filter((v) => v.verse >= verseStart && v.verse <= end);
  }

  private parseResponse(data: unknown, book: string, chapter: number): Verse[] {
    const verses: Verse[] = [];

    if (!Array.isArray(data)) return verses;

    for (const v of data) {
      if (v && typeof v === "object" && "verse" in v && "text" in v) {
        const verseNum = typeof v.verse === "number" ? v.verse : parseInt(String(v.verse), 10);
        const text = typeof v.text === "string" ? v.text : String(v.text ?? "");

        if (verseNum && text.trim()) {
          // bolls.life embeds Strong's Concordance numbers in KJV text:
          //   - Glued to words: "God430", "created1254"
          //   - Standalone particles: " 853 " (untranslated Hebrew markers)
          // Strip both patterns, plus any HTML tags
          const cleanText = text
            .replace(/<[^>]*>/g, "")                // strip HTML tags
            .replace(/([a-zA-Z])(\d{3,5})\b/g, "$1") // Strong's glued to words
            .replace(/\s\d{3,5}\s/g, " ")           // standalone Strong's numbers
            .replace(/\s{2,}/g, " ")                // collapse multiple spaces
            .trim();
          verses.push({
            book,
            chapter,
            verse: verseNum,
            text: cleanText,
            translation: this.translationId,
          });
        }
      }
    }

    return verses;
  }
}

// ============================================
// ESV API Provider
// Docs: https://api.esv.org/docs/
// ============================================

class EsvApiProvider implements BibleProvider {
  private apiKey: string;
  private baseUrl = "https://api.esv.org/v3/passage/text/";

  constructor() {
    this.apiKey = process.env.ESV_API_KEY ?? "";
    if (!this.apiKey) {
      console.warn("ESV_API_KEY not set — ESV translation will be unavailable");
    }
  }

  async fetchChapter(book: string, chapter: number): Promise<Verse[]> {
    const query = `${book} ${chapter}`;
    return this.fetchPassage(query, book, chapter);
  }

  async fetchVerses(
    book: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number
  ): Promise<Verse[]> {
    const end = verseEnd ?? verseStart;
    const query = `${book} ${chapter}:${verseStart}-${end}`;
    return this.fetchPassage(query, book, chapter);
  }

  private async fetchPassage(
    query: string,
    book: string,
    chapter: number
  ): Promise<Verse[]> {
    if (!this.apiKey) {
      throw new Error("ESV API key not configured");
    }

    const params = new URLSearchParams({
      q: query,
      "include-headings": "false",
      "include-footnotes": "false",
      "include-verse-numbers": "true",
      "include-short-copyright": "false",
      "include-passage-references": "false",
    });

    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: { Authorization: `Token ${this.apiKey}` },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`ESV API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseEsvResponse(data, book, chapter);
  }

  private parseEsvResponse(data: unknown, book: string, chapter: number): Verse[] {
    const verses: Verse[] = [];
    const text =
      typeof data === "object" &&
      data &&
      "passages" in data &&
      Array.isArray(data.passages) &&
      typeof data.passages[0] === "string"
        ? data.passages[0]
        : "";

    const parts = text.split(/\[(\d+)\]/).filter(Boolean);

    for (let i = 0; i < parts.length; i += 2) {
      const verseNum = parseInt(parts[i], 10);
      const verseText = (parts[i + 1] ?? "").trim();

      if (verseNum && verseText) {
        verses.push({
          book,
          chapter,
          verse: verseNum,
          text: verseText,
          translation: "ESV",
        });
      }
    }

    return verses;
  }
}

// ============================================
// Unified Bible Service
// ============================================

const providers: Record<string, BibleProvider> = {};

function getProvider(translationId: TranslationId): BibleProvider {
  if (providers[translationId]) return providers[translationId];

  const translation = getTranslation(translationId);

  switch (translation.apiSource) {
    case "esv-api":
      providers[translationId] = new EsvApiProvider();
      break;
    case "free-bible-api":
    default:
      providers[translationId] = new BollsLifeProvider(translationId);
      break;
  }

  return providers[translationId];
}

/**
 * Fetch an entire chapter of scripture
 */
export async function fetchChapter(
  book: string,
  chapter: number,
  translationId: TranslationId = "KJV"
): Promise<Chapter> {
  const provider = getProvider(translationId);
  const verses = await provider.fetchChapter(book, chapter);

  return {
    book,
    chapter,
    verses,
    translation: translationId,
  };
}

/**
 * Fetch specific verses from a chapter
 */
export async function fetchVerses(
  book: string,
  chapter: number,
  verseStart: number,
  verseEnd?: number,
  translationId: TranslationId = "KJV"
): Promise<Verse[]> {
  const provider = getProvider(translationId);
  return provider.fetchVerses(book, chapter, verseStart, verseEnd);
}

/**
 * Fetch a passage from a scripture reference string (e.g., "John 3:16-21")
 */
export async function fetchPassage(
  reference: string,
  translationId: TranslationId = "KJV"
): Promise<Verse[]> {
  const parsed = parseReference(reference);
  if (!parsed) throw new Error(`Could not parse reference: ${reference}`);

  if (parsed.verseStart) {
    return fetchVerses(
      parsed.book,
      parsed.chapter,
      parsed.verseStart,
      parsed.verseEnd,
      translationId
    );
  }

  const chapter = await fetchChapter(parsed.book, parsed.chapter, translationId);
  return chapter.verses;
}

/**
 * Parse a scripture reference string into components
 * Handles: "John 3", "John 3:16", "John 3:16-21", "1 John 2:1-5"
 */
export function parseReference(
  ref: string
): { book: string; chapter: number; verseStart?: number; verseEnd?: number } | null {
  const match = ref.match(
    /^(\d?\s*[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/
  );

  if (!match) return null;

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2], 10),
    verseStart: match[3] ? parseInt(match[3], 10) : undefined,
    verseEnd: match[4] ? parseInt(match[4], 10) : undefined,
  };
}

/**
 * Format a scripture reference object as a human-readable string
 */
export function formatReference(ref: {
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}): string {
  let str = `${ref.book} ${ref.chapter}`;
  if (ref.verseStart) {
    str += `:${ref.verseStart}`;
    if (ref.verseEnd && ref.verseEnd !== ref.verseStart) {
      str += `-${ref.verseEnd}`;
    }
  }
  return str;
}
