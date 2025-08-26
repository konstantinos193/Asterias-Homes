import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes room names by removing numbers, so identical rooms display the same name
 * e.g., "Standard Apartment 1" -> "Standard Apartment"
 */
export function normalizeRoomName(roomName: string): string {
  if (!roomName) return "Standard Apartment"
  
  // Remove numbers and extra spaces from room names
  // This ensures "Standard Apartment 1", "Standard Apartment 2", etc. all show as "Standard Apartment"
  return roomName.replace(/\s+\d+$/, '').trim() || "Standard Apartment"
}
