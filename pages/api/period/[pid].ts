import type { NextApiRequest, NextApiResponse } from "next";

import data from "../../../data/data-cycles-blocks.json";

type DataType = { [key: string]: { [key: string]: number } };

export type PeriodResponse = [string, number][];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PeriodResponse>
) {
  const { pid } = req.query;

  if (typeof pid !== "string") return res.status(400);
  if (!(pid in data)) return res.status(400);

  res.status(200).json(Object.entries((data as DataType)[pid]));
}
