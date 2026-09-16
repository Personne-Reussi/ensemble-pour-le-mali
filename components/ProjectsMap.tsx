"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/lib/types";

// Leaflet accède à `window`/`document` dès son import : le rendu serveur
// doit être désactivé, et ça ne peut se faire que depuis un Client
// Component (d'où ce petit wrapper séparé du composant carte lui-même).
const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[13px] bg-[#eef1ea]">
      Chargement de la carte...
    </div>
  ),
});

export default function ProjectsMap({ markers }: { markers: MapMarker[] }) {
  return <LeafletMapInner markers={markers} />;
}
