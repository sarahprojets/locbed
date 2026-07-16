import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

type ConversationItem = {
  id: string;
  listingTitle: string | null;
  last_message_at: string | null;
  otherParty: { display_name: string | null; avatar_url: string | null } | null;
};

export function ConversationList({
  conversations,
  basePath,
}: {
  conversations: ConversationItem[];
  basePath: string;
}) {
  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Aucune conversation"
        description="Vos échanges avec les voyageurs ou propriétaires apparaîtront ici."
      />
    );
  }

  return (
    <div className="flex flex-col divide-y rounded-xl border">
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={`${basePath}/${conversation.id}`}
          className="flex items-center gap-3 p-4 hover:bg-muted/50"
        >
          <Avatar>
            <AvatarImage src={conversation.otherParty?.avatar_url ?? undefined} />
            <AvatarFallback>
              {conversation.otherParty?.display_name?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              {conversation.otherParty?.display_name ?? "Utilisateur"}
            </p>
            {conversation.listingTitle ? (
              <p className="truncate text-sm text-muted-foreground">
                {conversation.listingTitle}
              </p>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
