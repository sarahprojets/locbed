import { setRequestLocale, getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { RegisterForm } from "@/features/auth/register-form";
import { OAuthButtons } from "@/features/auth/oauth-buttons";
import { Link } from "@/i18n/navigation";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-center">{t("register")}</h1>
      <OAuthButtons />
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" />
        ou
        <Separator className="flex-1" />
      </div>
      <RegisterForm />
      <p className="text-sm text-center text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-foreground underline underline-offset-4">
          {t("login")}
        </Link>
      </p>
    </div>
  );
}
