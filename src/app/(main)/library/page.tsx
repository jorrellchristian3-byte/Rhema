import { Metadata } from "next";
import LibraryClient from "@/components/library/LibraryClient";

export const metadata: Metadata = {
  title: "Library — Rhema",
  description:
    "Explore theological topics, key scripture passages, and study resources for deeper Bible study.",
};

export default function LibraryPage() {
  return <LibraryClient />;
}
