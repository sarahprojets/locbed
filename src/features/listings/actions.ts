"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ListingType } from "@/types/database.types";

export type ListingActionState = { error: string | null; listingId?: string };

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}

export async function createListing(
  _prev: ListingActionState,
  formData: FormData,
): Promise<ListingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "");
  if (!title.trim()) return { error: "Le titre est requis." };

  const cityId = String(formData.get("cityId") ?? "") || null;
  let countryId: string | null = null;
  if (cityId) {
    const { data: city } = await supabase
      .from("cities")
      .select("country_id")
      .eq("id", cityId)
      .single();
    countryId = city?.country_id ?? null;
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      type: String(formData.get("type") ?? "appartement") as ListingType,
      title,
      slug: slugify(title),
      description: String(formData.get("description") ?? "") || null,
      city_id: cityId,
      country_id: countryId,
      address: String(formData.get("address") ?? "") || null,
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
      max_guests: Number(formData.get("maxGuests") ?? 1),
      bedrooms: Number(formData.get("bedrooms") ?? 0),
      beds: Number(formData.get("beds") ?? 0),
      bathrooms: Number(formData.get("bathrooms") ?? 0),
      base_price_per_night: Number(formData.get("price") ?? 0),
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Erreur lors de la création." };

  const amenityCodes = formData.getAll("amenities") as string[];
  if (amenityCodes.length > 0) {
    const { data: amenities } = await supabase
      .from("amenities")
      .select("id")
      .in("code", amenityCodes);
    if (amenities && amenities.length > 0) {
      await supabase
        .from("listing_amenities")
        .insert(amenities.map((a) => ({ listing_id: data.id, amenity_id: a.id })));
    }
  }

  revalidatePath("/proprietaire/logements");
  redirect(`/proprietaire/logements/${data.id}`);
}

export async function updateListing(listingId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cityId = String(formData.get("cityId") ?? "") || null;
  let countryId: string | null = null;
  if (cityId) {
    const { data: city } = await supabase
      .from("cities")
      .select("country_id")
      .eq("id", cityId)
      .single();
    countryId = city?.country_id ?? null;
  }

  await supabase
    .from("listings")
    .update({
      type: String(formData.get("type") ?? "appartement") as ListingType,
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      city_id: cityId,
      country_id: countryId,
      address: String(formData.get("address") ?? "") || null,
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
      max_guests: Number(formData.get("maxGuests") ?? 1),
      bedrooms: Number(formData.get("bedrooms") ?? 0),
      beds: Number(formData.get("beds") ?? 0),
      bathrooms: Number(formData.get("bathrooms") ?? 0),
      base_price_per_night: Number(formData.get("price") ?? 0),
    })
    .eq("id", listingId)
    .eq("owner_id", user.id);

  const amenityCodes = formData.getAll("amenities") as string[];
  await supabase.from("listing_amenities").delete().eq("listing_id", listingId);
  if (amenityCodes.length > 0) {
    const { data: amenities } = await supabase
      .from("amenities")
      .select("id")
      .in("code", amenityCodes);
    if (amenities && amenities.length > 0) {
      await supabase
        .from("listing_amenities")
        .insert(amenities.map((a) => ({ listing_id: listingId, amenity_id: a.id })));
    }
  }

  revalidatePath(`/proprietaire/logements/${listingId}`);
}

export async function togglePublish(listingId: string, publish: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("listings")
    .update({
      status: publish ? "published" : "archived",
      published_at: publish ? new Date().toISOString() : null,
    })
    .eq("id", listingId)
    .eq("owner_id", user.id);

  revalidatePath(`/proprietaire/logements/${listingId}`);
  revalidatePath("/proprietaire/logements");
}

export async function deletePhoto(photoId: string, listingId: string) {
  const supabase = await createClient();
  await supabase.from("listing_photos").delete().eq("id", photoId);
  revalidatePath(`/proprietaire/logements/${listingId}`);
}

export async function setCoverPhoto(photoId: string, listingId: string) {
  const supabase = await createClient();
  await supabase.from("listing_photos").update({ is_cover: false }).eq("listing_id", listingId);
  await supabase.from("listing_photos").update({ is_cover: true }).eq("id", photoId);
  revalidatePath(`/proprietaire/logements/${listingId}`);
}
