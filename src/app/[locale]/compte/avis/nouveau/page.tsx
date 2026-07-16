import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/features/auth/require-role";
import { ReviewForm } from "@/features/reviews/review-form";

export default async function NewListingReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { user } = await requireRole("voyageur");
  const { bookingId } = await searchParams;
  if (!bookingId) notFound();

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("booking_requests")
    .select("*, listings(title)")
    .eq("id", bookingId)
    .eq("traveler_id", user.id)
    .eq("status", "accepted")
    .single();

  if (!booking) notFound();

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="text-2xl font-semibold">Votre avis sur {booking.listings?.title}</h1>
      <ReviewForm bookingRequestId={booking.id} type="listing_review" listingId={booking.listing_id} />
    </div>
  );
}
