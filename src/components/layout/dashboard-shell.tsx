import type { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { signOut } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export function DashboardShell({
  navItems,
  roleLabel,
  children,
}: {
  navItems: DashboardNavItem[];
  roleLabel: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link href="/" className="font-semibold text-lg tracking-tight px-2 py-1">
            LocBed
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      disabled={item.disabled}
                      render={
                        item.disabled ? (
                          <span className="opacity-50 cursor-not-allowed flex items-center gap-2" />
                        ) : (
                          <Link href={item.href} className="flex items-center gap-2" />
                        )
                      }
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2">
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="h-14 flex items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">{roleLabel}</span>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
