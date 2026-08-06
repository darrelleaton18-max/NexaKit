import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/NexaKit',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;