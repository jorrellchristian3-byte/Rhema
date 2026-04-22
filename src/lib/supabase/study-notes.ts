/**
 * Rhema — Study Notes Data Layer
 *
 * CRUD operations for user study notes via Supabase.
 */

import { createClient } from "./server";
import { StudyNote } from "@/types";

// ── Payload types ──

export interface CreateStudyNotePayload {
  user_id: string;
  book: string;
  chapter: number;
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateStudyNotePayload {
  title?: string;
  content?: string;
  book?: string;
  chapter?: number;
  tags?: string[];
}

// ── CRUD ──

/** Create a new study note */
export async function createStudyNote(
  payload: CreateStudyNotePayload
): Promise<StudyNote> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("study_notes")
    .insert({
      user_id: payload.user_id,
      book: payload.book,
      chapter: payload.chapter,
      title: payload.title,
      content: payload.content,
      tags: payload.tags ?? [],
    })
    .select()
    .single();

  if (error) throw error;
  return data as StudyNote;
}

/** Get a single study note by ID */
export async function getStudyNote(id: string): Promise<StudyNote | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("study_notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw error;
  }
  return data as StudyNote;
}

/** List study notes for a user, optionally filtered by book/chapter */
export async function listStudyNotes(options: {
  user_id: string;
  book?: string;
  chapter?: number;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ notes: StudyNote[]; count: number }> {
  const supabase = await createClient();

  let query = supabase
    .from("study_notes")
    .select("*", { count: "exact" })
    .eq("user_id", options.user_id)
    .order("updated_at", { ascending: false });

  if (options.book) {
    query = query.eq("book", options.book);
  }
  if (options.chapter !== undefined) {
    query = query.eq("chapter", options.chapter);
  }
  if (options.search) {
    query = query.or(
      `title.ilike.%${options.search}%,content.ilike.%${options.search}%`
    );
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit ?? 20) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { notes: (data ?? []) as StudyNote[], count: count ?? 0 };
}

/** Update a study note */
export async function updateStudyNote(
  id: string,
  payload: UpdateStudyNotePayload
): Promise<StudyNote> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("study_notes")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as StudyNote;
}

/** Delete a study note */
export async function deleteStudyNote(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("study_notes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
