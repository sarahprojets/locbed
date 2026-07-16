import { Star } from "lucide-react";

export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number | null;
  reviewCount: number;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? "size-3.5" : "size-4";

  if (rating === null || reviewCount === 0) {
    return <span className="text-xs text-muted-foreground">Nouveau logement</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Star className={`${iconSize} fill-primary text-primary`} />
      <span className="font-medium">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviewCount})</span>
    </span>
  );
}
