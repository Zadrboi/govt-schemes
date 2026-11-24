import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Drishti — Civic Infrastructure & Scheme Monitoring',
    short_name: 'Drishti',
    description: 'Statutory Scheme Monitoring and Social Audit Ledger for Assam and North East India',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#070c16',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
