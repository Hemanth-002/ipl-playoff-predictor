import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Match } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRemainingMatches(matches: Match[]) {
  return matches.filter((match) => !match.isCompleted);
}
