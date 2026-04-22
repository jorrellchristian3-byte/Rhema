/**
 * API: /api/study-notes
 *
 * GET  — list study notes for the authenticated user
 * POST — create a new study note
 */

import { NextRequest, NextResponse } from "next/server";
import { createStudyNote, listStudyNotes } from "@/lib/supabase/study-notes";
import { createClient } from "@/lib/supabase/server";

async function getAuthUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const book = searchParams.get("book") || undefined;
  const chapter = searchParams.get("chapter")
    ? parseInt(searchParams.get("chapter")!, 10)
    : undefined;
  const search = searchParams.get("search") || undefined;
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const result = await listStudyNotes({
      user_id: userId,
      book,
      chapter,
      search,
      limit,
      offset,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("List study notes error:", error);
    return NextResponse.json(
      { error: "Failed to list study notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.book || !body.chapter) {
      return NextResponse.json(
        { error: "book and chapter are required" },
        { status: 400 }
      );
    }

    const note = await createStudyNote({
      user_id: userId,
      book: body.book,
      chapter: body.chapter,
      title: body.title || "Untitled Note",
      content: body.content || "",
      tags: body.tags ?? [],
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create study note error:", error);
    return NextResponse.json(
      { error: "Failed to create study note" },
      { status: 500 }
    );
  }
}
