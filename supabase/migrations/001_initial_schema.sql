-- ============================================
-- Rhema — Initial Database Schema
-- Supabase / PostgreSQL
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS & PROFILES
-- ============================================

-- Profiles extend Supabase Auth users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- CURRICULA
-- ============================================

create type curriculum_category as enum (
  'book-study',
  'topical',
  'character-study',
  'devotional',
  'theology',
  'history',
  'practical-living',
  'apologetics'
);

create table public.curricula (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'Anonymous',
  cover_image_url text,
  category curriculum_category not null default 'topical',
  tags text[] not null default '{}',
  estimated_duration_minutes integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_curricula_published on public.curricula (is_published, created_at desc);
create index idx_curricula_category on public.curricula (category) where is_published = true;
create index idx_curricula_author on public.curricula (author_id);
create index idx_curricula_tags on public.curricula using gin (tags);

-- ============================================
-- CURRICULUM STEPS
-- ============================================

-- Each step contains an ordered array of blocks (stored as JSONB)
-- Block types: scripture, teaching, video, discussion
create table public.curriculum_steps (
  id uuid primary key default uuid_generate_v4(),
  curriculum_id uuid not null references public.curricula(id) on delete cascade,
  "order" integer not null,
  title text not null default '',
  blocks jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (curriculum_id, "order")
);

create index idx_steps_curriculum on public.curriculum_steps (curriculum_id, "order");

-- ============================================
-- RESOURCE LIBRARY — COMMENTARIES
-- ============================================

create table public.commentaries (
  id uuid primary key default uuid_generate_v4(),
  author text not null,
  title text not null,
  book text not null,              -- Bible book name
  chapter_start integer not null,
  chapter_end integer,
  verse_start integer,
  verse_end integer,
  content text not null,           -- markdown
  source_url text,
  is_public_domain boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_commentaries_book on public.commentaries (book, chapter_start);
create index idx_commentaries_author on public.commentaries (author);

-- ============================================
-- RESOURCE LIBRARY — THEOLOGIAN QUOTES
-- ============================================

create table public.quotes (
  id uuid primary key default uuid_generate_v4(),
  author text not null,
  author_era text,                  -- e.g., "Early Church", "Reformation", "Modern"
  text text not null,
  source_title text,
  source_url text,
  scripture_references jsonb not null default '[]',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_quotes_author on public.quotes (author);
create index idx_quotes_tags on public.quotes using gin (tags);

-- ============================================
-- RESOURCE LIBRARY — VIDEOS
-- ============================================

create table public.videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  url text not null,
  provider text not null default 'youtube',
  channel text not null default '',
  description text,
  duration_seconds integer,
  scripture_references jsonb not null default '[]',
  tags text[] not null default '{}',
  thumbnail_url text,
  created_at timestamptz not null default now()
);

create index idx_videos_tags on public.videos using gin (tags);

-- ============================================
-- RESOURCE LIBRARY — ARTICLES & BOOKS
-- ============================================

create table public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  author text not null,
  url text not null,
  source text not null default '',   -- e.g., "CCEL", "DTS"
  description text,
  scripture_references jsonb not null default '[]',
  tags text[] not null default '{}',
  is_free boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_articles_tags on public.articles using gin (tags);

-- ============================================
-- USER DATA — BOOKMARKS
-- ============================================

create table public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book text not null,
  chapter integer not null,
  verse_start integer,
  verse_end integer,
  note text,
  color text default '#3B82F6',
  created_at timestamptz not null default now()
);

create index idx_bookmarks_user on public.bookmarks (user_id, created_at desc);

-- ============================================
-- USER DATA — CURRICULUM PROGRESS
-- ============================================

create table public.curriculum_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  curriculum_id uuid not null references public.curricula(id) on delete cascade,
  current_step integer not null default 0,
  completed_steps integer[] not null default '{}',
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  unique (user_id, curriculum_id)
);

create index idx_progress_user on public.curriculum_progress (user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.curricula enable row level security;
alter table public.curriculum_steps enable row level security;
alter table public.commentaries enable row level security;
alter table public.quotes enable row level security;
alter table public.videos enable row level security;
alter table public.articles enable row level security;
alter table public.bookmarks enable row level security;
alter table public.curriculum_progress enable row level security;

-- Profiles: users can read all, update own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Curricula: published are readable by all; authors can CRUD their own
create policy "Published curricula are viewable by everyone" on public.curricula
  for select using (is_published = true or auth.uid() = author_id);
create policy "Authenticated users can create curricula" on public.curricula
  for insert with check (auth.uid() = author_id);
create policy "Authors can update own curricula" on public.curricula
  for update using (auth.uid() = author_id);
create policy "Authors can delete own curricula" on public.curricula
  for delete using (auth.uid() = author_id);

-- Curriculum steps: follow parent curriculum visibility
create policy "Steps visible with curriculum" on public.curriculum_steps
  for select using (
    exists (
      select 1 from public.curricula c
      where c.id = curriculum_id
      and (c.is_published = true or c.author_id = auth.uid())
    )
  );
create policy "Authors can manage steps" on public.curriculum_steps
  for all using (
    exists (
      select 1 from public.curricula c
      where c.id = curriculum_id and c.author_id = auth.uid()
    )
  );

-- Resource library: readable by everyone (public content)
create policy "Commentaries are public" on public.commentaries for select using (true);
create policy "Quotes are public" on public.quotes for select using (true);
create policy "Videos are public" on public.videos for select using (true);
create policy "Articles are public" on public.articles for select using (true);

-- User data: private to the owner
create policy "Users can manage own bookmarks" on public.bookmarks
  for all using (auth.uid() = user_id);
create policy "Users can manage own progress" on public.curriculum_progress
  for all using (auth.uid() = user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.curricula
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.curriculum_steps
  for each row execute function public.update_updated_at();
