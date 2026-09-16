"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { geocodeLocation } from "@/lib/geocoding";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function parseProjectForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    budget_target: Number(formData.get("budget_target") ?? 0),
    // current_funding n'est plus saisi ici : il est recalculé
    // automatiquement par un trigger Postgres à partir des dons validés
    // (voir supabase/migrations/004_donations_workflow.sql). L'inclure
    // ici l'écraserait à 0 à chaque sauvegarde du formulaire.
    physical_progress: Number(formData.get("physical_progress") ?? 0),
    status: String(formData.get("status") ?? "pending"),
    location_name: String(formData.get("location_name") ?? "").trim() || null,
    region: String(formData.get("region") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
    featured_image_url: String(formData.get("featured_image_url") ?? "").trim() || null,
    panorama_image_url: String(formData.get("panorama_image_url") ?? "").trim() || null,
    start_date: String(formData.get("start_date") ?? "") || null,
    end_date: String(formData.get("end_date") ?? "") || null,
  };
}

// On ne géocode PAS automatiquement si l'admin a explicitement rempli les
// champs de coordonnées manuelles à cette soumission précise (le
// formulaire ne pré-remplit plus ces champs avec les anciennes valeurs
// enregistrées, donc une valeur présente ici signifie un choix actif).
// Dans tous les autres cas, on recalcule à partir de l'adresse/ville/
// région actuelle — y compris à la modification — pour que la carte se
// mette bien à jour dès qu'on change la localisation d'un projet.
async function withResolvedCoordinates(
  values: ReturnType<typeof parseProjectForm>
): Promise<ReturnType<typeof parseProjectForm>> {
  if (values.latitude != null || values.longitude != null) {
    return values;
  }

  const coords = await geocodeLocation({
    address: values.address,
    city: values.location_name,
    region: values.region,
  });
  if (!coords) {
    return values;
  }

  return { ...values, latitude: coords.latitude, longitude: coords.longitude };
}

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient();
  const values = await withResolvedCoordinates(parseProjectForm(formData));

  const { error } = await supabase.from("projects").insert(values);

  if (error) {
    throw new Error(`Impossible de créer le projet : ${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const values = await withResolvedCoordinates(parseProjectForm(formData));

  const { error } = await supabase.from("projects").update(values).eq("id", id);

  if (error) {
    throw new Error(`Impossible de mettre à jour le projet : ${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(`Impossible de supprimer le projet : ${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function createExpenseAction(projectId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("expenses").insert({
    project_id: projectId,
    amount: Number(formData.get("amount") ?? 0),
    description: String(formData.get("description") ?? "").trim(),
    document_url: String(formData.get("document_url") ?? "").trim() || null,
    expense_date: String(formData.get("expense_date") ?? ""),
  });

  if (error) {
    throw new Error(`Impossible d'ajouter la dépense : ${error.message}`);
  }

  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}`);
}

export async function deleteExpenseAction(id: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) {
    throw new Error(`Impossible de supprimer la dépense : ${error.message}`);
  }

  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}`);
}

// ------------------------------------------------------------
// Dons
// ------------------------------------------------------------

export async function validateDonationAction(id: string, projectId: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("donations")
    .update({ status: "validated" })
    .eq("id", id);

  if (error) {
    throw new Error(`Impossible de valider le don : ${error.message}`);
  }

  revalidatePath("/admin/donations");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/projets");
  if (projectId) revalidatePath(`/projets/${projectId}`);
  redirect("/admin/donations");
}

export async function rejectDonationAction(id: string, projectId: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("donations")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    throw new Error(`Impossible de rejeter le don : ${error.message}`);
  }

  revalidatePath("/admin/donations");
  if (projectId) revalidatePath(`/projets/${projectId}`);
  redirect("/admin/donations");
}

// Ajout manuel (ex. don en espèces remis en main propre) — compte
// directement comme validé, pas de workflow de confirmation nécessaire.
export async function createManualDonationAction(formData: FormData) {
  const supabase = await createClient();

  const donationType = String(formData.get("donation_type") ?? "monetary");
  const projectId = String(formData.get("project_id") ?? "").trim() || null;

  const { error } = await supabase.from("donations").insert({
    donor_name: String(formData.get("donor_name") ?? "").trim() || "Anonyme",
    donation_type: donationType,
    amount: donationType === "monetary" ? Number(formData.get("amount") ?? 0) : null,
    item_description:
      donationType === "in_kind" ? String(formData.get("item_description") ?? "").trim() : null,
    payment_method: String(formData.get("payment_method") ?? "").trim() || null,
    project_id: projectId,
    status: "validated",
    tracking_code: `MANUEL-${Date.now().toString(36).toUpperCase()}`,
  });

  if (error) {
    throw new Error(`Impossible d'ajouter le don : ${error.message}`);
  }

  revalidatePath("/admin/donations");
  revalidatePath("/");
  revalidatePath("/projets");
  if (projectId) revalidatePath(`/projets/${projectId}`);
  redirect("/admin/donations");
}

// ------------------------------------------------------------
// Moyens de paiement
// ------------------------------------------------------------

export async function createPaymentMethodAction(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("payment_methods").insert({
    provider: String(formData.get("provider") ?? "orange_money"),
    label: String(formData.get("label") ?? "").trim() || null,
    phone_number: String(formData.get("phone_number") ?? "").trim(),
    account_name: String(formData.get("account_name") ?? "").trim() || null,
    is_active: true,
  });

  if (error) {
    throw new Error(`Impossible d'ajouter le moyen de paiement : ${error.message}`);
  }

  revalidatePath("/admin/payment-methods");
  redirect("/admin/payment-methods");
}

export async function togglePaymentMethodAction(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("payment_methods")
    .update({ is_active: !isActive })
    .eq("id", id);

  if (error) {
    throw new Error(`Impossible de mettre à jour : ${error.message}`);
  }

  revalidatePath("/admin/payment-methods");
  redirect("/admin/payment-methods");
}

export async function deletePaymentMethodAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("payment_methods").delete().eq("id", id);

  if (error) {
    throw new Error(`Impossible de supprimer : ${error.message}`);
  }

  revalidatePath("/admin/payment-methods");
  redirect("/admin/payment-methods");
}