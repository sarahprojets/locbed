import { CalendarCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function ReservationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Réservations</h1>
      <EmptyState
        icon={CalendarCheck}
        title="Aucune réservation"
        description="Vos demandes de réservation et leur statut apparaîtront ici."
      />
    </div>
  );
}
