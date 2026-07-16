"use client";

import { useRef, useState, useTransition } from "react";
import { Star, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { deletePhoto, setCoverPhoto } from "@/features/listings/actions";
import { useRouter } from "@/i18n/navigation";

type Photo = { id: string; url: string; is_cover: boolean };

export function PhotoUploader({
  listingId,
  photos,
}: {
  listingId: string;
  photos: Photo[];
}) {
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const path = `${listingId}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-photos")
        .upload(path, file);
      if (uploadError) continue;

      await supabase.from("listing_photos").insert({
        listing_id: listingId,
        storage_path: path,
        is_cover: photos.length === 0,
        position: photos.length,
      });
    }

    setUploading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" className="size-full object-cover" />
            {photo.is_cover ? (
              <span className="absolute left-1 top-1 rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium">
                Photo principale
              </span>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-linear-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              {!photo.is_cover ? (
                <Button
                  type="button"
                  size="icon-xs"
                  variant="secondary"
                  disabled={pending}
                  onClick={() => startTransition(() => setCoverPhoto(photo.id, listingId))}
                >
                  <Star className="size-3" />
                </Button>
              ) : null}
              <Button
                type="button"
                size="icon-xs"
                variant="destructive"
                disabled={pending}
                onClick={() => startTransition(() => deletePhoto(photo.id, listingId))}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        ))}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:bg-muted"
        >
          <Upload className="size-4" />
          {uploading ? "Envoi..." : "Ajouter"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
