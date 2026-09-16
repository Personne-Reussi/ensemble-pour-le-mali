import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, getExpensesByProject } from "@/lib/admin-data";
import ProjectForm from "@/components/admin/ProjectForm";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import {
  updateProjectAction,
  deleteProjectAction,
  createExpenseAction,
  deleteExpenseAction,
} from "@/app/admin/actions";

function formatFcfa(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, expenses] = await Promise.all([
    getProjectById(params.id),
    getExpensesByProject(params.id),
  ]);

  if (!project) {
    notFound();
  }

  const boundUpdate = updateProjectAction.bind(null, project.id);
  const boundDeleteProject = deleteProjectAction.bind(null, project.id);
  const boundCreateExpense = createExpenseAction.bind(null, project.id);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/projects" className="text-gray-500 text-[13px] mb-4 inline-block hover:text-green">
        ← Retour aux projets
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-semibold text-[26px]">{project.title}</h1>
        <form action={boundDeleteProject}>
          <ConfirmSubmitButton
            confirmMessage={`Supprimer définitivement "${project.title}" et toutes ses dépenses associées ?`}
            className="text-red-500 text-[13px] font-semibold hover:text-red-700"
          >
            Supprimer le projet
          </ConfirmSubmitButton>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="font-heading font-semibold text-[16px] mb-5">Informations du projet</h2>
        <ProjectForm action={boundUpdate} project={project} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-semibold text-[16px]">
            Dépenses <span className="text-gray-400 font-normal">({formatFcfa(totalExpenses)} au total)</span>
          </h2>
        </div>

        {expenses.length > 0 && (
          <div className="mb-6 divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden">
            {expenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-4 py-3">
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
                <div className="flex items-center gap-4">
                  <p className="text-[14px] font-semibold">{formatFcfa(Number(e.amount))}</p>
                  <form action={deleteExpenseAction.bind(null, e.id, project.id)}>
                    <ConfirmSubmitButton
                      confirmMessage="Supprimer cette dépense ?"
                      className="text-gray-400 hover:text-red-600 text-[13px]"
                    >
                      Supprimer
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        <form action={boundCreateExpense} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Description
            </label>
            <input
              name="description"
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              placeholder="Achat de ciment"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Montant (FCFA)
            </label>
            <input
              type="number"
              name="amount"
              min={0}
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Date
            </label>
            <input
              type="date"
              name="expense_date"
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Justificatif (URL du document)
            </label>
            <input
              name="document_url"
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              placeholder="https://..."
            />
            <p className="text-[12px] text-gray-400 mt-1">
              L&apos;upload direct de fichiers (Supabase Storage) arrive dans une
              prochaine itération — pour l&apos;instant, colle un lien.
            </p>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-green text-white font-semibold text-[14px] px-5 py-2.5 rounded-full hover:bg-green-dark transition"
            >
              Ajouter la dépense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
