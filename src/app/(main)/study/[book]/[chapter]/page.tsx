import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchChapter } from "@/lib/bible/api";
import { getBook } from "@/lib/bible/books";
import { Verse } from "@/types";
import StudyWorkspace from "@/components/study/StudyWorkspace";

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
    title: `Study ${book.name} ${chapter} — Rhema`,
    description: `Study ${book.name} chapter ${chapter} with notes, cross-references, and contextual resources.`,
  };
}

export default async function StudyPage({ params }: PageProps) {
  const { book: bookId, chapter: chapterStr } = await params;
  const chapter = parseInt(chapterStr, 10);
  const book = getBook(bookId);

  if (!book || isNaN(chapter) || chapter < 1 || chapter > book.chapters) {
    notFound();
  }

  let initialVerses: Verse[] = [];
  try {
    const result = await fetchChapter(book.name, chapter, "KJV");
    initialVerses = result.verses;
  } catch {
    initialVerses = [];
  }

  return (
    <StudyWorkspace
      bookId={bookId}
      bookName={book.name}
      chapter={chapter}
      totalChapters={book.chapters}
      initialVerses={initialVerses}
    />
  );
}
