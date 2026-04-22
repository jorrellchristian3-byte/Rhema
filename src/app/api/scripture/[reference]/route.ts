import { NextRequest, NextResponse } from "next/server";
import { fetchPassage } from "@/lib/bible";
import { TranslationId } from "@/types";

const SUPPORTED_TRANSLATIONS: TranslationId[] = ["KJV", "ESV", "WEB", "ASV"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference } = await params;
  const searchParams = request.nextUrl.searchParams;
  const translationParam = searchParams.get("translation") as TranslationId | null;
  const translation =
    translationParam && SUPPORTED_TRANSLATIONS.includes(translationParam)
      ? translationParam
      : "KJV";

  try {
    const verses = await fetchPassage(decodeURIComponent(reference), translation);
    return NextResponse.json({
      reference: decodeURIComponent(reference),
      translation,
      verses,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch scripture passage";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
