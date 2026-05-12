import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Split text by the first case-insensitive occurrence of `fragment` into [before, match, after]. */
export function splitHighlight(
  text: string,
  fragment?: string,
): { before: string; match: string; after: string } | null {
  if (!fragment) return null;
  const idx = text.toLowerCase().indexOf(fragment.toLowerCase());
  if (idx === -1) return null;
  return {
    before: text.slice(0, idx),
    match: text.slice(idx, idx + fragment.length),
    after: text.slice(idx + fragment.length),
  };
}
