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

export function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("default", {
    dateStyle: "long",
  }).format(new Date(timestamp));
}

const suffixes = {
  thousand: "K",
  million: "M",
  billion: "B",
};

function getSuffixAndDivisor(number: number) {
  if (number >= 1e9) return { suffix: suffixes.billion, divisor: 1e9 };
  if (number >= 1e6) return { suffix: suffixes.million, divisor: 1e6 };
  if (number >= 1e3) return { suffix: suffixes.thousand, divisor: 1e3 };
  return { suffix: "", divisor: 1 };
}

export function humanReadableCount(number: number, precision: number): string {
  const { suffix, divisor } = getSuffixAndDivisor(Math.abs(number));
  let value = (number / divisor).toFixed(precision);
  value = parseFloat(value).toString(); // Remove trailing zeros
  return Number(value) * divisor === number
    ? `${value}${suffix}`
    : `~${value}${suffix}`;
}

export function truncateAmount(num: string, maxDecimals = 2) {
  const [whole, decimals] = num.split(".");

  if (decimals && !decimals.replace(/0/g, "")) return whole; // return only `whole` if `decimals` is all zeroes

  if (!decimals || decimals.length <= maxDecimals) return num;
  return `${whole}.${decimals.substring(0, maxDecimals)}`;
}
