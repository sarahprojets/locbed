"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleFavorite(listingId: string, isFavorite: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" as const };

  if (isFavorite) {
    await supabase
      .from("favorites")
      .delete()
      .eq("traveler_id", user.id)
      .eq("listing_id", listingId);
  } else {
    await supabase.from("favorites").insert({ traveler_id: user.id, listing_id: listingId });
  }

  revalidatePath("/compte/favoris");
  return { error: null };
}
