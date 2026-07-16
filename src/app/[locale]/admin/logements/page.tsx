import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function AdminLogementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Logements</h1>
      <EmptyState
        icon={Building2}
        title="Aucun logement"
        description="La modération des annonces arrive dans une prochaine itération."
      />
    </div>
  );
}
