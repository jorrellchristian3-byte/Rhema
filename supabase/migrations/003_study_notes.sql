-- Study Notes table
-- Stores user study notes tied to scripture passages

CREATE TABLE IF NOT EXISTS study_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by user and passage
CREATE INDEX IF NOT EXISTS idx_study_notes_user_id ON study_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_study_notes_book_chapter ON study_notes(book, chapter);
CREATE INDEX IF NOT EXISTS idx_study_notes_updated ON study_notes(updated_at DESC);

-- RLS policies
ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notes
CREATE POLICY "Users can view own notes"
  ON study_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes"
  ON study_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON study_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON study_notes FOR DELETE
  USING (auth.uid() = user_id);
