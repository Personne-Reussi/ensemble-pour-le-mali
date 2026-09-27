// Types alignés sur supabase/schema.sql

export type ProjectStatus = "pending" | "active" | "completed" | "archived";

export interface Project {
  id: string;
  title: string;
  location_name: string | null;
  region?: string | null;
  address?: string | null;
  status: ProjectStatus;
  budget_target: number;
  current_funding: number;
  physical_progress: number;
  description: string | null;
  featured_image_url: string | null;
  panorama_image_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  image_url: string;
}

export interface MapMarker {
  id: string;
  name: string;
  status: ProjectStatus;
  latitude: number;
  longitude: number;
}

export interface AppSettings {
  online_donations_active: boolean;
  annual_funding_goal: number;
  manual_total_collected: number;
}

export type DonationStatus = "pending" | "awaiting_confirmation" | "validated" | "rejected";
export type DonationType = "monetary" | "in_kind";

export interface Donation {
  id: string;
  donor_name: string;
  amount: number | null;
  donation_type: DonationType;
  item_description: string | null;
  payment_method: string | null;
  status: DonationStatus;
  project_id: string | null;
  tracking_code: string;
  created_at: string;
  proof_url: string | null;
}

export interface PaymentMethod {
  id: string;
  provider: "orange_money" | "wave" | "other";
  label: string | null;
  phone_number: string;
  account_name: string | null;
  is_active: boolean;
  display_order: number;
}

export interface ImpactStats {
  projectsInProgress: number;
  projectsTotal: number;
  projectsCompleted: number;
  volunteersActive: number;
}
