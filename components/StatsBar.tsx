import type { AppSettings, ImpactStats } from "@/lib/types";

function formatFcfa(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export default function StatsBar({
  appSettings,
  impactStats,
}: {
  appSettings: AppSettings;
  impactStats: ImpactStats;
}) {
  const percent = appSettings.annual_funding_goal
    ? Math.round(
        (appSettings.manual_total_collected / appSettings.annual_funding_goal) * 100
      )
    : 0;

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid lg:grid-cols-[1.3fr_1.4fr_0.9fr_0.9fr_1fr] gap-8 items-center">
          <div>
            <h2 className="font-heading font-semibold text-[22px]">
              Notre impact en chiffres
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Grâce à votre soutien, nous agissons sur le terrain.
            </p>
          </div>

          {/* Fonds collectés */}
          <div className="border-l border-gray-200 pl-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center shrink-0">
                <svg width="20" height="20" fill="none" stroke="#27AE60" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="8" cy="8" r="6" />
                  <circle cx="16" cy="16" r="6" fill="#F2C94C" stroke="none" opacity={0.25} />
                  <path d="M8 5v6M5 8h6" />
                </svg>
              </div>
              <div>
                <p className="font-heading font-semibold text-[22px] leading-none">
                  {formatFcfa(appSettings.manual_total_collected)}{" "}
                  <span className="text-[13px] font-medium text-gray-500">FCFA</span>
                </p>
                <p className="text-gray-500 text-[13px] mt-1">Collectés cette année</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green rounded-full" style={{ width: `${percent}%` }} />
            </div>
            <p className="text-[12px] text-gray-500 mt-1.5">
              <span className="font-semibold text-green">{percent}%</span> de
              l&apos;objectif ({formatFcfa(appSettings.annual_funding_goal)} FCFA)
            </p>
          </div>

          {/* Projets en cours */}
          <div className="border-l border-gray-200 pl-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ocre/20 flex items-center justify-center shrink-0">
              <svg width="18" height="18" fill="none" stroke="#B98900" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 8h6M9 12h6M9 16h4" />
              </svg>
            </div>
            <div>
              <p className="font-heading font-semibold text-[22px] leading-none">
                {impactStats.projectsInProgress}
              </p>
              <p className="text-gray-500 text-[13px] mt-1">
                Projets en cours
                <br />
                <span className="text-gray-400">
                  (sur {impactStats.projectsTotal} au total)
                </span>
              </p>
            </div>
          </div>

          {/* Projets terminés */}
          <div className="border-l border-gray-200 pl-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center shrink-0">
              <svg width="18" height="18" fill="none" stroke="#27AE60" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12l3 3 5-6" />
              </svg>
            </div>
            <div>
              <p className="font-heading font-semibold text-[22px] leading-none">
                {impactStats.projectsCompleted}
              </p>
              <p className="text-gray-500 text-[13px] mt-1">
                Projets terminés
                <br />
                <span className="text-gray-400">(depuis 2022)</span>
              </p>
            </div>
          </div>

          {/* Bénévoles actifs */}
          <div className="border-l border-gray-200 pl-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center shrink-0">
              <svg width="18" height="18" fill="none" stroke="#27AE60" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div>
              <p className="font-heading font-semibold text-[22px] leading-none">
                {impactStats.volunteersActive}
              </p>
              <p className="text-gray-500 text-[13px] mt-1">
                Bénévoles actifs
                <br />
                <span className="text-gray-400">(Mali &amp; international)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
