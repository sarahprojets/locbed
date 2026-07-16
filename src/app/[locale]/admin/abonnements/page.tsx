import { CreditCard } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function AdminAbonnementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Abonnements</h1>
      <EmptyState
        icon={CreditCard}
        title="Aucun abonnement"
        description="Le suivi des abonnements Stripe des propriétaires apparaîtra ici une fois Stripe connecté."
      />
    </div>
  );
}
