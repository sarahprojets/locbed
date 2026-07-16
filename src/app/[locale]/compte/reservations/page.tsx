import { CalendarCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/features/auth/require-role";
import { cancelBookingRequest } from "@/features/bookings/actions";
import { Link } from "@/i18n/navigation";

export default async function ReservationsPage() {
  const { user } = await requireRole("voyageur");
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("traveler_id", user.id)
    .order("created_at", { ascending: false });

  const listingIds = [...new Set((requests ?? []).map((r) => r.listing_id))];
  const { data: listings } = listingIds.length
    ? await supabase.from("listings").select("id, title, slug").in("id", listingIds)
    : { data: [] };
  const listingById = new Map((listings ?? []).map((l) => [l.id, l]));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Réservations</h1>
      {!requests || requests.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="Aucune réservation"
          description="Vos demandes de réservation et leur statut apparaîtront ici."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((request) => {
            const listing = listingById.get(request.listing_id);
            return (
              <Card key={request.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link href={`/logement/${listing?.slug ?? ""}`} className="font-medium hover:underline">
                      {listing?.title ?? "Logement"}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.start_date).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(request.end_date).toLocaleDateString("fr-FR")} ·{" "}
                      {request.guests_count} voyageur(s)
                    </p>
                    {request.counter_price ? (
                      <p className="text-sm">Contre-offre : {request.counter_price}€/nuit</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <BookingStatusBadge status={request.status} />
                    {request.status === "pending" ? (
                      <form action={cancelBookingRequest.bind(null, request.id)}>
                        <Button type="submit" variant="outline" size="sm">
                          Annuler
                        </Button>
                      </form>
                    ) : null}
                    {request.status === "accepted" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        render={<Link href={`/compte/avis/nouveau?bookingId=${request.id}`} />}
                      >
                        Laisser un avis
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
