import { supabase } from "./supabase/public";
import {
  mockProjects,
  mockNews,
  mockMapMarkers,
  mockAppSettings,
  mockImpactStats,
} from "./mock-data";
import type {
  Project,
  NewsItem,
  MapMarker,
  AppSettings,
  ImpactStats,
  ProjectStatus,
} from "./types";

let warnedOnce = false;
function warnFallback(context: string, error?: unknown) {
  if (warnedOnce) return;
  warnedOnce = true;
  if (!supabase) {
    console.warn(
      "[data] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY absentes de .env.local — affichage des données de démonstration."
    );
  } else {
    console.error(`[data] Erreur Supabase (${context}), repli sur les données de démonstration.`, error);
  }
}

// Bounding box approximative du Mali, gardée uniquement en commentaire
// de référence — n'est plus utilisée depuis le passage à Leaflet, qui
// travaille directement avec latitude/longitude.

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  if (!supabase) {
    warnFallback("getFeaturedProjects");
    return mockProjects.slice(0, limit);
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, description, budget_target, current_funding, physical_progress, status, location_name, region, address, featured_image_url, panorama_image_url, latitude, longitude"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    warnFallback("getFeaturedProjects", error);
    return mockProjects.slice(0, limit);
  }

  return data as Project[];
}

export async function getAppSettings(): Promise<AppSettings> {
  if (!supabase) {
    warnFallback("getAppSettings");
    return mockAppSettings;
  }

  const { data, error } = await supabase
    .from("app_settings")
    .select("online_donations_active, annual_funding_goal, manual_total_collected")
    .eq("id", 1)
    .single();

  if (error || !data) {
    warnFallback("getAppSettings", error);
    return mockAppSettings;
  }

  return data as AppSettings;
}

export async function getImpactStats(): Promise<ImpactStats> {
  if (!supabase) {
    warnFallback("getImpactStats");
    return mockImpactStats;
  }

  const [totalRes, activeRes, completedRes, volunteersRes] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("volunteers").select("id", { count: "exact", head: true }).eq("status", "active"),
  ]);

  const anyError =
    totalRes.error || activeRes.error || completedRes.error || volunteersRes.error;

  if (anyError) {
    warnFallback("getImpactStats", anyError);
    return mockImpactStats;
  }

  return {
    projectsTotal: totalRes.count ?? 0,
    projectsInProgress: activeRes.count ?? 0,
    projectsCompleted: completedRes.count ?? 0,
    volunteersActive: volunteersRes.count ?? 0,
  };
}

export async function getLatestNews(limit = 4): Promise<NewsItem[]> {
  if (!supabase) {
    warnFallback("getLatestNews");
    return mockNews.slice(0, limit);
  }

  const { data, error } = await supabase
    .from("project_updates")
    .select("id, title, image_url, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    warnFallback("getLatestNews", error);
    return mockNews.slice(0, limit);
  }

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    date: formatter.format(new Date(row.created_at)),
    image_url: row.image_url ?? mockNews[0].image_url,
  }));
}

export async function getMapMarkers(): Promise<MapMarker[]> {
  if (!supabase) {
    warnFallback("getMapMarkers");
    return mockMapMarkers;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, location_name, region, status, latitude, longitude");

  if (error || !data) {
    warnFallback("getMapMarkers", error);
    return mockMapMarkers;
  }

  const withCoords = data.filter(
    (p): p is typeof p & { latitude: number; longitude: number } =>
      p.latitude != null && p.longitude != null
  );

  // On ne retombe sur les données de démo que si Supabase n'a renvoyé
  // aucune ligne du tout (table vide côté connexion factice) — voir le
  // garde `!supabase` plus haut. Si de vrais projets existent mais sans
  // coordonnées, on affiche une carte sans pastille plutôt que de
  // masquer un vrai état "pas encore de projet" derrière du mock.
  //
  // Plusieurs projets à la même position (même ville, adresse non
  // renseignée) sont gérés par le regroupement ("clustering") côté carte
  // (voir components/LeafletMapInner.tsx), pas ici — on renvoie les
  // vraies coordonnées telles quelles.
  return withCoords.map((p) => ({
    id: p.id,
    name: p.region ? `${p.location_name ?? p.title}, ${p.region}` : p.location_name ?? p.title,
    status: p.status as ProjectStatus,
    latitude: p.latitude,
    longitude: p.longitude,
  }));
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!supabase) {
    warnFallback("getProjectById");
    return mockProjects.find((p) => p.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, description, budget_target, current_funding, physical_progress, status, location_name, region, address, featured_image_url, panorama_image_url, latitude, longitude, start_date, end_date"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    warnFallback("getProjectById", error);
    return mockProjects.find((p) => p.id === id) ?? null;
  }

  return data as Project;
}

export interface PublicExpense {
  id: string;
  amount: number;
  description: string;
  document_url: string | null;
  expense_date: string;
}

export async function getExpensesForProject(id: string): Promise<PublicExpense[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("expenses")
    .select("id, amount, description, document_url, expense_date")
    .eq("project_id", id)
    .order("expense_date", { ascending: false });

  if (error || !data) return [];
  return data;
}
