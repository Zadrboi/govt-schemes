import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: '#1e40af',
          light: '#eff6ff',
          dark: '#60a5fa',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: '#0369a1',
          light: '#f0f9ff',
          dark: '#38bdf8',
        },
        accentCard: {
          DEFAULT: 'var(--accent-card)',
          dark: '#7dd3fc',
        },
        pill: {
          DEFAULT: 'var(--pill)',
          text: 'var(--pill-text)',
        },
        line: 'var(--line)',
        surface: {
          DEFAULT: 'var(--surface)',
          glass: 'var(--surface-glass)',
        },
      },
      borderRadius: {
        card: '22px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.04em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
};

export default config;
