import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/features/auth/require-role";

const STATUS_LABELS = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
  suspended: "Suspendu",
} as const;

export default async function LogementsPage() {
  const { user } = await requireRole("proprietaire");
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mes logements</h1>
        <Button render={<Link href="/proprietaire/logements/nouveau" />}>Ajouter un logement</Button>
      </div>
      {!listings || listings.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Aucun logement"
          description="Ajoutez votre premier logement pour commencer à recevoir des réservations."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/proprietaire/logements/${listing.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{listing.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {listing.type === "maison" ? "Maison" : "Appartement"} ·{" "}
                      {listing.base_price_per_night}€/nuit
                    </p>
                  </div>
                  <Badge variant={listing.status === "published" ? "default" : "outline"}>
                    {STATUS_LABELS[listing.status]}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
