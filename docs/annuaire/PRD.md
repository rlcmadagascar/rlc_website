# PRD — Annuaire des Alumni RLC Madagascar

**Version:** 1.0
**Date:** 2026-03-30
**Produit:** Annuaire des Alumni — solution standalone
**Statut:** Draft

---

## 1. Contexte et Objectif

### 1.1 Contexte

RLC Madagascar est un programme de leadership qui regroupe des alumni répartis sur les 22 régions de Madagascar, ainsi qu'en Afrique du Sud et au Sénégal. Ces alumni sont issus de différentes cohortes (depuis 2019) et se spécialisent dans 6 tracks thématiques.

Jusqu'ici, l'annuaire est intégré dans la plateforme RLC Madagascar comme une sous-fonctionnalité. L'objectif est de le faire évoluer en **solution à part entière**, autonome et déployable indépendamment.

### 1.2 Objectif Produit

Créer un **annuaire professionnel des alumni RLC Madagascar** qui :

- Permette à tout visiteur de découvrir et rechercher les alumni
- Permette aux alumni de gérer leur profil et leur visibilité
- Produise une valeur réelle pour le réseau : mise en relation, visibilité des membres, sentiment d'appartenance
- Soit utilisable en dehors du contexte du site principal RLC

### 1.3 Utilisateurs Cibles

| Persona | Description | Besoin principal |
|---|---|---|
| **Visiteur public** | Partenaire, recruteur, curieux | Trouver un alumni par région / track / cohorte |
| **Alumni inscrit** | Membre du programme RLC | Être visible, mettre à jour son profil, retrouver ses pairs |
| **Alumni non inscrit** | Membre RLC non encore dans l'annuaire | Rejoindre l'annuaire facilement |
| **Administrateur** | Équipe RLC | Gérer les profils, modérer, exporter des données |

---

## 2. Périmètre Fonctionnel

### 2.1 Fonctionnalités Incluses (MVP)

#### F1 — Répertoire Public
- Affichage de tous les alumni avec `in_directory = true`
- Carte alumni : photo, nom, cohorte, track, région, localisation, poste, organisation, lien LinkedIn
- Barre de statistiques : total alumni, nombre de régions représentées, compteur par centre régional
- Pagination (6 par page, navigation intelligente)
- Responsive (mobile, tablette, desktop)

#### F2 — Recherche et Filtres
- Recherche par nom (temps réel, insensible à la casse)
- Filtre : Centre régional (Sénégal / Afrique du Sud)
- Filtre : Track (6 options)
- Filtre : Région Madagascar (22 régions)
- Combinaison de tous les filtres simultanément
- Bouton "Réinitialiser les filtres"
- Compteur de résultats

#### F3 — Inscription dans l'Annuaire (Alumni authentifiés)
- Formulaire d'inscription/modification accessible depuis le profil utilisateur
- Champs : photo, nom complet, type et numéro de cohorte, centre régional, région, track, poste, organisation, LinkedIn, email, téléphone
- Upload et compression de photo (400x400, format WebP)
- Flag de visibilité `in_directory` (l'alumni choisit d'être visible ou non)
- Les données de contact (email, téléphone) sont stockées mais **non affichées publiquement**

#### F4 — Authentification
- Authentification via Supabase Auth
- Les alumni non connectés peuvent consulter l'annuaire
- Seuls les alumni connectés peuvent modifier leur profil

### 2.2 Fonctionnalités Exclues du MVP (Hors Périmètre)

- Messagerie directe entre alumni
- Export PDF / Excel de l'annuaire
- Validation manuelle des inscriptions par un admin
- Carte géographique des alumni
- Réseau social / fil d'activité
- Intégration LinkedIn OAuth

---

## 3. User Stories

### Public / Non-connecté

| ID | En tant que | Je veux | Afin de |
|---|---|---|---|
| US-01 | Visiteur | Voir la liste des alumni | Découvrir le réseau RLC |
| US-02 | Visiteur | Rechercher un alumni par nom | Retrouver quelqu'un que je connais |
| US-03 | Visiteur | Filtrer par track | Trouver des alumni dans mon domaine |
| US-04 | Visiteur | Filtrer par région | Identifier des alumni proches de moi |
| US-05 | Visiteur | Filtrer par centre régional | Voir les alumni de Sénégal ou d'Afrique du Sud |
| US-06 | Visiteur | Voir les statistiques globales | Avoir une vue d'ensemble du réseau |
| US-07 | Visiteur | Accéder au profil LinkedIn d'un alumni | Prendre contact professionnellement |

### Alumni Connecté

| ID | En tant que | Je veux | Afin de |
|---|---|---|---|
| US-08 | Alumni | M'inscrire dans l'annuaire | Être visible pour mon réseau |
| US-09 | Alumni | Mettre à jour mes informations | Garder mon profil à jour |
| US-10 | Alumni | Choisir d'être visible ou non | Contrôler ma visibilité |
| US-11 | Alumni | Uploader une photo de profil | Personnaliser ma présence |
| US-12 | Alumni | Renseigner mon poste et organisation | Mettre en avant mon parcours professionnel |

### Administrateur

| ID | En tant que | Je veux | Afin de |
|---|---|---|---|
| US-13 | Admin | Voir tous les alumni (même non visibles) | Gérer la base complète |
| US-14 | Admin | Modifier un profil alumni | Corriger des erreurs |
| US-15 | Admin | Activer / désactiver la visibilité | Modérer les profils |

---

## 4. Exigences Non-Fonctionnelles

### Performance
- Chargement initial < 2 secondes sur connexion standard
- Filtres et recherche réactifs (< 300ms)
- Images compressées (WebP, max 400x400px)

### Sécurité
- **RLS Supabase** : un utilisateur ne peut modifier que son propre profil
- Email et téléphone **jamais exposés** dans l'API publique
- Authentification requise pour toute modification

### Accessibilité
- Balises sémantiques HTML (headings, nav, main, article)
- Labels ARIA pour la pagination et les filtres
- Alt text pour les images
- Navigation au clavier fonctionnelle

### Internationalisation
- Interface bilingue : Français / Anglais
- Basculement via `LangContext`
- Toutes les chaînes passent par le système de traductions

### Compatibilité
- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Mobile first, responsive sur tous écrans

---

## 5. Données et Taxonomies

### 5.1 Tracks (6)

| Valeur | Libellé |
|---|---|
| `business` | Business & Entrepreneuriat |
| `civic` | Leadership Civique |
| `public_management` | Management Public & Gouvernance |
| `education` | Education Changemaker |
| `wash` | Wash |
| `energie` | Energie |

### 5.2 Centres Régionaux (2)

| Valeur | Libellé | Emoji |
|---|---|---|
| `Sénégal` | Sénégal | 🇸🇳 |
| `Afrique du Sud` | Afrique du Sud | 🇿🇦 |

### 5.3 Régions Madagascar (22)

Analamanga, Vakinankaratra, Itasy, Bongolava, Matsiatra Ambony, Amoron'i Mania, Vatovavy, Fitovinany, Atsimo-Atsinanana, Atsinanana, Analanjirofo, Alaotra-Mangoro, Boeny, Sofia, Betsiboka, Melaky, Atsimo-Andrefana, Androy, Anosy, Menabe, Diana, Sava

### 5.4 Types de Cohorte

- `Cohort` → numérotées (1, 2, 3, 4, 5…)
- `Session` → identifiées par année (2024, 2025…)

---

## 6. Modèle de Données — Table `alumni`

| Champ | Type | Visibilité | Description |
|---|---|---|---|
| `id` | UUID | — | Clé primaire |
| `user_id` | UUID | — | Lien vers auth.users |
| `name` | text | Publique | Nom complet |
| `avatar` | text (URL) | Publique | URL de la photo de profil |
| `cohort` | text | Publique | Label complet (ex: "Cohort 1") |
| `cohort_type` | text | Publique | "Cohort" ou "Session" |
| `cohort_number` | text | Publique | Numéro ou année |
| `track` | text | Publique | Track de spécialisation |
| `region` | text | Publique | Région Madagascar |
| `location` | text | Publique | Centre régional (Sénégal / Afrique du Sud) |
| `position` | text | Publique | Intitulé du poste |
| `organization` | text | Publique | Nom de l'organisation |
| `linkedin` | text (URL) | Publique | Lien profil LinkedIn |
| `email` | text | **Privée** | Email de contact |
| `phone` | text | **Privée** | Téléphone |
| `in_directory` | boolean | — | Contrôle la visibilité publique |
| `created_at` | timestamp | — | Date de création |
| `updated_at` | timestamp | — | Date de dernière mise à jour |

---

## 7. Règles Métier

1. Un alumni n'est affiché dans le répertoire public que si `in_directory = true`
2. L'email et le téléphone ne sont **jamais retournés** dans les requêtes publiques
3. Un utilisateur ne peut créer/modifier que son propre enregistrement (RLS)
4. Un admin peut modifier tous les enregistrements
5. La photo est compressée à 400x400px en WebP avant upload
6. Un alumni peut choisir de retirer sa visibilité sans supprimer ses données
7. Les filtres sont cumulatifs (ET logique)
8. La pagination revient à la page 1 quand un filtre change

---

## 8. KPIs et Critères de Succès

| Indicateur | Cible à 3 mois |
|---|---|
| Alumni inscrits dans l'annuaire | > 80% des membres actifs |
| Régions représentées | > 15 sur 22 |
| Visites mensuelles de la page annuaire | > 200 |
| Taux de complétion des profils | > 70% des champs renseignés |

---

## 9. Évolutions Futures (Post-MVP)

- **Carte géographique** des alumni (Leaflet.js)
- **Export CSV/Excel** pour l'équipe RLC
- **Validation admin** des nouvelles inscriptions
- **Mise en relation** via formulaire de contact (sans exposer l'email)
- **Filtres avancés** : cohorte, année de promotion
- **Page profil publique** pour chaque alumni (`/alumni/:id`)
- **Badge de vérification** pour les profils complets
- **Notifications** : rappel aux alumni de compléter leur profil

---

## 10. Dépendances

| Dépendance | Rôle |
|---|---|
| Supabase | Base de données, Auth, Storage |
| React 19 | Framework UI |
| React Router v7 | Routing |
| react-easy-crop | Recadrage de photo |
| react-icons | Icônes (LinkedIn) |

---

*Document produit — RLC Madagascar — Annuaire Alumni v1.0*
