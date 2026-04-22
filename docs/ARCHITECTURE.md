# Rhema — Architecture Overview

## Project Structure

```
rhema/
├── docs/                          # Project documentation
│   └── ARCHITECTURE.md            # This file
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Database schema
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth routes (login, signup)
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (main)/                # Main app routes
│   │   │   ├── read/[book]/[chapter]/  # Scripture reader
│   │   │   ├── curricula/              # Browse & discover curricula
│   │   │   │   ├── [id]/               # View a curriculum
│   │   │   │   └── create/             # Curriculum builder
│   │   │   └── library/                # Resource directory
│   │   │       ├── commentaries/
│   │   │       ├── videos/
│   │   │       ├── quotes/
│   │   │       └── articles/
│   │   ├── api/                   # API routes
│   │   │   ├── scripture/[reference]/  # Scripture fetching proxy
│   │   │   ├── curricula/              # CRUD for curricula
│   │   │   └── search/                 # Full-text search
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── ui/                    # Base UI components (buttons, inputs, cards)
│   │   ├── layout/                # Shell, nav, sidebar, footer
│   │   ├── scripture/             # Verse display, chapter reader, translation picker
│   │   ├── curriculum/            # Step editor, block renderers, progress tracker
│   │   └── library/               # Resource cards, search results, filters
│   ├── lib/
│   │   ├── bible/                 # Bible data layer
│   │   │   ├── api.ts             # Unified fetch from multiple Bible APIs
│   │   │   ├── books.ts           # All 66 books with metadata
│   │   │   ├── translations.ts    # Available translations config
│   │   │   └── index.ts           # Public exports
│   │   ├── supabase/              # Database client
│   │   │   ├── client.ts          # Browser client
│   │   │   ├── server.ts          # Server client
│   │   │   └── middleware.ts      # Auth session refresh
│   │   └── utils/                 # Shared utilities
│   ├── hooks/                     # React hooks
│   ├── styles/
│   │   └── design-tokens.ts       # Colors, typography, spacing
│   ├── types/
│   │   └── index.ts               # All TypeScript types
│   └── middleware.ts              # Next.js middleware (auth)
├── .env.local.example             # Environment variable template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js (App Router) | SSR for SEO, React Server Components, API routes built-in |
| Language | TypeScript | Type safety across the full stack |
| Styling | Tailwind CSS + design tokens | Rapid UI development with consistent design system |
| Database | Supabase (PostgreSQL) | Free tier, built-in auth, real-time, Row Level Security |
| Auth | Supabase Auth | Email/password + OAuth, optional accounts |
| Bible Data | Free Use Bible API + ESV API | Multi-translation scripture with caching |
| Hosting | Vercel | Zero-config Next.js deployment, generous free tier |
| Search | Supabase full-text search (MVP) | Built into PostgreSQL, no extra service needed |

## Data Model

### Core Entities

**Curricula** — The centerpiece. A curriculum has a title, description, author, category, and tags. It contains ordered **steps**.

**Curriculum Steps** — Each step has a title and an array of **blocks** (stored as JSONB). Blocks are the atomic content units:

- `scripture` — A Bible reference with optional translation preference and creator note
- `teaching` — Markdown content (the creator's own teaching/commentary)
- `video` — An embeddable video URL with metadata
- `discussion` — A list of reflection/discussion questions

This block-based design is flexible — new block types can be added without schema changes.

**Resource Library** — Four tables for the directory: commentaries, quotes, videos, articles. All have scripture reference linking and tag-based categorization.

**User Data** — Profiles (extending Supabase Auth), bookmarks, and curriculum progress tracking.

### Key Design Decisions

1. **JSONB for step blocks** — Rather than separate tables per block type with complex joins, blocks are stored as a typed JSONB array. This makes reads fast (one query gets a full step) and the schema extensible.

2. **Scripture references as structured data** — Not just strings. `{ book, chapter, verseStart, verseEnd }` enables linking resources to specific passages and building cross-reference features.

3. **Tags as PostgreSQL arrays with GIN indexes** — Fast tag-based filtering without a separate tags table or junction tables.

4. **Row Level Security** — All tables have RLS policies. Resource library tables are publicly readable. User data is private. Curricula are public when published, private otherwise.

## Bible API Architecture

The Bible service layer (`src/lib/bible/`) provides a unified interface over multiple API providers:

```
fetchPassage("John 3:16-21", "ESV")
    │
    ├── Checks translation config → ESV uses esv-api provider
    │
    ├── EsvApiProvider.fetchVerses()
    │   └── GET https://api.esv.org/v3/passage/text/?q=John+3:16-21
    │
    └── Returns normalized Verse[] regardless of provider
```

All providers return the same `Verse` type. Adding a new translation source means implementing the `BibleProvider` interface — the rest of the app doesn't change.

Scripture responses are cached via Next.js `revalidate` (24-hour TTL) to minimize API calls.

## Auth Flow

Rhema is **open access with optional accounts**:

- **Anonymous users** can read scripture, browse the curriculum library, view resources
- **Authenticated users** can additionally: create curricula, save bookmarks, track progress

The middleware refreshes Supabase auth sessions on every request. No routes are fully gated — auth just unlocks write features.

## Design System

**Visual direction:** Minimal/modern structure (clean whitespace, logical layout) with scholarly depth (deep navy palette, serif fonts for content, warm accents).

- **Serif font** (Libre Baskerville) — scripture text, headings, curriculum content
- **Sans-serif font** (Inter) — UI elements, navigation, metadata, buttons
- **Color palette** — deep navy primary, warm gold accent, warm neutral grays
- **Background** — warm off-white (#FAFAF8), not stark white

## Next Steps to Build

1. **Install dependencies** — `@supabase/ssr`, `@supabase/supabase-js`
2. **Set up Supabase project** — Create project at supabase.com, run migration
3. **Build the landing page** — First visual proof of life
4. **Build the scripture reader** — Core reading experience at `/read/[book]/[chapter]`
5. **Build the curriculum viewer** — Display a curriculum with its steps and blocks
6. **Build the curriculum builder** — The create/edit interface for curricula
7. **Build the library browser** — Search and filter resources
8. **Seed initial content** — Import public domain commentaries, curate videos and quotes
