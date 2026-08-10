"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

interface SearchInputProps {
  /** The committed term. Kept apart from what is being typed. */
  value: string;
  /** Called once typing settles. Safe to pass inline — see the commit guard below. */
  onChange: (value: string) => void;
  /** For a visible <Label htmlFor>. Without one, `label` becomes the aria-label. */
  id?: string;
  label: string;
  placeholder?: string;
  className?: string;
}

/**
 * A search box that reports its term only once typing settles.
 *
 * The draft is local state so the field stays responsive; the settled value is what
 * reaches the caller, and through it the query key.
 */
export function SearchInput({
  value,
  onChange,
  id,
  label,
  placeholder,
  className,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  const settled = useDebouncedValue(draft.trim());

  // What was last handed out, rather than comparing against `value`: a caller that
  // does not echo the term back — or echoes it a render late — would otherwise be
  // called again on every render with the same string, and one that navigates on
  // change would do so in a loop.
  const committed = useRef(value);

  useEffect(() => {
    if (settled === committed.current) return;

    committed.current = settled;
    onChange(settled);
  }, [settled, onChange]);

  // Follows the term being changed from outside — a "clear all filters" button, or a
  // link arriving with one in the query string. Guarded on `committed` so it ignores
  // the echo of the caller applying what was just typed.
  useEffect(() => {
    if (value === committed.current) return;

    committed.current = value;
    setDraft(value);
  }, [value]);

  const clear = () => {
    setDraft("");
    committed.current = "";
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />

      <Input
        id={id}
        // Deliberately `text`, not `search`: WebKit and Blink draw their own clear
        // button inside a search field, which sat right next to the one below — two
        // crosses, only one of which reached our state.
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-label={id ? undefined : label}
        placeholder={placeholder}
        // Room for the icon at one end and the clear button at the other.
        className="ps-9 pe-9"
      />

      {draft && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={clear}
          aria-label="مسح البحث"
          className="absolute top-1/2 end-1 -translate-y-1/2 text-muted-foreground"
        >
          <X className="size-4" aria-hidden />
        </Button>
      )}
    </div>
  );
}
