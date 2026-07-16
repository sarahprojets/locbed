import { Building2, LayoutDashboard, MessageCircle, User as UserIcon, CreditCard } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/features/auth/require-role";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: "/proprietaire", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/proprietaire/logements", label: "Mes logements", icon: Building2 },
  { href: "/proprietaire/messages", label: "Messages", icon: MessageCircle },
  { href: "/proprietaire/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/proprietaire/profil", label: "Profil", icon: UserIcon },
];

export default async function ProprietaireLayout({ children }: { children: React.ReactNode }) {
  await requireRole("proprietaire");

  return (
    <DashboardShell navItems={NAV_ITEMS} roleLabel="Espace propriétaire">
      {children}
    </DashboardShell>
  );
}
