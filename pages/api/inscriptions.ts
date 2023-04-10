import type { NextApiRequest, NextApiResponse } from "next";

import data from "../../data/data-gallery.json";

export type GalleryResponse = {
  id: string;
  address: string;
  output_value: string;
  sat: string;
  content_length: string;
  content_type: string;
  timestamp: string;
  genesis_height: string;
  genesis_fee: string;
  genesis_transaction: string;
  location: string;
  output: string;
  offset: string;
}[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GalleryResponse>
) {
  // todo: fake filtering, etc.
  res
    .status(200)
    .json(
      data.slice(
        0,
        parseInt(
          (Array.isArray(req.query.limit)
            ? req.query.limit[0]
            : req.query.limit) ?? "26"
        )
      )
    );
}
