"use client";

import dynamic from "next/dynamic";

// Photo Sphere Viewer utilise WebGL/canvas : incompatible avec le rendu
// serveur, même pattern que components/ProjectsMap.tsx pour la carte.
const PanoramaViewerInner = dynamic(() => import("./PanoramaViewerInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[13px] bg-[#1a1a1a]">
      Chargement de la visite 360°...
    </div>
  ),
});

export default function PanoramaViewer({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption?: string;
}) {
  return <PanoramaViewerInner imageUrl={imageUrl} caption={caption} />;
}
