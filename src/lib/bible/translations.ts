import { Translation, TranslationId } from "@/types";

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
  ASV: {
    id: "ASV",
    name: "American Standard Version",
    abbreviation: "ASV",
    language: "en",
    isPublicDomain: true,
    apiSource: "free-bible-api",
  },
  YLT: {
    id: "YLT",
    name: "Young's Literal Translation",
    abbreviation: "YLT",
    language: "en",
    isPublicDomain: true,
    apiSource: "free-bible-api",
  },
};

export const DEFAULT_TRANSLATION: TranslationId = "KJV";

export function getTranslation(id: TranslationId): Translation {
  return TRANSLATIONS[id];
}

export function getAvailableTranslations(): Translation[] {
  return Object.values(TRANSLATIONS);
}
