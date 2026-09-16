import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ⚠️ Ce client contourne toutes les policies RLS — à n'utiliser QUE dans
// des Server Actions / code serveur, jamais importé dans un composant
// "use client". Sert uniquement au flux public de dons (app/dons/
// actions.ts) : créer un don anonyme, le retrouver par son code de
// suivi, sans authentification. La sécurité repose sur le fait que le
// code de suivi n'est jamais listable — chaque action exige le code
// exact, jamais un accès en liste libre à la table `donations`.
export function isServiceRoleConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL manquant dans .env.local"
    );
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
  });
}
