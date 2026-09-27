import { getAllExpenses, getAllProjects } from "@/lib/admin-data";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { createExpenseGlobalAction, deleteExpenseGlobalAction } from "@/app/admin/actions";

function formatFcfa(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export default async function ExpensesPage() {
  const [expenses, projects] = await Promise.all([getAllExpenses(), getAllProjects()]);
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div>
      <h1 className="font-heading font-semibold text-[26px] mb-1">Dépenses</h1>
      <p className="text-gray-500 text-[14px] mb-8">
        {expenses.length} dépense{expenses.length > 1 ? "s" : ""} enregistrée
        {expenses.length > 1 ? "s" : ""}, {formatFcfa(total)} au total, tous projets confondus.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-[14px] p-6 text-center">
            Aucune dépense pour l&apos;instant.
          </p>
        ) : (
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-gray-400 text-[12px] border-b border-gray-100">
                <th className="font-medium px-5 py-3">Projet</th>
                <th className="font-medium px-5 py-3">Description</th>
                <th className="font-medium px-5 py-3">Montant</th>
                <th className="font-medium px-5 py-3">Date</th>
                <th className="font-medium px-5 py-3">Justificatif</th>
                <th className="font-medium px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5 font-medium">{e.project_title ?? "—"}</td>
                  <td className="px-5 py-3.5 text-gray-600">{e.description}</td>
                  <td className="px-5 py-3.5 font-semibold">{formatFcfa(Number(e.amount))}</td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {new Intl.DateTimeFormat("fr-FR").format(new Date(e.expense_date))}
                  </td>
                  <td className="px-5 py-3.5">
                    {e.document_url ? (
                      <a
                        href={e.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green font-semibold underline"
                      >
                        Voir
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <form action={deleteExpenseGlobalAction.bind(null, e.id)}>
                      <ConfirmSubmitButton
                        confirmMessage="Supprimer cette dépense ?"
                        className="text-gray-400 hover:text-red-600 text-[13px]"
                      >
                        Supprimer
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-xl">
        <h2 className="font-heading font-semibold text-[16px] mb-4">Ajouter une dépense</h2>
        <form action={createExpenseGlobalAction} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Projet</label>
            <select
              name="project_id"
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]"
            >
              <option value="">Sélectionner un projet</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Description
            </label>
            <input
              name="description"
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]"
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
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Date</label>
            <input
              type="date"
              name="expense_date"
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Justificatif (URL, optionnel)
            </label>
            <input
              name="document_url"
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]"
              placeholder="https://..."
            />
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