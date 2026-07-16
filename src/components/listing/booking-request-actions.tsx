"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { respondToBookingRequest } from "@/features/bookings/actions";

export function BookingRequestActions({ requestId }: { requestId: string }) {
  const [countering, setCountering] = useState(false);
  const [counterPrice, setCounterPrice] = useState("");
  const [pending, startTransition] = useTransition();

  if (countering) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Prix/nuit"
          value={counterPrice}
          onChange={(e) => setCounterPrice(e.target.value)}
          className="h-8 w-28"
        />
        <Button
          size="sm"
          disabled={pending || !counterPrice}
          onClick={() =>
            startTransition(() =>
              respondToBookingRequest(requestId, "countered", Number(counterPrice)),
            )
          }
        >
          Envoyer
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCountering(false)}>
          Annuler
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        disabled={pending}
        onClick={() => startTransition(() => respondToBookingRequest(requestId, "accepted"))}
      >
        Accepter
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => setCountering(true)}
      >
        Contre-offre
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => startTransition(() => respondToBookingRequest(requestId, "refused"))}
      >
        Refuser
      </Button>
    </div>
  );
}
