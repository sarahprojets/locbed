"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarRatingInput({ name, label }: { name: string; label: string }) {
  const [value, setValue] = useState(5);

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} étoiles`}
            onClick={() => setValue(n)}
            className="p-0.5"
          >
            <Star className={n <= value ? "size-5 fill-primary text-primary" : "size-5 text-muted-foreground"} />
          </button>
        ))}
        <input type="hidden" name={name} value={value} />
      </div>
    </div>
  );
}
