import { Heart, LayoutDashboard, MessageCircle, User as UserIcon, CalendarCheck } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/features/auth/require-role";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: "/compte", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/compte/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/compte/favoris", label: "Favoris", icon: Heart },
  { href: "/compte/messages", label: "Messages", icon: MessageCircle },
  { href: "/compte/profil", label: "Profil", icon: UserIcon },
];

export default async function VoyageurLayout({ children }: { children: React.ReactNode }) {
  await requireRole("voyageur");

  return (
    <DashboardShell navItems={NAV_ITEMS} roleLabel="Espace voyageur">
      {children}
    </DashboardShell>
  );
}
