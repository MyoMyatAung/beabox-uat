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
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );
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

export const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

export function formatDateTime(
  timestampInSeconds: number,
  timeZone: string
): string {
  const date = new Date(timestampInSeconds * 1000); // Convert seconds to milliseconds

  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone || "UTC",
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  // Format as yy-mm-dd hh:mm
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}`;
}

export function isWebView() {
  return (
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.jsBridge
  );
}

export const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    approved: "已批准",
    pending: "待处理",
    rejected: "已拒绝",
    success: "成功",
    failed: "失败",
    declined: "已拒绝",
  };

  return statusMap[status.toLowerCase()] || status;
};

// Simple encoding/decoding functions
export const encodePassword = (password: string): string => {
  return btoa(password); // Base64 encode
};

export const decodePassword = (encodedPassword: string): string => {
  return atob(encodedPassword); // Base64 decode
};
