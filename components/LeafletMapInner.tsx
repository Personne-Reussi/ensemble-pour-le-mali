"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { MapMarker } from "@/lib/types";

const statusColor: Record<string, string> = {
  active: "#27AE60",
  pending: "#F2C94C",
  completed: "#333333",
  archived: "#9CA3AF",
};

// Icône simple (cercle coloré en HTML/CSS) au lieu des icônes par défaut
// de Leaflet — cohérent avec les couleurs de statut utilisées ailleurs
// sur le site, et compatible avec le plugin de clustering (qui attend
// des `Marker` classiques, pas des `CircleMarker` SVG).
function createStatusIcon(status: string) {
  const color = statusColor[status] ?? statusColor.active;
  return L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

// Centre approximatif du Mali.
const MALI_CENTER: [number, number] = [17, -4];

export default function LeafletMapInner({ markers }: { markers: MapMarker[] }) {
  const router = useRouter();

  const center: [number, number] =
    markers.length === 1 ? [markers[0].latitude, markers[0].longitude] : MALI_CENTER;
  const zoom = markers.length === 1 ? 11 : 5;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      // `isolate` (CSS isolation: isolate) est la vraie correction du bug
      // "la carte passe au-dessus de tout au scroll" : Leaflet donne à
      // ses propres éléments (tuiles, contrôles zoom, popups) des
      // z-index internes très élevés (jusqu'à 1000). Sans isolation, ces
      // valeurs entrent en compétition avec le reste de la page (barre
      // de navigation mobile, modales...) dans le MÊME contexte
      // d'empilement global. `isolate` enferme tous les z-index internes
      // de Leaflet à l'intérieur de cette boîte : ils ne peuvent plus
      // jamais déborder par-dessus quoi que ce soit d'extérieur, quelle
      // que soit la valeur que Leaflet utilise en interne.
      className="w-full h-full isolate"
      style={{ background: "#eef1ea" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Plusieurs projets à la même position (même ville sans adresse
          précise) se regroupent automatiquement en un seul point avec un
          compteur ; cliquer dessus zoome, et au niveau de zoom maximum les
          projets encore superposés s'écartent en éventail ("spiderfy")
          pour rester tous sélectionnables individuellement. */}
      <MarkerClusterGroup chunkedLoading spiderfyOnMaxZoom showCoverageOnHover={false}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={createStatusIcon(marker.status)}
            eventHandlers={{
              click: () => router.push(`/projets/${marker.id}`),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              {marker.name}
            </Tooltip>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
