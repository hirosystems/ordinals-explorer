import { redirect } from "next/navigation";
import { API_URL } from "../../../../lib/constants";

const PREVIEW_URL = process.env.NEXT_PUBLIC_PREVIEW_URL;

export async function GET(
  request: Request,
  { params }: { params: { iid: string } }
) {
  if (request.url.includes("hiro.so")) {
    // todo: add this as an ENV config
    // don't show the preview (with potentially unsafe content) on the main domain
    const url = new URL(request.url);
    // todo: add redirect url to ENV config
    url.hostname = "ordinal.vercel.app";
    return redirect(url.toString());
  }

  try {
    const id = params.iid;
    const data = await getInscription(id);
    // todo: errors?

    if (
      data.mime_type.startsWith("image/svg+xml") ||
      data.mime_type.startsWith("text/html")
    ) {
      const res = await fetch(`${API_URL}/inscriptions/${id}/content`);
      return new Response(res.body, {
        status: 200,
        headers: {
          "Content-Type": data.mime_type,
          "Content-Security-Policy": `default-src 'self' ${PREVIEW_URL}; img-src 'self' ${PREVIEW_URL} https://api.hiro.so; script-src 'unsafe-inline' 'unsafe-eval' ${PREVIEW_URL}; style-src 'unsafe-inline' ${PREVIEW_URL}; frame-src 'self' ${PREVIEW_URL}; font-src 'self' ${PREVIEW_URL};`,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response("Not all mime types supported for raw.", {
      status: 401,
    });
  } catch (e) {
    return new Response("500", {
      status: 500,
    });
  }
}

// fetch
async function getInscription(iid: string) {
  const response = await fetch(`${API_URL}/inscriptions/${iid.toLowerCase()}`);
  return await response.json();
}
