// Régions administratives du Mali (les 10 régions "historiques" +
// le District de Bamako — le découpage le plus largement reconnu et
// utilisé). Si le pays officialise un découpage différent à l'usage,
// ajuster cette liste suffit à mettre à jour tout le formulaire et la
// contrainte en base (voir supabase/migrations/003_add_region_address.sql).
export const MALI_REGIONS = [
  "Kayes",
  "Koulikoro",
  "Sikasso",
  "Ségou",
  "Mopti",
  "Tombouctou",
  "Gao",
  "Kidal",
  "Ménaka",
  "Taoudénit",
  "District de Bamako",
] as const;

export type MaliRegion = (typeof MALI_REGIONS)[number];
