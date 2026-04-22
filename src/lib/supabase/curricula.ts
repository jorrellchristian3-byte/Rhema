/**
 * Rhema — Curriculum Data Layer
 *
 * CRUD operations for curricula and curriculum steps via Supabase.
 * Used by API routes and server actions.
 */

import { createClient } from "./server";
import {
  Curriculum,
  CurriculumStep,
  CurriculumCategory,
  StepBlock,
} from "@/types";

// ── Types for insert/update payloads ──

export interface CreateCurriculumPayload {
  title: string;
  description: string;
  author_id?: string | null;
  author_name: string;
  category: CurriculumCategory;
  tags: string[];
  estimated_duration_minutes?: number;
  cover_image_url?: string;
}

export interface UpdateCurriculumPayload {
  title?: string;
  description?: string;
  category?: CurriculumCategory;
  tags?: string[];
  estimated_duration_minutes?: number;
  cover_image_url?: string;
  is_published?: boolean;
}

export interface CreateStepPayload {
  curriculum_id: string;
  order: number;
  title: string;
  blocks: StepBlock[];
}

export interface UpdateStepPayload {
  title?: string;
  order?: number;
  blocks?: StepBlock[];
}

// ── Curriculum CRUD ──

/** Create a new curriculum (draft by default) */
export async function createCurriculum(
  payload: CreateCurriculumPayload
): Promise<Curriculum> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("curricula")
    .insert({
      ...payload,
      is_published: false,
      estimated_duration_minutes: payload.estimated_duration_minutes ?? 0,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create curriculum: ${error.message}`);
  return data as Curriculum;
}

/** Get a single curriculum by ID, optionally with its steps */
export async function getCurriculum(
  id: string,
  includeSteps = true
): Promise<Curriculum | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("curricula")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`Failed to fetch curriculum: ${error.message}`);
  }

  const curriculum = data as Curriculum;

  if (includeSteps) {
    const { data: steps, error: stepsError } = await supabase
      .from("curriculum_steps")
      .select("*")
      .eq("curriculum_id", id)
      .order("order", { ascending: true });

    if (stepsError)
      throw new Error(`Failed to fetch steps: ${stepsError.message}`);

    curriculum.steps = (steps as CurriculumStep[]) ?? [];
  }

  return curriculum;
}

/** List published curricula with optional filters */
export async function listCurricula(options?: {
  category?: CurriculumCategory;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ curricula: Curriculum[]; count: number }> {
  const supabase = await createClient();
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  let query = supabase
    .from("curricula")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.tags && options.tags.length > 0) {
    query = query.contains("tags", options.tags);
  }

  if (options?.search) {
    query = query.or(
      `title.ilike.%${options.search}%,description.ilike.%${options.search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) throw new Error(`Failed to list curricula: ${error.message}`);

  return {
    curricula: (data as Curriculum[]) ?? [],
    count: count ?? 0,
  };
}

/** List curricula authored by a specific user (drafts + published) */
export async function listUserCurricula(
  authorId: string
): Promise<Curriculum[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("curricula")
    .select("*")
    .eq("author_id", authorId)
    .order("updated_at", { ascending: false });

  if (error)
    throw new Error(`Failed to list user curricula: ${error.message}`);

  return (data as Curriculum[]) ?? [];
}

/** Update a curriculum */
export async function updateCurriculum(
  id: string,
  payload: UpdateCurriculumPayload
): Promise<Curriculum> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("curricula")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update curriculum: ${error.message}`);
  return data as Curriculum;
}

/** Delete a curriculum and all its steps (cascade handled by DB) */
export async function deleteCurriculum(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("curricula").delete().eq("id", id);

  if (error) throw new Error(`Failed to delete curriculum: ${error.message}`);
}

// ── Curriculum Step CRUD ──

/** Add a step to a curriculum */
export async function createStep(
  payload: CreateStepPayload
): Promise<CurriculumStep> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("curriculum_steps")
    .insert({
      curriculum_id: payload.curriculum_id,
      order: payload.order,
      title: payload.title,
      blocks: payload.blocks as unknown as Record<string, unknown>[],
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create step: ${error.message}`);
  return data as unknown as CurriculumStep;
}

/** Update a step */
export async function updateStep(
  id: string,
  payload: UpdateStepPayload
): Promise<CurriculumStep> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.order !== undefined) updateData.order = payload.order;
  if (payload.blocks !== undefined) updateData.blocks = payload.blocks;

  const { data, error } = await supabase
    .from("curriculum_steps")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update step: ${error.message}`);
  return data as unknown as CurriculumStep;
}

/** Delete a step */
export async function deleteStep(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("curriculum_steps")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Failed to delete step: ${error.message}`);
}

/** Reorder steps within a curriculum */
export async function reorderSteps(
  curriculumId: string,
  stepIds: string[]
): Promise<void> {
  const supabase = await createClient();

  // Update each step's order based on its position in the array
  const updates = stepIds.map((stepId, index) =>
    supabase
      .from("curriculum_steps")
      .update({ order: index + 1 })
      .eq("id", stepId)
      .eq("curriculum_id", curriculumId)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error)
    throw new Error(`Failed to reorder steps: ${failed.error.message}`);
}
