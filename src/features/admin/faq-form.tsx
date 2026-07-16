"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFaqItem, type ContentActionState } from "@/features/admin/content-actions";

const initialState: ContentActionState = { error: null };

export function FaqForm() {
  const [state, formAction, pending] = useActionState(createFaqItem, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-3 rounded-xl border p-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="answer">Réponse</Label>
        <Textarea id="answer" name="answer" rows={3} required />
      </div>
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="w-fit">
        Ajouter
      </Button>
    </form>
  );
}
