import type { NextApiRequest, NextApiResponse } from "next";

import data from "../../../../../data/api/v1-inscriptions.json";

export type InscriptionResponse = {
  id: string;
  number: number;
  address: string;
  genesis_block_height: number;
  genesis_block_hash: string;
  genesis_tx_id: string;
  genesis_fee: string;
  location: string;
  output: string;
  offset: string;
  sat_ordinal: string;
  sat_rarity: string;
  mime_type: string;
  content_type: string;
  content_length: number;
  timestamp: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<InscriptionResponse>
) {
  const { iid } = req.query;

  if (typeof iid !== "string") return res.status(400);

  const inscription = data.results.filter((result) => result.id === iid)[0];

  if (!inscription) return res.status(404);

  res.status(200).json(inscription);
}
