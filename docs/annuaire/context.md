# Contexte Technique — Annuaire des Alumni RLC Madagascar

**Version:** 1.0
**Date:** 2026-03-30
**Scope:** Fonctionnalité Annuaire uniquement

---

## 1. Stack Technique

| Couche | Technologie | Version |
|---|---|---|
| Framework UI | React | 19.2.0 |
| Routing | React Router | v7 |
| Base de données | Supabase (PostgreSQL) | — |
| Auth | Supabase Auth | — |
| Storage (images) | Supabase Storage | — |
| CSS | CSS modules + media queries | — |
| Icônes | react-icons | — |
| Recadrage image | react-easy-crop | — |
| i18n | LangContext (custom) | — |

---

## 2. Architecture des Fichiers

```
src/
├── pages/
│   ├── DirectoryPage.jsx        # Page publique de l'annuaire
│   ├── DirectoryPage.css        # Styles de la page annuaire
│   └── ProfilePage.jsx          # Profil utilisateur (onglet annuaire)
│
├── components/
│   ├── AlumniFormModal.jsx      # Formulaire d'inscription (ancienne version)
│   ├── AlumniFormModal.css      # Styles du formulaire
│   └── Navbar.jsx               # Navigation (lien vers /directory)
│
├── data/
│   └── alumni.js                # Données de référence (20 alumni samples)
│
├── context/
│   ├── AuthContext.jsx          # Gestion de l'authentification
│   └── LangContext.jsx          # Gestion du bilinguisme FR/EN
│
├── lib/
│   └── supabase.js              # Client Supabase
│
└── i18n/
    └── translations.js          # Chaînes de traduction FR/EN

supabase/
└── migrations/
    ├── 20260325_rls_user_tables.sql        # Politiques RLS
    ├── 20260326_alumni_contact_fields.sql  # Ajout email + phone
    └── 20260326_alumni_in_directory.sql    # Ajout flag in_directory

docs/
└── annuaire/
    ├── PRD.md      # Ce PRD
    └── context.md  # Ce document
```

---

## 3. Routes

| Route | Composant | Accès | Description |
|---|---|---|---|
| `/directory` | `DirectoryPage.jsx` | Public | Répertoire public des alumni |
| `/profile` | `ProfilePage.jsx` | Authentifié | Profil utilisateur |
| `/profile?tab=annuaire` | `ProfilePage.jsx` | Authentifié | Onglet inscription annuaire |

---

## 4. Base de Données — Schéma Supabase

### Table `alumni`

```sql
CREATE TABLE alumni (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id),
  name          TEXT,
  avatar        TEXT,
  cohort        TEXT,
  cohort_type   TEXT,   -- 'Cohort' | 'Session'
  cohort_number TEXT,
  track         TEXT,
  region        TEXT,
  location      TEXT,   -- 'Sénégal' | 'Afrique du Sud'
  position      TEXT,
  organization  TEXT,
  linkedin      TEXT,
  email         TEXT,   -- PRIVÉ, jamais exposé publiquement
  phone         TEXT,   -- PRIVÉ, jamais exposé publiquement
  in_directory  BOOLEAN DEFAULT false,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Row Level Security (RLS)

```sql
-- Lecture publique : tout le monde peut lire
CREATE POLICY "Public read alumni"
  ON alumni FOR SELECT USING (true);

-- Insertion : uniquement son propre enregistrement
CREATE POLICY "Users insert own alumni"
  ON alumni FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Modification : uniquement son propre enregistrement
CREATE POLICY "Users update own alumni"
  ON alumni FOR UPDATE
  USING (auth.uid() = user_id);

-- Suppression : uniquement son propre enregistrement
CREATE POLICY "Users delete own alumni"
  ON alumni FOR DELETE
  USING (auth.uid() = user_id);
```

> **Note sécurité :** Les colonnes `email` et `phone` sont dans la table mais ne doivent **jamais** être sélectionnées dans les requêtes publiques. Voir section 6.

---

## 5. Composants — Détail Technique

### 5.1 `DirectoryPage.jsx`

**Rôle :** Affichage public filtrable de tous les alumni avec `in_directory = true`

**État local :**
```js
const [alumni, setAlumni]         = useState([]);   // tous les alumni visibles
const [searchTerm, setSearchTerm] = useState('');
const [filterLocation, setFilterLocation] = useState('');
const [filterTrack, setFilterTrack]       = useState('');
const [filterRegion, setFilterRegion]     = useState('');
const [currentPage, setCurrentPage]       = useState(1);
const ITEMS_PER_PAGE = 6;
```

**Requête Supabase (lecture publique) :**
```js
supabase
  .from('alumni')
  .select('id, name, avatar, cohort, track, region, location, position, organization, linkedin')
  // email et phone EXCLUS intentionnellement
  .eq('in_directory', true)
  .order('name')
```

**Logique de filtrage (client-side) :**
```js
const filtered = alumni
  .filter(a => a.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  .filter(a => filterLocation ? a.location === filterLocation : true)
  .filter(a => filterTrack    ? a.track    === filterTrack    : true)
  .filter(a => filterRegion   ? a.region   === filterRegion   : true);
```

**Statistiques calculées :**
```js
const stats = {
  total:       alumni.length,
  regions:     new Set(alumni.map(a => a.region).filter(Boolean)).size,
  senegal:     alumni.filter(a => a.location === 'Sénégal').length,
  afriqueSud:  alumni.filter(a => a.location === 'Afrique du Sud').length,
};
```

**Pagination :**
```js
const totalPages   = Math.ceil(filtered.length / ITEMS_PER_PAGE);
const paginated    = filtered.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);
```

**Réinitialisation des filtres :**
```js
const hasActiveFilters = searchTerm || filterLocation || filterTrack || filterRegion;
const resetFilters = () => {
  setSearchTerm('');
  setFilterLocation('');
  setFilterTrack('');
  setFilterRegion('');
  setCurrentPage(1);
};
```

---

### 5.2 `ProfilePage.jsx` — Onglet Annuaire

**Rôle :** Formulaire d'inscription/modification pour un alumni authentifié

**Lecture du profil existant :**
```js
supabase
  .from('alumni')
  .select('*')  // email/phone OK ici car l'utilisateur lit son propre profil
  .eq('user_id', user.id)
  .single()
```

**Sauvegarde (upsert) :**
```js
supabase
  .from('alumni')
  .upsert({
    user_id:       user.id,
    name, avatar, cohort, cohort_type, cohort_number,
    track, region, location,
    position, organization, linkedin,
    email, phone,
    in_directory:  true,
    updated_at:    new Date().toISOString()
  }, { onConflict: 'user_id' })
```

---

### 5.3 `AlumniFormModal.jsx`

**Rôle :** Ancienne version modale du formulaire d'inscription (toujours utilisée dans l'ancien flow `AlumniPage`)

**Upload d'avatar :**
```js
// Compression via utilitaire
const compressed = await compressImage(file, { maxWidth: 400, maxHeight: 400, format: 'webp' });
// Upload vers Supabase Storage
const { data } = await supabase.storage
  .from('avatars')
  .upload(`alumni/${user.id}`, compressed, { upsert: true });
```

---

## 6. Sécurité et Confidentialité

### Principe de moindre exposition

Les champs `email` et `phone` sont **toujours exclus** des requêtes publiques :

```js
// CORRECT — directoryPage.jsx
.select('id, name, avatar, cohort, track, region, location, position, organization, linkedin')

// INTERDIT — ne jamais faire en lecture publique
.select('*')
```

### Vérification des avatars

Les URLs d'avatar sont validées avant affichage :
```js
import { isSafeAvatarUrl } from '../utils/avatarUtils';
// Accepte uniquement les URLs Supabase Storage ou les fallbacks autorisés
```

### CORS et Auth

- Toutes les mutations passent par Supabase Auth (JWT)
- Les politiques RLS empêchent toute modification croisée entre utilisateurs

---

## 7. Internationalisation

### Structure

```js
// src/i18n/translations.js
{
  fr: {
    directory: {
      title: "Annuaire des Alumni",
      search_placeholder: "Rechercher un alumni...",
      filter_location: "Centre régional",
      filter_track: "Track",
      filter_region: "Région",
      reset_filters: "Réinitialiser les filtres",
      alumni_found: (n) => `${n} alumni trouvé${n > 1 ? 's' : ''}`,
      stats_total: "Alumni",
      stats_regions: "Régions",
      // ...
    }
  },
  en: {
    directory: {
      title: "Alumni Directory",
      // ...
    }
  }
}
```

### Usage dans les composants

```js
const { t } = useLang();
// t('directory.title') → "Annuaire des Alumni" ou "Alumni Directory"
```

---

## 8. Taxonomies — Valeurs de Référence

### Tracks

```js
export const TRACKS = [
  'Business & Entrepreneuriat',
  'Leadership Civique',
  'Management Public & Gouvernance',
  'Education Changemaker',
  'Wash',
  'Energie',
];
```

### Centres régionaux

```js
export const LOCATIONS = [
  { value: 'Sénégal',      label: 'Sénégal',      flag: '🇸🇳' },
  { value: 'Afrique du Sud', label: 'Afrique du Sud', flag: '🇿🇦' },
];
```

### Régions Madagascar (22)

```js
export const REGIONS = [
  'Analamanga', 'Vakinankaratra', 'Itasy', 'Bongolava',
  'Matsiatra Ambony', "Amoron'i Mania", 'Vatovavy', 'Fitovinany',
  'Atsimo-Atsinanana', 'Atsinanana', 'Analanjirofo', 'Alaotra-Mangoro',
  'Boeny', 'Sofia', 'Betsiboka', 'Melaky',
  'Atsimo-Andrefana', 'Androy', 'Anosy', 'Menabe', 'Diana', 'Sava',
];
```

### Types de cohorte

```js
export const COHORT_TYPES = ['Cohort', 'Session'];
```

---

## 9. Couleurs des Tracks (UI)

```css
/* Chaque track a une couleur de badge distincte */
.track-business         { background: #FEF3C7; color: #92400E; }
.track-civic            { background: #D1FAE5; color: #065F46; }
.track-public-mgmt      { background: #DBEAFE; color: #1E40AF; }
.track-education        { background: #FCE7F3; color: #9D174D; }
.track-wash             { background: #E0F2FE; color: #0369A1; }
.track-energie          { background: #FEF9C3; color: #854D0E; }
```

---

## 10. Responsive Design

```css
/* Desktop : 3 colonnes */
.alumni-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Tablette : 2 colonnes */
@media (max-width: 768px) {
  .alumni-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile : 1 colonne */
@media (max-width: 480px) {
  .alumni-grid { grid-template-columns: 1fr; }
}
```

---

## 11. Flux Utilisateur

### Flux Public (Consultation)

```
/directory
  → Chargement des alumni (in_directory = true)
  → Affichage grille + barre de stats
  → Recherche / filtres
  → Pagination
  → Clic LinkedIn → onglet externe
```

### Flux Alumni (Inscription)

```
/profile?tab=annuaire
  → Vérification auth (redirect /login si non connecté)
  → Lecture du profil existant (si déjà inscrit → pré-remplissage)
  → Upload photo (optionnel) → compression WebP → Supabase Storage
  → Remplissage du formulaire
  → Sauvegarde (upsert) → in_directory = true
  → Confirmation
  → Visible dans /directory
```

---

## 12. Variables d'Environnement Requises

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 13. Migrations à Appliquer (ordre)

```bash
# 1. Politiques RLS
supabase/migrations/20260325_rls_user_tables.sql

# 2. Ajout des champs de contact
supabase/migrations/20260326_alumni_contact_fields.sql

# 3. Ajout du flag de visibilité
supabase/migrations/20260326_alumni_in_directory.sql
```

---

## 14. Points d'Attention Techniques

### Performance
- Le filtrage est entièrement **client-side** pour éviter des requêtes répétées
- Tous les alumni visibles sont chargés en une seule requête au montage
- Acceptable tant que le volume reste < ~500 alumni

### Scalabilité (si > 500 alumni)
- Migrer vers un filtrage **server-side** (Supabase `.filter()` dans la requête)
- Ajouter un index sur `in_directory`, `track`, `region`, `location`

### Upload d'images
- Taille max recommandée : 5 MB en entrée, compressé à ~50-100 KB
- Format de sortie : WebP (meilleur ratio qualité/poids)
- Chemin Supabase Storage : `avatars/alumni/{user_id}`

### Cohérence des données
- `cohort` est dénormalisé (`cohort_type` + `cohort_number`) → s'assurer que les deux sont toujours renseignés ensemble
- `in_directory` est à `false` par défaut → un alumni doit explicitement choisir d'être visible

---

*Document technique — RLC Madagascar — Annuaire Alumni v1.0*
