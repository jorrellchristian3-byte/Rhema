/**
 * API: /api/curricula
 *
 * GET  — list published curricula (with optional filters)
 * POST — create a new curriculum (draft)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  listCurricula,
  createCurriculum,
  CreateCurriculumPayload,
} from "@/lib/supabase/curricula";
import { CurriculumCategory } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const category = searchParams.get("category") as CurriculumCategory | null;
  const tags = searchParams.get("tags")?.split(",").filter(Boolean);
  const topic = searchParams.get("topic") || undefined;
  const search = searchParams.get("search") || undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  // If a topic filter is provided, add it to the tags filter
  const combinedTags = [...(tags ?? [])];
  if (topic) combinedTags.push(topic);

  try {
    const result = await listCurricula({
      category: category ?? undefined,
      tags: combinedTags.length > 0 ? combinedTags : undefined,
      search,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("List curricula error:", error);
    return NextResponse.json(
      { error: "Failed to list curricula" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateCurriculumPayload;

    if (!body.title || !body.category || !body.author_name) {
      return NextResponse.json(
        { error: "title, category, and author_name are required" },
        { status: 400 }
      );
    }

    const curriculum = await createCurriculum(body);
    return NextResponse.json(curriculum, { status: 201 });
  } catch (error) {
    console.error("Create curriculum error:", error);
    return NextResponse.json(
      { error: "Failed to create curriculum" },
      { status: 500 }
    );
  }
}
