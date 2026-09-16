// Données de secours (fallback), utilisées automatiquement par lib/data.ts
// tant que .env.local n'est pas rempli avec de vraies clés Supabase,
// ou si une requête échoue. Structurées comme les tables du schéma
// (voir supabase/schema.sql).

import type {
  Project,
  NewsItem,
  MapMarker,
  AppSettings,
  ImpactStats,
} from "./types";

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Forage à Sikasso",
    location_name: "Sikasso",
    region: "Sikasso",
    address: null,
    status: "active",
    budget_target: 15_000_000,
    current_funding: 11_500_000,
    physical_progress: 72,
    description:
      "Construction d'un forage pour l'accès à l'eau potable dans 2 villages.",
    featured_image_url:
      "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=1200&auto=format&fit=crop",
    panorama_image_url: null,
    latitude: 11.32,
    longitude: -5.67,
  },
  {
    id: "2",
    title: "Réhabilitation d'une école",
    location_name: "Koutiala",
    region: "Sikasso",
    address: null,
    status: "pending",
    budget_target: 10_000_000,
    current_funding: 0,
    physical_progress: 0,
    description:
      "Rénovation de 6 salles de classe pour améliorer les conditions d'apprentissage.",
    featured_image_url:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
    latitude: 12.39,
    longitude: -5.46,
  },
  {
    id: "3",
    title: "Soutien aux agriculteurs",
    location_name: "Bandiagara",
    region: "Mopti",
    address: null,
    status: "completed",
    budget_target: 8_200_000,
    current_funding: 8_200_000,
    physical_progress: 100,
    description:
      "Fourniture de matériel agricole et formation pour 120 producteurs.",
    featured_image_url:
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1200&auto=format&fit=crop",
    latitude: 14.35,
    longitude: -3.61,
  },
];

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Fin des travaux du forage de Sikasso",
    date: "03 oct. 2025",
    image_url:
      "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Début de la toiture de l'école de Koutiala",
    date: "27 sept. 2025",
    image_url:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Achat du ciment pour l'école de Koutiala",
    date: "18 sept. 2025",
    image_url:
      "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Livraison du matériel agricole à Bandiagara",
    date: "12 sept. 2025",
    image_url:
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=200&auto=format&fit=crop",
  },
];

export const mockMapMarkers: MapMarker[] = [
  { id: "1", name: "Sikasso, Mali", status: "active", latitude: 11.32, longitude: -5.67 },
  { id: "2", name: "Koutiala, Mali", status: "pending", latitude: 12.39, longitude: -5.46 },
  { id: "3", name: "Bandiagara, Mali", status: "completed", latitude: 14.35, longitude: -3.61 },
];

export const mockAppSettings: AppSettings = {
  online_donations_active: false,
  annual_funding_goal: 72_000_000,
  manual_total_collected: 48_750_000,
};

export const mockImpactStats: ImpactStats = {
  projectsInProgress: 12,
  projectsTotal: 18,
  projectsCompleted: 8,
  volunteersActive: 245,
};
