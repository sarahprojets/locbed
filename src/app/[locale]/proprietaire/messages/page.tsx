import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/features/auth/require-role";
import { getConversationsForUser } from "@/features/messaging/queries";
import { ConversationList } from "@/components/messaging/conversation-list";

export default async function ProprietaireMessagesPage() {
  const { user } = await requireRole("proprietaire");
  const supabase = await createClient();
  const conversations = await getConversationsForUser(supabase, user.id, "proprietaire");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Messages</h1>
      <ConversationList conversations={conversations} basePath="/proprietaire/messages" />
    </div>
  );
}
