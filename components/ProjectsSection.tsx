import type { Project, MapMarker, NewsItem } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import MapSection from "./MapSection";
import NewsSection from "./NewsSection";

export default function ProjectsSection({
  projects,
  mapMarkers,
  news,
}: {
  projects: Project[];
  mapMarkers: MapMarker[];
  news: NewsItem[];
}) {
  return (
    <section id="projets" className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-heading font-semibold text-[28px]">Nos projets</h2>
          <p className="text-gray-500 mt-1">Des actions concrètes pour un impact durable.</p>
        </div>
        <a
          href="/projets"
          className="text-green font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
        >
          Voir tous les projets <span>→</span>
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {projects.length === 0 ? (
          <div className="lg:col-span-3 bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-gray-500 text-[15px] mb-1">
              Aucun projet publié pour le moment.
            </p>
            <p className="text-gray-400 text-[13px]">
              Les premiers projets apparaîtront ici dès qu&apos;ils seront ajoutés.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <MapSection markers={mapMarkers} />
        <NewsSection news={news} />
      </div>
    </section>
  );
}
