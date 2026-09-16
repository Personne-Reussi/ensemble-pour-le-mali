"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { ProjectStatusBreakdown, MonthlyExpenseTotal } from "@/lib/admin-data";

const STATUS_COLORS: Record<string, string> = {
  "En cours": "#27AE60",
  "En attente": "#F2C94C",
  Terminé: "#333333",
  Archivé: "#9CA3AF",
};

function formatFcfaShort(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
}

export default function DashboardCharts({
  statusBreakdown,
  expensesOverTime,
}: {
  statusBreakdown: ProjectStatusBreakdown[];
  expensesOverTime: MonthlyExpenseTotal[];
}) {
  return (
    <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-heading font-semibold text-[16px] mb-4">
          Évolution des dépenses
        </h3>
        {expensesOverTime.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400 text-[13px] text-center px-6">
            Le graphique apparaîtra dès que des dépenses seront enregistrées
            sur au moins deux mois différents.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={expensesOverTime} margin={{ left: -20, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#27AE60" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#27AE60" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f1f1f1" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatFcfaShort}
              />
              <Tooltip
                formatter={(value: number) => [`${new Intl.NumberFormat("fr-FR").format(value)} FCFA`, "Cumulé"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#27AE60"
                strokeWidth={2}
                fill="url(#expensesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-heading font-semibold text-[16px] mb-4">
          Répartition des projets par statut
        </h3>
        {statusBreakdown.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400 text-[13px] text-center px-6">
            Aucun projet pour l&apos;instant.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="count"
                nameKey="label"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {statusBreakdown.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.label] ?? "#9CA3AF"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} projet${value > 1 ? "s" : ""}`, name]}
                contentStyle={{ borderRadius: 12, border: "1px solid #f0f0f0", fontSize: 13 }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: "#6b7280" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
