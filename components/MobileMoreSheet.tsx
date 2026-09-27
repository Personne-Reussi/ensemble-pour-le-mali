"use client";

import Link from "next/link";

const links = [
  { href: "/projets", label: "Faire un don" },
  { href: "/#organisation", label: "Notre organisation" },
  { href: "/#contact", label: "Contact" },
  { href: "/#benevole", label: "Espace bénévole" },
];

export default function MobileMoreSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl p-5"
        style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="block px-3 py-3 rounded-lg text-[15px] font-medium text-anthracite hover:bg-gray-50 transition"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
