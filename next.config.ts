import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ]
  },
  // Simple production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
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
