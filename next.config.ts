import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/OmniUtility',
  assetPrefix: '/OmniUtility/',
  images: {
    unoptimized: true,
  },
  
  // ADDED: Silence the Turbopack warning so local dev works perfectly
  turbopack: {},
  
  // 1. Tell Webpack not to bundle Node.js modules for the browser (used during the production build)
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },

  // 2. Set strict Cross-Origin headers for local WebAssembly testing
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;