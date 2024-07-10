import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (address: string, n: number = 6) => {
  return address?.length > n
    ? address.slice(0, n) +
        "..." +
        address.slice(address.length - 4, address.length)
    : address;
};
