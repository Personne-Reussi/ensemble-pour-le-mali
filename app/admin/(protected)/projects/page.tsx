import Link from "next/link";
import { getAllProjects } from "@/lib/admin-data";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-ocre/20 text-[#8a6a00]" },
  active: { label: "En cours", className: "bg-green/10 text-green" },
  completed: { label: "Terminé", className: "bg-anthracite/10 text-anthracite" },
  archived: { label: "Archivé", className: "bg-gray-100 text-gray-500" },
};

function formatFcfa(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-semibold text-[26px] mb-1">Projets & dépenses</h1>
          <p className="text-gray-500 text-[14px]">
            {projects.length} projet{projects.length > 1 ? "s" : ""} au total.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-green text-white font-semibold text-[14px] px-5 py-2.5 rounded-full hover:bg-green-dark transition"
        >
          + Nouveau projet
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-[14px] mb-4">
              Aucun projet pour l&apos;instant. La home affiche les données
              de démonstration en attendant.
            </p>
            <Link
              href="/admin/projects/new"
              className="text-green font-semibold text-[14px]"
            >
              Créer ton premier projet →
            </Link>
          </div>
        ) : (
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-gray-400 text-[12px] border-b border-gray-100">
                <th className="font-medium px-5 py-3">Projet</th>
                <th className="font-medium px-5 py-3">Localisation</th>
                <th className="font-medium px-5 py-3">Statut</th>
                <th className="font-medium px-5 py-3">Avancement</th>
                <th className="font-medium px-5 py-3">Financement</th>
                <th className="font-medium px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const status = statusConfig[p.status];
                return (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3.5 font-medium">{p.title}</td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {p.location_name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{p.physical_progress}%</td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {formatFcfa(p.current_funding)} / {formatFcfa(p.budget_target)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="text-green font-semibold text-[13px]"
                      >
                        Gérer →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
