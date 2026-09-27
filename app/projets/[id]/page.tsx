import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import MobileProjectTopBar from "@/components/MobileProjectTopBar";
import PanoramaViewer from "@/components/PanoramaViewer";
import DonationModal from "@/components/DonationModal";
import ProjectsMap from "@/components/ProjectsMap";
import { getProjectById, getExpensesForProject } from "@/lib/data";
import { formatProjectLocation, formatTimeRemaining, formatDateFr } from "@/lib/format";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=1200&auto=format&fit=crop";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-ocre text-anthracite" },
  active: { label: "En cours", className: "bg-green text-white" },
  completed: { label: "Terminé", className: "bg-anthracite/80 text-white" },
  archived: { label: "Archivé", className: "bg-gray-400 text-white" },
};

function formatFcfa(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const expenses = await getExpensesForProject(params.id);
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const fundingPercent = project.budget_target
    ? Math.min(100, Math.round((project.current_funding / project.budget_target) * 100))
    : 0;
  const spentPercent = project.budget_target
    ? Math.min(100, Math.round((totalSpent / project.budget_target) * 100))
    : 0;

  const status = statusConfig[project.status] ?? statusConfig.pending;
  const timeRemaining = project.status === "active" ? formatTimeRemaining(project.end_date) : null;
  const location = formatProjectLocation(project);
  const startLabel = formatDateFr(project.start_date);
  const endLabel = formatDateFr(project.end_date);

  return (
    <main className="bg-offwhite text-anthracite">
      <Header />

      {/* Barre mobile Retour/Partager — remplace le fil d'ariane sur petit écran */}
      <MobileProjectTopBar title={project.title} />

      {/* Fil d'ariane, desktop uniquement */}
      <div className="hidden lg:flex max-w-6xl mx-auto px-6 pt-5 text-[13px] text-gray-400 items-center gap-1.5">
        <Link href="/" className="hover:text-green">Accueil</Link>
        <span>›</span>
        <Link href="/#projets" className="hover:text-green">Projets</Link>
        <span>›</span>
        <span className="text-gray-600">{project.title}</span>
      </div>

      {/* Hero */}
      <div className="relative h-72 sm:h-80 mt-1 lg:mt-4 max-w-6xl mx-auto lg:rounded-3xl overflow-hidden px-0 sm:px-6 lg:px-0">
        <div className="relative h-full sm:rounded-3xl overflow-hidden">
          <Image
            src={project.featured_image_url ?? FALLBACK_IMAGE}
            alt={project.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-0 px-5 sm:px-10 flex flex-col justify-end pb-6 sm:pb-8">
            <span className={`w-fit text-[12px] font-semibold px-3 py-1 rounded-full mb-3 ${status.className}`}>
              {status.label}
            </span>
            <h1 className="font-heading font-extrabold text-white text-[24px] sm:text-[36px] leading-tight mb-2 sm:mb-1 max-w-2xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-white/85 text-[13px]">
              {location && (
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {location}
                  {project.address && <span className="text-white/60 hidden sm:inline"> · {project.address}</span>}
                </span>
              )}
              {startLabel && (
                <span className="hidden sm:flex items-center gap-1.5">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  Début : {startLabel}
                </span>
              )}
              {endLabel && (
                <span className="hidden sm:flex items-center gap-1.5">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                  Fin prévue : {endLabel}
                </span>
              )}
            </div>
          </div>

          {project.panorama_image_url && (
            <a
              href="#visite-360"
              className="absolute bottom-6 right-5 sm:right-10 bg-white/95 hover:bg-white text-anthracite text-[12px] sm:text-[13px] font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-2 shadow-lg transition"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z" />
              </svg>
              Voir en 360°
            </a>
          )}
        </div>
      </div>

      {/* Bandeau stats — 2x2 sur mobile, 4 en ligne à partir de lg */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-5 sm:mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <p className="text-gray-500 text-[11px] sm:text-[12px] mb-1 sm:mb-1.5">Budget total</p>
            <p className="font-heading font-semibold text-[16px] sm:text-[19px]">{formatFcfa(project.budget_target)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <p className="text-gray-500 text-[11px] sm:text-[12px] mb-1 sm:mb-1.5">Fonds collectés</p>
            <p className="font-heading font-semibold text-[16px] sm:text-[19px] mb-2">{formatFcfa(project.current_funding)}</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green rounded-full" style={{ width: `${fundingPercent}%` }} />
            </div>
            <p className="text-[11px] text-green font-semibold mt-1">{fundingPercent}%</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <p className="text-gray-500 text-[11px] sm:text-[12px] mb-1 sm:mb-1.5">Dépenses réalisées</p>
            <p className="font-heading font-semibold text-[16px] sm:text-[19px] mb-2">{formatFcfa(totalSpent)}</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-anthracite rounded-full" style={{ width: `${spentPercent}%` }} />
            </div>
            <p className="text-[11px] text-gray-500 font-semibold mt-1">{spentPercent}%</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <p className="text-gray-500 text-[11px] sm:text-[12px] mb-1 sm:mb-1.5">Avancement physique</p>
            <p className="font-heading font-semibold text-[16px] sm:text-[19px] mb-2">{project.physical_progress}%</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-ocre rounded-full" style={{ width: `${project.physical_progress}%` }} />
            </div>
            {timeRemaining && <p className="text-[11px] text-gray-400 mt-1">{timeRemaining}</p>}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid lg:grid-cols-[1.6fr_1fr] gap-8">
        <div className="space-y-8 sm:space-y-10 min-w-0">
          {project.panorama_image_url && (
            <div id="visite-360" className="scroll-mt-24">
              <h2 className="font-heading font-semibold text-[17px] sm:text-[19px] mb-1">
                Visite virtuelle à 360°
              </h2>
              <p className="text-gray-400 text-[13px] mb-4">
                Découvrez le site du projet comme si vous y étiez.
              </p>
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#1a1a1a]">
                <PanoramaViewer imageUrl={project.panorama_image_url} caption={project.title} />
              </div>
            </div>
          )}

          <div>
            <h2 className="font-heading font-semibold text-[17px] sm:text-[19px] mb-3">
              À propos du projet
            </h2>
            <p className="text-gray-600 leading-relaxed text-[14px] sm:text-[15px]">
              {project.description ?? "Aucune description disponible pour le moment."}
            </p>
          </div>

          {/* Galerie avant/pendant/après, historique, indicateurs d'impact :
              à venir une fois la gestion admin de project_images /
              project_updates / project_impacts construite. */}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-[17px] sm:text-[19px]">Dépenses</h2>
              <span className="text-gray-400 text-[12px]">{formatFcfa(totalSpent)}</span>
            </div>
            {expenses.length === 0 ? (
              <p className="text-gray-400 text-[13px] bg-white border border-dashed border-gray-200 rounded-xl p-6 text-center">
                Aucune dépense publiée pour ce projet pour l&apos;instant.
              </p>
            ) : (
              <div className="divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden bg-white">
                {expenses.map((e) => (
                  <div key={e.id} className="flex items-center justify-between px-4 py-3.5">
                    <div>
                      <p className="text-[14px] font-medium">{e.description}</p>
                      <p className="text-[12px] text-gray-400">
                        {new Intl.DateTimeFormat("fr-FR").format(new Date(e.expense_date))}
                        {e.document_url && (
                          <>
                            {" · "}
                            <a href={e.document_url} target="_blank" className="text-green underline">
                              justificatif
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                    <p className="text-[14px] font-semibold shrink-0">
                      {formatFcfa(Number(e.amount))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5 h-fit lg:sticky lg:top-24 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
            <div className="w-11 h-11 rounded-full bg-green/10 text-green flex items-center justify-center mb-3">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.6 6.3 4.9 5c2-.8 4 0 5.1 1.7C11.1 5 13.1 4.2 15.1 5c3.3 1.3 4.1 5.1 2.2 7.9C14.7 16.65 12 21 12 21z" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-[15px] sm:text-[16px] mb-1">Soutenez ce projet</h3>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
              Votre don permet de financer directement l&apos;avancement de ce projet.
            </p>
            <DonationModal projectId={project.id} projectTitle={project.title} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
            <div className="w-11 h-11 rounded-full bg-ocre/20 text-[#8a6a00] flex items-center justify-center mb-3">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-[15px] sm:text-[16px] mb-1">Devenir bénévole</h3>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
              Apporte tes compétences ou ton temps pour faire avancer ce projet sur le terrain.
            </p>
            <a
              href="/#benevole"
              className="block text-center border-2 border-anthracite text-anthracite font-semibold text-[14px] py-2.5 rounded-full hover:bg-anthracite hover:text-white transition"
            >
              Rejoindre
            </a>
          </div>

          {/* Sur mobile, la localisation/période sont déjà visibles dans
              le bandeau du hero — pas besoin de les répéter ici. */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-heading font-semibold text-[15px] mb-4">Ce projet en un coup d&apos;œil</h3>
            <div className="space-y-4 text-[13px]">
              {location && (
                <div className="flex items-start gap-3">
                  <svg width="16" height="16" className="text-green mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-[11px]">Localisation</p>
                    <p className="font-medium">{location}</p>
                    {project.address && <p className="text-gray-400 text-[12px]">{project.address}</p>}
                  </div>
                </div>
              )}
              {(startLabel || endLabel) && (
                <div className="flex items-start gap-3">
                  <svg width="16" height="16" className="text-green mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-[11px]">Période</p>
                    <p className="font-medium">
                      {startLabel ?? "—"} {endLabel ? `→ ${endLabel}` : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mini-carte : desktop uniquement, pour garder le flux mobile
              court et éviter de réintroduire les soucis de z-index sur un
              petit écran où elle apporte peu (le hero affiche déjà la
              localisation). */}
          {project.latitude != null && project.longitude != null && (
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-4">
              <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                <ProjectsMap
                  markers={[
                    {
                      id: project.id,
                      name: project.title,
                      status: project.status as "pending" | "active" | "completed" | "archived",
                      latitude: project.latitude,
                      longitude: project.longitude,
                    },
                  ]}
                />
              </div>
              <a href="/#projets" className="text-green font-semibold text-[13px] flex items-center gap-1">
                Voir sur la carte générale <span>→</span>
              </a>
            </div>
          )}
        </aside>
      </section>

      <MobileTabBar />
      <Footer />
    </main>
  );
}