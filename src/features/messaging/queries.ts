import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export async function getConversationsForUser(
  supabase: Client,
  userId: string,
  role: "voyageur" | "proprietaire",
) {
  const field = role === "voyageur" ? "traveler_id" : "owner_id";
  const otherField = role === "voyageur" ? "owner_id" : "traveler_id";

  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .eq(field, userId)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (!conversations || conversations.length === 0) return [];

  const otherIds = [...new Set(conversations.map((c) => c[otherField]))];
  const listingIds = [
    ...new Set(conversations.map((c) => c.listing_id).filter((id): id is string => !!id)),
  ];

  const [{ data: others }, { data: listings }] = await Promise.all([
    supabase.from("public_profiles").select("*").in("id", otherIds),
    listingIds.length
      ? supabase.from("listings").select("id, title").in("id", listingIds)
      : Promise.resolve({ data: [] as { id: string; title: string }[] }),
  ]);

  const otherById = new Map((others ?? []).map((o) => [o.id, o]));
  const listingById = new Map((listings ?? []).map((l) => [l.id, l]));

  return conversations.map((conversation) => ({
    ...conversation,
    otherParty: otherById.get(conversation[otherField]) ?? null,
    listingTitle: conversation.listing_id
      ? (listingById.get(conversation.listing_id)?.title ?? null)
      : null,
  }));
}

export async function getConversationThread(supabase: Client, conversationId: string) {
  const { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();
  if (!conversation) return null;

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at");

  const { data: traveler } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("id", conversation.traveler_id)
    .single();
  const { data: owner } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("id", conversation.owner_id)
    .single();

  return { conversation, messages: messages ?? [], traveler, owner };
}
