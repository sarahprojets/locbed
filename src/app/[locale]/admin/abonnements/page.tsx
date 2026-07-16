import { CreditCard } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { createAdminClient } from "@/lib/supabase/admin";

const STATUS_LABELS = {
  trialing: "Essai",
  active: "Actif",
  past_due: "Impayé",
  canceled: "Résilié",
  incomplete: "Incomplet",
  unpaid: "Impayé",
} as const;

export default async function AdminAbonnementsPage() {
  const supabase = createAdminClient();
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const ownerIds = [...new Set((subscriptions ?? []).map((s) => s.owner_id))];
  const { data: owners } = ownerIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", ownerIds)
    : { data: [] };
  const ownerById = new Map((owners ?? []).map((o) => [o.id, o]));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Abonnements</h1>
      {!subscriptions || subscriptions.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="Aucun abonnement"
          description="Le suivi des abonnements Stripe des propriétaires apparaîtra ici une fois Stripe connecté."
        />
      ) : (
        <div className="flex flex-col divide-y rounded-xl border">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {ownerById.get(subscription.owner_id)?.display_name ?? "Propriétaire"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Depuis le {new Date(subscription.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <Badge variant={subscription.status === "active" ? "default" : "outline"}>
                {STATUS_LABELS[subscription.status]}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
