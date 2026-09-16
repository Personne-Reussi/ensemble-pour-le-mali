import Link from "next/link";
import { Coins, Wallet, FolderKanban, Users } from "lucide-react";
import {
  getDashboardStats,
  getAllProjects,
  getProjectStatusBreakdown,
  getExpensesOverTime,
} from "@/lib/admin-data";
import DashboardCharts from "@/components/admin/DashboardCharts";

function formatFcfa(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

const statusLabel: Record<string, string> = {
  pending: "En attente",
  active: "En cours",
  completed: "Terminé",
  archived: "Archivé",
};

const statusBadge: Record<string, string> = {
  pending: "bg-ocre/20 text-[#8a6a00]",
  active: "bg-green/10 text-green",
  completed: "bg-anthracite/10 text-anthracite",
  archived: "bg-gray-100 text-gray-500",
};

export default async function DashboardPage() {
  const [stats, projects, statusBreakdown, expensesOverTime] = await Promise.all([
    getDashboardStats(),
    getAllProjects(),
    getProjectStatusBreakdown(),
    getExpensesOverTime(),
  ]);

  const recentProjects = projects.slice(0, 5);
  const fundsPercent = stats.annualFundingGoal
    ? Math.min(100, Math.round((stats.fundsCollected / stats.annualFundingGoal) * 100))
    : 0;

  return (
    <div>
      <h1 className="font-heading font-semibold text-[26px] mb-1">Bonjour 👋</h1>
      <p className="text-gray-500 text-[14px] mb-8">
        Voici un aperçu de l&apos;activité de votre organisation.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green/10 text-green flex items-center justify-center">
              <Coins size={19} />
            </div>
            <p className="text-gray-500 text-[13px]">Fonds collectés</p>
          </div>
          <p className="font-heading font-semibold text-[22px] mb-2">
            {formatFcfa(stats.fundsCollected)}
          </p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green rounded-full" style={{ width: `${fundsPercent}%` }} />
          </div>
          <p className="text-[12px] text-gray-400 mt-2">
            {stats.annualFundingGoal
              ? `${fundsPercent}% de l'objectif (${formatFcfa(stats.annualFundingGoal)})`
              : "Objectif annuel non défini"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Wallet size={19} />
            </div>
            <p className="text-gray-500 text-[13px]">Dépenses totales</p>
          </div>
          <p className="font-heading font-semibold text-[22px]">
            {formatFcfa(stats.totalExpenses)}
          </p>
          <p className="text-[12px] text-gray-400 mt-2">
            {stats.fundsCollected
              ? `${Math.round((stats.totalExpenses / stats.fundsCollected) * 100)}% des fonds collectés`
              : "—"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-ocre/20 text-[#8a6a00] flex items-center justify-center">
              <FolderKanban size={19} />
            </div>
            <p className="text-gray-500 text-[13px]">Projets en cours</p>
          </div>
          <p className="font-heading font-semibold text-[22px]">{stats.activeProjectsCount}</p>
          <p className="text-[12px] text-gray-400 mt-2">{stats.projectsCount} projets au total</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
              <Users size={19} />
            </div>
            <p className="text-gray-500 text-[13px]">Bénévoles</p>
          </div>
          <p className="font-heading font-semibold text-[22px]">{stats.volunteersCount}</p>
        </div>
      </div>

      <DashboardCharts statusBreakdown={statusBreakdown} expensesOverTime={expensesOverTime} />

      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="font-heading font-semibold text-[18px]">Projets récents</h2>
        <Link href="/admin/projects" className="text-green font-semibold text-[13px]">
          Voir tous les projets →
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {recentProjects.length === 0 ? (
          <p className="text-gray-500 text-[14px] p-6 text-center">
            Aucun projet pour l&apos;instant.{" "}
            <Link href="/admin/projects/new" className="text-green font-semibold">
              Crée le premier
            </Link>
            .
          </p>
        ) : (
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-gray-400 text-[12px] border-b border-gray-100">
                <th className="font-medium px-5 py-3">Projet</th>
                <th className="font-medium px-5 py-3">Statut</th>
                <th className="font-medium px-5 py-3">Avancement</th>
                <th className="font-medium px-5 py-3">Financement</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <Link href={`/admin/projects/${p.id}`} className="font-medium hover:text-green">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${statusBadge[p.status]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.physical_progress}%</td>
                  <td className="px-5 py-3 text-gray-500">
                    {formatFcfa(p.current_funding)} / {formatFcfa(p.budget_target)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
