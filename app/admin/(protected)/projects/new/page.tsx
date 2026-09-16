import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";
import { createProjectAction } from "@/app/admin/actions";

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/projects" className="text-gray-500 text-[13px] mb-4 inline-block hover:text-green">
        ← Retour aux projets
      </Link>
      <h1 className="font-heading font-semibold text-[26px] mb-6">Nouveau projet</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ProjectForm action={createProjectAction} />
      </div>
    </div>
  );
}
