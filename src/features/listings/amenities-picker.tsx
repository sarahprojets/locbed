"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AmenitiesPicker({
  options,
  defaultSelected = [],
}: {
  options: { code: string; name: string }[];
  defaultSelected?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option.code);
        return (
          <Button
            key={option.code}
            type="button"
            size="sm"
            variant={active ? "default" : "outline"}
            onClick={() =>
              setSelected((prev) =>
                active ? prev.filter((c) => c !== option.code) : [...prev, option.code],
              )
            }
          >
            {option.name}
          </Button>
        );
      })}
      {selected.map((code) => (
        <input key={code} type="hidden" name="amenities" value={code} />
      ))}
    </div>
  );
}
