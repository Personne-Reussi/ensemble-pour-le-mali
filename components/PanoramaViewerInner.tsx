"use client";

import { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";

export default function PanoramaViewerInner({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: imageUrl,
      caption,
      navbar: ["zoom", "caption", "fullscreen"],
      defaultZoomLvl: 0,
    });

    // Nettoyage indispensable : sans ça, changer de projet ou revenir sur
    // la page laisse un contexte WebGL orphelin (fuite mémoire).
    return () => {
      viewer.destroy();
    };
  }, [imageUrl, caption]);

  return <div ref={containerRef} className="w-full h-full" />;
}
