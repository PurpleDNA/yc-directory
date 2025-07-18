import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: "incremental",
    // after: true
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
