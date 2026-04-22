import { ReaderClient } from "@/components/scripture/reader-client";
import Link from "next/link";

export const metadata = {
  title: "Read Scripture | Rhema",
};

export default function ReadPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-10 md:px-8">
      <div className="mx-auto mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Scripture Reader
        </h1>
        <p className="mt-2 text-neutral-700">
          Start with a single passage flow and save bookmarks once authenticated.
        </p>
        <div className="mt-3 flex gap-3 text-sm">
          <Link href="/login" className="font-semibold text-neutral-900 underline">
            Login
          </Link>
          <Link href="/signup" className="font-semibold text-neutral-900 underline">
            Sign up
          </Link>
        </div>
      </div>
      <ReaderClient />
    </main>
  );
}
