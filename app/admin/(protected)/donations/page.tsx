import { getDonations, getAllProjects } from "@/lib/admin-data";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import {
  validateDonationAction,
  rejectDonationAction,
  createManualDonationAction,
} from "@/app/admin/actions";

function formatFcfa(value: number | null) {
  if (value == null) return "—";
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

const statusBadge: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente de paiement", className: "bg-gray-100 text-gray-500" },
  awaiting_confirmation: { label: "À confirmer", className: "bg-ocre/20 text-[#8a6a00]" },
  validated: { label: "Validé", className: "bg-green/10 text-green" },
  rejected: { label: "Rejeté", className: "bg-red-50 text-red-500" },
};

export default async function DonationsPage() {
  const [donations, projects] = await Promise.all([getDonations(), getAllProjects()]);

  const awaitingCount = donations.filter((d) => d.status === "awaiting_confirmation").length;

  return (
    <div>
      <h1 className="font-heading font-semibold text-[26px] mb-1">Dons</h1>
      <p className="text-gray-500 text-[14px] mb-8">
        {awaitingCount > 0
          ? `${awaitingCount} don${awaitingCount > 1 ? "s" : ""} en attente de ta confirmation.`
          : "Aucun don en attente de confirmation."}
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
        {donations.length === 0 ? (
          <p className="text-gray-500 text-[14px] p-6 text-center">Aucun don pour l&apos;instant.</p>
        ) : (
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-gray-400 text-[12px] border-b border-gray-100">
                <th className="font-medium px-5 py-3">Donateur</th>
                <th className="font-medium px-5 py-3">Projet</th>
                <th className="font-medium px-5 py-3">Type</th>
                <th className="font-medium px-5 py-3">Montant</th>
                <th className="font-medium px-5 py-3">Justificatif</th>
                <th className="font-medium px-5 py-3">Statut</th>
                <th className="font-medium px-5 py-3">Code</th>
                <th className="font-medium px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => {
                const status = statusBadge[d.status] ?? statusBadge.pending;
                return (
                  <tr key={d.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3.5 font-medium">{d.donor_name}</td>
                    <td className="px-5 py-3.5 text-gray-500">{d.project_title ?? "Général"}</td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {d.donation_type === "monetary" ? "Argent" : "Matériel"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {d.donation_type === "monetary" ? formatFcfa(d.amount) : d.item_description}
                    </td>
                    <td className="px-5 py-3.5">
                      {d.proof_url ? (
                        <a
                          href={d.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green font-semibold text-[13px] underline"
                        >
                          Voir
                        </a>
                      ) : (
                        <span className="text-gray-300 text-[13px]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-[12px]">{d.tracking_code}</td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {d.status === "awaiting_confirmation" && (
                        <div className="flex gap-2 justify-end">
                          <form action={validateDonationAction.bind(null, d.id, d.project_id)}>
                            <button className="text-green font-semibold text-[13px]">Valider</button>
                          </form>
                          <form action={rejectDonationAction.bind(null, d.id, d.project_id)}>
                            <ConfirmSubmitButton
                              confirmMessage="Rejeter ce don ?"
                              className="text-red-500 font-semibold text-[13px]"
                            >
                              Rejeter
                            </ConfirmSubmitButton>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-xl">
        <h2 className="font-heading font-semibold text-[16px] mb-4">
          Ajouter un don manuellement
        </h2>
        <p className="text-gray-400 text-[12px] mb-4">
          Pour un don en espèces reçu directement (pas besoin de workflow de confirmation —
          il est enregistré comme validé immédiatement).
        </p>
        <form action={createManualDonationAction} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Donateur</label>
            <input name="donor_name" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]" placeholder="Anonyme" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Projet</label>
            <select name="project_id" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]">
              <option value="">Général (aucun projet)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Type</label>
            <select name="donation_type" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]">
              <option value="monetary">Argent</option>
              <option value="in_kind">Matériel</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Montant (FCFA)</label>
            <input type="number" name="amount" min={0} className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Description (si don en matériel)
            </label>
            <input name="item_description" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]" placeholder="10 sacs de ciment" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="bg-green text-white font-semibold text-[14px] px-5 py-2.5 rounded-full hover:bg-green-dark transition">
              Ajouter le don
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}