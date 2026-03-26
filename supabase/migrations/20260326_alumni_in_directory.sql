-- Migration: Add in_directory flag to alumni table
-- Controls visibility in the public directory

ALTER TABLE alumni
  ADD COLUMN IF NOT EXISTS in_directory BOOLEAN NOT NULL DEFAULT false;

-- Existing records that have cohort/track filled are considered registered
UPDATE alumni
  SET in_directory = true
  WHERE cohort IS NOT NULL AND track IS NOT NULL AND cohort != '' AND track != '';
