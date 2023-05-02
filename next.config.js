/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.hiro.so",
      },
    ],
  },

  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
      {
        source: "/AeonikFono-Regular.woff",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/AeonikFono-Regular.woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  redirects: async () => {
    return [
      {
        source: "/content/:iid",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/inscriptions/:iid/content`,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
