import type { NextApiRequest, NextApiResponse } from "next";

import data from "../../../../../data/api/v1-inscriptions.json";
import { InscriptionResponse } from "./[iid]";
export type { InscriptionResponse } from "./[iid]";

export type InscriptionListResponse = {
  limit: number;
  offset: number;
  total: number;
  results: InscriptionResponse[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<InscriptionListResponse>
) {
  res.status(200).json(data);
}
