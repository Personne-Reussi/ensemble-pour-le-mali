import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Wallet,
  HeartHandshake,
  CreditCard,
  Users,
  Newspaper,
  FileText,
  Image as ImageIcon,
  Settings,
  UserCog,
  ScrollText,
  Search,
  Bell,
} from "lucide-react";
import Logo from "@/components/Logo";
import UserMenu from "@/components/admin/UserMenu";
import { getPendingDonationsCount } from "@/lib/admin-data";

const mainLinks = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, enabled: true },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban, enabled: true },
  { href: "#", label: "Dépenses", icon: Wallet, enabled: false },
  { href: "/admin/donations", label: "Dons", icon: HeartHandshake, enabled: true },
  { href: "/admin/payment-methods", label: "Moyens de paiement", icon: CreditCard, enabled: true },
  { href: "#", label: "Bénévoles", icon: Users, enabled: false },
  { href: "#", label: "Actualités", icon: Newspaper, enabled: false },
  { href: "#", label: "Rapports", icon: FileText, enabled: false },
  { href: "#", label: "Photos & Médias", icon: ImageIcon, enabled: false },
  { href: "#", label: "Paramètres", icon: Settings, enabled: false },
];

const adminLinks = [
  { href: "#", label: "Utilisateurs", icon: UserCog, enabled: false },
  { href: "#", label: "Logs d'activité", icon: ScrollText, enabled: false },
];

function NavItem({
  href,
  label,
  icon: Icon,
  enabled,
  badge,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  enabled: boolean;
  badge?: number;
}) {
  if (!enabled) {
    return (
      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] text-white/30 cursor-not-allowed select-none">
        <span className="flex items-center gap-3">
          <Icon size={18} strokeWidth={1.75} />
          {label}
        </span>
        <span className="text-[10px] font-medium bg-white/5 text-white/40 px-1.5 py-0.5 rounded">
          Bientôt
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
    >
      <span className="flex items-center gap-3">
        <Icon size={18} strokeWidth={1.75} />
        {label}
      </span>
      {!!badge && (
        <span className="text-[10px] font-bold bg-ocre text-anthracite px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default async function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pendingDonations = await getPendingDonationsCount();

  return (
    <div className="min-h-screen bg-offwhite flex">
      <aside className="w-64 bg-[#14251C] flex flex-col shrink-0">
        <Link
          href="/"
          title="Voir le site public"
          className="h-20 flex items-center gap-3 px-6 border-b border-white/10 hover:bg-white/5 transition"
        >
          <Logo size={34} />
          <div className="leading-tight">
            <p className="font-heading font-semibold text-[14px] text-white">
              Ensemble pour le Mali
            </p>
            <p className="text-[11px] text-white/50">
              Solidarité · Développement · Impact
            </p>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {mainLinks.map((link) => (
            <NavItem
              key={link.label}
              {...link}
              badge={link.href === "/admin/donations" ? pendingDonations : undefined}
            />
          ))}

          <p className="text-[11px] font-semibold text-white/30 tracking-wide px-3 pt-6 pb-2">
            ADMINISTRATION
          </p>
          {adminLinks.map((link) => (
            <NavItem key={link.label} {...link} />
          ))}
        </nav>

        <div className="p-4">
          <div className="rounded-2xl overflow-hidden relative h-28 mb-1">
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-end p-3">
              <p className="font-hand text-ocre text-lg leading-tight">
                Ensemble pour un Mali plus solidaire
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 w-80 max-w-full">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un projet, une dépense..."
              disabled
              className="bg-transparent text-[13px] outline-none w-full placeholder:text-gray-400 cursor-not-allowed"
              title="Recherche disponible prochainement"
            />
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/admin/donations"
              className="relative text-gray-400 hover:text-gray-600 transition"
              title={pendingDonations > 0 ? `${pendingDonations} don(s) à confirmer` : "Aucune notification"}
            >
              <Bell size={19} />
              {pendingDonations > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {pendingDonations > 9 ? "9+" : pendingDonations}
                </span>
              )}
            </Link>
            <UserMenu userEmail={userEmail} />
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
