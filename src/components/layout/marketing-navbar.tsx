import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function MarketingNavbar() {
  const t = useTranslations();

  return (
    <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          LocBed
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            {t("nav.explore")}
          </Link>
          <Link href="/comment-ca-marche" className="hover:text-foreground transition-colors">
            {t("nav.howItWorks")}
          </Link>
          <Link href="/devenir-proprietaire" className="hover:text-foreground transition-colors">
            {t("nav.becomeHost")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" render={<Link href="/login" />}>
            {t("nav.login")}
          </Button>
          <Button render={<Link href="/register" />}>{t("nav.register")}</Button>
        </div>
      </div>
    </header>
  );
}
