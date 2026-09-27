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
          au-delà. bg-white opaque (pas de /90 ou /95) + ombre portée
          pour que la barre paraisse bien "posée" au-dessus du contenu,
          quel que soit ce qui défile derrière. */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
            >
              {active && (
                <span className="absolute top-0 h-[3px] w-8 rounded-full bg-green" />
              )}
              <Icon
                size={20}
                strokeWidth={active ? 2.25 : 1.75}
                className={active ? "text-green" : "text-gray-400"}
              />
              <span
                className={`text-[11px] font-medium ${active ? "text-green" : "text-gray-400"}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
        >
          <Menu size={20} strokeWidth={1.75} className="text-gray-400" />
          <span className="text-[11px] font-medium text-gray-400">Plus</span>
        </button>
      </nav>

      <MobileMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />

      {/* Réserve la place occupée par la barre fixe pour que le footer
          (ou tout contenu en bas de page) ne soit jamais masqué derrière. */}
      <div
        className="lg:hidden"
        style={{ height: "calc(60px + env(safe-area-inset-bottom, 0px))" }}
      />
    </>
  );
}
