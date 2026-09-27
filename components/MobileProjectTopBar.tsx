"use client";

import Link from "next/link";
import { Share2, ChevronLeft } from "lucide-react";

export default function MobileProjectTopBar({ title }: { title: string }) {
  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // L'utilisateur a annulé le partage — rien à faire.
      }
      return;
    }

    // Pas d'API de partage natif disponible (desktop, anciens navigateurs) :
    // on copie le lien dans le presse-papiers à la place.
    try {
      await navigator.clipboard.writeText(url);
      alert("Lien copié !");
    } catch {
      // Silencieux si le presse-papiers n'est pas accessible non plus.
    }
  }

  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3">
      <Link href="/projets" className="flex items-center gap-1 text-gray-600 text-[14px] font-medium">
        <ChevronLeft size={18} />
        Retour
      </Link>
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-gray-600 text-[14px] font-medium"
      >
        <Share2 size={16} />
        Partager
      </button>
    </div>
  );
}
