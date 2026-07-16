import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { SiteFooter } from "@/components/layout/site-footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
