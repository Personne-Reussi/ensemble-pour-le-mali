import type { Project } from "./types";

// Combine ville/quartier + région pour l'affichage public, sans dupliquer
// si les deux sont identiques (ex. ville "Sikasso" et région "Sikasso").
export function formatProjectLocation(
  project: Pick<Project, "location_name" | "region">
): string | null {
  const { location_name, region } = project;

  if (!location_name && !region) return null;
  if (!region || location_name === region) return location_name;
  if (!location_name) return region;

  return `${location_name}, ${region}`;
}

// "Il reste X jours/mois" à partir d'une date de fin prévue, uniquement
// si elle est dans le futur — sinon null (le composant appelant décide
// quoi afficher, ou rien).
export function formatTimeRemaining(endDate: string | null | undefined): string | null {
  if (!endDate) return null;

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return null;

  const diffDays = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return null;

  if (diffDays < 30) return `Il reste ${diffDays} jour${diffDays > 1 ? "s" : ""}`;

  const months = Math.round(diffDays / 30);
  return `Il reste ${months} mois`;
}

export function formatDateFr(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
