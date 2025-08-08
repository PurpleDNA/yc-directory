import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}

export function pagination<T>(array: T[]) {
  const pages = [];
  let num = 0;
  for (let i = 0; i < array.length / 9; i++) {
    const split = array.slice(num, num + 9);
    pages.push(split);
    num = num + 9;
  }
  return pages;
}
