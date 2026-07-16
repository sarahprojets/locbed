"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AmenitiesPicker } from "@/features/listings/amenities-picker";
import { createListing, updateListing, type ListingActionState } from "@/features/listings/actions";
import type { Database } from "@/types/database.types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];

const initialState: ListingActionState = { error: null };

export function ListingForm({
  listing,
  cities,
  amenityOptions,
  selectedAmenities = [],
}: {
  listing?: Listing;
  cities: { id: string; name: string }[];
  amenityOptions: { code: string; name: string }[];
  selectedAmenities?: string[];
}) {
  const editAction = async (
    _prev: ListingActionState,
    formData: FormData,
  ): Promise<ListingActionState> => {
    await updateListing(listing!.id, formData);
    return { error: null };
  };

  const [state, formAction, pending] = useActionState(
    listing ? editAction : createListing,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Titre de l&apos;annonce</Label>
          <Input id="title" name="title" required defaultValue={listing?.title} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={listing?.type ?? "appartement"}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appartement">Appartement</SelectItem>
              <SelectItem value="maison">Maison</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={5} defaultValue={listing?.description ?? ""} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cityId">Ville</Label>
          <Select name="cityId" defaultValue={listing?.city_id ?? undefined}>
            <SelectTrigger id="cityId">
              <SelectValue placeholder="Choisir une ville" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" name="address" defaultValue={listing?.address ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="maxGuests">Voyageurs</Label>
          <Input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min={1}
            defaultValue={listing?.max_guests ?? 1}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bedrooms">Chambres</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={listing?.bedrooms ?? 0}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="beds">Lits</Label>
          <Input id="beds" name="beds" type="number" min={0} defaultValue={listing?.beds ?? 0} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bathrooms">Salles de bain</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min={0}
            defaultValue={listing?.bathrooms ?? 0}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 max-w-xs">
        <Label htmlFor="price">Prix par nuit (€)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min={0}
          step="0.01"
          defaultValue={listing?.base_price_per_night ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Équipements</Label>
        <AmenitiesPicker options={amenityOptions} defaultSelected={selectedAmenities} />
      </div>

      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {listing ? "Enregistrer" : "Créer le logement"}
      </Button>
    </form>
  );
}
