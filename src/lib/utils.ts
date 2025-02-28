import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (
  ...args: [input: RequestInfo | URL, init?: RequestInit]
) => fetch(...args).then((res) => res.json());
