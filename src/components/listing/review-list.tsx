import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RatingStars } from "@/components/shared/rating-stars";

type Review = {
  id: string;
  rating_overall: number;
  comment: string | null;
  created_at: string;
  reviewer: { display_name: string | null; avatar_url: string | null } | null;
};

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun avis pour l&apos;instant.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <RatingStars
        rating={reviews.reduce((sum, r) => sum + r.rating_overall, 0) / reviews.length}
        reviewCount={reviews.length}
        size="md"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-9">
                <AvatarImage src={review.reviewer?.avatar_url ?? undefined} />
                <AvatarFallback>
                  {review.reviewer?.display_name?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {review.reviewer?.display_name ?? "Voyageur"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            {review.comment ? <p className="text-sm">{review.comment}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
