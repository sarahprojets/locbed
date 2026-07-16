"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { togglePublish } from "@/features/listings/actions";

export function PublishToggle({ listingId, isPublished }: { listingId: string; isPublished: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={isPublished ? "outline" : "default"}
      disabled={pending}
      onClick={() => startTransition(() => togglePublish(listingId, !isPublished))}
    >
      {isPublished ? "Dépublier" : "Publier l'annonce"}
    </Button>
  );
}
