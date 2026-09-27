"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import Footer from "@/components/Footer";
import { lookupDonationByCode } from "@/app/dons/actions";
import { donationStatusLabels } from "@/lib/donations";
import type { Donation } from "@/lib/types";

function formatFcfa(value: number | null) {
  if (value == null) return null;
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

function TrackDonationForm() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [donation, setDonation] = useState<Donation | null>(null);

  const runLookup = useCallback(async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    setNotFound(false);
    setDonation(null);

    const result = await lookupDonationByCode(value);
    setLoading(false);

    if (!result) {
      setNotFound(true);
      return;
    }
    setDonation(result);
  }, []);

  // Si on arrive avec ?code=... (ex. juste après avoir confirmé un don),
  // on lance la recherche tout de suite sans que le visiteur ait à
  // cliquer sur quoi que ce soit.
  useEffect(() => {
    if (initialCode) {
      runLookup(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runLookup(code);
  }

  return (
    <main className="bg-offwhite text-anthracite min-h-screen">
      <Header />

      <section className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-heading font-semibold text-[24px] mb-2">Suivre mon don</h1>
        <p className="text-gray-500 text-[14px] mb-8">
          Entre le code reçu au moment de ton don pour connaître son statut.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="DON-XXXXXX"
            className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="bg-green text-white font-semibold text-[14px] px-5 rounded-lg hover:bg-green-dark transition disabled:opacity-60"
          >
            {loading ? "..." : "Vérifier"}
          </button>
        </form>

        {notFound && (
          <p className="bg-red-50 text-red-600 text-[13px] rounded-lg px-4 py-3">
            Aucun don trouvé avec ce code. Vérifie qu&apos;il est bien recopié.
          </p>
        )}

        {donation && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-[13px] text-gray-400 mb-1">Code {donation.tracking_code}</p>
            <p className="font-heading font-semibold text-[17px] mb-3">
              {donationStatusLabels[donation.status]?.label ?? donation.status}
            </p>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
              {donationStatusLabels[donation.status]?.description}
            </p>
            <div className="border-t border-gray-100 pt-4 text-[13px] space-y-1.5">
              <p>
                <span className="text-gray-400">Type :</span>{" "}
                {donation.donation_type === "monetary" ? "Don en argent" : "Don en matériel"}
              </p>
              {donation.donation_type === "monetary" && donation.amount != null && (
                <p>
                  <span className="text-gray-400">Montant :</span> {formatFcfa(donation.amount)}
                </p>
              )}
              {donation.item_description && (
                <p>
                  <span className="text-gray-400">Description :</span> {donation.item_description}
                </p>
              )}
              <p>
                <span className="text-gray-400">Soumis le :</span>{" "}
                {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                  new Date(donation.created_at)
                )}
              </p>
            </div>
          </div>
        )}
      </section>
      <MobileTabBar />

      <Footer />
    </main>
  );
}

export default function TrackDonationPage() {
  return (
    <Suspense fallback={null}>
      <TrackDonationForm />
    </Suspense>
  );
}