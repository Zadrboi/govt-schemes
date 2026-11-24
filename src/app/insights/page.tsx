'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, AlertTriangle, ShieldAlert, ArrowUpRight, 
  ChevronRight, ArrowRight, Bot 
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AnomalyCard {
  workCode: string;
  title: string;
  district: string;
  scheme: string;
  sanctioned: number;
  spent: number;
  physicalPct: number;
  varianceGapPct: number;
  causalReason: string;
  statutoryAction: string;
  imagePath: string;
}

const EXPLAINABLE_ANOMALIES: AnomalyCard[] = [
  {
    workCode: 'AS-DAR-0821',
    title: 'Sipajhar Piped Water Supply Sub-Scheme Phase 2',
    district: 'Darrang',
    scheme: 'NESIDS-OTRI',
    sanctioned: 4.85,
    spent: 3.88,
    physicalPct: 45,
    varianceGapPct: 35.0,
    imagePath: '/images/water-project.jpg',
    causalReason:
      'Contractor billed for pipeline distribution pipes prior to excavation clearance from Public Works Roads Department. Physical verification confirmed intake well is completed, but 12km village feeder network remains uninstalled.',
    statutoryAction:
      'Stop-work notice issued under Section 14(2). Remaining tranche of ₹0.97 Cr frozen pending joint inspection by Executive Engineer PHE Mangaldai.',
  },
  {
    workCode: 'AS-DHU-0912',
    title: 'Dhubri Riverine Protection & Approach Road Embankment',
    district: 'Dhubri',
    scheme: 'NESIDS-ROADS',
    sanctioned: 8.2,
    spent: 6.9,
    physicalPct: 52,
    varianceGapPct: 32.1,
    imagePath: '/images/river-embankment.jpg',
    causalReason:
      'High seasonal river currents disrupted geo-bag placement. Financial disbursements were released against advance procurement of boulder riprap without verifying on-site embankment compaction.',
    statutoryAction:
      'Circle Officer Dhubri mandated third-party physical audit. Utilization certificate issuance suspended until GPS elevation profiles conform to DPR specifications.',
  },
  {
    workCode: 'AS-KAM-0744',
    title: 'Betkuchi Multi-Utility Civic Cold Chain Center',
    district: 'Kamrup',
    scheme: 'PM-DEVINE',
    sanctioned: 12.5,
    spent: 10.2,
    physicalPct: 58,
    varianceGapPct: 23.6,
    imagePath: '/images/road-bridge.jpg',
    causalReason:
      'Refrigeration compressor units imported and stored off-site. Civil structural shell lacks certified electrical substations required for operational handover.',
    statutoryAction:
      'Penalty clause Section 9 invoked against primary engineering contractor. Technical sanction team reassigned to inspect Betkuchi grid connection within 10 days.',
  },
];

const DISTRICT_COMPARISONS = [
  { district: 'Darrang', schemes: 42, sanctioned: 68.4, spent: 44.2, accuracy: 96.8, stalled: 1 },
  { district: 'Kamrup', schemes: 76, sanctioned: 184.2, spent: 142.6, accuracy: 98.4, stalled: 0 },
  { district: 'Jorhat', schemes: 38, sanctioned: 54.1, spent: 39.8, accuracy: 97.2, stalled: 0 },
  { district: 'Dhubri', schemes: 29, sanctioned: 48.7, spent: 36.1, accuracy: 94.6, stalled: 1 },
  { district: 'Cachar', schemes: 34, sanctioned: 62.0, spent: 46.5, accuracy: 95.9, stalled: 0 },
];

export default function InsightsPage() {
  const { t } = useLanguage();
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyCard>(EXPLAINABLE_ANOMALIES[0]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const analyticalPrompts = [
    'Why is Sipajhar Water Supply project AS-DAR-0821 flagged as high risk?',
    'Compare physical-financial accuracy between Darrang and Kamrup districts.',
    'Under Assam RTPS Act 2012, what is the maximum resolution timeline for stalled works?',
    'Which schemes have drawn more than 75% funds with less than 50% physical completion?',
  ];

  return (
    <div className="w-full min-h-screen bg-surface dark:bg-slate-950/50 pt-24 pb-28 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-8 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-line dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary dark:text-sky-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary dark:text-sky-400">
              {t.insightsBadge || 'Data Storytelling & Anomaly Attribution'}
            </span>
          </div>
          <h1 className="editorial-headline text-3xl sm:text-4xl text-ink dark:text-slate-100">
            {t.insightsHeading || 'Explainable Intelligence.'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-300 mt-1">
            Plain-language causal attribution for budget variances, stalled works, and district performance.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-full border border-line dark:border-slate-800 shadow-xs">
          <Sparkles className="w-4 h-4 text-primary dark:text-sky-400 ml-2" />
          <span className="text-xs font-semibold text-ink dark:text-slate-100 pr-3">Zero Black-Box Scoring</span>
        </div>
      </div>

      {/* Top Summary Strip (3 Ticket-Notched KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Reconciled Flow Integrity */}
        <div className="ticket-card rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[175px]">
          <div className="flex items-center justify-between text-[#0f172a]">
            <span className="text-xs uppercase tracking-wider font-semibold font-mono">{t.insightsCard1Title || 'Reconciled Flow Integrity'}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/90 text-primary text-[10px] font-semibold">▲ 1.4% vs Q2</span>
          </div>
          <div className="my-2">
            <div className="text-3xl lg:text-4xl font-bold tracking-tight text-[#0f172a] tabular-nums">99.2%</div>
            <div className="text-xs text-[#0f172a] font-medium mt-0.5">Telemetry Aligned</div>
          </div>
          <div className="pt-2.5 border-t border-[#7dd3fc] text-[11px] text-[#334155]">
            {t.insightsCard1Desc || '₹1,420 Cr matched with zero audit friction across 1,840 works.'}
          </div>
        </div>

        {/* Card 2: Multi-Spectral Ground Delta */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[175px]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-ink-muted dark:text-slate-400 font-medium font-mono">{t.insightsCard2Title || 'Multi-Spectral Ground Delta'}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-slate-800 text-secondary dark:text-sky-400 text-[10px] font-semibold">Nominal Baseline</span>
          </div>
          <div className="my-2">
            <div className="text-3xl lg:text-4xl font-bold text-ink dark:text-slate-100 tracking-tight tabular-nums">4.8%</div>
            <div className="text-xs text-secondary dark:text-sky-400 font-medium mt-0.5">Sentinel-2 Surface Variance</div>
          </div>
          <div className="pt-2.5 border-t border-line dark:border-slate-800 text-[11px] text-ink-muted dark:text-slate-400">
            {t.insightsCard2Desc || 'Zero ghost projects detected across all satellite passes.'}
          </div>
        </div>

        {/* Card 3: Panchayat Anomaly Density */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[175px]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-ink-muted dark:text-slate-400 font-medium font-mono">{t.insightsCard3Title || 'Panchayat Anomaly Density'}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">Action Required</span>
          </div>
          <div className="my-2">
            <div className="text-3xl lg:text-4xl font-bold text-amber-600 dark:text-amber-400 tracking-tight tabular-nums">1.2%</div>
            <div className="text-xs text-ink-muted dark:text-slate-400 font-medium mt-0.5">28 Works Under Investigation</div>
          </div>
          <div className="pt-2.5 border-t border-line dark:border-slate-800 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            {t.insightsCard3Desc || 'Auto-routed to respective Deputy Commissioners.'}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. EXPLAINABLE ANOMALY SPOTLIGHT ("WHY THIS WAS FLAGGED")     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Anomaly List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Active Variance Flag Triggers
            </span>
            <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-semibold">
              3 High-Risk Sites
            </span>
          </div>

          <div className="space-y-3">
            {EXPLAINABLE_ANOMALIES.map((item) => {
              const isSelected = selectedAnomaly.workCode === item.workCode;

              return (
                <div
                  key={item.workCode}
                  onClick={() => setSelectedAnomaly(item)}
                  className={`p-4 rounded-[22px] border transition-all duration-200 cursor-pointer flex gap-3 items-center ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-red-500 shadow-md ring-1 ring-red-400/20'
                      : 'bg-white/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border-line dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-line dark:border-slate-700">
                    <Image src={item.imagePath} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-mono text-[10px] font-semibold text-red-700 dark:text-red-400">
                        {item.workCode}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full font-bold">
                        +{item.varianceGapPct}% Gap
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-ink dark:text-slate-100 truncate">
                      {item.title}
                    </h3>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-ink-muted dark:text-slate-400">
                      <span>{item.district} • {item.scheme}</span>
                      <span className="text-red-700 dark:text-red-400 font-medium flex items-center gap-0.5">
                        Explain <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Explainable Attribution Card (7 cols) */}
        <div className="lg:col-span-7 rounded-[28px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-line dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary dark:text-sky-400 px-2.5 py-0.5 bg-blue-50 dark:bg-slate-800 rounded-full">
                  {selectedAnomaly.workCode}
                </span>
                <span className="text-xs px-2.5 py-0.5 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 rounded-full font-semibold">
                  Statutory Variance &gt; 25%
                </span>
              </div>
              <h2 className="text-lg font-semibold text-ink dark:text-slate-100 mt-2 leading-snug">
                {selectedAnomaly.title}
              </h2>
            </div>
            <Link
              href={`/asset/${selectedAnomaly.workCode}`}
              className="px-3.5 py-1.5 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-xs flex items-center gap-1 flex-shrink-0"
            >
              <span>Asset Card</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Metric Comparison Badges */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-surface dark:bg-slate-800 rounded-2xl border border-line dark:border-slate-700">
              <span className="text-[10px] text-ink-muted dark:text-slate-400 uppercase">Sanctioned</span>
              <div className="text-base font-semibold text-ink dark:text-slate-100 tabular-nums mt-0.5">
                ₹{selectedAnomaly.sanctioned} Cr
              </div>
            </div>
            <div className="p-3 bg-surface dark:bg-slate-800 rounded-2xl border border-line dark:border-slate-700">
              <span className="text-[10px] text-ink-muted dark:text-slate-400 uppercase">Disbursed</span>
              <div className="text-base font-semibold text-red-600 dark:text-red-400 tabular-nums mt-0.5">
                ₹{selectedAnomaly.spent} Cr <span className="text-[10px]">({((selectedAnomaly.spent / selectedAnomaly.sanctioned) * 100).toFixed(0)}%)</span>
              </div>
            </div>
            <div className="p-3 bg-surface dark:bg-slate-800 rounded-2xl border border-line dark:border-slate-700">
              <span className="text-[10px] text-ink-muted dark:text-slate-400 uppercase">Physical Done</span>
              <div className="text-base font-semibold text-ink dark:text-slate-100 tabular-nums mt-0.5">
                {selectedAnomaly.physicalPct}%
              </div>
            </div>
          </div>

          {/* Causal Attribution Story */}
          <div className="p-5 rounded-2xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>{t.insightsRootCauseHeader || 'Why This Was Flagged (Causal Attribution)'}</span>
            </div>
            <p className="text-xs text-ink dark:text-slate-200 leading-relaxed font-normal">
              {selectedAnomaly.causalReason}
            </p>
          </div>

          {/* Statutory Enforcement Action */}
          <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary dark:text-sky-400">
              <ShieldAlert className="w-4 h-4 text-primary dark:text-sky-400" />
              <span>{t.insightsStatutoryActionHeader || 'Mandatory Statutory Action Taken'}</span>
            </div>
            <p className="text-xs text-ink dark:text-slate-200 leading-relaxed font-medium">
              {selectedAnomaly.statutoryAction}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DISTRICT COMPARISON CARDS                                   */}
      {/* ============================================================== */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-ink dark:text-slate-100">District Performance &amp; Reconciliation Benchmarks</h2>
            <p className="text-xs text-ink-muted dark:text-slate-300">Comparing fund deployment velocity and physical verification rates</p>
          </div>
          <span className="text-xs text-ink-muted dark:text-slate-400 font-mono">Assam 35 Districts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DISTRICT_COMPARISONS.map((dist) => (
            <div
              key={dist.district}
              className="p-5 rounded-[22px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-xs font-bold text-ink dark:text-slate-100">{dist.district}</span>
                <div className="text-[11px] text-ink-muted dark:text-slate-400 mt-0.5">{dist.schemes} Schemes Tracked</div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-slate-400">Budget:</span>
                  <span className="font-medium text-ink dark:text-slate-100">₹{dist.sanctioned} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-slate-400">Spent:</span>
                  <span className="font-medium text-ink dark:text-slate-100">₹{dist.spent} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-slate-400">Accuracy:</span>
                  <span className="font-semibold text-secondary dark:text-sky-400">{dist.accuracy}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-line dark:border-slate-800 text-[10px] text-ink-muted dark:text-slate-400 flex items-center justify-between">
                <span>Stalled: <strong className="text-ink dark:text-slate-100">{dist.stalled}</strong></span>
                <span className="text-primary dark:text-sky-400 hover:underline cursor-pointer">Filter</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. INTEGRATED SAHAY AI ANALYTICAL PROMPTS                      */}
      {/* ============================================================== */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary dark:text-sky-400" />
          <h2 className="text-base font-semibold text-ink dark:text-slate-100">
            Grounded Analytical Queries via Sahay AI
          </h2>
        </div>
        <p className="text-xs text-ink-muted dark:text-slate-300 max-w-2xl">
          Click any prompt below to dispatch an authenticated, grounded statutory inquiry against the Assam gazette and live project ledger.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analyticalPrompts.map((promptText, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPrompt(promptText)}
              className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-line dark:border-slate-700 hover:border-primary/50 text-xs font-medium text-ink dark:text-slate-100 cursor-pointer transition-all shadow-xs flex items-center justify-between gap-3"
            >
              <span>{promptText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary dark:text-sky-400 flex-shrink-0" />
            </div>
          ))}
        </div>

        {selectedPrompt && (
          <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-primary/30 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-primary dark:text-sky-400">Selected Statutory Query:</span>
              <button onClick={() => setSelectedPrompt(null)} className="text-ink-muted dark:text-slate-400 hover:text-ink dark:hover:text-white">✕</button>
            </div>
            <p className="text-xs font-medium text-ink dark:text-slate-100">{selectedPrompt}</p>
            <p className="text-[11px] text-ink-muted dark:text-slate-400 pt-1">
              💡 Open the Sahay AI launcher at the bottom-right of your screen to review live gazette citations and structured PDF records for this inquiry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
