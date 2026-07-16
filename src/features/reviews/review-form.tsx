"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRatingInput } from "@/features/reviews/star-rating-input";
import { submitReview, type ReviewActionState } from "@/features/reviews/actions";
import type { ReviewType } from "@/types/database.types";

const CRITERIA: Record<ReviewType, { key: string; label: string }[]> = {
  listing_review: [
    { key: "cleanliness", label: "Propreté" },
    { key: "comfort", label: "Confort" },
    { key: "communication", label: "Communication" },
    { key: "location", label: "Emplacement" },
    { key: "value", label: "Rapport qualité/prix" },
  ],
  traveler_review: [
    { key: "respect", label: "Respect du logement" },
    { key: "communication", label: "Communication" },
    { key: "punctuality", label: "Ponctualité" },
    { key: "cleanliness", label: "Propreté" },
    { key: "rules", label: "Respect du règlement" },
  ],
};

const initialState: ReviewActionState = { error: null };

export function ReviewForm({
  bookingRequestId,
  type,
  listingId,
  revieweeId,
}: {
  bookingRequestId: string;
  type: ReviewType;
  listingId?: string;
  revieweeId?: string;
}) {
  const [state, formAction, pending] = useActionState(submitReview, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="bookingRequestId" value={bookingRequestId} />
      <input type="hidden" name="type" value={type} />
      {listingId ? <input type="hidden" name="listingId" value={listingId} /> : null}
      {revieweeId ? <input type="hidden" name="revieweeId" value={revieweeId} /> : null}

      <div className="flex flex-col gap-2">
        {CRITERIA[type].map((criterion) => (
          <StarRatingInput
            key={criterion.key}
            name={`rating_${criterion.key}`}
            label={criterion.label}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="comment">Commentaire</Label>
        <Textarea id="comment" name="comment" rows={4} />
      </div>

      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-fit">
        Publier l&apos;avis
      </Button>
    </form>
  );
}
