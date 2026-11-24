import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SahayAIBot from '@/components/SahayAIBot';
import SmoothScroll from '@/components/SmoothScroll';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Drishti (দৃষ্টি) — Scheme Monitoring & Statutory Audit',
  description: 'Real-time monitoring and physical-financial reconciliation of decentralised planning schemes across Assam & North East India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={interTight.variable}>
      <head>
        {/* Prevent flash of wrong theme if dark or light is stored or preferred */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('drishti-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&p)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-ink antialiased selection:bg-pill selection:text-pill-text transition-colors">
        <AccessibilityProvider>
          <LanguageProvider>
            <SmoothScroll>
              {/* Skip to Main Content Link (First keyboard focusable element) */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-full focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white font-medium text-xs transition-all"
              >
                Skip to main content
              </a>
              <Navigation />
              <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 w-full flex flex-col focus:outline-none"
              >
                {children}
              </main>
              <Footer />
              <SahayAIBot />
            </SmoothScroll>
          </LanguageProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
