import { LayoutDashboard } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function VoyageurDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>
      <EmptyState
        icon={LayoutDashboard}
        title="Bienvenue sur LocBed"
        description="Vos réservations, favoris et messages apparaîtront ici une fois la recherche de logements disponible."
      />
    </div>
  );
}
