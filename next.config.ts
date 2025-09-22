import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // BlockNote is not yet compatible with React 19 StrictMode
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
