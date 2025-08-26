import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Build optimizations
  experimental: {
    // optimizeCss: true, // Disabled for static export compatibility
  },
  
  // Development vs production settings
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
