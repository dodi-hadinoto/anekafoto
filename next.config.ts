import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Also ignoring TS errors to ensure we get a binary to test routing
  },
};

export default nextConfig;
