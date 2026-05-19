import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const emptyPolyfill = "./src/empty-polyfill.js";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "core-js/modules/es.array.at": emptyPolyfill,
      "core-js/modules/es.array.flat": emptyPolyfill,
      "core-js/modules/es.array.flat-map": emptyPolyfill,
      "core-js/modules/es.object.from-entries": emptyPolyfill,
      "core-js/modules/es.object.has-own": emptyPolyfill,
      "core-js/modules/es.string.trim-end": emptyPolyfill,
      "core-js/modules/es.string.trim-start": emptyPolyfill,
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.microlink.io" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "devanshuverma.in" }],
        destination: "https://www.devanshuverma.in/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
