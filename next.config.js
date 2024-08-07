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
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" }
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
      {
        source: "/-/content/:iid",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/inscriptions/:iid/content`,
        permanent: false,
      },
      {
        source: "/explore",
        destination: `/inscriptions`,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
