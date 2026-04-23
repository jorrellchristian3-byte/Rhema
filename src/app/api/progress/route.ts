import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/progress?curriculum_id=xxx
 * Returns the user's progress for a curriculum (or all curricula if no id).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const curriculumId = new URL(request.url).searchParams.get("curriculum_id");

  let query = supabase
    .from("curriculum_progress")
    .select("*")
    .eq("user_id", user.id);

  if (curriculumId) {
    query = query.eq("curriculum_id", curriculumId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data ?? [] });
}

/**
 * POST /api/progress
 * Create or update progress for a curriculum.
 * Body: { curriculum_id, current_step, completed_steps }
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { curriculum_id, current_step, completed_steps } = body;

  if (!curriculum_id) {
    return NextResponse.json({ error: "curriculum_id required" }, { status: 400 });
  }

  // Upsert: insert if new, update if exists
  const { data, error } = await supabase
    .from("curriculum_progress")
    .upsert(
      {
        user_id: user.id,
        curriculum_id,
        current_step: current_step ?? 0,
        completed_steps: completed_steps ?? [],
        last_activity_at: new Date().toISOString(),
      },
      { onConflict: "user_id,curriculum_id" }
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data });
}
