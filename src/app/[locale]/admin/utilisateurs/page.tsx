import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function AdminUtilisateursPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Utilisateurs</h1>
      <EmptyState
        icon={Users}
        title="Liste des utilisateurs"
        description="La gestion des voyageurs et propriétaires (suspension, vérification) arrive dans une prochaine itération."
      />
    </div>
  );
}
