"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      onClick={() => startTransition(onDelete)}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
