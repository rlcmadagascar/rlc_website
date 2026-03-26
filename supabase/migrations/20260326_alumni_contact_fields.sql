-- Migration: Add private contact fields to alumni table
-- email and phone are stored but not exposed in the public directory

ALTER TABLE alumni
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;
