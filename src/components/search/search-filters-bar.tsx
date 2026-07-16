"use client";

import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const AMENITY_OPTIONS = [
  { code: "piscine", label: "Piscine" },
  { code: "wifi", label: "Wi-Fi" },
  { code: "parking", label: "Parking" },
  { code: "climatisation", label: "Climatisation" },
  { code: "vue_mer", label: "Vue mer" },
  { code: "animaux_acceptes", label: "Animaux acceptés" },
];

export function SearchFiltersBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const type = searchParams.get("type") ?? "tous";
  const guests = searchParams.get("guests") ?? "";
  const priceMax = searchParams.get("prixMax") ?? "";
  const activeAmenities = searchParams.get("equipements")?.split(",").filter(Boolean) ?? [];

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleAmenity(code: string) {
    const next = activeAmenities.includes(code)
      ? activeAmenities.filter((a) => a !== code)
      : [...activeAmenities, code];
    updateParam("equipements", next.length ? next.join(",") : null);
  }

  return (
    <div className="flex flex-col gap-3 border-b pb-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={type} onValueChange={(v) => updateParam("type", v === "tous" ? null : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous types</SelectItem>
            <SelectItem value="appartement">Appartement</SelectItem>
            <SelectItem value="maison">Maison</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          min={1}
          placeholder="Voyageurs"
          className="w-32"
          defaultValue={guests}
          onBlur={(e) => updateParam("guests", e.target.value || null)}
        />
        <Input
          type="number"
          min={0}
          placeholder="Prix max / nuit"
          className="w-36"
          defaultValue={priceMax}
          onBlur={(e) => updateParam("prixMax", e.target.value || null)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {AMENITY_OPTIONS.map((amenity) => {
          const active = activeAmenities.includes(amenity.code);
          return (
            <Button
              key={amenity.code}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              onClick={() => toggleAmenity(amenity.code)}
            >
              {amenity.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
