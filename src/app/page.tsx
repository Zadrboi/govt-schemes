'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getCanonicalKpis } from '@/lib/data/canonical';
import { 
  ArrowUpRight, ArrowRight, ShieldCheck,
  Layers, QrCode, WifiOff, Cpu, Database
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const introContainerRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const { t } = useLanguage();
  const kpis = getCanonicalKpis();

  // Animated counters directly synced to canonical dataset
  const [counts, setCounts] = useState({
    totalWorks: kpis.totalWorks,
    districts: kpis.districtsCovered,
    ledgerMatch: kpis.ledgerMatchPct,
    activeExceptions: kpis.activeExceptions,
  });

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.documentElement.classList.contains('reduce-motion'));

    // Scale-in intro animation
    if (!prefersReducedMotion && heroCardRef.current) {
      gsap.fromTo(
        heroCardRef.current,
        { scale: 0.95, borderRadius: '28px' },
        {
          scale: 1,
          borderRadius: '0px',
          duration: 1.2,
          ease: 'power3.out',
        }
      );
    }

    // Impact stats counter animation
    const statsTrigger = ScrollTrigger.create({
      trigger: statsSectionRef.current,
      start: 'top 80%',
      onEnter: () => {
        const obj = { totalWorks: 0, districts: 0, ledgerMatch: 0, activeExceptions: 0 };
        gsap.to(obj, {
          totalWorks: kpis.totalWorks,
          districts: kpis.districtsCovered,
          ledgerMatch: kpis.ledgerMatchPct,
          activeExceptions: kpis.activeExceptions,
          duration: prefersReducedMotion ? 0.01 : 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            setCounts({
              totalWorks: Math.floor(obj.totalWorks),
              districts: Math.floor(obj.districts),
              ledgerMatch: Number(obj.ledgerMatch.toFixed(1)),
              activeExceptions: Math.floor(obj.activeExceptions),
            });
          },
        });
      },
      once: true,
    });

    return () => {
      statsTrigger.kill();
    };
  }, [kpis.totalWorks, kpis.districtsCovered, kpis.ledgerMatchPct, kpis.activeExceptions]);

  return (
    <div className="w-full flex flex-col overflow-hidden bg-white dark:bg-[#070c16] text-[#0f172a] dark:text-[#eef4fc] transition-colors pb-28">
      {/* ============================================================== */}
      {/* 1. CINEMATIC SCALE-IN HERO & MASKED ASSAM VALLEY BACKDROP     */}
      {/* ============================================================== */}
      <section
        ref={introContainerRef}
        className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between pt-28 pb-16 px-4 sm:px-8 bg-surface dark:bg-slate-900/40 overflow-hidden"
      >
        {/* Subtle architectural background grid */}
        <div className="absolute inset-0 grid-sq opacity-45 pointer-events-none" />

        {/* Scaled Hero Canvas Container */}
        <div
          ref={heroCardRef}
          className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col justify-between"
        >
          {/* Top Editorial Badge */}
          <div className="flex justify-center pt-2 sm:pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0edff] text-[#1e3a8a] dark:bg-blue-950 dark:text-blue-200 border border-[#bae6fd] dark:border-blue-900 text-xs font-medium tracking-tight shadow-xs transition-transform hover:scale-105">
              <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse"></span>
              <span>{t.heroBadge || 'Real-time public infrastructure ledger'}</span>
              <span className="text-[10px] opacity-70">GIGW 3.0 Planning Baseline</span>
            </div>
          </div>

          {/* Editorial Split-Word Headline */}
          <div className="text-center max-w-4xl mx-auto my-auto py-6">
            <h1 className="editorial-headline text-4xl sm:text-6xl md:text-7xl font-normal text-[#0f172a] dark:text-white tracking-[-0.04em] leading-[1.08]">
              {t.heroTitle1 || 'Track every public promise,'} <br className="hidden sm:inline" />
              <span className="italic text-[#1d4ed8] dark:text-[#60a5fa]">{t.heroTitle2 || 'from sanction to soil.'}</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base md:text-lg text-[#475569] dark:text-[#94a3b8] max-w-2xl mx-auto font-normal leading-relaxed tracking-tight">
              {t.heroSubtitle || 'Assam sovereign physical-financial reconciliation ledger. Satellite verification, offline mesh audits, and multilingual intelligence for every citizen.'}
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-[#1d4ed8] hover:bg-blue-700 text-white text-xs sm:text-sm font-medium tracking-tight rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>{t.heroExploreBtn || 'Explore Audit Ledger'}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/verify"
                className="px-6 py-3 bg-white dark:bg-slate-900 hover:bg-[#f4f7fb] dark:hover:bg-slate-800 text-[#0f172a] dark:text-white text-xs sm:text-sm font-medium tracking-tight rounded-full border border-[#e4ecf5] dark:border-slate-800 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#0284c7] dark:text-[#38bdf8]" />
                <span>{t.heroVerifyBtn || 'Field Verification'}</span>
              </Link>
            </div>
          </div>

          {/* Masked Assam Valley / Infrastructure Imagery fading into background */}
          <div className="relative w-full h-[260px] sm:h-[340px] md:h-[400px] rounded-[28px] overflow-hidden shadow-2xl border border-[#e4ecf5] dark:border-slate-800">
            <Image
              src="/images/hero-landscape.jpg"
              alt="Assam River Basin and Infrastructure Panorama"
              fill
              priority
              className="object-cover object-center"
            />
            {/* Upper mask gradient fading seamlessly into background mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/95 dark:via-[#070c16]/20 dark:to-[#070c16]/95" />
            
            {/* Top-Right Floating Frosted Glass Card with deeper backdrop */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-6 max-w-[200px] sm:max-w-xs px-3 sm:px-4 py-2 sm:py-3 rounded-2xl border border-white/60 dark:border-slate-700/80 shadow-lg text-left backdrop-blur-md bg-white/85 dark:bg-slate-900/85 pointer-events-none">
              <div className="text-[10px] uppercase font-semibold text-[#0284c7] dark:text-[#38bdf8] tracking-wider">
                Brahmaputra Basin
              </div>
              <div className="text-xs font-semibold text-[#0f172a] dark:text-white mt-0.5 truncate">
                Majuli Bund Reinforcement
              </div>
              <div className="text-[11px] text-[#475569] dark:text-slate-300 mt-1 flex items-center gap-1.5 font-mono">
                <span>₹48.2 Cr</span>
                <span>•</span>
                <span className="text-[#1d4ed8] dark:text-[#60a5fa] font-sans font-medium">84% Completed</span>
              </div>
            </div>

            {/* Bottom-Left Floating Frosted Glass Card with deeper backdrop */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-6 max-w-[220px] sm:max-w-xs px-3 sm:px-4 py-2 sm:py-3 rounded-2xl border border-white/60 dark:border-slate-700/80 shadow-lg text-left backdrop-blur-md bg-white/85 dark:bg-slate-900/85 pointer-events-none">
              <div className="text-[10px] uppercase font-semibold text-[#1d4ed8] dark:text-[#60a5fa] tracking-wider">
                Latest Field Audit
              </div>
              <div className="text-xs font-semibold text-[#0f172a] dark:text-white mt-0.5 truncate">
                Jorhat Community Health
              </div>
              <div className="text-[11px] text-[#475569] dark:text-slate-300 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]"></span>
                <span className="truncate">Verified by Gram Sabha #14</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PINNED IMPACT STATS WITH 4 TICKET-NOTCHED CARDS             */}
      {/* ============================================================== */}
      <section
        ref={statsSectionRef}
        className="w-full py-24 px-6 sm:px-12 bg-white dark:bg-[#070c16] relative border-y border-[#e4ecf5] dark:border-slate-800 transition-colors"
      >
        {/* Serene blue decorative glow behind cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] bg-[#bae6fd]/30 dark:bg-blue-900/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0edff] dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-200 text-xs font-semibold tracking-tight mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
              <span>Simulated Demo Dataset • Live across Assam</span>
            </div>
            <h2 className="editorial-headline text-3xl sm:text-4xl md:text-5xl font-normal tracking-tighter text-[#0f172a] dark:text-white leading-tight">
              15 Canonical Works verified in the open.
            </h2>
            <p className="mt-3 text-[#475569] dark:text-[#94a3b8] text-base font-normal tracking-tight">
              Radical transparency across 11 schemes. Real-time reconciliation data computed directly from the Drishti statutory demo ledger.
            </p>
          </div>

          {/* 4-Column Ticket-Notched KPI Cards in Glacier Sky-Blue (#BAE6FD) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Card 1 */}
            <div className="ticket-card rounded-2xl p-7 flex flex-col justify-between min-h-[190px] shadow-[0_6px_20px_rgba(186,230,253,0.35)] dark:shadow-none transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-[#0f172a] text-xs font-semibold tracking-tight uppercase">
                <span>Canonical Ledger</span>
                <span className="w-2 h-2 rounded-full bg-[#1d4ed8]"></span>
              </div>
              <div className="my-auto">
                <div className="text-4xl lg:text-[42px] font-bold tracking-tighter text-[#0f172a] tabular-nums">
                  {counts.totalWorks}
                </div>
                <div className="text-sm font-medium text-[#0f172a] mt-1 tracking-tight">Canonical Works</div>
              </div>
              <div className="text-[12px] text-[#334155] pt-2 border-t border-[#7dd3fc]">
                Simulated demo dataset across 11 schemes
              </div>
            </div>

            {/* Card 2 */}
            <div className="ticket-card rounded-2xl p-7 flex flex-col justify-between min-h-[190px] shadow-[0_6px_20px_rgba(186,230,253,0.35)] dark:shadow-none transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-[#0f172a] text-xs font-semibold tracking-tight uppercase">
                <span>Geographic Reach</span>
                <span className="w-2 h-2 rounded-full bg-[#1d4ed8]"></span>
              </div>
              <div className="my-auto">
                <div className="text-4xl lg:text-[42px] font-bold tracking-tighter text-[#0f172a] tabular-nums">
                  {counts.districts}
                </div>
                <div className="text-sm font-medium text-[#0f172a] mt-1 tracking-tight">Districts Seeded</div>
              </div>
              <div className="text-[12px] text-[#334155] pt-2 border-t border-[#7dd3fc]">
                All 35 official districts supported statewide
              </div>
            </div>

            {/* Card 3 */}
            <div className="ticket-card rounded-2xl p-7 flex flex-col justify-between min-h-[190px] shadow-[0_6px_20px_rgba(186,230,253,0.35)] dark:shadow-none transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-[#0f172a] text-xs font-semibold tracking-tight uppercase">
                <span>Fiduciary Integrity</span>
                <span className="w-2 h-2 rounded-full bg-[#1d4ed8]"></span>
              </div>
              <div className="my-auto">
                <div className="text-4xl lg:text-[42px] font-bold tracking-tighter text-[#0f172a] tabular-nums">
                  {counts.ledgerMatch}%
                </div>
                <div className="text-sm font-medium text-[#0f172a] mt-1 tracking-tight">Reconciliation Match</div>
              </div>
              <div className="text-[12px] text-[#334155] pt-2 border-t border-[#7dd3fc]">
                {kpis.totalWorks - kpis.activeExceptions}/{kpis.totalWorks} works without variance gap
              </div>
            </div>

            {/* Card 4 */}
            <div className="ticket-card rounded-2xl p-7 flex flex-col justify-between min-h-[190px] shadow-[0_6px_20px_rgba(186,230,253,0.35)] dark:shadow-none transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between text-[#0f172a] text-xs font-semibold tracking-tight uppercase">
                <span>Statutory Alerts</span>
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
              </div>
              <div className="my-auto">
                <div className="text-4xl lg:text-[42px] font-bold tracking-tighter text-red-700 tabular-nums">
                  {counts.activeExceptions}
                </div>
                <div className="text-sm font-medium text-[#0f172a] mt-1 tracking-tight">Active Exception</div>
              </div>
              <div className="text-[12px] text-[#334155] pt-2 border-t border-[#7dd3fc]">
                Flagship Sipajhar WSS (80% debit vs 35% physical)
              </div>
            </div>
          </div>

          {/* Minimal Strip of Drishti Core Modules */}
          <div className="border-t border-b border-[#e4ecf5] dark:border-slate-800 py-8">
            <div className="flex flex-wrap items-center justify-between gap-6 px-2">
              <div className="text-xs uppercase tracking-wider text-[#475569] dark:text-[#94a3b8] font-medium">
                {t.archTitle || 'Core Architecture'}
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-[#f4f7fb] dark:bg-slate-800 border border-[#e4ecf5] dark:border-slate-700 flex items-center justify-center text-[#475569] dark:text-slate-300 group-hover:text-[#1d4ed8]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[#0f172a] dark:text-slate-200 group-hover:text-[#1d4ed8] transition-colors tracking-tight">
                  GIS Geo-Tagging
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-[#f4f7fb] dark:bg-slate-800 border border-[#e4ecf5] dark:border-slate-700 flex items-center justify-center text-[#475569] dark:text-slate-300 group-hover:text-[#1d4ed8]">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[#0f172a] dark:text-slate-200 group-hover:text-[#1d4ed8] transition-colors tracking-tight">
                  QR Public Audit
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-[#f4f7fb] dark:bg-slate-800 border border-[#e4ecf5] dark:border-slate-700 flex items-center justify-center text-[#475569] dark:text-slate-300 group-hover:text-[#1d4ed8]">
                  <WifiOff className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[#0f172a] dark:text-slate-200 group-hover:text-[#1d4ed8] transition-colors tracking-tight">
                  Offline Mesh Sync
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-[#f4f7fb] dark:bg-slate-800 border border-[#e4ecf5] dark:border-slate-700 flex items-center justify-center text-[#475569] dark:text-slate-300 group-hover:text-[#1d4ed8]">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[#0f172a] dark:text-slate-200 group-hover:text-[#1d4ed8] transition-colors tracking-tight">
                  Sahay Multilingual AI
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-[#f4f7fb] dark:bg-slate-800 border border-[#e4ecf5] dark:border-slate-700 flex items-center justify-center text-[#475569] dark:text-slate-300 group-hover:text-[#1d4ed8]">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-[#0f172a] dark:text-slate-200 group-hover:text-[#1d4ed8] transition-colors tracking-tight">
                  Open Ledger API
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. INTERACTIVE 3-PANEL PROCESS ACCORDION                      */}
      {/* ============================================================== */}
      <section className="py-24 px-6 sm:px-12 bg-[#f4f7fb] dark:bg-[#070d18] border-t border-[#e4ecf5] dark:border-slate-800 relative transition-colors" id="process">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0edff] dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-200 text-xs font-semibold tracking-tight mb-4">
              <span>{t.processTag || 'How Drishti works'}</span>
            </div>
            <h2 className="editorial-headline text-3xl sm:text-4xl md:text-5xl font-normal tracking-tighter text-[#0f172a] dark:text-white leading-tight">
              {t.processHeading || 'Clarity at every step of the lifecycle.'}
            </h2>
            <p className="mt-3 text-[#475569] dark:text-[#94a3b8] text-base font-normal tracking-tight">
              From cabinet financial sanctions down to grass-root soil testing and gram sabha approval.
            </p>
          </div>

          {/* 3 Full-Height Vertical Columns separated by 1px hairlines */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-[#e4ecf5] dark:border-slate-800 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            {/* Column 1 */}
            <div
              onMouseEnter={() => setActiveStep(1)}
              className={`p-8 sm:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e4ecf5] dark:border-slate-800 transition-all duration-300 cursor-pointer ${
                activeStep === 1 ? 'md:col-span-6 bg-white dark:bg-[#0f172a]' : 'md:col-span-3 bg-[#f8fafc]/50 dark:bg-slate-900/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs uppercase tracking-widest text-[#1d4ed8] dark:text-blue-400 font-bold">
                    Phase 01 • Inception
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#e0edff] dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-200 font-semibold whitespace-nowrap">
                    {t.phase1Title || 'Sanction & Map'}
                  </span>
                </div>
                {/* Giant Cobalt Numeral 1 */}
                <div className="text-7xl sm:text-8xl md:text-9xl font-light text-[#1d4ed8] dark:text-blue-400 tracking-tighter leading-none mb-6">
                  1
                </div>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0f172a] dark:text-white mb-3">
                  {t.phase1Title || 'Sanction & Map'}
                </h3>
                <p className="text-sm sm:text-base text-[#475569] dark:text-[#94a3b8] leading-relaxed max-w-lg mb-6">
                  {t.phase1Desc || 'Administrative approvals and departmental budgets are ingested directly from the state treasury system. Drishti automatically pins precise cadastral GPS coordinates.'}
                </p>
              </div>
              <div className="pt-6 border-t border-[#e4ecf5] dark:border-slate-800 flex flex-wrap gap-2 text-xs">
                <span className="font-medium px-3 py-1.5 rounded-lg bg-[#f4f7fb] dark:bg-slate-800 border border-[#e4ecf5] dark:border-slate-700 text-[#0f172a] dark:text-slate-200">
                  Treasury Ingestion API
                </span>
                <span className="font-medium px-3 py-1.5 rounded-lg bg-[#f4f7fb] dark:bg-slate-800 border border-[#e4ecf5] dark:border-slate-700 text-[#0f172a] dark:text-slate-200">
                  GIS Polygon Mapping
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div
              onMouseEnter={() => setActiveStep(2)}
              className={`p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e4ecf5] dark:border-slate-800 transition-all duration-300 cursor-pointer ${
                activeStep === 2 ? 'md:col-span-6 bg-white dark:bg-[#0f172a]' : 'md:col-span-3 bg-[#f8fafc]/50 dark:bg-slate-900/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs uppercase tracking-widest text-[#0284c7] font-bold">
                    Phase 02 • Field
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#e0edff] dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-200 font-semibold whitespace-nowrap">
                    {t.phase2Title || 'Soil & Ground Audit'}
                  </span>
                </div>
                {/* Giant Cerulean Numeral 2 */}
                <div className="text-7xl sm:text-8xl md:text-9xl font-light text-[#0284c7] tracking-tighter leading-none mb-6">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0f172a] dark:text-white mb-2">
                  {t.phase2Title || 'Soil & Ground Audit'}
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] leading-relaxed mb-6">
                  {t.phase2Desc || 'Field inspectors and local village monitoring units capture cryptographically signed photographs and geotagged timestamp benchmarks on-site with anti-spoof EXIF extraction.'}
                </p>
              </div>
              <div className="pt-6 border-t border-[#e4ecf5] dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-medium text-[#475569] dark:text-[#94a3b8]">QR Mobile Verification</span>
                <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-[#e4ecf5] dark:border-slate-700 flex items-center justify-center text-[#475569] dark:text-slate-300">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Column 3 */}
            <div
              onMouseEnter={() => setActiveStep(3)}
              className={`p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                activeStep === 3 ? 'md:col-span-6 bg-white dark:bg-[#0f172a]' : 'md:col-span-3 bg-[#f8fafc]/50 dark:bg-slate-900/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs uppercase tracking-widest text-[#38bdf8] font-bold">
                    Phase 03 • Public
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#e0edff] dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-200 font-semibold whitespace-nowrap">
                    {t.phase3Title || 'Public Proof'}
                  </span>
                </div>
                {/* Giant Accent Numeral 3 */}
                <div className="text-7xl sm:text-8xl md:text-9xl font-light text-[#38bdf8] tracking-tighter leading-none mb-6">
                  3
                </div>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0f172a] dark:text-white mb-2">
                  {t.phase3Title || 'Public Proof & Signoff'}
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] leading-relaxed mb-6">
                  {t.phase3Desc || 'Final release of contractor milestones requires public sign-off. Open ledgers accessible in Assamese, Bodo, Bengali, and English via Sahay AI.'}
                </p>
              </div>
              <div className="pt-6 border-t border-[#e4ecf5] dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-medium text-[#475569] dark:text-[#94a3b8]">Gram Sabha Attestation</span>
                <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-[#e4ecf5] dark:border-slate-700 flex items-center justify-center text-[#475569] dark:text-slate-300">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. CLOSING CTA & DUSK ASSAM INFRASTRUCTURE LANDSCAPE           */}
      {/* ============================================================== */}
      <section className="relative w-full overflow-hidden bg-white dark:bg-[#070c16] transition-colors" id="closing">
        <div className="relative w-full h-[540px] flex items-center justify-center overflow-hidden">
          {/* Top fade gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4f7fb] dark:from-[#070d18] via-transparent to-black/40 z-10"></div>
          <Image
            src="/images/bridge-dusk.jpg"
            alt="Serene dusk evening landscape of Assam Brahmaputra river plains at golden hour sunset"
            fill
            className="object-cover object-center"
          />
          
          {/* Centered frosted glass CTA card */}
          <div className="relative z-20 max-w-xl w-full mx-6 p-8 sm:p-12 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/80 dark:border-slate-700/80 shadow-[0_16px_40px_rgba(15,23,42,0.15)] text-center">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#1d4ed8] dark:text-blue-300 px-3 py-1 rounded-full bg-[#e0edff] dark:bg-blue-950 mb-4 inline-block">
              {t.closingBadge || 'Open Access Civic Registry'}
            </span>
            <h3 className="editorial-headline text-3xl sm:text-4xl font-normal tracking-tighter text-[#0f172a] dark:text-white mb-3 leading-tight">
              {t.closingTitle || 'Start exploring Drishti.'}
            </h3>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#94a3b8] mb-8 font-normal max-w-md mx-auto">
              {t.closingSubtitle || 'Query sanctions, inspect public works in your panchayat, or verify geotagged field reports in seconds.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-[#1d4ed8] hover:bg-blue-700 text-white text-sm font-medium tracking-tight px-7 py-3 rounded-full transition-all shadow-sm"
              >
                {t.closingLaunchBtn || 'Launch Public Explorer'}
              </Link>
              <Link
                href="/eligibility"
                className="w-full sm:w-auto bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-[#0f172a] dark:text-slate-100 text-sm font-medium tracking-tight px-6 py-3 rounded-full border border-[#e4ecf5] dark:border-slate-700 transition-all"
              >
                {t.closingEligibilityBtn || 'Check Scheme Eligibility'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
