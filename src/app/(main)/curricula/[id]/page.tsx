import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCurriculum } from "@/lib/supabase/curricula";
import CurriculumViewer from "@/components/curriculum/CurriculumViewer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const curriculum = await getCurriculum(id, false);

  if (!curriculum) {
    return { title: "Not Found — Rhema" };
  }

  return {
    title: `${curriculum.title} — Rhema`,
    description: curriculum.description,
  };
}

export default async function CurriculumPage({ params }: PageProps) {
  const { id } = await params;
  const curriculum = await getCurriculum(id, true);

  if (!curriculum) {
    notFound();
  }

  return <CurriculumViewer curriculum={curriculum} />;
}
