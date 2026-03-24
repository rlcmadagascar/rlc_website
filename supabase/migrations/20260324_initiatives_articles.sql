-- Table: initiatives_articles
-- Stores bilingual articles for all initiative categories (spotlight, fireside, autres)

CREATE TABLE initiatives_articles (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category    text        NOT NULL CHECK (category IN ('spotlight', 'fireside', 'autres')),
  title_fr    text        NOT NULL,
  title_en    text        NOT NULL,
  date        date        NOT NULL,
  author      text        NOT NULL DEFAULT 'RLC Madagascar Chapter',
  tag_fr      text        NOT NULL,
  tag_en      text        NOT NULL,
  image_url   text,
  image_path  text,
  excerpt_fr  text,
  excerpt_en  text,
  published   boolean     NOT NULL DEFAULT true,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Storage bucket for article photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-images',
  'article-images',
  true,
  5242880, -- 5 MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

CREATE POLICY "Public read article images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated upload article images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'article-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated update article images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'article-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete article images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'article-images' AND auth.role() = 'authenticated');

-- Index for fast filtering by category + published
CREATE INDEX idx_initiatives_articles_category ON initiatives_articles (category, published, date DESC);

-- Row-level security
ALTER TABLE initiatives_articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Public read published articles"
  ON initiatives_articles FOR SELECT
  USING (published = true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated insert"
  ON initiatives_articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update"
  ON initiatives_articles FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete"
  ON initiatives_articles FOR DELETE
  USING (auth.role() = 'authenticated');

-- Seed data — Spotlight
INSERT INTO initiatives_articles (category, title_fr, title_en, date, author, tag_fr, tag_en, image_url, excerpt_fr, excerpt_en, sort_order) VALUES
(
  'spotlight',
  'Andrianantenaina Rakoto : de la formation RLC à l''entrepreneuriat agricole',
  'Andrianantenaina Rakoto: From RLC Training to Agricultural Entrepreneurship',
  '2025-01-20',
  'RLC Madagascar Chapter',
  'Spotlight', 'Spotlight',
  'https://picsum.photos/seed/agro1/600/380',
  'Trois ans après sa formation RLC, Andrianantenaina Rakoto a transformé AgroMada Academy en l''un des programmes d''entrepreneuriat rural les plus impactants de la région Analamanga. Plus de 200 jeunes agriculteurs formés, trois partenariats régionaux signés — voici l''histoire d''un homme qui a transformé le savoir en action.',
  'Three years after completing his RLC training, Andrianantenaina Rakoto has built AgroMada Academy into one of the most impactful rural entrepreneurship programs in the Analamanga region. Over 200 young farmers trained, three regional partnerships secured — this is the story of a man who turned knowledge into action.',
  1
),
(
  'spotlight',
  'Lalaina Razafimahefa révolutionne l''éducation civique dans le Nord',
  'Lalaina Razafimahefa is Revolutionizing Civic Education in Northern Madagascar',
  '2024-11-12',
  'RLC Madagascar Chapter',
  'Spotlight', 'Spotlight',
  'https://picsum.photos/seed/civic2/600/380',
  'Avec CivicLab Madagascar, Lalaina a touché plus de 1 200 lycéens de la région Diana grâce à des ateliers interactifs sur la participation démocratique et les droits civiques. Son approche — pratique, portée par les pairs et ancrée dans le local — est aujourd''hui répliquée dans trois autres régions.',
  'Through CivicLab Madagascar, Lalaina has reached over 1,200 high school students in the Diana region with interactive workshops on democratic participation and civic rights. Her approach — hands-on, peer-driven, and local — is being replicated in three other regions.',
  2
),
(
  'spotlight',
  'Fenosoa Andriantsiferana : la e-gouvernance au service des citoyens',
  'Fenosoa Andriantsiferana: e-Governance at the Service of Citizens',
  '2024-10-05',
  'RLC Madagascar Chapter',
  'Spotlight', 'Spotlight',
  'https://picsum.photos/seed/gov3/600/380',
  'GovConnect, la passerelle numérique citoyen-administration conçue par Fenosoa, a traité plus de 1 500 demandes administratives lors de sa première année. Aujourd''hui, cinq communes ont adopté la plateforme et l''équipe prépare un déploiement à l''échelle nationale.',
  'GovConnect, the citizen-administration digital bridge built by Fenosoa, processed over 1,500 administrative requests in its first year. Today, five municipalities have adopted the platform and the team is scaling to the national level.',
  3
),
(
  'spotlight',
  'Harizo Rafanomezantsoa : l''énergie solaire pour les communautés isolées',
  'Harizo Rafanomezantsoa: Solar Energy for Remote Communities',
  '2024-09-18',
  'RLC Madagascar Chapter',
  'Spotlight', 'Spotlight',
  'https://picsum.photos/seed/solar4/600/380',
  'En rentrant de son programme RLC, Harizo avait un seul objectif : apporter la lumière là où il n''y en a pas. SolarVillage a depuis connecté 45 foyers dans la région Melaky à l''énergie renouvelable, réduisant de 80% les dépenses en pétrole lampant et permettant aux enfants d''étudier après la tombée de la nuit.',
  'When Harizo returned from his RLC program, he had one goal: bring light to the communities that have none. SolarVillage has since connected 45 households in the Melaky region to renewable energy, cutting kerosene costs by 80% and enabling children to study after dark.',
  4
),

-- Seed data — Autres
(
  'autres',
  'Lancement de MentorMada : 30 jeunes leaders accompagnés',
  'Launch of MentorMada: 30 Young Leaders Now Have a Mentor',
  '2025-03-05',
  'RLC Madagascar Chapter',
  'Programme', 'Program',
  'https://picsum.photos/seed/mentor1/600/380',
  'Le programme MentorMada, co-conçu par des alumni et le bureau du Chapter, a officiellement été lancé le mois dernier. Trente jeunes leaders âgés de 18 à 25 ans sont désormais accompagnés par des mentors expérimentés dans le cadre d''un suivi structuré de six mois. Les candidatures pour la deuxième cohorte ouvrent en juin.',
  'The MentorMada program, co-designed by RLC alumni and the Chapter bureau, officially launched last month. Thirty emerging leaders aged 18–25 are now paired with experienced mentors for a six-month structured accompaniment. Applications for the second cohort open in June.',
  1
),
(
  'autres',
  'Partenariat RLC Madagascar × Chambre de Commerce : de nouvelles opportunités',
  'RLC Madagascar × Chamber of Commerce: New Opportunities for Alumni',
  '2025-01-28',
  'RLC Madagascar Chapter',
  'Partenariat', 'Partnership',
  'https://picsum.photos/seed/partner2/600/380',
  'Un mémorandum d''entente signé entre le RLC Madagascar Chapter et la Chambre de Commerce d''Antananarivo ouvre de nouvelles portes pour les alumni entrepreneurs : accès aux ressources de développement des affaires, événements de réseautage et procédure accélérée d''immatriculation.',
  'A memorandum of understanding signed between RLC Madagascar Chapter and the Antananarivo Chamber of Commerce opens new doors for alumni entrepreneurs: access to business development resources, networking events, and a fast-track registration process for new businesses.',
  2
),
(
  'autres',
  'RLC Madagascar au Forum National de la Jeunesse 2024',
  'RLC Madagascar at the 2024 National Youth Forum',
  '2024-11-08',
  'RLC Madagascar Chapter',
  'Événement', 'Event',
  'https://picsum.photos/seed/forum3/600/380',
  'Cinq alumni ont représenté le Chapter lors du Forum National de la Jeunesse organisé à Antananarivo. Des tables rondes sur l''engagement civique aux ateliers sur l''entrepreneuriat numérique, la présence RLC s''est fait sentir tout au long des trois jours de l''événement. Lire le compte-rendu complet.',
  'Five RLC alumni represented the Chapter at the National Youth Forum held in Antananarivo. From panel discussions on civic engagement to workshops on digital entrepreneurship, the RLC presence was felt across the three-day event. Read the full recap.',
  3
),

-- Seed data — Fireside
(
  'fireside',
  'Fireside Chat #7 — Leadership féminin et transformation communautaire',
  'Fireside Chat #7 — Women''s Leadership and Community Transformation',
  '2025-02-14',
  'RLC Madagascar Chapter',
  'Fireside Chat', 'Fireside Chat',
  'https://picsum.photos/seed/fire7/600/380',
  'Dans cette septième édition, trois alumni féminines partagent comment elles ont surmonté les obstacles de genre pour conduire le changement dans leurs communautés. Une conversation sur la résilience, la représentation et la puissance des réseaux — animée par le Président du Chapter, Hery Andriamahefa.',
  'In this seventh edition, three women alumni share how they navigated gender barriers to lead change in their communities. A conversation about resilience, representation, and the power of networks — moderated by RLC Chapter President Hery Andriamahefa.',
  1
),
(
  'fireside',
  'Fireside Chat #6 — Entrepreneuriat social : entre impact et viabilité',
  'Fireside Chat #6 — Social Entrepreneurship: Between Impact and Sustainability',
  '2024-12-03',
  'RLC Madagascar Chapter',
  'Fireside Chat', 'Fireside Chat',
  'https://picsum.photos/seed/fire6/600/380',
  'Un projet social peut-il être à la fois financièrement viable et fidèle à sa mission ? Les alumni Toky Randriamahefasoa et Miantsa Andriamalala débattent de la tension entre croissance et impact, et partagent les modèles économiques derrière leurs initiatives.',
  'Can a social enterprise be both financially viable and mission-driven? Alumni Toky Randriamahefasoa and Miantsa Andriamalala debate the tension between growth and purpose, and share the financial models behind their initiatives.',
  2
),
(
  'fireside',
  'Fireside Chat #5 — Gouvernance locale et engagement des jeunes',
  'Fireside Chat #5 — Local Governance and Youth Engagement',
  '2024-10-22',
  'RLC Madagascar Chapter',
  'Fireside Chat', 'Fireside Chat',
  'https://picsum.photos/seed/fire5/600/380',
  'Des alumni travaillant au sein des structures de gouvernance locale parlent franchement des obstacles qu''ils rencontrent — et des victoires qu''ils ont remportées. Un regard rare sur ce que signifie vraiment exercer un leadership civique au niveau communal.',
  'Young alumni working within local government structures speak frankly about the obstacles they face — and the wins they''ve achieved. A rare inside look at what civic leadership really looks like at the commune level.',
  3
);
