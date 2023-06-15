import { NextApiRequest, NextApiResponse } from "next";
import { getScreenshot } from "../../../lib/chromium";

type ResponseData = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { iid } = req.query;

    const file = await getScreenshot(`https://ordinals.hiro.so/ogimage/${iid}`);
    // todo: maybe add cache control
    // res.setHeader(
    // 'Cache-Control',
    // `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    // );
    res.statusCode = 200;
    res.setHeader("Content-Type", `image/png`);
    res.end(file);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
    console.error(e);
  }
}
