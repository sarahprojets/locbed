import { createClient } from "@/lib/supabase/server";
import { ListingForm } from "@/features/listings/listing-form";

export default async function NewListingPage() {
  const supabase = await createClient();
  const [{ data: cities }, { data: amenities }] = await Promise.all([
    supabase.from("cities").select("id, name").order("name"),
    supabase.from("amenities").select("code, name").order("name"),
  ]);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">Nouveau logement</h1>
      <ListingForm cities={cities ?? []} amenityOptions={amenities ?? []} />
    </div>
  );
}
