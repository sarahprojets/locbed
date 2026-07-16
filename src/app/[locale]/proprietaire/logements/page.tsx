import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function LogementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mes logements</h1>
        <Button disabled>Ajouter un logement</Button>
      </div>
      <EmptyState
        icon={Building2}
        title="Aucun logement"
        description="L'assistant de création de logement (photos, description, tarifs, calendrier) arrive dans une prochaine itération."
      />
    </div>
  );
}
