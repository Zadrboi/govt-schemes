'use client';

import React from 'react';
import Link from 'next/link';
import DrishtiEmblem from './DrishtiEmblem';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[var(--accent-card)] dark:bg-slate-950 text-ink dark:text-slate-100 py-16 px-6 relative overflow-hidden border-t border-line dark:border-slate-800 transition-colors pb-24 md:pb-16">
      {/* Subtle organic watermark pattern in background */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
        <DrishtiEmblem size={280} showWordmark={false} />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10 relative z-10 pr-0 md:pr-16">
        <div className="space-y-4 max-w-md">
          <div className="flex items-center gap-3">
            <DrishtiEmblem size={32} />
          </div>
          <p className="text-sm text-ink-muted dark:text-slate-300 leading-relaxed">
            {t.footerTagline || 'Statutory decentralised planning & physical-financial verification ledger for the Government of Assam and North Eastern Region.'}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-ink-muted dark:text-slate-300 border border-black/5 dark:border-slate-700">
              NESIDS Roads &amp; OTRI
            </span>
            <span className="px-3 py-1 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-ink-muted dark:text-slate-300 border border-black/5 dark:border-slate-700">
              PM-DevINE
            </span>
            <span className="px-3 py-1 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-ink-muted dark:text-slate-300 border border-black/5 dark:border-slate-700">
              Assam Darshan
            </span>
            <span className="px-3 py-1 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-ink-muted dark:text-slate-300 border border-black/5 dark:border-slate-700">
              RTPS Act 2012
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-medium">
          <div className="space-y-2.5">
            <span className="text-[11px] uppercase tracking-wider text-primary dark:text-sky-400 font-semibold block">
              {t.footerCoreScreens || 'Core Screens'}
            </span>
            <ul className="space-y-2 text-ink-muted dark:text-slate-300">
              <li><Link href="/dashboard" className="hover:text-ink dark:hover:text-white transition-colors">{t.navLedger || 'Audit Ledger'}</Link></li>
              <li><Link href="/verify" className="hover:text-ink dark:hover:text-white transition-colors">{t.navVerify || 'Field Verify'}</Link></li>
              <li><Link href="/insights" className="hover:text-ink dark:hover:text-white transition-colors">{t.navInsights || 'Intelligence'}</Link></li>
              <li><Link href="/eligibility" className="hover:text-ink dark:hover:text-white transition-colors">{t.navEligibility || 'Eligibility'}</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="text-[11px] uppercase tracking-wider text-primary dark:text-sky-400 font-semibold block">
              {t.footerCivicChannels || 'Civic Channels'}
            </span>
            <ul className="space-y-2 text-ink-muted dark:text-slate-300">
              <li><Link href="/notices" className="hover:text-ink dark:hover:text-white transition-colors">{t.noticesGazetteHeader || 'Gazette Circulars'}</Link></li>
              <li><Link href="/directory" className="hover:text-ink dark:hover:text-white transition-colors">{t.dirBadge || 'Block Transit'}</Link></li>
              <li><a href="tel:1905" className="hover:text-ink dark:hover:text-white transition-colors">Helpline 1905</a></li>
              <li><span className="opacity-75">Dispur, Guwahati</span></li>
            </ul>
          </div>

          <div className="space-y-2.5 col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-primary dark:text-sky-400 font-semibold block">
              {t.footerIntegrity || 'Integrity'}
            </span>
            <ul className="space-y-2 text-ink-muted dark:text-slate-300">
              <li><span>OWASP ASVS Security Controls</span></li>
              <li><span>GIGW 3.0 Planning Baseline</span></li>
              <li><span>SHA-256 Audit Checksums (Demo)</span></li>
              <li><span>Local-First Offline Queue (Demo)</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-black/10 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-[11px] text-ink-muted dark:text-slate-400 gap-4 pr-0 md:pr-16">
        <div className="space-y-1 text-center md:text-left">
          <div>
            © {new Date().getFullYear()} {t.footerCopyright || 'Drishti (দৃষ্টি). Open Statutory Public Ledger.'}
          </div>
          <div className="text-[10px] text-ink-muted/80 dark:text-slate-500">
            Independent civic monitoring prototype for demonstration — not an official Government of Assam or MDoNER portal.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-primary dark:text-sky-400 font-medium">Drishti Editorial Standard</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
          <span>Zero-slop interface</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
