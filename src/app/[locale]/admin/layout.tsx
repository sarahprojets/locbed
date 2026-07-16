import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  FileText,
  HelpCircle,
  Flag,
  ScrollText,
} from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/features/auth/require-role";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/logements", label: "Logements", icon: Building2 },
  { href: "/admin/abonnements", label: "Abonnements", icon: CreditCard },
  { href: "/admin/blog", label: "Blog", icon: FileText, disabled: true },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, disabled: true },
  { href: "/admin/signalements", label: "Signalements", icon: Flag, disabled: true },
  { href: "/admin/logs", label: "Logs", icon: ScrollText, disabled: true },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin");

  return (
    <DashboardShell navItems={NAV_ITEMS} roleLabel="Administration">
      {children}
    </DashboardShell>
  );
}
