import { atom } from "jotai";

export const lastInscriptionDataAtom = atom<{
  number: string;
  date: Date;
} | null>(null);
