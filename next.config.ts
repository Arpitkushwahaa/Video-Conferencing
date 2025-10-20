import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'img.clerk.com'
        },
        {
            protocol: 'https',
            hostname: 'images.clerk.dev'
        },
        {
            protocol: 'https',
            hostname: 'images.clerk.com'
        },
        {
            protocol: 'https',
            hostname: 'www.gravatar.com'
        },
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com'
        },
        {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com'
        }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@stream-io/video-react-sdk'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
