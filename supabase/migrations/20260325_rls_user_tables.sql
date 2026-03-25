-- Migration: RLS policies for alumni, initiatives, testimonials
-- Fixes initiatives_articles to restrict writes to admins only

-- =========================================================
-- TABLE: alumni
-- =========================================================
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;

-- Anyone can read the directory
CREATE POLICY "Public read alumni"
  ON alumni FOR SELECT
  USING (true);

-- Users can only insert their own record
CREATE POLICY "Users insert own alumni"
  ON alumni FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own record
CREATE POLICY "Users update own alumni"
  ON alumni FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own record
CREATE POLICY "Users delete own alumni"
  ON alumni FOR DELETE
  USING (auth.uid() = user_id);


-- =========================================================
-- TABLE: initiatives
-- =========================================================
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;

-- Anyone can read initiatives (public showcase)
CREATE POLICY "Public read initiatives"
  ON initiatives FOR SELECT
  USING (true);

-- Users can only insert their own initiatives
CREATE POLICY "Users insert own initiatives"
  ON initiatives FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own initiatives
CREATE POLICY "Users update own initiatives"
  ON initiatives FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own initiatives
CREATE POLICY "Users delete own initiatives"
  ON initiatives FOR DELETE
  USING (auth.uid() = user_id);


-- =========================================================
-- TABLE: testimonials
-- =========================================================
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can read testimonials
CREATE POLICY "Public read testimonials"
  ON testimonials FOR SELECT
  USING (true);

-- Users can only insert their own testimonials
CREATE POLICY "Users insert own testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own testimonials
CREATE POLICY "Users update own testimonials"
  ON testimonials FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own testimonials
CREATE POLICY "Users delete own testimonials"
  ON testimonials FOR DELETE
  USING (auth.uid() = user_id);


-- =========================================================
-- TABLE: initiatives_articles
-- Fix: replace "any authenticated user" with admin-only
--
-- app_metadata.role is set server-side only (service role),
-- users cannot modify it themselves.
--
-- To grant admin access to a user, run in Supabase SQL editor
-- (requires service role):
--   UPDATE auth.users
--   SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
--   WHERE id = '<user_uuid>';
-- =========================================================
DROP POLICY IF EXISTS "Authenticated insert" ON initiatives_articles;
DROP POLICY IF EXISTS "Authenticated update" ON initiatives_articles;
DROP POLICY IF EXISTS "Authenticated delete" ON initiatives_articles;

CREATE POLICY "Admin insert articles"
  ON initiatives_articles FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin update articles"
  ON initiatives_articles FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin delete articles"
  ON initiatives_articles FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Storage: restrict article-images writes to admins only
DROP POLICY IF EXISTS "Authenticated upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update article images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete article images" ON storage.objects;

CREATE POLICY "Admin upload article images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'article-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin update article images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'article-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin delete article images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'article-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
