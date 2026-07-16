import { Home } from "lucide-react";

export function PhotoGallery({ photos, title }: { photos: { url: string }[]; title: string }) {
  if (photos.length === 0) {
    return (
      <div className="flex aspect-16/9 items-center justify-center rounded-xl bg-muted">
        <Home className="size-10 text-muted-foreground" />
      </div>
    );
  }

  const [cover, ...rest] = photos;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2 sm:aspect-16/7">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cover.url}
        alt={title}
        className="aspect-16/9 w-full rounded-xl object-cover sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full"
      />
      {rest.slice(0, 4).map((photo, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={photo.url}
          alt={`${title} ${i + 2}`}
          className="hidden aspect-square w-full rounded-xl object-cover sm:block sm:h-full"
        />
      ))}
    </div>
  );
}
