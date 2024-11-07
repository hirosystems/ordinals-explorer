export const TILE_SIZE = 16;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.hiro.so/ordinals/v1";

export const API_BETA_URL = process.env.NEXT_PUBLIC_API_BETA_URL ?? API_URL;

export const UNSAFE_API_URL =
  process.env.NEXT_PUBLIC_UNSAFE_API_URL ??
  "https://ordinals-preview.vercel.app";
