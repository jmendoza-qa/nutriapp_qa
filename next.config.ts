import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.paulinacocina.net',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      }
    ],
  },
  // Exclude test-related directories and files from Next.js build
  webpack: (config, { isServer }) => {
    // Exclude pages/ directory (Page Objects) and test files from build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/pages/**', // Page Objects directory (not Next.js pages)
        '**/tests/**',
        '**/playwright-report/**',
        '**/test-results/**',
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
    };
    
    // Ignore playwright-core from being processed
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        'playwright-core': false,
      },
    };
    
    return config;
  },
};

export default nextConfig;
