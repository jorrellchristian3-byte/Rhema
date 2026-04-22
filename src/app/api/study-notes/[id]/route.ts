/**
 * API: /api/study-notes/[id]
 *
 * GET    — get a single study note
 * PATCH  — update a study note
 * DELETE — delete a study note
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getStudyNote,
  updateStudyNote,
  deleteStudyNote,
} from "@/lib/supabase/study-notes";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const note = await getStudyNote(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    console.error("Get study note error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study note" },
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
    const body = await request.json();
    const note = await updateStudyNote(id, body);
    return NextResponse.json(note);
  } catch (error) {
    console.error("Update study note error:", error);
    return NextResponse.json(
      { error: "Failed to update study note" },
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
    await deleteStudyNote(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete study note error:", error);
    return NextResponse.json(
      { error: "Failed to delete study note" },
      { status: 500 }
    );
  }
}
