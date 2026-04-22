/**
 * API: /api/curricula/[id]
 *
 * GET    — get a single curriculum with its steps
 * PATCH  — update curriculum metadata
 * DELETE — delete a curriculum
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getCurriculum,
  updateCurriculum,
  deleteCurriculum,
  UpdateCurriculumPayload,
} from "@/lib/supabase/curricula";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const curriculum = await getCurriculum(id);
    if (!curriculum) {
      return NextResponse.json(
        { error: "Curriculum not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(curriculum);
  } catch (error) {
    console.error("Get curriculum error:", error);
    return NextResponse.json(
      { error: "Failed to fetch curriculum" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = (await request.json()) as UpdateCurriculumPayload;
    const curriculum = await updateCurriculum(id, body);
    return NextResponse.json(curriculum);
  } catch (error) {
    console.error("Update curriculum error:", error);
    return NextResponse.json(
      { error: "Failed to update curriculum" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await deleteCurriculum(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete curriculum error:", error);
    return NextResponse.json(
      { error: "Failed to delete curriculum" },
      { status: 500 }
    );
  }
}
