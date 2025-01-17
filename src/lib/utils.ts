import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// date formatter
const timestamp = new Date("2025-01-11T08:18:13.000000Z");
const now = new Date();
const differenceInMilliseconds = now - timestamp;
const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
const differenceInHours = Math.floor(
  differenceInMilliseconds / (1000 * 60 * 60)
);
const differenceInDays = Math.floor(
  differenceInMilliseconds / (1000 * 60 * 60 * 24)
);

export const dateForamtter = (date: any) => {
  let result = "";
  if (differenceInMinutes < 60) {
    result = `${differenceInMinutes} min`;
  } else if (differenceInHours < 24) {
    result = `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""}`;
  } else {
    result = `${differenceInDays} day${differenceInDays > 1 ? "s" : ""}`;
  }
  return result;
};
