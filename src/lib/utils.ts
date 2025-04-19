/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// date formatter

export const dateForamtter = (date: any) => {
  const timestamp = new Date(date);
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - timestamp.getTime();
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  const differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60)
  );
  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );
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
