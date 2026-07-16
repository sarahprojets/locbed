import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/features/auth/actions";

export function OAuthButtons() {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col gap-2">
      <form action={signInWithOAuth.bind(null, "google")}>
        <Button type="submit" variant="outline" className="w-full">
          {t("continueWithGoogle")}
        </Button>
      </form>
      <form action={signInWithOAuth.bind(null, "apple")}>
        <Button type="submit" variant="outline" className="w-full">
          {t("continueWithApple")}
        </Button>
      </form>
      <form action={signInWithOAuth.bind(null, "facebook")}>
        <Button type="submit" variant="outline" className="w-full">
          {t("continueWithFacebook")}
        </Button>
      </form>
    </div>
  );
}
