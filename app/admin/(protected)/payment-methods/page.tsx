import { getAllPaymentMethods } from "@/lib/admin-data";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import {
  createPaymentMethodAction,
  togglePaymentMethodAction,
  deletePaymentMethodAction,
} from "@/app/admin/actions";

const providerLabels: Record<string, string> = {
  orange_money: "Orange Money",
  wave: "Wave",
  other: "Autre",
};

export default async function PaymentMethodsPage() {
  const methods = await getAllPaymentMethods();

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading font-semibold text-[26px] mb-1">Moyens de paiement</h1>
      <p className="text-gray-500 text-[14px] mb-8">
        Numéros affichés aux donateurs lorsqu&apos;ils font un don. Désactive un numéro
        au lieu de le supprimer si tu veux pouvoir le réactiver plus tard.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
        {methods.length === 0 ? (
          <p className="text-gray-500 text-[14px] p-6 text-center">
            Aucun moyen de paiement configuré — les donateurs ne verront rien à l&apos;étape
            de paiement tant que tu n&apos;en ajoutes pas un.
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {methods.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[14px] font-semibold">
                    {providerLabels[m.provider] ?? m.provider}
                    {m.label && <span className="text-gray-400 font-normal"> — {m.label}</span>}
                  </p>
                  <p className="text-[15px] font-mono">{m.phone_number}</p>
                  {m.account_name && <p className="text-[12px] text-gray-400">{m.account_name}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                      m.is_active ? "bg-green/10 text-green" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {m.is_active ? "Actif" : "Désactivé"}
                  </span>
                  <form action={togglePaymentMethodAction.bind(null, m.id, m.is_active)}>
                    <button className="text-gray-500 text-[13px] font-medium hover:text-green">
                      {m.is_active ? "Désactiver" : "Activer"}
                    </button>
                  </form>
                  <form action={deletePaymentMethodAction.bind(null, m.id)}>
                    <ConfirmSubmitButton
                      confirmMessage="Supprimer ce moyen de paiement ?"
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
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-heading font-semibold text-[16px] mb-4">Ajouter un numéro</h2>
        <form action={createPaymentMethodAction} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Fournisseur</label>
            <select name="provider" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]">
              <option value="orange_money">Orange Money</option>
              <option value="wave">Wave</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Numéro</label>
            <input name="phone_number" required className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]" placeholder="+223 70 00 00 00" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Étiquette (optionnel)</label>
            <input name="label" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]" placeholder="Compte principal" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Nom du titulaire (optionnel)</label>
            <input name="account_name" className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px]" placeholder="Ensemble pour le Mali" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="bg-green text-white font-semibold text-[14px] px-5 py-2.5 rounded-full hover:bg-green-dark transition">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}