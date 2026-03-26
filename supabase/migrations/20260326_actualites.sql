-- Migration: Create actualites table (admin-only write, public read)

CREATE TABLE IF NOT EXISTS actualites (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  content      text,
  image        text,
  published_at date NOT NULL DEFAULT CURRENT_DATE,
  link         text,
  published    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE actualites ENABLE ROW LEVEL SECURITY;

-- Anyone can read published actualites
CREATE POLICY "Public read actualites"
  ON actualites FOR SELECT
  USING (published = true);

-- Admins can do everything
CREATE POLICY "Admin insert actualites"
  ON actualites FOR INSERT
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin update actualites"
  ON actualites FOR UPDATE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin delete actualites"
  ON actualites FOR DELETE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
