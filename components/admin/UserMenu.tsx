"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { signOutAction } from "@/app/admin/actions";

export default function UserMenu({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const displayName = userEmail.split("@")[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5"
      >
        <div className="w-9 h-9 rounded-full bg-green/10 text-green font-semibold text-[13px] flex items-center justify-center uppercase">
          {displayName.slice(0, 2)}
        </div>
        <div className="text-left leading-tight hidden sm:block">
          <p className="text-[13px] font-semibold text-anthracite capitalize">{displayName}</p>
          <p className="text-[11px] text-gray-400">Administrateur</p>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
          <p className="px-4 py-2 text-[12px] text-gray-400 truncate border-b border-gray-50 mb-1">
            {userEmail}
          </p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
