"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createBookingRequest,
  type BookingActionState,
} from "@/features/bookings/actions";

const initialState: BookingActionState = { error: null };

export function BookingRequestForm({
  listingId,
  pricePerNight,
  isOwnListing,
  isLoggedIn,
}: {
  listingId: string;
  pricePerNight: number;
  isOwnListing: boolean;
  isLoggedIn: boolean;
}) {
  const [state, formAction, pending] = useActionState(createBookingRequest, initialState);

  if (isOwnListing) {
    return (
      <p className="text-sm text-muted-foreground">C&apos;est votre propre logement.</p>
    );
  }

  if (state.success) {
    return (
      <p className="text-sm">
        Demande envoyée ! Le propriétaire va y répondre depuis sa messagerie.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="listingId" value={listingId} />
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="startDate">Arrivée</Label>
          <Input id="startDate" name="startDate" type="date" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="endDate">Départ</Label>
          <Input id="endDate" name="endDate" type="date" required />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="guestsCount">Voyageurs</Label>
        <Input id="guestsCount" name="guestsCount" type="number" min={1} defaultValue={1} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proposedPrice">Proposer un prix par nuit (optionnel)</Label>
        <Input
          id="proposedPrice"
          name="proposedPrice"
          type="number"
          min={0}
          placeholder={`${pricePerNight}€`}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message au propriétaire</Label>
        <Textarea id="message" name="message" rows={3} />
      </div>
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {isLoggedIn ? "Envoyer la demande" : "Se connecter pour réserver"}
      </Button>
    </form>
  );
}
