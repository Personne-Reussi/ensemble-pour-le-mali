import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// `supabase` reste `null` tant que `.env.local` n'est pas rempli
// (voir .env.local.example). Chaque fonction de lib/data.ts vérifie
// ce cas et retourne les données de secours de lib/mock-data.ts à la
// place — le site ne plante jamais, il affiche juste la démo en attendant.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
