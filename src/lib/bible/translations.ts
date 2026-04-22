import { Translation, TranslationId } from "@/types";

// API IDs map display abbreviations to the bible.helloao.org translation IDs
export const TRANSLATION_API_IDS: Record<TranslationId, string> = {
  KJV: "engkjv",
  ESV: "ESV", // ESV uses its own API
  WEB: "engwebp",
  ASV: "engasv",
};

export const TRANSLATIONS: Record<TranslationId, Translation> = {
  KJV: {
    id: "KJV",
    name: "King James Version",
    abbreviation: "KJV",
    language: "en",
    isPublicDomain: true,
    apiSource: "free-bible-api",
  },
  ESV: {
    id: "ESV",
    name: "English Standard Version",
    abbreviation: "ESV",
    language: "en",
    isPublicDomain: false,
    apiSource: "esv-api",
  },
  WEB: {
    id: "WEB",
    name: "World English Bible",
    abbreviation: "WEB",
    language: "en",
    isPublicDomain: true,
    apiSource: "free-bible-api",
  },
  ASV: {
    id: "ASV",
    name: "American Standard Version",
    abbreviation: "ASV",
    language: "en",
    isPublicDomain: true,
    apiSource: "free-bible-api",
  },
};

export function getApiTranslationId(id: TranslationId): string {
  return TRANSLATION_API_IDS[id] ?? id;
}

export const DEFAULT_TRANSLATION: TranslationId = "KJV";

export function getTranslation(id: TranslationId): Translation {
  return TRANSLATIONS[id];
}

export function getAvailableTranslations(): Translation[] {
  return Object.values(TRANSLATIONS);
}
