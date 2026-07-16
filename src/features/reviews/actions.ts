"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ReviewType } from "@/types/database.types";

export type ReviewActionState = { error: string | null };

export async function submitReview(
  _prev: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bookingRequestId = String(formData.get("bookingRequestId") ?? "");
  const type = String(formData.get("type") ?? "") as ReviewType;
  const listingId = String(formData.get("listingId") ?? "") || null;
  const revieweeId = String(formData.get("revieweeId") ?? "") || null;
  const comment = String(formData.get("comment") ?? "") || null;

  const criteriaKeys =
    type === "listing_review"
      ? ["cleanliness", "comfort", "communication", "location", "value"]
      : ["respect", "communication", "punctuality", "cleanliness", "rules"];

  const ratings: Record<string, number> = {};
  for (const key of criteriaKeys) {
    ratings[key] = Number(formData.get(`rating_${key}`) ?? 5);
  }
  const ratingOverall =
    Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;

  const { error } = await supabase.from("reviews").insert({
    type,
    booking_request_id: bookingRequestId,
    reviewer_id: user.id,
    listing_id: type === "listing_review" ? listingId : null,
    reviewee_id: type === "traveler_review" ? revieweeId : null,
    ratings,
    rating_overall: Math.round(ratingOverall * 10) / 10,
    comment,
    status: "published",
    published_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/compte/reservations");
  revalidatePath("/proprietaire/logements");
  redirect(type === "listing_review" ? "/compte/reservations" : "/proprietaire/logements");
}
