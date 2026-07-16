"use client";

import { useTransition } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setListingStatus } from "@/features/admin/actions";
import type { ListingStatus } from "@/types/database.types";

export function ListingRowActions({
  listingId,
  status,
}: {
  listingId: string;
  status: ListingStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" disabled={pending} />}>
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== "published" ? (
          <DropdownMenuItem
            onClick={() => startTransition(() => setListingStatus(listingId, "published"))}
          >
            Republier
          </DropdownMenuItem>
        ) : null}
        {status !== "suspended" ? (
          <DropdownMenuItem
            onClick={() => startTransition(() => setListingStatus(listingId, "suspended"))}
          >
            Suspendre
          </DropdownMenuItem>
        ) : null}
        {status !== "archived" ? (
          <DropdownMenuItem
            onClick={() => startTransition(() => setListingStatus(listingId, "archived"))}
          >
            Archiver
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
