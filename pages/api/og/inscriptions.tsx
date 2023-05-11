import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

import Ellipsis from "../../../components/Ellipsis";
import { ThumbnailIcon } from "../../../components/Thumbnail";
import { API_URL } from "../../../lib/constants";
import { InscriptionResponse } from "../../../lib/types";

export const config = {
  runtime: "edge",
};

// todo: re-add aeonik font when rewriting in puppetteer
const font = fetch(new URL("../../../assets/Inter.ttf", import.meta.url)).then(
  (res) => res.arrayBuffer()
);

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const iid = searchParams.get("id");
  if (!iid) {
    return new ImageResponse(<div>0ops</div>);
  }

  const fontData = await font;

  // todo: error handling
  const inscription = await getInscription(iid);

  const imageUrl = `${API_URL}/inscriptions/${inscription.id}/content`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          fontFamily: '"Inter"',
          fontSize: "32px",
          textRendering: "geometricPrecision",
          padding: "4px 32px",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ordinals.hiro.so/logo.svg"
            alt=""
            width="402px"
            height="42px"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "384px",
              height: "384px",
              aspectRatio: "1/1",
              backgroundColor: "#EBE8E5",
              borderRadius: "13px",
              border: "3px solid #E4E0DC",
              overflow: "hidden",
            }}
          >
            {compatibleTypes.includes(
              inscription.content_type.toLowerCase()
            ) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://ordinals.hiro.so/_next/image?url=${encodeURI(
                  imageUrl
                )}&w=384&q=100`}
                alt=""
                width="100%"
                height="100%"
                style={{
                  imageRendering: "pixelated",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThumbnailIcon
                  inscription={inscription}
                  showImage={false}
                  style={thumbnailIconStyle(inscription.content_type)}
                />
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "48px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "38px", marginRight: "20px" }}>
                Inscription{" "}
              </span>
              <div
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  border: "3px solid #E4E0DC",
                  borderRadius: "12px",
                }}
              >
                #{inscription.number}
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "32px" }}
            >
              <div style={{ display: "flex" }}>
                <span style={{ marginRight: "16px" }}>ID: </span>
                <span style={{ textDecoration: "underline" }}>
                  <Ellipsis text={iid} size={10} />
                </span>
              </div>
              <div style={{ display: "flex" }}>
                <span style={{ marginRight: "16px" }}>Type: </span>
                <span style={{ textDecoration: "underline" }}>
                  {inscription.content_type}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            color: "#8C877D",
          }}
        >
          ordinals.hiro.so
          {/* todo: add top right arrow icon */}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}

async function getInscription(iid: string): Promise<InscriptionResponse> {
  const response = await fetch(`${API_URL}/inscriptions/${iid.toLowerCase()}`);
  return await response.json();
}

// ImageResponse compatible
const compatibleTypes = ["image/jpeg", "image/png", "image/gif"];

function thumbnailIconStyle(type: string) {
  // audio, video
  if (type.startsWith("audio/") || type.startsWith("video/"))
    return {
      width: "120px",
      height: "120px",
    };

  // file, image, text
  return { width: "96px", height: "120px" };
}
