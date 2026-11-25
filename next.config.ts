import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
  },
  // Handle node: protocol imports from sharp and other native modules
  webpack: (config, { isServer }) => {
    // Handle node: protocol imports - use externals for server, fallback for client
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'sharp',
        'exifr',
        /^node:/,
      ];
    } else {
      // Client-side: provide empty modules for node: built-ins
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        module: false,
        'node:fs': false,
        'node:net': false,
        'node:tls': false,
        'node:crypto': false,
        'node:stream': false,
        'node:url': false,
        'node:zlib': false,
        'node:http': false,
        'node:https': false,
        'node:assert': false,
        'node:os': false,
        'node:path': false,
        'node:child_process': false,
        'node:module': false,
      };
    }
    
    // Ignore node: protocol warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/sharp/ },
      { message: /node:/ },
    ];
    
    return config;
  },
  // Exclude sharp from client bundle (Next.js 15+)
  serverExternalPackages: ['sharp', 'exifr'],
  async headers() {
    return [
      // Global security headers
      {
        source: '/:path*',
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=(self), interest-cohort=()',
          },
        ],
      },
      // CSP for HTML pages
      {
        source: '/((?!api|_next|images|favicon).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: https://tile.openstreetmap.org https://*.tile.openstreetmap.org",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // Stricter CSP for API routes
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'none'; frame-ancestors 'none'",
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
          {
            key: 'X-RateLimit-Limit',
            value: '30',
          },
        ],
      },
      // Private routes - no cache
      {
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
        ],
      },
      {
        source: '/grievances/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
        ],
      },
      {
        source: '/field-verify/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
        ],
      },
    ];
  },
};

export default nextConfig;