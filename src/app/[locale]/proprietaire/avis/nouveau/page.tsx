import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/features/auth/require-role";
import { ReviewForm } from "@/features/reviews/review-form";

export default async function NewTravelerReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  await requireRole("proprietaire");
  const { bookingId } = await searchParams;
  if (!bookingId) notFound();

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("booking_requests")
    .select("*, listings(title, owner_id)")
    .eq("id", bookingId)
    .eq("status", "accepted")
    .single();

  if (!booking) notFound();

  const { data: traveler } = await supabase
    .from("public_profiles")
    .select("display_name")
    .eq("id", booking.traveler_id)
    .single();

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="text-2xl font-semibold">Votre avis sur {traveler?.display_name ?? "ce voyageur"}</h1>
      <ReviewForm bookingRequestId={booking.id} type="traveler_review" revieweeId={booking.traveler_id} />
    </div>
  );
}
