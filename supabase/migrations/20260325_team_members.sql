-- Migration: team_members table
-- Managed exclusively by admins (app_metadata.role = 'admin')

CREATE TABLE team_members (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category    text        NOT NULL CHECK (category IN ('bureau', 'coordinator', 'focal_point', 'past_coordinator')),
  name        text        NOT NULL,
  role        text,         -- bureau only
  portfolio   text,         -- coordinator only
  region      text,         -- focal_point only
  period      text,         -- past_coordinator only
  avatar      text,
  linkedin    text,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_team_members_category ON team_members (category, sort_order);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Anyone can read team members
CREATE POLICY "Public read team members"
  ON team_members FOR SELECT
  USING (true);

-- Admin only writes
CREATE POLICY "Admin insert team members"
  ON team_members FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin update team members"
  ON team_members FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin delete team members"
  ON team_members FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
