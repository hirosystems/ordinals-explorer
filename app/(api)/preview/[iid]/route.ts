import { API_URL } from "../../../../lib/constants";
import { getFontSize } from "../../../../lib/utils";
import { InscriptionResponse } from "../../../../lib/types";

export async function GET(
  request: Request,
  { params }: { params: { iid: string } }
) {
  if (request.url.includes("hiro.so")) {
    // todo: add this as an ENV config
    // don't show the preview (with potentially unsafe content) on the main domain
    return new Response("Arbitrary previews not allowed on this domain.", {
      status: 400,
    });
  }

  try {
    const id = params.iid;
    const data = await getInscription(id);
    // todo: errors

    return new Response(await page(data), {
      status: 200,

      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(await pageEmpty(), {
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

// todo: potentially render these pages directly from the api (faster db access)
// todo: remove css loading from this route group
async function page(data: InscriptionResponse): Promise<string> {
  // todo: add error handling and 404 etc.

  if (data.mime_type.startsWith("image/")) {
    return html(bodyWithImage(data));
  } else if (data.mime_type.startsWith("video/")) {
    return html(bodyWithVideo(data));
  } else if (data.mime_type.startsWith("audio/")) {
    return html(bodyWithAudio(data));
  } else if (data.mime_type.startsWith("text/")) {
    // todo: don't fetch content if big?
    const content = await getContent(data.id);

    if (data.mime_type.startsWith("text/html")) {
      return content;
    }

    return htmlWithFont(
      data.content_length < 32
        ? bodyWithTextShort(data, content)
        : bodyWithText(data, content)
    );
  } else if (data.mime_type.startsWith("application/json")) {
    // todo: don't fetch content if big?
    const content = await getContent(data.id);

    return htmlWithFont(bodyWithText(data, content));
  }

  // todo: more types
  return html(bodyWithFile(data));
}

function html(children: string) {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="format-detection" content="telephone=no" />
        <style>
          * {
            margin: 0;
            box-sizing: border-box;
          }
          html,
          body {
            min-height: 100vh;
            image-rendering: pixelated;
          }
          html {
            height: 100%;
          }
          body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #F2F0ED;
          }
        </style>
      </head>
      ${children}
    </html>`;
}

function htmlWithFont(children: string) {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="format-detection" content="telephone=no" />
        <style>
          @font-face {
            font-family: "Aeonik Fono";
            src: url("https://alphaassets.hiro.so/AeonikFono-Regular.woff2") format("woff2"),
              url("https://alphaassets.hiro.so/AeonikFono-Regular.woff") format("woff");
            font-weight: normal;
            font-style: normal;
            font-display: block;
          }
          * {
            margin: 0;
            box-sizing: border-box;
          }
          html,
          body {
            min-height: 100vh;
            image-rendering: pixelated;
            font-family: "Aeonik Fono", sans-serif;
          }
          html {
            height: 100%;
          }
          body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #F2F0ED;
          }
        </style>
      </head>
      ${children}
    </html>`;
}

// Preview Image stretched to square / container
// function PreviewImage(params: { iid: string }) {
//   return (
//     <body
//       style={{
//         align-items: center,
//         justify-content: "space-around",
//         display: "flex",
//         height: "100%",
//         margin: 0,
//       }}
//     >
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         src={`${API_URL}/inscriptions/${data.id}/content`}
//         alt="Inscription image"
//         style={{ height: "100%", width: "100%", imageRendering: "pixelated" }}
//         width="100%"
//         height="100%"
//       />
//     </body>
//   );
// }

// bodies

function bodyWithImage(data: InscriptionResponse) {
  return `
    <body style="background-image: url(${API_URL}/inscriptions/${data.id}/content); background-position: center; background-repeat: no-repeat; background-size: contain; height: 100%; image-rendering: pixelated;>
      <img src="${API_URL}/inscriptions/${data.id}/content" alt="Inscription image" style="image-rendering: pixelated; opacity: 0;"
        width="100%"
        height="100%"
      />
    </body>`;
}

function bodyWithVideo(data: InscriptionResponse) {
  // todo: add bg color? for non square videos
  return `<body style="align-items: center; display: flex; height: 100%;">
      <video
        autoPlay
        controls
        loop
        muted
        style="width: 100%; height: 100%";"
      >
        <source src="${API_URL}/inscriptions/${data.id}/content" />
      </video>
    </body>`;
}

function bodyWithAudio(data: InscriptionResponse) {
  return `<body
      style={{
        align-items: center,
        justify-content: "space-around",
        display: "flex",
        height: "100%",
        margin: 0,
      }}
    >
      <audio controls style={{ width: "100%" }}>
        <source src="${API_URL}/inscriptions/${data.id}/content" />
      </audio>
    </body>`;
}

function bodyWithText(data: InscriptionResponse, text: string) {
  return `
  <body style="display: flex; align-items: center; width: 100%; aspect-atio: 1/1; position: relative; overflow: hidden; padding: 3px; text-rendering: geometricPrecision;">
    <p style="display: inline-block; width: 100%; padding: 4px; word-break: break-all; white-space: pre-wrap; font-size: ${getFontSize(
      data.content_length
    )}">${text}</p>
    <div style="background: linear-gradient(rgba(242, 240, 237, 0),rgba(242, 240, 237, 0),rgba(242, 240, 237, 1)); position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
  </body>`;
}

function bodyWithTextShort(data: InscriptionResponse, text: string) {
  return `
    <body style="display: flex; align-items: center; justify-content: space-around; width: 100%; height: 100%; padding: 3px; text-rendering: geometricPrecision;">
      <p style="display: inline-block; width: 100%; padding: 4px; word-break: break-all; text-align: center; font-size: 24px;">${text}</p>
    </body>`;
}

function pageEmpty() {
  return `<html><body style="width: 100%; height: 100%; background: #CFC9C2;"></body></html>`;
}

function bodyWithFile(data: InscriptionResponse) {
  return `
    <body style="display: flex; align-items: center; justify-content: space-around; width: 100%; height: 100%;">
      <div style="width: 48px">
        ${iconFile()}
      </div>
    </body>`;
}

// fetch
async function getInscription(iid: string) {
  const response = await fetch(`${API_URL}/inscriptions/${iid.toLowerCase()}`);
  return await response.json();
}

async function getContent(iid: string) {
  const response = await fetch(`${API_URL}/inscriptions/${iid}/content`);
  return await response.text();
}

// icons

function iconFile() {
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 30"
    >
      <path
        stroke="#AEA8A0"
        stroke-linecap="square"
        stroke-linejoin="bevel"
        d="M22.308 28.97H1.692a1.145 1.145 0 0 1-1.146-1.146V2.625A1.145 1.145 0 0 1 1.692 1.48h13.744l8.018 8.018v18.326a1.145 1.145 0 0 1-1.146 1.145Z"
      />
      <path
        fill="#AEA8A0"
        d="M5.06 18.623v-2.234h2.117v-.584H5.06v-1.708h2.504v-.584h-3.14v5.11h.636ZM11.352 13.513H8.476v.526H9.6v4.058H8.476v.526h2.876v-.526h-1.117V14.04h1.117v-.526ZM15.56 18.623v-.584h-2.293v-4.526h-.634v5.11h2.927ZM19.82 18.623v-.584h-2.605v-1.723h2.109v-.584h-2.11v-1.635h2.512v-.584H16.58v5.11h3.24Z"
      />
      <path
        stroke="#AEA8A0"
        stroke-width=".44"
        d="M5.06 18.623v-2.234h2.117v-.584H5.06v-1.708h2.504v-.584h-3.14v5.11h.636ZM11.352 13.513H8.476v.526H9.6v4.058H8.476v.526h2.876v-.526h-1.117V14.04h1.117v-.526ZM15.56 18.623v-.584h-2.293v-4.526h-.634v5.11h2.927ZM19.82 18.623v-.584h-2.605v-1.723h2.109v-.584h-2.11v-1.635h2.512v-.584H16.58v5.11h3.24Z"
      />
      <path
        stroke="#AEA8A0"
        stroke-linecap="square"
        stroke-linejoin="bevel"
        d="M15.436 1.871v7.626h7.606"
      />
    </svg>`;
}

function iconAudio() {
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 23 18"
    >
      <path
        stroke="#AEA8A0"
        stroke-linecap="square"
        stroke-linejoin="bevel"
        stroke-width="1.417"
        d="M1.585 12.95V5.814h5.352l5.352-4.46V17.41l-5.352-4.46H1.585ZM19.425 3.807a7.137 7.137 0 0 1 0 11.15"
      />
    </svg>`;
}

function iconImage() {
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 30"
    >
      <path
        stroke="#AEA8A0"
        stroke-linecap="square"
        stroke-linejoin="bevel"
        d="M22.308 28.97H1.692a1.145 1.145 0 0 1-1.146-1.146V2.625A1.145 1.145 0 0 1 1.692 1.48h13.744l8.018 8.018v18.326a1.146 1.146 0 0 1-1.146 1.145Z"
      />
      <path
        stroke="#AEA8A0"
        stroke-linecap="square"
        stroke-linejoin="bevel"
        d="M15.436 1.871v7.626h7.606"
      />
      <path
        stroke="#AEA8A0"
        d="m1 20.5 4.002-4.699a1 1 0 0 1 1.447-.08l6.183 5.833a1 1 0 0 0 1.073.195l3.502-1.468a1 1 0 0 1 .71-.024L23 22"
      />
      <circle cx="16.733" cy="14.5" r=".5" stroke="#AEA8A0" />
    </svg>`;
}

function iconText() {
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 30"
    >
      <path
        stroke="#AEA8A0"
        stroke-linecap="square"
        stroke-linejoin="bevel"
        d="M22.308 28.97H1.692a1.145 1.145 0 0 1-1.146-1.146V2.625A1.145 1.145 0 0 1 1.692 1.48h13.744l8.018 8.018v18.326a1.145 1.145 0 0 1-1.146 1.145Z"
      />
      <path
        stroke="#AEA8A0"
        stroke-linecap="square"
        stroke-linejoin="bevel"
        d="M15.436 1.871v7.626h7.606"
      />
      <path
        fill="#AEA8A0"
        d="M7.07 19.311v-4.98h1.825v-.643H4.548v.642h1.824v4.981h.699ZM10.362 19.311l1.55-2.362 1.567 2.362h.828L12.37 16.38l1.816-2.692h-.803l-1.447 2.178-1.446-2.178h-.82l1.816 2.74-1.936 2.884h.812ZM17.486 19.311v-4.98h1.824v-.643h-4.347v.642h1.824v4.981h.699Z"
      />
      <path
        stroke="#AEA8A0"
        stroke-width=".551"
        d="M7.07 19.311v-4.98h1.825v-.643H4.548v.642h1.824v4.981h.699ZM10.362 19.311l1.55-2.362 1.567 2.362h.828L12.37 16.38l1.816-2.692h-.803l-1.447 2.178-1.446-2.178h-.82l1.816 2.74-1.936 2.884h.812ZM17.486 19.311v-4.98h1.824v-.643h-4.347v.642h1.824v4.981h.699Z"
      />
    </svg>`;
}

function iconVideo() {
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 26 25"
    >
      <rect
        width="22.877"
        height="22.877"
        x="1.561"
        y="1.341"
        stroke="#AEA8A0"
        stroke-width="1.2"
        rx="11.438"
      />
      <path
        stroke="#AEA8A0"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.2"
        d="m16.986 12.78-6.118-3.974v7.947l6.118-3.973Z"
      />
    </svg>`;
}
