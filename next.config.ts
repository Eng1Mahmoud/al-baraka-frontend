import type { NextConfig } from "next";

/** Where the Express API actually lives. Server-side only — the browser never sees it. */
const apiOrigin = process.env.API_ORIGIN ;

const nextConfig: NextConfig = {
  /**
   * The API is served from this app's own origin and forwarded on from here.
   *
   * The alternative — the browser calling Render directly — puts the session cookie on
   * the API's domain, where `proxy.ts` cannot read it: the gate on /dashboard runs on
   * this domain and is only sent this domain's cookies, so it saw no session however
   * well the login had gone and bounced every visit straight back to /login. Coming
   * through here the cookie is first-party, which is also what lets it drop
   * SameSite=None and the CORS allowance it needed to travel cross-site.
   */
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiOrigin}/api/:path*` }];
  },
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
