import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import ProjectsSection from "@/components/ProjectsSection";
import CtaSection from "@/components/CtaSection";
import MobileTabBar from "@/components/MobileTabBar";
import Footer from "@/components/Footer";

import {
  getFeaturedProjects,
  getAppSettings,
  getImpactStats,
  getLatestNews,
  getMapMarkers,
} from "@/lib/data";

// Récupère les données côté serveur à chaque requête. Passe en
// `export const revalidate = 60` (ISR) une fois en prod si tu préfères
// du contenu mis en cache plutôt que du 100% temps réel.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, appSettings, impactStats, news, mapMarkers] =
    await Promise.all([
      getFeaturedProjects(3),
      getAppSettings(),
      getImpactStats(),
      getLatestNews(4),
      getMapMarkers(),
    ]);

  return (
    <main className="bg-offwhite text-anthracite">
      <Header />
      <Hero />
      <StatsBar appSettings={appSettings} impactStats={impactStats} />
      <ProjectsSection projects={projects} mapMarkers={mapMarkers} news={news} />
      <CtaSection />
      <MobileTabBar />
      <Footer />
    </main>
  );
}
