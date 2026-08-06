import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/NexaKit',
  assetPrefix: '/NexaKit/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;