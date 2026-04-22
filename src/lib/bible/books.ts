import { BibleBook } from "@/types";

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: "genesis", name: "Genesis", abbreviation: "Gen", testament: "OT", order: 1, chapters: 50 },
  { id: "exodus", name: "Exodus", abbreviation: "Exod", testament: "OT", order: 2, chapters: 40 },
  { id: "leviticus", name: "Leviticus", abbreviation: "Lev", testament: "OT", order: 3, chapters: 27 },
  { id: "numbers", name: "Numbers", abbreviation: "Num", testament: "OT", order: 4, chapters: 36 },
  { id: "deuteronomy", name: "Deuteronomy", abbreviation: "Deut", testament: "OT", order: 5, chapters: 34 },
  { id: "joshua", name: "Joshua", abbreviation: "Josh", testament: "OT", order: 6, chapters: 24 },
  { id: "judges", name: "Judges", abbreviation: "Judg", testament: "OT", order: 7, chapters: 21 },
  { id: "ruth", name: "Ruth", abbreviation: "Ruth", testament: "OT", order: 8, chapters: 4 },
  { id: "1-samuel", name: "1 Samuel", abbreviation: "1Sam", testament: "OT", order: 9, chapters: 31 },
  { id: "2-samuel", name: "2 Samuel", abbreviation: "2Sam", testament: "OT", order: 10, chapters: 24 },
  { id: "1-kings", name: "1 Kings", abbreviation: "1Kgs", testament: "OT", order: 11, chapters: 22 },
  { id: "2-kings", name: "2 Kings", abbreviation: "2Kgs", testament: "OT", order: 12, chapters: 25 },
  { id: "1-chronicles", name: "1 Chronicles", abbreviation: "1Chr", testament: "OT", order: 13, chapters: 29 },
  { id: "2-chronicles", name: "2 Chronicles", abbreviation: "2Chr", testament: "OT", order: 14, chapters: 36 },
  { id: "ezra", name: "Ezra", abbreviation: "Ezra", testament: "OT", order: 15, chapters: 10 },
  { id: "nehemiah", name: "Nehemiah", abbreviation: "Neh", testament: "OT", order: 16, chapters: 13 },
  { id: "esther", name: "Esther", abbreviation: "Esth", testament: "OT", order: 17, chapters: 10 },
  { id: "job", name: "Job", abbreviation: "Job", testament: "OT", order: 18, chapters: 42 },
  { id: "psalms", name: "Psalms", abbreviation: "Ps", testament: "OT", order: 19, chapters: 150 },
  { id: "proverbs", name: "Proverbs", abbreviation: "Prov", testament: "OT", order: 20, chapters: 31 },
  { id: "ecclesiastes", name: "Ecclesiastes", abbreviation: "Eccl", testament: "OT", order: 21, chapters: 12 },
  { id: "song-of-solomon", name: "Song of Solomon", abbreviation: "Song", testament: "OT", order: 22, chapters: 8 },
  { id: "isaiah", name: "Isaiah", abbreviation: "Isa", testament: "OT", order: 23, chapters: 66 },
  { id: "jeremiah", name: "Jeremiah", abbreviation: "Jer", testament: "OT", order: 24, chapters: 52 },
  { id: "lamentations", name: "Lamentations", abbreviation: "Lam", testament: "OT", order: 25, chapters: 5 },
  { id: "ezekiel", name: "Ezekiel", abbreviation: "Ezek", testament: "OT", order: 26, chapters: 48 },
  { id: "daniel", name: "Daniel", abbreviation: "Dan", testament: "OT", order: 27, chapters: 12 },
  { id: "hosea", name: "Hosea", abbreviation: "Hos", testament: "OT", order: 28, chapters: 14 },
  { id: "joel", name: "Joel", abbreviation: "Joel", testament: "OT", order: 29, chapters: 3 },
  { id: "amos", name: "Amos", abbreviation: "Amos", testament: "OT", order: 30, chapters: 9 },
  { id: "obadiah", name: "Obadiah", abbreviation: "Obad", testament: "OT", order: 31, chapters: 1 },
  { id: "jonah", name: "Jonah", abbreviation: "Jonah", testament: "OT", order: 32, chapters: 4 },
  { id: "micah", name: "Micah", abbreviation: "Mic", testament: "OT", order: 33, chapters: 7 },
  { id: "nahum", name: "Nahum", abbreviation: "Nah", testament: "OT", order: 34, chapters: 3 },
  { id: "habakkuk", name: "Habakkuk", abbreviation: "Hab", testament: "OT", order: 35, chapters: 3 },
  { id: "zephaniah", name: "Zephaniah", abbreviation: "Zeph", testament: "OT", order: 36, chapters: 3 },
  { id: "haggai", name: "Haggai", abbreviation: "Hag", testament: "OT", order: 37, chapters: 2 },
  { id: "zechariah", name: "Zechariah", abbreviation: "Zech", testament: "OT", order: 38, chapters: 14 },
  { id: "malachi", name: "Malachi", abbreviation: "Mal", testament: "OT", order: 39, chapters: 4 },
  // New Testament
  { id: "matthew", name: "Matthew", abbreviation: "Matt", testament: "NT", order: 40, chapters: 28 },
  { id: "mark", name: "Mark", abbreviation: "Mark", testament: "NT", order: 41, chapters: 16 },
  { id: "luke", name: "Luke", abbreviation: "Luke", testament: "NT", order: 42, chapters: 24 },
  { id: "john", name: "John", abbreviation: "John", testament: "NT", order: 43, chapters: 21 },
  { id: "acts", name: "Acts", abbreviation: "Acts", testament: "NT", order: 44, chapters: 28 },
  { id: "romans", name: "Romans", abbreviation: "Rom", testament: "NT", order: 45, chapters: 16 },
  { id: "1-corinthians", name: "1 Corinthians", abbreviation: "1Cor", testament: "NT", order: 46, chapters: 16 },
  { id: "2-corinthians", name: "2 Corinthians", abbreviation: "2Cor", testament: "NT", order: 47, chapters: 13 },
  { id: "galatians", name: "Galatians", abbreviation: "Gal", testament: "NT", order: 48, chapters: 6 },
  { id: "ephesians", name: "Ephesians", abbreviation: "Eph", testament: "NT", order: 49, chapters: 6 },
  { id: "philippians", name: "Philippians", abbreviation: "Phil", testament: "NT", order: 50, chapters: 4 },
  { id: "colossians", name: "Colossians", abbreviation: "Col", testament: "NT", order: 51, chapters: 4 },
  { id: "1-thessalonians", name: "1 Thessalonians", abbreviation: "1Thess", testament: "NT", order: 52, chapters: 5 },
  { id: "2-thessalonians", name: "2 Thessalonians", abbreviation: "2Thess", testament: "NT", order: 53, chapters: 3 },
  { id: "1-timothy", name: "1 Timothy", abbreviation: "1Tim", testament: "NT", order: 54, chapters: 6 },
  { id: "2-timothy", name: "2 Timothy", abbreviation: "2Tim", testament: "NT", order: 55, chapters: 4 },
  { id: "titus", name: "Titus", abbreviation: "Titus", testament: "NT", order: 56, chapters: 3 },
  { id: "philemon", name: "Philemon", abbreviation: "Phlm", testament: "NT", order: 57, chapters: 1 },
  { id: "hebrews", name: "Hebrews", abbreviation: "Heb", testament: "NT", order: 58, chapters: 13 },
  { id: "james", name: "James", abbreviation: "Jas", testament: "NT", order: 59, chapters: 5 },
  { id: "1-peter", name: "1 Peter", abbreviation: "1Pet", testament: "NT", order: 60, chapters: 5 },
  { id: "2-peter", name: "2 Peter", abbreviation: "2Pet", testament: "NT", order: 61, chapters: 3 },
  { id: "1-john", name: "1 John", abbreviation: "1John", testament: "NT", order: 62, chapters: 5 },
  { id: "2-john", name: "2 John", abbreviation: "2John", testament: "NT", order: 63, chapters: 1 },
  { id: "3-john", name: "3 John", abbreviation: "3John", testament: "NT", order: 64, chapters: 1 },
  { id: "jude", name: "Jude", abbreviation: "Jude", testament: "NT", order: 65, chapters: 1 },
  { id: "revelation", name: "Revelation", abbreviation: "Rev", testament: "NT", order: 66, chapters: 22 },
];

export function getBook(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.id === id);
}

export function getBookByName(name: string): BibleBook | undefined {
  const normalized = name.toLowerCase().trim();
  return BIBLE_BOOKS.find(
    (b) =>
      b.name.toLowerCase() === normalized ||
      b.abbreviation.toLowerCase() === normalized ||
      b.id === normalized
  );
}

export function getOldTestament(): BibleBook[] {
  return BIBLE_BOOKS.filter((b) => b.testament === "OT");
}

export function getNewTestament(): BibleBook[] {
  return BIBLE_BOOKS.filter((b) => b.testament === "NT");
}
