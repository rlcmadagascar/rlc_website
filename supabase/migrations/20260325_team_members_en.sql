-- Migration: add English role/portfolio fields to team_members

ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS role_en      text,
  ADD COLUMN IF NOT EXISTS portfolio_en text;
