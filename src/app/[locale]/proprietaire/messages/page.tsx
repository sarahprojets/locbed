import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function ProprietaireMessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Messages</h1>
      <EmptyState
        icon={MessageCircle}
        title="Aucune conversation"
        description="La messagerie avec les voyageurs arrivera dans une prochaine itération."
      />
    </div>
  );
}
