"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const t = useTranslations("home");
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  return (
    <form
      className="flex w-full max-w-xl gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (value.trim()) params.set("q", value.trim());
        router.push(`/recherche${params.toString() ? `?${params.toString()}` : ""}`);
      }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-12 pl-10"
        />
      </div>
      <Button type="submit" size="lg" className="h-12 px-8">
        {t("searchCta")}
      </Button>
    </form>
  );
}
