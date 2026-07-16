import { setRequestLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { setRole } from "@/features/auth/actions";

export default async function ChooseRolePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <div className="flex flex-col gap-6 text-center">
      <h1 className="text-2xl font-semibold">{t("chooseRole")}</h1>
      <div className="grid grid-cols-2 gap-3">
        <form action={setRole.bind(null, "voyageur")}>
          <Button type="submit" variant="outline" className="w-full h-24">
            {t("roleTraveler")}
          </Button>
        </form>
        <form action={setRole.bind(null, "proprietaire")}>
          <Button type="submit" variant="outline" className="w-full h-24">
            {t("roleOwner")}
          </Button>
        </form>
      </div>
    </div>
  );
}
