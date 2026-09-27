"use client";

import { useState, useRef, useEffect } from "react";

export default function HelpTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

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
    <span ref={ref} className="relative inline-block ml-1.5 align-middle">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold inline-flex items-center justify-center hover:bg-gray-300 transition"
        aria-label="Aide"
      >
        ?
      </button>
      {open && (
        <span className="absolute z-20 left-0 top-6 w-64 bg-anthracite text-white text-[12px] leading-relaxed rounded-lg p-3 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
