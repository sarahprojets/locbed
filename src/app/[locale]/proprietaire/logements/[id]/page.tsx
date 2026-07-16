import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/features/auth/require-role";
import { ListingForm } from "@/features/listings/listing-form";
import { PhotoUploader } from "@/features/listings/photo-uploader";
import { PublishToggle } from "@/features/listings/publish-toggle";
import { BookingRequestActions } from "@/components/listing/booking-request-actions";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { publicStorageUrl } from "@/features/listings/queries";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await requireRole("proprietaire");
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!listing) notFound();

  const [{ data: cities }, { data: amenities }, { data: listingAmenities }, { data: photos }, { data: bookingRequests }] =
    await Promise.all([
      supabase.from("cities").select("id, name").order("name"),
      supabase.from("amenities").select("code, name").order("name"),
      supabase.from("listing_amenities").select("amenity_id").eq("listing_id", id),
      supabase
        .from("listing_photos")
        .select("id, storage_path, is_cover")
        .eq("listing_id", id)
        .order("position"),
      supabase
        .from("booking_requests")
        .select("*")
        .eq("listing_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const amenityIds = new Set((listingAmenities ?? []).map((a) => a.amenity_id));
  const { data: allAmenities } = await supabase.from("amenities").select("id, code");
  const selectedAmenityCodes = (allAmenities ?? [])
    .filter((a) => amenityIds.has(a.id))
    .map((a) => a.code);

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{listing.title}</h1>
        <PublishToggle listingId={listing.id} isPublished={listing.status === "published"} />
      </div>

      <div>
        <h2 className="mb-3 font-medium">Photos</h2>
        <PhotoUploader
          listingId={listing.id}
          photos={(photos ?? []).map((p) => ({
            id: p.id,
            url: publicStorageUrl(supabase, "listing-photos", p.storage_path),
            is_cover: p.is_cover,
          }))}
        />
      </div>

      <Separator />

      <ListingForm
        listing={listing}
        cities={cities ?? []}
        amenityOptions={amenities ?? []}
        selectedAmenities={selectedAmenityCodes}
      />

      <Separator />

      <div>
        <h2 className="mb-3 font-medium">Demandes de réservation</h2>
        {!bookingRequests || bookingRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande pour l&apos;instant.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {bookingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(request.start_date).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(request.end_date).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.guests_count} voyageur(s)
                      {request.proposed_price ? ` · offre : ${request.proposed_price}€/nuit` : ""}
                    </p>
                    {request.message ? <p className="text-sm mt-1">{request.message}</p> : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <BookingStatusBadge status={request.status} />
                    {request.status === "pending" ? (
                      <BookingRequestActions requestId={request.id} />
                    ) : null}
                    {request.status === "accepted" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        render={<Link href={`/proprietaire/avis/nouveau?bookingId=${request.id}`} />}
                      >
                        Laisser un avis
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
