"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendMessage(conversationId: string, body: string, basePath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!body.trim()) return;

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: body.trim(),
  });

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath(`${basePath}/${conversationId}`);
}

/** Finds or creates the conversation between the current traveler and a listing's owner. */
export async function startConversation(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: listing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", listingId)
    .single();
  if (!listing) redirect("/");

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("traveler_id", user.id)
    .eq("owner_id", listing.owner_id)
    .maybeSingle();

  if (existing) redirect(`/compte/messages/${existing.id}`);

  const { data: created } = await supabase
    .from("conversations")
    .insert({ listing_id: listingId, traveler_id: user.id, owner_id: listing.owner_id })
    .select("id")
    .single();

  redirect(`/compte/messages/${created!.id}`);
}
