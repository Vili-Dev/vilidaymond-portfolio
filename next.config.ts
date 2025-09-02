import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  // Remove 'export' output for Netlify compatibility with API routes
  // Netlify will handle the deployment automatically
  trailingSlash: true,
  
  // Image optimization
  images: {
    // Keep unoptimized for Netlify compatibility
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'scontent-cdg4-2.cdninstagram.com',
      'scontent-cdg4-1.cdninstagram.com',
      'instagram.com'
    ],
  },
  
  // Build optimizations
  experimental: {
    turbo: {
      // Turbopack optimizations
    }
  },
  
  // Environment variable handling
  env: {
    NEXT_PUBLIC_PORTFOLIO_NAME: process.env.NEXT_PUBLIC_PORTFOLIO_NAME,
    NEXT_PUBLIC_INSTAGRAM_HANDLE: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE,
  },
  
  // Development vs production settings
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // Netlify-specific optimizations
  ...(process.env.NETLIFY && {
    // Netlify-specific settings
    poweredByHeader: false,
    generateEtags: false,
  }),
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(nextConfig);
