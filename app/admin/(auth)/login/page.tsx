"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Identifiants incorrects. Vérifie ton email et ton mot de passe.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size={48} />
          <h1 className="font-heading font-semibold text-[20px] mt-4">
            Espace administrateur
          </h1>
          <p className="text-gray-500 text-sm mt-1">Ensemble pour le Mali</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
        >
          {error && (
            <p className="bg-red-50 text-red-600 text-[13px] rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              placeholder="admin@ensemblepourlemali.org"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green text-white font-semibold text-[14px] py-2.5 rounded-lg hover:bg-green-dark transition disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-[12px] text-gray-400 mt-6">
          Accès réservé aux administrateurs. Contacte le responsable
          technique si tu n&apos;as pas encore de compte.
        </p>
      </div>
    </div>
  );
}
