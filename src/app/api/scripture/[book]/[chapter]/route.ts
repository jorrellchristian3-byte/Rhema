import { NextRequest, NextResponse } from "next/server";
import { fetchChapter } from "@/lib/bible/api";
import { TranslationId } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ book: string; chapter: string }> }
) {
  const { book, chapter: chapterStr } = await params;
  const chapter = parseInt(chapterStr, 10);

  if (!book || isNaN(chapter) || chapter < 1) {
    return NextResponse.json(
      { error: "Invalid book or chapter" },
      { status: 400 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const translation =
    (searchParams.get("translation") as TranslationId) || "KJV";

  try {
    const result = await fetchChapter(
      decodeURIComponent(book),
      chapter,
      translation
    );

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("Scripture fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scripture", verses: [] },
      { status: 500 }
    );
  }
}
