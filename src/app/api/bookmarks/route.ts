import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createBookmarkSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  verseStart: z.number().int().positive().optional(),
  verseEnd: z.number().int().positive().optional(),
  note: z.string().max(500).optional(),
  color: z.string().max(20).optional(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookmarks: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createBookmarkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      book: parsed.data.book,
      chapter: parsed.data.chapter,
      verse_start: parsed.data.verseStart,
      verse_end: parsed.data.verseEnd,
      note: parsed.data.note,
      color: parsed.data.color ?? "#3B82F6",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookmark: data }, { status: 201 });
}
