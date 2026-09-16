import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { getFeaturedProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectsCatalogPage() {
  const projects = await getFeaturedProjects(100);

  return (
    <main className="bg-offwhite text-anthracite">
      <Header />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <h1 className="font-heading font-semibold text-[28px] mb-1">Nos projets</h1>
        <p className="text-gray-500 mb-10">
          Toutes les actions en cours, terminées ou à venir, financées grâce à votre soutien.
        </p>

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-gray-500 text-[15px]">Aucun projet publié pour le moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
