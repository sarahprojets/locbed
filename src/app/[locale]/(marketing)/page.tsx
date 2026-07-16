import { getTranslations, setRequestLocale } from "next-intl/server";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("tagline") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <section className="mx-auto max-w-6xl px-6 py-24 text-center flex flex-col items-center gap-8">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-balance max-w-3xl">
          {t("heroTitle")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl text-balance">
          {t("heroSubtitle")}
        </p>
        <form className="w-full max-w-xl flex gap-2">
          <Input placeholder={t("searchPlaceholder")} className="h-12" />
          <Button type="submit" size="lg" className="h-12 px-8">
            {t("searchCta")}
          </Button>
        </form>
        <Button variant="link" render={<Link href="/devenir-proprietaire" />}>
          Vous avez un logement à louer ?
        </Button>
      </section>
    </>
  );
}
