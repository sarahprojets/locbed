"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/features/listings/favorites-actions";
import { useRouter } from "@/i18n/navigation";

export function FavoriteButton({
  listingId,
  initialIsFavorite,
}: {
  listingId: string;
  initialIsFavorite: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-sm"
      className="rounded-full shadow-sm"
      disabled={pending}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = !isFavorite;
        setIsFavorite(next);
        startTransition(async () => {
          const result = await toggleFavorite(listingId, isFavorite);
          if (result.error === "unauthenticated") {
            setIsFavorite(!next);
            router.push("/login");
          }
        });
      }}
    >
      <Heart className={isFavorite ? "size-4 fill-destructive text-destructive" : "size-4"} />
    </Button>
  );
}
