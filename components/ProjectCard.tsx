import Image from "next/image";
import type { Project } from "@/lib/types";
import { formatProjectLocation } from "@/lib/format";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=1200&auto=format&fit=crop";

const statusConfig = {
  active: { label: "En cours", className: "bg-green text-white" },
  pending: { label: "En attente", className: "bg-ocre text-anthracite" },
  completed: { label: "Terminé", className: "bg-anthracite/80 text-white" },
  archived: { label: "Archivé", className: "bg-gray-400 text-white" },
};

function formatFcfa(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export default function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status];
  const isCompleted = project.status === "completed";
  const barColor = project.status === "pending" ? "bg-ocre" : "bg-green";
  // La barre reflète le financement (collecté / objectif), plus parlant
  // pour un visiteur qui décide où donner que l'avancement physique des
  // travaux sur le terrain.
  const fundingPercent = project.budget_target
    ? Math.min(100, Math.round((project.current_funding / project.budget_target) * 100))
    : 0;
  const percentLabel = (
    <span className={`text-[13px] font-semibold ${fundingPercent > 0 ? "text-green" : "text-gray-400"}`}>
      {fundingPercent}%
    </span>
  );

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="relative h-44">
        <Image
          src={project.featured_image_url ?? FALLBACK_IMAGE}
          alt={project.title}
          fill
          className="object-cover"
        />
        <span
          className={`absolute top-3 left-3 text-[11px] font-semibold px-3 py-1 rounded-full ${status.className}`}
        >
          {status.label}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-heading font-semibold text-[17px] mb-1">
          {project.title}
        </h3>
        <p className="text-gray-500 text-[13px] flex items-center gap-1 mb-3">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {formatProjectLocation(project) ?? "Localisation à venir"}
        </p>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{
                width: `${Math.max(fundingPercent, fundingPercent > 0 ? 2 : 0)}%`,
              }}
            />
          </div>
          {percentLabel}
        </div>
        <div className="flex justify-between text-[13px] mb-4">
          <div>
            <p className="font-semibold">{formatFcfa(project.current_funding)}</p>
            <p className="text-gray-400 text-[12px]">
              {isCompleted ? "dépensés" : "collectés"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatFcfa(project.budget_target)}</p>
            <p className="text-gray-400 text-[12px]">
              {isCompleted ? "budget" : "objectif"}
            </p>
          </div>
        </div>
        <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
          {project.description}
        </p>
        <a href={`/projets/${project.id}`} className="text-green font-semibold text-sm flex items-center gap-1">
          Voir le projet <span>→</span>
        </a>
      </div>
    </article>
  );
}