import type { NextApiRequest, NextApiResponse } from "next";

import data from "../../../data/data-blocks.json";
const dataMap = new Map<string, string[]>(data as [string, string[]][]);

export type BlockResponse = string[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlockResponse>
) {
  const { bid } = req.query;

  if (typeof bid !== "string") return res.status(400);
  if (!dataMap.has(bid)) return res.status(400);

  res.status(200).json(dataMap.get(bid)!);
}
