import { Metadata } from "next";
import CurriculaLibrary from "@/components/curriculum/CurriculaLibrary";

export const metadata: Metadata = {
  title: "Curriculum — Rhema",
  description:
    "Browse and discover Bible study curriculum. Filter by category, search by topic, and start studying.",
};

export default function CurriculaPage() {
  return <CurriculaLibrary />;
}
