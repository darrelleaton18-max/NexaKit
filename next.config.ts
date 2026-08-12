import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/OmniUtility',
  assetPrefix: '/OmniUtility/',
  images: {
    unoptimized: true,
  },
  
  // Silence the Turbopack warning so local dev works perfectly
  turbopack: {},
  
  // 1. Tell Webpack not to bundle Node.js modules for the browser
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },

  // 2. FFmpeg Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;