import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  BookOpen,
  Layers,
  Library,
  Play,
  MessageSquareQuote,
  Users,
  GitCompareArrows,
  Landmark,
  ArrowRight,
  Search,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary-50)] to-[var(--background)]" />
          <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-[var(--accent-600)] tracking-wide uppercase mb-4">
                Free &amp; Open Source
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl leading-tight text-[var(--primary-900)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Study scripture.
                <br />
                <span className="text-[var(--primary-500)]">
                  Build curriculum.
                </span>
                <br />
                Go deeper.
              </h1>
              <p className="mt-6 text-lg text-[var(--neutral-600)] leading-relaxed max-w-xl">
                Rhema brings together scripture, commentary, video, and
                discussion into structured study paths anyone can create and
                follow — completely free.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/curricula"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary-500)] text-white font-medium hover:bg-[var(--primary-600)] transition-colors"
                >
                  Explore Curriculum
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/read/john/1"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--primary-700)] font-medium hover:bg-[var(--neutral-100)] transition-colors"
                >
                  <BookOpen size={16} />
                  Start Reading
                </Link>
              </div>
            </div>

            {/* Scripture preview card */}
            <div className="mt-16 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 shadow-sm max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium text-[var(--neutral-400)] uppercase tracking-wider">
                  John 1:1-5 &middot; KJV
                </span>
              </div>
              <div className="scripture-text text-[var(--primary-900)] text-lg leading-[1.9]">
                <span className="verse-number">1</span>In the beginning was the
                Word, and the Word was with God, and the Word was God.{" "}
                <span className="verse-number">2</span>The same was in the
                beginning with God.{" "}
                <span className="verse-number">3</span>All things were made by
                him; and without him was not any thing made that was made.{" "}
                <span className="verse-number">4</span>In him was life; and the
                life was the light of men.{" "}
                <span className="verse-number">5</span>And the light shineth in
                darkness; and the darkness comprehended it not.
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT IS RHEMA ===== */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2
              className="text-3xl text-[var(--primary-900)] mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              More than a Bible app
            </h2>
            <p className="text-[var(--neutral-600)] leading-relaxed">
              Most free tools let you read or search. Rhema lets you{" "}
              <em>learn</em> — with structured study paths that combine
              scripture, teaching, video, and guided discussion in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BookOpen size={22} />}
              title="Read Scripture"
              description="Multiple translations side by side. Clean, distraction-free reading with highlighting and bookmarks."
            />
            <FeatureCard
              icon={<Layers size={22} />}
              title="Build Curriculum"
              description="Create structured study plans with scripture passages, your own teaching notes, embedded videos, and discussion questions."
            />
            <FeatureCard
              icon={<Search size={22} />}
              title="Discover & Follow"
              description="Browse a public library of curriculum created by others. Follow a study plan at your own pace with progress tracking."
            />
            <FeatureCard
              icon={<Library size={22} />}
              title="Resource Directory"
              description="Public domain commentaries, theologian quotes, articles, and book recommendations — all linked to scripture."
            />
            <FeatureCard
              icon={<Play size={22} />}
              title="Video Integration"
              description="BibleProject explainers, seminary lectures, and curated teaching content mapped to passages and topics."
            />
            <FeatureCard
              icon={<Users size={22} />}
              title="Community Driven"
              description="Share curriculum, learn from how others study, and contribute to a growing library of resources."
            />
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="bg-[var(--primary-900)] text-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2
              className="text-3xl mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              How a curriculum works
            </h2>
            <p className="text-[var(--primary-200)] mb-12 max-w-xl">
              Each curriculum is a series of steps. Every step combines different
              content blocks that you arrange in any order.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <BlockCard
                icon={<BookOpen size={20} />}
                label="Scripture"
                description="A Bible passage pulled from the translation of your choice, displayed inline."
                color="var(--accent-500)"
              />
              <BlockCard
                icon={<MessageSquareQuote size={20} />}
                label="Teaching"
                description="Your own commentary, context, and insights written in rich text."
                color="#7E9FC7"
              />
              <BlockCard
                icon={<Play size={20} />}
                label="Video"
                description="An embedded YouTube video — lectures, sermons, BibleProject, and more."
                color="#2D6A4F"
              />
              <BlockCard
                icon={<Users size={20} />}
                label="Discussion"
                description="Guided questions for personal reflection or group conversation."
                color="#9B6B9E"
              />
              <BlockCard
                icon={<GitCompareArrows size={20} />}
                label="Cross Reference"
                description="Link related passages side by side to show how themes weave across Scripture."
                color="#0284c7"
              />
              <BlockCard
                icon={<Landmark size={20} />}
                label="Context"
                description="Historical, cultural, and literary background that brings the passage to life."
                color="#e11d48"
              />
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2
            className="text-3xl text-[var(--primary-900)] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Start studying today
          </h2>
          <p className="text-[var(--neutral-600)] mb-8 max-w-md mx-auto">
            No account required to read and explore. Sign up when you are ready
            to create your own curriculum and track your progress.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/read/genesis/1"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary-500)] text-white font-medium hover:bg-[var(--primary-600)] transition-colors"
            >
              Open the Bible
              <BookOpen size={16} />
            </Link>
            <Link
              href="/curricula"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--primary-700)] font-medium hover:bg-[var(--neutral-100)] transition-colors"
            >
              Browse Curricula
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ===== Sub-components ===== */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary-200)] hover:shadow-sm transition-all">
      <div className="w-10 h-10 rounded-lg bg-[var(--primary-50)] flex items-center justify-center text-[var(--primary-500)] mb-4 group-hover:bg-[var(--primary-100)] transition-colors">
        {icon}
      </div>
      <h3
        className="text-lg text-[var(--primary-900)] mb-2"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </h3>
      <p className="text-sm text-[var(--neutral-500)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function BlockCard({
  icon,
  label,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}) {
  return (
    <div className="p-5 rounded-xl bg-[var(--primary-800)] border border-[var(--primary-700)]">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {icon}
      </div>
      <h4 className="font-semibold text-white mb-1">{label}</h4>
      <p className="text-sm text-[var(--primary-300)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
