import { API_URL } from "../../lib/constants";
import "./globals.css";

import Script from "next/script";

export async function generateMetadata() {
  return {
    openGraph: {
      title: "Ordinals — Hiro", // todo: add inscription number
      description: "An Ordinals Explorer built using Hiro APIs and tools",
      url: "https://ordinals.hiro.so",
      siteName: "Ordinals — Hiro",
      images: [
        {
          url: "/og-image.png",
          width: 1201,
          height: 601,
        },
      ],
      locale: "en-US",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}

      <head>
        {/* todo: add better touch icon for apple */}
        {/* <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        /> */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        {/* todo: optimize autogenerated web manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#CFC9C2" />
        <meta name="msapplication-TileColor" content="#CFC9C2" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          httpEquiv="Content-Security-Policy"
          content={`frame-src ${
            process.env.NODE_ENV === "production"
              ? ""
              : " http://localhost:3000"
          } https://api.hiro.so https://ordinals.hiro.so;`}
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PFK4WN9');`}
        </Script>
      </head>
      <body className="flex flex-col justify-between min-h-screen">
        {children}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PFK4WN9"
            style={{ display: "none", visibility: "hidden" }}
            height="0"
            width="0"
          />
        </noscript>
      </body>
    </html>
  );
}
