/**
 * Rhema — Bible API Integration Layer
 *
 * Unified interface for fetching scripture from multiple sources:
 * - Free Use Bible API (bible.helloao.org) — KJV, WEB, ASV, and 1000+ translations
 * - ESV API (api.esv.org) — ESV translation (requires API key)
 *
 * All providers are normalized to a common Verse/Chapter format.
 */

import { Chapter, Verse, TranslationId } from "@/types";
import { getTranslation } from "./translations";

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
// Free Use Bible API Provider
// Docs: https://bible.helloao.org
// ============================================

class FreeBibleApiProvider implements BibleProvider {
  private translation: string;
  private baseUrl = "https://bible.helloao.org/api";

  constructor(translation: string) {
    // The Free Use Bible API uses specific file paths per translation
    this.translation = translation;
  }

  async fetchChapter(book: string, chapter: number): Promise<Verse[]> {
    const bookId = this.normalizeBookName(book);
    const url = `${this.baseUrl}/${this.translation}/${bookId}/${chapter}.json`;

    const response = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${book} ${chapter} (${this.translation}): ${response.status}`
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
    const allVerses = await this.fetchChapter(book, chapter);
    const end = verseEnd ?? verseStart;
    return allVerses.filter((v) => v.verse >= verseStart && v.verse <= end);
  }

  private parseResponse(data: unknown, book: string, chapter: number): Verse[] {
    // The Free Use Bible API returns chapter content
    // Structure varies by translation — handle common formats
    const verses: Verse[] = [];

    const content =
      typeof data === "object" &&
      data &&
      "chapter" in data &&
      typeof data.chapter === "object" &&
      data.chapter &&
      "content" in data.chapter &&
      Array.isArray(data.chapter.content)
        ? data.chapter.content
        : null;

    if (content) {
      for (const item of content) {
        if (
          typeof item === "object" &&
          item &&
          "type" in item &&
          "number" in item &&
          "content" in item &&
          item.type === "verse"
        ) {
          verses.push({
            book,
            chapter,
            verse: parseInt(String(item.number), 10),
            text: this.extractText(item.content),
            translation: this.translation,
          });
        }
      }
    }

    return verses;
  }

  private extractText(content: unknown): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .map((c: unknown) => {
          if (typeof c === "string") return c;
          if (typeof c === "object" && c && "text" in c && typeof c.text === "string") {
            return c.text;
          }
          if (typeof c === "object" && c && "content" in c) {
            return this.extractText(c.content);
          }
          return "";
        })
        .join("");
    }
    if (typeof content === "object" && content && "text" in content && typeof content.text === "string") {
      return content.text;
    }
    return "";
  }

  private normalizeBookName(book: string): string {
    // Convert display names to API-compatible format
    return book.replace(/\s+/g, "");
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

    // ESV returns plain text with verse numbers in brackets [1], [2], etc.
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
      providers[translationId] = new FreeBibleApiProvider(translationId);
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
