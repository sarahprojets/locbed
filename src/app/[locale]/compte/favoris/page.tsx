import { Heart } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function FavorisPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Favoris</h1>
      <EmptyState
        icon={Heart}
        title="Aucun favori"
        description="Ajoutez des logements à vos favoris pour les retrouver ici."
      />
    </div>
  );
}
