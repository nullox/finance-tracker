import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency } from "./currencies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencyFormatter(currency?: Currency) {
  return Intl.NumberFormat(currency?.locale || "en-US", {
    style: "currency",
    currency: currency?.value || "USD",
  });
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function dateToYMD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function YMDToDate(date: string) {
  const [year, month, day] = splitYMD(date);
  return new Date(year, month - 1, day);
}

export function splitYMD(date: string) {
  const parts = date.split("-");
  return [parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])];
}

export function isYMD(value: string) {
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === dateToYMD(date);
}
