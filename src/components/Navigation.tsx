'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DrishtiEmblem from './DrishtiEmblem';
import AccessibilityMenu from './AccessibilityMenu';
import { useAccessibility } from './AccessibilityProvider';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { Globe, ArrowUpRight, Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { settings, toggleTheme } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<{ id: string; name: string; role: string } | null>(null);

  // Synchronize session state from /api/auth/me
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success && d?.data?.user) {
          setSessionUser(d.data.user);
        } else {
          setSessionUser(null);
        }
      })
      .catch(() => setSessionUser(null));
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setSessionUser(null);
    window.location.href = '/login';
  };

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

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
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
      <nav
        aria-label="Primary Navigation"
        className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-3 md:gap-5 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-line dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all hover:shadow-[0_12px_36px_rgb(0,0,0,0.09)] max-w-5xl w-full"
      >
        {/* Brand Wordmark & Emblem */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full px-1 shrink-0"
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
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-ink-muted hover:text-ink dark:hover:text-slate-100 hover:bg-surface dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-medium text-ink-muted dark:text-slate-300 hover:text-ink bg-surface dark:bg-slate-800 rounded-full border border-line dark:border-slate-700 transition-colors"
              aria-label="Change Language"
              aria-expanded={langDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 py-1.5 w-32 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-line dark:border-slate-800 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
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

          {/* Primary Cobalt Pill CTA (Desktop and Tablets >= 640px) */}
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 bg-primary hover:bg-blue-700 text-white text-xs font-medium tracking-tight rounded-full shadow-sm transition-transform active:scale-95"
          >
            <span>{t.navLiveAudit || 'Live Audit'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </Link>

          {/* Mobile Menu Toggle Button (lg:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 p-1.5 text-ink-muted hover:text-ink dark:hover:text-slate-100 rounded-full hover:bg-surface dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs pointer-events-auto"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Down Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden pointer-events-auto fixed inset-x-3 sm:inset-x-4 top-16 sm:top-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-line dark:border-slate-800 rounded-3xl p-5 shadow-2xl z-50 flex flex-col gap-2 max-h-[calc(100dvh-5.5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[48px] flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
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

          {/* Prominent Mobile Live Audit CTA */}
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-blue-700 text-white text-sm font-medium rounded-2xl shadow-sm transition-transform active:scale-98"
          >
            <span>{t.navLiveAudit || 'Live Audit'}</span>
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </Link>

          {/* Authenticated User Status or Sign-In Link */}
          {sessionUser ? (
            <div className="flex items-center justify-between px-4 py-2.5 bg-surface dark:bg-slate-800/70 text-ink dark:text-slate-200 text-xs font-medium rounded-2xl">
              <div className="flex flex-col">
                <span className="font-semibold">{sessionUser.name}</span>
                <span className="text-[10px] text-ink-muted dark:text-slate-400">{sessionUser.role?.replace('_', ' ')}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="text-xs text-red-600 font-semibold hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 bg-surface dark:bg-slate-800/70 hover:bg-pill/60 text-ink dark:text-slate-200 text-xs font-medium rounded-2xl transition-colors"
            >
              <div className="flex flex-col">
                <span>Citizen (Guest)</span>
                <span className="text-[10px] text-primary dark:text-sky-400">Sign in as Official / Evaluator →</span>
              </div>
              <User className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navigation;
