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
import { createBlogPost, type ContentActionState } from "@/features/admin/content-actions";

const initialState: ContentActionState = { error: null };

export function BlogPostForm() {
  const [state, formAction, pending] = useActionState(createBlogPost, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="excerpt">Résumé</Label>
        <Input id="excerpt" name="excerpt" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="audience">Audience</Label>
        <Select name="audience" defaultValue="both">
          <SelectTrigger id="audience">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="both">Tous</SelectItem>
            <SelectItem value="voyageur">Voyageurs</SelectItem>
            <SelectItem value="proprietaire">Propriétaires</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Contenu</Label>
        <Textarea id="content" name="content" rows={12} required />
      </div>
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="w-fit">
        Publier
      </Button>
    </form>
  );
}
