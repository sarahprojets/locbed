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
import { setUserSuspended, setUserRole } from "@/features/admin/actions";

export function UserRowActions({
  userId,
  isSuspended,
  role,
}: {
  userId: string;
  isSuspended: boolean;
  role: "voyageur" | "proprietaire" | "admin";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" disabled={pending} />}>
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => startTransition(() => setUserSuspended(userId, !isSuspended))}
        >
          {isSuspended ? "Réactiver le compte" : "Suspendre le compte"}
        </DropdownMenuItem>
        {role !== "proprietaire" ? (
          <DropdownMenuItem onClick={() => startTransition(() => setUserRole(userId, "proprietaire"))}>
            Passer propriétaire
          </DropdownMenuItem>
        ) : null}
        {role !== "voyageur" ? (
          <DropdownMenuItem onClick={() => startTransition(() => setUserRole(userId, "voyageur"))}>
            Passer voyageur
          </DropdownMenuItem>
        ) : null}
        {role !== "admin" ? (
          <DropdownMenuItem onClick={() => startTransition(() => setUserRole(userId, "admin"))}>
            Promouvoir admin
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
