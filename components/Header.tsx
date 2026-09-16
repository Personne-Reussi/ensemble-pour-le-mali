"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Projets", href: "/#projets" },
  { label: "Notre organisation", href: "/#organisation" },
  { label: "Actualités", href: "/#actualites" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={42} />
          <div className="leading-tight">
            <p className="font-heading font-semibold text-[17px] text-anthracite">
              Ensemble pour le Mali
            </p>
            <p className="text-[11px] tracking-wide text-gray-500">
              Solidarité · Développement · Impact
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-[15px] font-medium text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.href === "/" && isHome
                  ? "text-green font-semibold border-b-2 border-green pb-1"
                  : "hover:text-green transition"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#benevole"
            className="flex items-center gap-2 border-2 border-green text-green font-semibold text-[14px] px-4 py-2.5 rounded-full hover:bg-green/5 transition"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            Espace bénévole
          </Link>
          <Link
            href="/projets"
            className="flex items-center gap-2 bg-green text-white font-semibold text-[14px] px-5 py-2.5 rounded-full hover:bg-green-dark transition shadow-sm shadow-green/30"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.6 6.3 4.9 5c2-.8 4 0 5.1 1.7C11.1 5 13.1 4.2 15.1 5c3.3 1.3 4.1 5.1 2.2 7.9C14.7 16.65 12 21 12 21z" />
            </svg>
            Faire un don
          </Link>
        </div>
      </div>
    </header>
  );
}
