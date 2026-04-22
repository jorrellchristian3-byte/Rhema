/**
 * API: /api/curricula/[id]/steps/[stepId]
 *
 * PATCH  — update a step (title, blocks, order)
 * DELETE — remove a step
 */

import { NextRequest, NextResponse } from "next/server";
import { updateStep, deleteStep, UpdateStepPayload } from "@/lib/supabase/curricula";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  const { stepId } = await params;

  try {
    const body = (await request.json()) as UpdateStepPayload;
    const step = await updateStep(stepId, body);
    return NextResponse.json(step);
  } catch (error) {
    console.error("Update step error:", error);
    return NextResponse.json(
      { error: "Failed to update step" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  const { stepId } = await params;

  try {
    await deleteStep(stepId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete step error:", error);
    return NextResponse.json(
      { error: "Failed to delete step" },
      { status: 500 }
    );
  }
}
