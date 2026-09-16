# Ensemble pour le Mali — Plateforme de transparence et d'impact

Front de la page d'accueil, construit selon le cahier des charges
(Next.js + Tailwind CSS), reproduisant la maquette fournie.

## Démarrer

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
  layout.tsx        → layout racine (polices Poppins / Inter / Caveat)
  page.tsx           → assemble la page d'accueil
  globals.css        → styles globaux + Tailwind
components/
  Header.tsx          → nav + boutons "Espace bénévole" / "Faire un don"
  Hero.tsx            → bannière principale
  StatsBar.tsx        → bandeau "Notre impact en chiffres"
  ProjectsSection.tsx → grille de projets + carte + actualités
  ProjectCard.tsx      → carte d'un projet (statut, avancement, budget)
  MapSection.tsx       → carte du Mali (placeholder, à remplacer par Leaflet)
  NewsSection.tsx       → liste des actualités
  CtaSection.tsx        → section "Chaque geste compte"
  Footer.tsx             → pied de page
lib/
  mock-data.ts        → données de démo, alignées sur le schéma Supabase (bd.docx)
```

## Supabase — c'est déjà branché

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Dans le **SQL Editor**, exécute dans l'ordre :
   - `supabase/schema.sql` → crée les 10 tables + index.
   - `supabase/policies.sql` → active le RLS avec 2 rôles pour la V1
     (`public` lecture seule, `authenticated` = admin), comme recommandé
     dans le cahier des charges. Ajoute aussi le trigger `updated_at`
     sur `app_settings`.
3. Copie `.env.local.example` en `.env.local` et remplis avec ton
   **Project URL** et ta clé **anon** (Project Settings → API).
4. `npm run dev` — la home lit maintenant directement Supabase via
   `lib/data.ts` (`getFeaturedProjects`, `getAppSettings`, `getImpactStats`,
   `getLatestNews`, `getMapMarkers`).

**Tant que `.env.local` n'est pas rempli**, le site tourne quand même :
chaque fonction de `lib/data.ts` retombe automatiquement sur les données
de démonstration de `lib/mock-data.ts`. Pratique pour développer le
design sans dépendre d'une base déjà peuplée.

## Espace administrateur

Une fois `.env.local` rempli et `supabase/policies.sql` exécuté, crée ton
premier compte admin :

1. Dashboard Supabase → **Authentication → Users → Add user**, renseigne
   un email et un mot de passe (coche "Auto-confirm user").
2. Va sur `http://localhost:3000/admin` (ou clique "Espace admin" en bas
   du site) et connecte-toi.

Ce que tu peux faire depuis l'admin dès maintenant :
- **Tableau de bord** (`/admin`) : fonds collectés, dépenses totales,
  nombre de projets/bénévoles/rapports.
- **Projets & dépenses** (`/admin/projects`) : créer/modifier/supprimer
  un projet, et gérer ses dépenses (avec lien vers un justificatif —
  l'upload direct de fichiers via Supabase Storage est prévu pour une
  prochaine itération, pour l'instant on colle une URL).

L'accès est protégé par `middleware.ts` + le layout de
`app/admin/(protected)/`, qui vérifie la session Supabase Auth à chaque
requête (policies RLS `authenticated` de `supabase/policies.sql`).
Si les clés ne sont pas encore configurées, `/admin` affiche un message
clair au lieu de planter.

**Pas encore fait dans cette itération** (à la demande, pour rester
focus sur l'essentiel) : gestion des actualités/photos/indicateurs
d'impact, rapports, bénévoles, et le toggle des dons en ligne — ce sera
la suite logique du back-office.



1. **Peupler la base** : ajoute tes vrais projets dans Supabase (table
   `projects`) — dès qu'il y en a, ils remplacent automatiquement les
   données de démo sur la home.
2. **Carte interactive réelle** : intégrer `react-leaflet` + OpenStreetMap
   en `dynamic import (ssr: false)` dans `components/MapSection.tsx`,
   qui reçoit déjà les marqueurs positionnés via `latitude`/`longitude`
   (calcul actuellement approximatif dans `lib/data.ts`, à remplacer par
   de vraies coordonnées Leaflet).
3. **Pages dédiées** : fiche projet (`/projets/[id]`), catalogue avec filtres
   (`/projets`), formulaire bénévole (`INSERT` dans `volunteers`), page
   dons (mode manuel / `online_donations_active`), rapports PDF.
4. **Espace administrateur** : authentification Supabase Auth. Les policies
   sont déjà prêtes pour tout utilisateur `authenticated` (V1 simplifiée) ;
   ajoute les sous-rôles de `profiles.role` en V2 si besoin.
5. **Déploiement** : Vercel, comme prévu au cahier des charges — pense à
   renseigner les mêmes variables d'environnement dans les settings Vercel.

## Charte graphique

| Élément | Valeur |
|---|---|
| Vert institutionnel | `#27AE60` |
| Jaune ocre | `#F2C94C` |
| Blanc cassé | `#F8F9FA` |
| Gris anthracite | `#333333` |
| Titres | Poppins |
| Contenu | Inter |
