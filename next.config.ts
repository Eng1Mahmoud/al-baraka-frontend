import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Product images are served from the Sirv account configured in .env
        hostname: process.env.NEXT_PUBLIC_SIRV_DOMAIN ?? "**.sirv.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // The service worker must not be cached, or push/offline fixes never ship.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
