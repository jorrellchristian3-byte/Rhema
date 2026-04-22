/**
 * API: /api/curricula/[id]/steps
 *
 * POST — add a new step to a curriculum
 * PUT  — reorder all steps
 */

import { NextRequest, NextResponse } from "next/server";
import { createStep, reorderSteps } from "@/lib/supabase/curricula";
import { StepBlock } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const step = await createStep({
      curriculum_id: id,
      order: body.order ?? 1,
      title: body.title ?? "Untitled Step",
      blocks: (body.blocks as StepBlock[]) ?? [],
    });
    return NextResponse.json(step, { status: 201 });
  } catch (error) {
    console.error("Create step error:", error);
    return NextResponse.json(
      { error: "Failed to create step" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const stepIds: string[] = body.stepIds;

    if (!Array.isArray(stepIds)) {
      return NextResponse.json(
        { error: "stepIds array is required" },
        { status: 400 }
      );
    }

    await reorderSteps(id, stepIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder steps error:", error);
    return NextResponse.json(
      { error: "Failed to reorder steps" },
      { status: 500 }
    );
  }
}
