import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/resources?book=Genesis&chapter=1
 *
 * Fetches commentaries, quotes, videos, and articles related to a book/chapter.
 * Commentaries are matched by book + chapter range.
 * Quotes, videos, and articles are matched by scripture_references JSONB.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get("book");
  const chapterStr = searchParams.get("chapter");

  if (!book) {
    return NextResponse.json({ error: "book is required" }, { status: 400 });
  }

  const chapter = chapterStr ? parseInt(chapterStr, 10) : undefined;
  const supabase = await createClient();

  // 1. Commentaries — matched by book + chapter range
  let commentariesQuery = supabase
    .from("commentaries")
    .select("*")
    .eq("book", book)
    .order("chapter_start", { ascending: true })
    .limit(20);

  if (chapter) {
    commentariesQuery = commentariesQuery
      .lte("chapter_start", chapter)
      .or(`chapter_end.gte.${chapter},chapter_end.is.null`);
  }

  // 2. Quotes — scripture_references is JSONB array of {book, chapter, ...}
  //    Use containment operator to find quotes referencing this book
  const quotesFilter = chapter
    ? JSON.stringify([{ book, chapter }])
    : JSON.stringify([{ book }]);

  const quotesQuery = supabase
    .from("quotes")
    .select("*")
    .contains("scripture_references", quotesFilter)
    .limit(20);

  // 3. Videos
  const videosQuery = supabase
    .from("videos")
    .select("*")
    .contains("scripture_references", quotesFilter)
    .limit(10);

  // 4. Articles
  const articlesQuery = supabase
    .from("articles")
    .select("*")
    .contains("scripture_references", quotesFilter)
    .limit(10);

  const [commentaries, quotes, videos, articles] = await Promise.all([
    commentariesQuery,
    quotesQuery,
    videosQuery,
    articlesQuery,
  ]);

  return NextResponse.json({
    commentaries: commentaries.data ?? [],
    quotes: quotes.data ?? [],
    videos: videos.data ?? [],
    articles: articles.data ?? [],
  });
}
