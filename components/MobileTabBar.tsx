"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, FolderKanban, Search, Newspaper, Menu } from "lucide-react";
import MobileMoreSheet from "./MobileMoreSheet";

const tabs = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/projets", label: "Projets", icon: FolderKanban },
  { href: "/suivre-mon-don", label: "Mon don", icon: Search },
  { href: "/#actualites", label: "Actus", icon: Newspaper },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* Visible uniquement en dessous du breakpoint lg — le header
          desktop classique (nav complète en haut) prend le relais
          au-delà. */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 flex items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                active ? "text-green" : "text-gray-400"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
              {tab.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium text-gray-400"
        >
          <Menu size={20} strokeWidth={1.75} />
          Plus
        </button>
      </nav>

      <MobileMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />

      {/* Réserve la place occupée par la barre fixe pour que le footer
          (ou tout contenu en bas de page) ne soit jamais masqué derrière. */}
      <div
        className="lg:hidden"
        style={{ height: "calc(56px + env(safe-area-inset-bottom, 0px))" }}
      />
    </>
  );
}
