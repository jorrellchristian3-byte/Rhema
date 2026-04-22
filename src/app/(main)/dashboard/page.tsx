import { Metadata } from "next";
import Dashboard from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "My Curriculum — Rhema",
  description: "Manage your curriculum drafts, published studies, and reading progress.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
