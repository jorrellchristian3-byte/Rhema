import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchChapter } from "@/lib/bible/api";
import { getBook } from "@/lib/bible/books";
import { Verse } from "@/types";
import ReaderClient from "@/components/scripture/ReaderClient";

interface PageProps {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { book: bookId, chapter: chapterStr } = await params;
  const book = getBook(bookId);
  const chapter = parseInt(chapterStr, 10);

  if (!book || isNaN(chapter)) {
    return { title: "Not Found — Rhema" };
  }

  return {
    title: `${book.name} ${chapter} — Rhema`,
    description: `Read ${book.name} chapter ${chapter} in the KJV and other translations on Rhema.`,
  };
}

export default async function ReadPage({ params }: PageProps) {
  const { book: bookId, chapter: chapterStr } = await params;
  const chapter = parseInt(chapterStr, 10);
  const book = getBook(bookId);

  if (!book || isNaN(chapter) || chapter < 1 || chapter > book.chapters) {
    notFound();
  }

  // Server-side fetch of initial chapter (KJV, cached)
  let initialVerses: Verse[] = [];
  try {
    const result = await fetchChapter(book.name, chapter, "KJV");
    initialVerses = result.verses;
  } catch {
    initialVerses = [];
  }

  return (
    <ReaderClient
      bookId={bookId}
      chapter={chapter}
      initialVerses={initialVerses}
      initialTranslation="KJV"
    />
  );
}
