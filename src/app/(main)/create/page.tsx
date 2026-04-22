import { Metadata } from "next";
import CurriculumBuilder from "@/components/curriculum/CurriculumBuilder";

export const metadata: Metadata = {
  title: "Create Curriculum — Rhema",
  description:
    "Build a Bible study curriculum with scripture passages, teaching notes, videos, and discussion questions.",
};

export default function CreatePage() {
  return <CurriculumBuilder />;
}
