import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Utilisé dans les Server Components et Server Actions de app/admin/**.
// Contrairement à lib/supabase/public.ts (lecture seule pour la home),
// ce client porte la session de l'utilisateur connecté, donc les policies
// RLS "auth.role() = 'authenticated'" (voir supabase/policies.sql)
// s'appliquent correctement pour les écritures admin.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Server Component (pas une Server Action) :
            // on ne peut pas écrire de cookie ici, le middleware s'en
            // charge déjà au niveau de la requête suivante.
          }
        },
      },
    }
  );
}