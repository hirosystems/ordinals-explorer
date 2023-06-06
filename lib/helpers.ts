import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function periodIdToBlockHeight(periodId: number): number {
  return periodId * 210_000;
}

export function blockHeightToPeriodId(blockHeight: number): number {
  return Math.floor(blockHeight / 210_000);
}

export function blockHeightToMinedSats(blockHeight: number): bigint {
  const period = blockHeightToPeriodId(blockHeight);

  let reward = 50n * 100_000_000n;
  let sum = 0n;

  for (let c = 0; c < period; c++, reward /= 2n) {
    sum += reward * 210_000n;
  }

  const remaining = BigInt(blockHeight - periodIdToBlockHeight(period));
  return sum + remaining * reward;
}

export function blockHeightToRewardSats(blockHeight: number) {
  return (
    (210_000n * 100_000_000n) / 2n ** BigInt(blockHeightToPeriodId(blockHeight))
  );
}

export function scrollIntoView(
  element: HTMLElement | SVGElement | null,
  offset: number = 0
) {
  if (!element) return;
  const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

// https://swr.vercel.app/docs/getting-started
export const fetcher = (...args: any[]) => {
  // if first arg is array, consider the second arg as options
  if (Array.isArray(args[0]))
    return fetch(args[0][0], args[0][1]).then((res) => res.json());
  // @ts-ignore
  return fetch(...args).then((res) => res.json());
};

export const textFetcher = (...args: any[]) => {
  // if first arg is array, consider the second arg as options
  if (Array.isArray(args[0]))
    return fetch(args[0][0], args[0][1]).then((res) => res.text());
  // @ts-ignore
  return fetch(...args).then((res) => res.text());
};

// helper for textual inscription previews/renders
export function getFontSize(contentLength: number) {
  if (contentLength < 10) return 22;
  if (contentLength < 50) return 20;
  return 14;
}

export function formatDateTime(timestamp: number) {
  return new Intl.DateTimeFormat("default", {
    dateStyle: "long",
    timeStyle: "medium",
  }).format(new Date(timestamp));
}
