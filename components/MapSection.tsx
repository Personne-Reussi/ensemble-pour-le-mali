import type { MapMarker } from "@/lib/types";
import ProjectsMap from "./ProjectsMap";

// Carte Leaflet réelle (voir components/LeafletMapInner.tsx). Cliquer sur
// un point envoie directement vers /projets/[id].
export default function MapSection({ markers }: { markers: MapMarker[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-[18px]">
          Nos projets sur la carte
        </h3>
      </div>

      <div className="relative h-72 rounded-xl overflow-hidden">
        {markers.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-[#eef1ea]">
            <p className="text-gray-400 text-[13px]">
              Aucun projet localisé pour le moment.
            </p>
          </div>
        ) : (
          <ProjectsMap markers={markers} />
        )}
      </div>

      <div className="flex items-center gap-5 mt-4 text-[12px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green inline-block" /> En cours
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-ocre inline-block" /> En attente
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-anthracite inline-block" /> Terminé
        </span>
      </div>
    </div>
  );
}
