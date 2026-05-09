import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Split text on the first occurrence of `fragment` (case-insensitive) and return parts */
export function highlightText(text: string, fragment?: string): ReactNode[] {
  if (!fragment) return [text];
  const idx = text.toLowerCase().indexOf(fragment.toLowerCase());
  if (idx === -1) return [text];
  return [
    text.slice(0, idx),
    { __highlight: text.slice(idx, idx + fragment.length) } as unknown as ReactNode,
    text.slice(idx + fragment.length),
  ];
}
