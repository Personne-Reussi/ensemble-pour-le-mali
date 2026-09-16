"use server";

import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/admin";
import { supabase as publicSupabase } from "@/lib/supabase/public";
import { generateTrackingCode } from "@/lib/donations";
import type { Donation, PaymentMethod, DonationType } from "@/lib/types";

export interface SubmitDonationInput {
  projectId: string | null;
  donorName: string;
  donationType: DonationType;
  amount: number | null;
  itemDescription: string | null;
}

export async function submitDonationPledge(
  input: SubmitDonationInput
): Promise<{ trackingCode: string } | { error: string }> {
  if (!isServiceRoleConfigured()) {
    return { error: "Le suivi des dons n'est pas encore configuré (clé service_role manquante)." };
  }

  if (input.donationType === "monetary" && (!input.amount || input.amount <= 0)) {
    return { error: "Merci d'indiquer un montant." };
  }
  if (input.donationType === "in_kind" && !input.itemDescription?.trim()) {
    return { error: "Merci de décrire ce que tu souhaites donner." };
  }

  const supabase = createServiceRoleClient();

  // Génère un code de suivi unique, avec quelques tentatives en cas de
  // collision improbable (6 caractères sur 32 valeurs ~ 1 milliard de
  // combinaisons, mais on reste prudent).
  for (let attempt = 0; attempt < 5; attempt++) {
    const trackingCode = generateTrackingCode();

    const { error } = await supabase.from("donations").insert({
      donor_name: input.donorName.trim() || "Anonyme",
      donation_type: input.donationType,
      amount: input.donationType === "monetary" ? input.amount : null,
      item_description: input.donationType === "in_kind" ? input.itemDescription?.trim() : null,
      project_id: input.projectId,
      status: "pending",
      tracking_code: trackingCode,
    });

    if (!error) {
      return { trackingCode };
    }

    // Code déjà pris (contrainte unique) : on retente avec un nouveau.
    if (!error.message.includes("tracking_code")) {
      return { error: "Impossible d'enregistrer le don. Réessaie dans un instant." };
    }
  }

  return { error: "Impossible de générer un code de suivi. Réessaie dans un instant." };
}

export async function confirmDonationPayment(
  trackingCode: string
): Promise<{ success: true } | { error: string }> {
  if (!isServiceRoleConfigured()) {
    return { error: "Le suivi des dons n'est pas encore configuré." };
  }

  const supabase = createServiceRoleClient();

  const { data, error: fetchError } = await supabase
    .from("donations")
    .select("id, status")
    .eq("tracking_code", trackingCode.trim().toUpperCase())
    .single();

  if (fetchError || !data) {
    return { error: "Code de suivi introuvable." };
  }

  if (data.status !== "pending") {
    return { error: "Ce don a déjà été traité." };
  }

  const { error } = await supabase
    .from("donations")
    .update({ status: "awaiting_confirmation" })
    .eq("id", data.id);

  if (error) {
    return { error: "Impossible de mettre à jour le don. Réessaie." };
  }

  return { success: true };
}

export async function lookupDonationByCode(
  trackingCode: string
): Promise<Donation | null> {
  if (!isServiceRoleConfigured()) return null;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("tracking_code", trackingCode.trim().toUpperCase())
    .single();

  if (error || !data) return null;
  return data as Donation;
}

// Lecture publique des moyens de paiement actifs — passe par le client
// anonyme classique (policy RLS dédiée), pas besoin de service_role ici.
export async function getActivePaymentMethods(): Promise<PaymentMethod[]> {
  if (!publicSupabase) return [];

  const { data, error } = await publicSupabase
    .from("payment_methods")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data as PaymentMethod[];
}
