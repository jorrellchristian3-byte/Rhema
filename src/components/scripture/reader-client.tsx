"use client";

import { FormEvent, useMemo, useState } from "react";
import { Verse } from "@/types";

type ScriptureResponse = {
  reference: string;
  translation: string;
  verses: Verse[];
};

const DEFAULT_REFERENCE = "John 3:16-18";

export function ReaderClient() {
  const [referenceInput, setReferenceInput] = useState(DEFAULT_REFERENCE);
  const [translation, setTranslation] = useState("KJV");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScriptureResponse | null>(null);
  const [bookmarkStatus, setBookmarkStatus] = useState<string | null>(null);

  const canBookmark = useMemo(() => Boolean(data?.verses.length), [data]);

  async function handleRead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setBookmarkStatus(null);

    try {
      const encodedReference = encodeURIComponent(referenceInput.trim());
      const response = await fetch(
        `/api/scripture/${encodedReference}?translation=${translation}`
      );
      const payload = (await response.json()) as
        | ScriptureResponse
        | { error: string };

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Unable to fetch passage");
      }

      setData(payload);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unexpected error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function saveBookmark() {
    if (!data?.verses.length) return;

    const firstVerse = data.verses[0];
    const lastVerse = data.verses[data.verses.length - 1];

    const response = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book: firstVerse.book,
        chapter: firstVerse.chapter,
        verseStart: firstVerse.verse,
        verseEnd: lastVerse.verse,
      }),
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setBookmarkStatus(payload.error ?? "Could not save bookmark");
      return;
    }

    setBookmarkStatus("Bookmark saved");
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleRead} className="flex flex-col gap-4 md:flex-row">
        <label className="flex flex-1 flex-col gap-2 text-sm font-medium">
          Scripture reference
          <input
            className="rounded-md border border-neutral-300 px-3 py-2"
            value={referenceInput}
            onChange={(event) => setReferenceInput(event.target.value)}
            placeholder="John 3:16-18"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Translation
          <select
            className="rounded-md border border-neutral-300 px-3 py-2"
            value={translation}
            onChange={(event) => setTranslation(event.target.value)}
          >
            <option value="KJV">KJV</option>
            <option value="ESV">ESV</option>
            <option value="WEB">WEB</option>
            <option value="ASV">ASV</option>
          </select>
        </label>

        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Loading..." : "Read"}
        </button>
      </form>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {data ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              {data.reference} ({data.translation})
            </h2>
            <button
              type="button"
              onClick={saveBookmark}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
              disabled={!canBookmark}
            >
              Save bookmark
            </button>
          </div>

          {bookmarkStatus ? <p className="text-sm text-neutral-600">{bookmarkStatus}</p> : null}

          <div className="space-y-3 text-[1.03rem] leading-7 text-neutral-800">
            {data.verses.map((verse) => (
              <p key={`${verse.book}-${verse.chapter}-${verse.verse}`}>
                <span className="mr-2 text-xs font-semibold text-neutral-500">
                  {verse.verse}
                </span>
                {verse.text}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
