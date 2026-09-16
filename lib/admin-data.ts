import { createClient } from "@/lib/supabase/server";

export interface AdminProject {
  id: string;
  title: string;
  description: string | null;
  budget_target: number;
  current_funding: number;
  physical_progress: number;
  status: "pending" | "active" | "completed" | "archived";
  location_name: string | null;
  region: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  featured_image_url: string | null;
  panorama_image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface AdminExpense {
  id: string;
  project_id: string;
  amount: number;
  description: string;
  document_url: string | null;
  expense_date: string;
  created_at: string;
}

export async function getAllProjects(): Promise<AdminProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin-data] getAllProjects", error);
    return [];
  }
  return data ?? [];
}

export async function getProjectById(id: string): Promise<AdminProject | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[admin-data] getProjectById", error);
    return null;
  }
  return data;
}

export async function getExpensesByProject(projectId: string): Promise<AdminExpense[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("project_id", projectId)
    .order("expense_date", { ascending: false });

  if (error) {
    console.error("[admin-data] getExpensesByProject", error);
    return [];
  }
  return data ?? [];
}

export interface DashboardStats {
  fundsCollected: number;
  annualFundingGoal: number;
  totalExpenses: number;
  projectsCount: number;
  activeProjectsCount: number;
  volunteersCount: number;
  reportsCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [settingsRes, expensesRes, projectsRes, activeProjectsRes, volunteersRes, reportsRes] =
    await Promise.all([
      supabase.from("app_settings").select("manual_total_collected, annual_funding_goal").eq("id", 1).single(),
      supabase.from("expenses").select("amount"),
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabase.from("volunteers").select("id", { count: "exact", head: true }),
      supabase.from("reports").select("id", { count: "exact", head: true }),
    ]);

  const totalExpenses =
    expensesRes.data?.reduce((sum, row) => sum + Number(row.amount), 0) ?? 0;

  return {
    fundsCollected: Number(settingsRes.data?.manual_total_collected ?? 0),
    annualFundingGoal: Number(settingsRes.data?.annual_funding_goal ?? 0),
    totalExpenses,
    projectsCount: projectsRes.count ?? 0,
    activeProjectsCount: activeProjectsRes.count ?? 0,
    volunteersCount: volunteersRes.count ?? 0,
    reportsCount: reportsRes.count ?? 0,
  };
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  active: "En cours",
  completed: "Terminé",
  archived: "Archivé",
};

export interface ProjectStatusBreakdown {
  status: string;
  label: string;
  count: number;
}

// Répartition réelle des projets par statut — alimente le donut du
// tableau de bord (voir app/admin/(protected)/page.tsx). Pas de donnée
// inventée : uniquement ce qui existe déjà dans la table `projects`.
export async function getProjectStatusBreakdown(): Promise<ProjectStatusBreakdown[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("status");

  if (error || !data) {
    console.error("[admin-data] getProjectStatusBreakdown", error);
    return [];
  }

  const counts = new Map<string, number>();
  data.forEach((row) => {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([status, count]) => ({
    status,
    label: STATUS_LABELS[status] ?? status,
    count,
  }));
}

export interface MonthlyExpenseTotal {
  month: string;
  label: string;
  cumulative: number;
}

// Cumul réel des dépenses mois par mois, à partir des dépenses
// effectivement saisies (expenses.expense_date) — pas de courbe
// inventée : si aucune dépense n'est encore enregistrée, retourne un
// tableau vide et le graphique affiche un état vide plutôt qu'une fausse
// tendance.
export async function getExpensesOverTime(): Promise<MonthlyExpenseTotal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("amount, expense_date")
    .order("expense_date", { ascending: true });

  if (error || !data || data.length === 0) {
    return [];
  }

  const monthlyTotals = new Map<string, number>();
  data.forEach((row) => {
    const date = new Date(row.expense_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + Number(row.amount));
  });

  const sortedKeys = Array.from(monthlyTotals.keys()).sort();
  const formatter = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit" });

  let cumulative = 0;
  return sortedKeys.map((key) => {
    cumulative += monthlyTotals.get(key) ?? 0;
    const [year, month] = key.split("-").map(Number);
    return {
      month: key,
      label: formatter.format(new Date(year, month - 1, 1)),
      cumulative,
    };
  });
}

export interface AdminDonation {
  id: string;
  donor_name: string;
  amount: number | null;
  donation_type: "monetary" | "in_kind";
  item_description: string | null;
  payment_method: string | null;
  status: "pending" | "awaiting_confirmation" | "validated" | "rejected";
  project_id: string | null;
  project_title?: string;
  tracking_code: string;
  created_at: string;
}

export async function getDonations(): Promise<AdminDonation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*, projects(title)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[admin-data] getDonations", error);
    return [];
  }

  return data.map((row: any) => ({
    ...row,
    project_title: row.projects?.title,
  }));
}

export async function getPendingDonationsCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("donations")
    .select("id", { count: "exact", head: true })
    .eq("status", "awaiting_confirmation");

  if (error) {
    console.error("[admin-data] getPendingDonationsCount", error);
    return 0;
  }
  return count ?? 0;
}

export interface AdminPaymentMethod {
  id: string;
  provider: "orange_money" | "wave" | "other";
  label: string | null;
  phone_number: string;
  account_name: string | null;
  is_active: boolean;
  display_order: number;
}

export async function getAllPaymentMethods(): Promise<AdminPaymentMethod[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("[admin-data] getAllPaymentMethods", error);
    return [];
  }
  return data;
}
