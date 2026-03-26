-- Migration: Add English translation columns for user-generated content

-- initiatives
ALTER TABLE initiatives
  ADD COLUMN IF NOT EXISTS title_en      text,
  ADD COLUMN IF NOT EXISTS excerpt_en    text,
  ADD COLUMN IF NOT EXISTS description_en text;

-- testimonials
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS quote_en text;

-- actualites
ALTER TABLE actualites
  ADD COLUMN IF NOT EXISTS title_en   text,
  ADD COLUMN IF NOT EXISTS content_en text;
