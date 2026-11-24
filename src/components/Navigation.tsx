'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DrishtiEmblem from './DrishtiEmblem';
import AccessibilityMenu from './AccessibilityMenu';
import { useAccessibility } from './AccessibilityProvider';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { Globe, ArrowUpRight, Menu, X, Sun, Moon } from 'lucide-react';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { settings, toggleTheme } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.navOverview || 'Overview' },
    { href: '/dashboard', label: t.navLedger || 'Ledger' },
    { href: '/verify', label: t.navVerify || 'Verify' },
    { href: '/notices', label: t.navNotices || 'Notices' },
    { href: '/eligibility', label: t.navEligibility || 'Eligibility' },
    { href: '/directory', label: t.navDirectory || 'Directory' },
    { href: '/insights', label: t.navInsights || 'Insights' },
  ];

  const langs: { code: SupportedLanguage; label: string; script: string }[] = [
    { code: 'en', label: 'English', script: 'EN' },
    { code: 'as', label: 'অসমীয়া', script: 'AS' },
    { code: 'hi', label: 'हिन्दी', script: 'HI' },
    { code: 'bn', label: 'বাংলা', script: 'BN' },
  ];

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Primary Navigation"
        className="pointer-events-auto flex items-center justify-between gap-3 md:gap-5 px-4 md:px-6 py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-line dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all hover:shadow-[0_12px_36px_rgb(0,0,0,0.09)] max-w-5xl w-full"
      >
        {/* Brand Wordmark & Emblem */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full px-1"
        >
          <DrishtiEmblem />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all ${
                  isActive
                    ? 'bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-semibold shadow-xs'
                    : 'text-ink-muted hover:text-ink dark:hover:text-slate-100 hover:bg-surface dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full text-ink-muted hover:text-ink dark:hover:text-slate-100 hover:bg-surface dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            )}
          </button>

          {/* Accessibility Menu */}
          <AccessibilityMenu />

          {/* Language Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-ink-muted dark:text-slate-300 hover:text-ink bg-surface dark:bg-slate-800 rounded-full border border-line dark:border-slate-700 transition-colors"
              aria-label="Change Language"
              aria-expanded={langDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 py-1.5 w-32 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-line dark:border-slate-800 z-50 text-xs"
                role="menu"
              >
                {langs.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-surface dark:hover:bg-slate-800 flex items-center justify-between ${
                      lang === l.code ? 'text-primary dark:text-sky-400 font-semibold bg-blue-50 dark:bg-slate-800' : 'text-ink-muted dark:text-slate-300'
                    }`}
                    role="menuitem"
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] opacity-60">{l.script}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Cobalt Pill CTA */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-blue-700 text-white text-xs font-medium tracking-tight rounded-full shadow-sm transition-transform active:scale-95"
          >
            <span>{t.navLiveAudit || 'Live Audit'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-ink-muted hover:text-ink rounded-full focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden pointer-events-auto fixed inset-x-4 top-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-line dark:border-slate-800 rounded-3xl p-5 shadow-2xl z-50 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-semibold'
                    : 'text-ink-muted hover:text-ink dark:hover:text-slate-100 hover:bg-surface dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navigation;
