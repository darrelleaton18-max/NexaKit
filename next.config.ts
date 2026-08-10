import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Change 'OmniUtility' if your exact GitHub repository case-sensitivity differs
  basePath: '/OmniUtility',
  assetPrefix: '/OmniUtility/',
  images: {
    unoptimized: true, // Required for static GitHub Pages export
  },
};

export default nextConfig;