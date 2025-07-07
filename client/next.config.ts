import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: config => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  reactStrictMode: false,
};

export default nextConfig;
