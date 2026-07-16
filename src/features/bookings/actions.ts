"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type BookingActionState = { error: string | null; success?: boolean };

export async function createBookingRequest(
  _prev: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const listingId = String(formData.get("listingId") ?? "");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const guestsCount = Number(formData.get("guestsCount") ?? 1);
  const message = String(formData.get("message") ?? "");
  const proposedPriceRaw = formData.get("proposedPrice");

  if (!startDate || !endDate) {
    return { error: "Merci de sélectionner des dates." };
  }

  const { error } = await supabase.from("booking_requests").insert({
    listing_id: listingId,
    traveler_id: user.id,
    start_date: startDate,
    end_date: endDate,
    guests_count: guestsCount,
    message: message || null,
    proposed_price: proposedPriceRaw ? Number(proposedPriceRaw) : null,
  });

  if (error) return { error: error.message };

  revalidatePath("/compte/reservations");
  return { error: null, success: true };
}

export async function respondToBookingRequest(
  requestId: string,
  status: "accepted" | "refused" | "countered",
  counterPrice?: number,
  responseMessage?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("booking_requests")
    .update({
      status,
      counter_price: counterPrice ?? null,
      owner_response_message: responseMessage ?? null,
      responded_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  revalidatePath("/proprietaire/logements");
  revalidatePath("/compte/reservations");
}

export async function cancelBookingRequest(requestId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("booking_requests")
    .update({ status: "cancelled" })
    .eq("id", requestId)
    .eq("traveler_id", user.id);

  revalidatePath("/compte/reservations");
}
