import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { createAdminClient } from "@/lib/supabase/admin";
import { ListingRowActions } from "@/features/admin/listing-row-actions";
import { Link } from "@/i18n/navigation";

const STATUS_LABELS = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
  suspended: "Suspendu",
} as const;

export default async function AdminLogementsPage() {
  const supabase = createAdminClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Logements</h1>
      {!listings || listings.length === 0 ? (
        <EmptyState icon={Building2} title="Aucun logement" description="Les annonces apparaîtront ici." />
      ) : (
        <div className="flex flex-col divide-y rounded-xl border">
          {listings.map((listing) => (
            <div key={listing.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/logement/${listing.slug}`} className="truncate font-medium hover:underline">
                  {listing.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {listing.type === "maison" ? "Maison" : "Appartement"} · {listing.base_price_per_night}€/nuit
                </p>
              </div>
              <Badge variant={listing.status === "published" ? "default" : "outline"}>
                {STATUS_LABELS[listing.status]}
              </Badge>
              <ListingRowActions listingId={listing.id} status={listing.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
