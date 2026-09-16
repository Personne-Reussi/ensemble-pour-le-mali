"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  submitDonationPledge,
  confirmDonationPayment,
  getActivePaymentMethods,
} from "@/app/dons/actions";
import { paymentProviderLabels } from "@/lib/donations";
import type { PaymentMethod, DonationType } from "@/lib/types";

type Step = "form" | "payment";

export default function DonationModal({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [donorName, setDonorName] = useState("");
  const [donationType, setDonationType] = useState<DonationType>("monetary");
  const [amount, setAmount] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  const [trackingCode, setTrackingCode] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  function resetAndClose() {
    setOpen(false);
    setTimeout(() => {
      setStep("form");
      setError(null);
      setDonorName("");
      setDonationType("monetary");
      setAmount("");
      setItemDescription("");
      setTrackingCode("");
    }, 300);
  }

  async function handleSubmitPledge(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await submitDonationPledge({
      projectId,
      donorName,
      donationType,
      amount: amount ? Number(amount) : null,
      itemDescription: itemDescription || null,
    });

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setTrackingCode(result.trackingCode);
    const methods = await getActivePaymentMethods();
    setPaymentMethods(methods);
    setStep("payment");
    setLoading(false);
  }

  async function handleConfirmPayment() {
    setLoading(true);
    setError(null);
    const result = await confirmDonationPayment(trackingCode);

    if ("error" in result) {
      setLoading(false);
      setError(result.error);
      return;
    }

    // Direct vers la page de suivi avec le code déjà rempli — évite au
    // donateur de devoir copier/coller ou cliquer sur un lien.
    router.push(`/suivre-mon-don?code=${trackingCode}`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="block w-full text-center bg-green text-white font-semibold text-[14px] py-2.5 rounded-full hover:bg-green-dark transition"
      >
        Faire un don pour ce projet
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={resetAndClose} />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Fermer"
            >
              ✕
            </button>

            {step === "form" && (
              <form onSubmit={handleSubmitPledge}>
                <h3 className="font-heading font-semibold text-[18px] mb-1">Faire un don</h3>
                <p className="text-gray-500 text-[13px] mb-5">Pour : {projectTitle}</p>

                {error && (
                  <p className="bg-red-50 text-red-600 text-[13px] rounded-lg px-3 py-2 mb-4">
                    {error}
                  </p>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
                      Ton nom (optionnel)
                    </label>
                    <input
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                      placeholder="Anonyme"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-600 mb-2">
                      Type de don
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDonationType("monetary")}
                        className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold border-2 transition ${
                          donationType === "monetary"
                            ? "border-green bg-green/5 text-green"
                            : "border-gray-200 text-gray-500"
                        }`}
                      >
                        Argent
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationType("in_kind")}
                        className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold border-2 transition ${
                          donationType === "in_kind"
                            ? "border-green bg-green/5 text-green"
                            : "border-gray-200 text-gray-500"
                        }`}
                      >
                        Matériel
                      </button>
                    </div>
                  </div>

                  {donationType === "monetary" ? (
                    <div>
                      <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
                        Montant (FCFA)
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                        placeholder="10000"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
                        Que souhaites-tu donner ?
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                        placeholder="Ex. 10 sacs de ciment"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-green text-white font-semibold text-[14px] py-2.5 rounded-full hover:bg-green-dark transition disabled:opacity-60"
                >
                  {loading ? "Envoi..." : "Continuer"}
                </button>
              </form>
            )}

            {step === "payment" && (
              <div>
                <h3 className="font-heading font-semibold text-[18px] mb-1">
                  {donationType === "monetary" ? "Effectue le paiement" : "Merci pour ce don !"}
                </h3>
                <p className="text-gray-500 text-[13px] mb-4">
                  Ton code de suivi : <span className="font-mono font-semibold text-anthracite">{trackingCode}</span>
                  <br />
                  Note-le pour suivre le statut de ton don sur{" "}
                  <a href="/suivre-mon-don" className="text-green underline">
                    /suivre-mon-don
                  </a>
                  .
                </p>

                {donationType === "monetary" && (
                  <>
                    {paymentMethods.length === 0 ? (
                      <p className="text-gray-400 text-[13px] bg-gray-50 rounded-lg p-4 mb-4">
                        Aucun moyen de paiement n&apos;est configuré pour le moment. Contacte
                        l&apos;association directement.
                      </p>
                    ) : (
                      <div className="space-y-2 mb-5">
                        {paymentMethods.map((m) => (
                          <div key={m.id} className="border border-gray-100 rounded-lg p-3.5 flex items-center justify-between">
                            <div>
                              <p className="text-[13px] font-semibold">
                                {paymentProviderLabels[m.provider] ?? m.provider}
                                {m.label && <span className="text-gray-400 font-normal"> — {m.label}</span>}
                              </p>
                              <p className="text-[15px] font-mono">{m.phone_number}</p>
                              {m.account_name && (
                                <p className="text-[12px] text-gray-400">{m.account_name}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {error && (
                  <p className="bg-red-50 text-red-600 text-[13px] rounded-lg px-3 py-2 mb-4">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="w-full bg-green text-white font-semibold text-[14px] py-2.5 rounded-full hover:bg-green-dark transition disabled:opacity-60"
                >
                  {loading
                    ? "..."
                    : donationType === "monetary"
                    ? "J'ai payé, valider mon don"
                    : "Confirmer mon don"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}