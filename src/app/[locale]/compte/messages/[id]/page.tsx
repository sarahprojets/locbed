import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/features/auth/require-role";
import { getConversationThread } from "@/features/messaging/queries";
import { MessageThread } from "@/components/messaging/message-thread";

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await requireRole("voyageur");
  const supabase = await createClient();

  const thread = await getConversationThread(supabase, id);
  if (!thread || thread.conversation.traveler_id !== user.id) notFound();

  return (
    <MessageThread
      conversationId={id}
      messages={thread.messages}
      currentUserId={user.id}
      otherParty={thread.owner}
      basePath="/compte/messages"
    />
  );
}
