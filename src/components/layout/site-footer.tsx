import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="border-t mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          LocBed
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/">{t("nav.explore")}</Link>
          <Link href="/comment-ca-marche">{t("nav.howItWorks")}</Link>
          <Link href="/devenir-proprietaire">{t("nav.becomeHost")}</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
        <p>
          © {new Date().getFullYear()} LocBed. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
