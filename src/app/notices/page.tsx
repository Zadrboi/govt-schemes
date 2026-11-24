'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FileText, Search, Calendar, Building2, 
  ChevronRight, CheckCircle2, ArrowUpRight, 
  Download, RefreshCw, X 
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface NoticeItem {
  id: string;
  title: string;
  issuingAuthority: string;
  publishedAt: string;
  effectiveAt?: string;
  status: string;
  originalText: string;
  plainSummary: string;
  actionChecklistJson?: string;
  sourceUrl?: string;
  translationsJson?: string;
  imagePath?: string;
}

export default function NoticesPage() {
  const { t } = useLanguage();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  useEffect(() => {
    const loadNotices = async () => {
      setLoading(true);
      try {
        let url = '/api/notices?limit=50';
        if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.data) {
          setNotices(data.data);
          if (data.data.length > 0) {
            setSelectedNotice((prev) => prev || data.data[0]);
          }
        }
      } catch {
        // Local fallback
      } finally {
        setLoading(false);
      }
    };
    loadNotices();
  }, [statusFilter]);

  const filteredNotices = notices.filter((n) => {
    if (search.trim() === '') return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.issuingAuthority.toLowerCase().includes(q) ||
      n.plainSummary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full min-h-screen bg-surface dark:bg-slate-950/50 pt-24 pb-28 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-8 transition-colors">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-line dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary dark:text-sky-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary dark:text-sky-400">
              {t.noticesGazetteHeader || 'Official Assam Gazette Circulars'}
            </span>
          </div>
          <h1 className="editorial-headline text-3xl sm:text-4xl text-ink dark:text-slate-100">
            {t.noticesTitle || 'Statutory Circulars & Scheme Updates'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-300 mt-1">
            Authoritative administrative orders, fund freeze mandates, and public social audit notices.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.noticesSearchPlaceholder || 'Search circulars, orders...'}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-full bg-white dark:bg-slate-900 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:border-primary shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-full border border-line dark:border-slate-700 shadow-xs overflow-x-auto no-scrollbar max-w-full">
            {['ALL', 'ACTIVE', 'AMENDED', 'SUPERSEDED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  statusFilter === st
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink-muted dark:text-slate-300 hover:text-ink hover:bg-surface dark:hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Changelog Feed & Slide-over Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Changelog Feed): 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-ink-muted dark:text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
              <span>Fetching latest gazette circulars...</span>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="p-12 text-center text-xs text-ink-muted dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-line dark:border-slate-800">
              No matching gazette circulars found for current query.
            </div>
          ) : (
            filteredNotices.map((notice, idx) => {
              const isSelected = selectedNotice?.id === notice.id;
              const isStopWork = notice.title.toLowerCase().includes('stop-work') || notice.title.toLowerCase().includes('freeze');
              const noticePhoto = idx % 3 === 0 ? '/images/plaque-unveiling.jpg' : idx % 3 === 1 ? '/images/water-resources.jpg' : '/images/school-lakhimpur.jpg';

              return (
                <article
                  key={notice.id}
                  onClick={() => {
                    setSelectedNotice(notice);
                    setIsMobileDetailOpen(true);
                  }}
                  className={`p-6 rounded-[24px] border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-primary shadow-md ring-1 ring-primary/20'
                      : 'bg-white/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border-line dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-surface dark:bg-slate-800 text-ink-muted dark:text-slate-400">
                        {new Date(notice.publishedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isStopWork ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' : 'bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                      }`}>
                        {notice.status}
                      </span>
                    </div>

                    <span className="text-[11px] text-primary dark:text-sky-400 font-medium flex items-center gap-1">
                      <span>{t.noticesReadOrderBtn || 'Read Order'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-ink dark:text-slate-100 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-ink-muted dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {notice.plainSummary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-line/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-ink-muted dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-primary dark:text-sky-400" />
                      <span>{notice.issuingAuthority}</span>
                    </span>
                    {notice.effectiveAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Effective: {new Date(notice.effectiveAt).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Right Column: Sticky Slide-over Document Reader (Desktop: hidden below lg) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-28">
          {selectedNotice ? (
            <div className="p-6 sm:p-7 rounded-[28px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-sm space-y-5">
              {/* Document Header Image Banner */}
              <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-line dark:border-slate-800">
                <Image
                  src="/images/plaque-unveiling.jpg"
                  alt="Gazette statutory order announcement"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white">
                  Official Gazette Authority Stamp
                </div>
              </div>

              {/* Document Header */}
              <div className="space-y-2 border-b border-line dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary dark:text-sky-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                    Gazette Order Reader
                  </span>
                  <span className="text-xs font-mono text-ink-muted dark:text-slate-400">
                    Ref #{selectedNotice.id.slice(-8)}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-ink dark:text-slate-100 leading-snug">
                  {selectedNotice.title}
                </h2>
                <div className="text-xs text-ink-muted dark:text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
                  <span>{selectedNotice.issuingAuthority}</span>
                </div>
              </div>

              {/* Plain Language Summary */}
              <div className="p-4 rounded-2xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 space-y-1.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary dark:text-sky-400" />
                  <span>{t.noticesPlainSummaryHeader || 'Citizen Plain-Language Summary'}</span>
                </div>
                <p className="text-xs text-ink dark:text-slate-200 leading-relaxed">
                  {selectedNotice.plainSummary}
                </p>
              </div>

              {/* Action Checklist if present */}
              {selectedNotice.actionChecklistJson && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-ink dark:text-slate-100">
                    Mandatory Statutory Checklist:
                  </div>
                  <div className="space-y-1.5">
                    {(() => {
                      try {
                        const items = JSON.parse(selectedNotice.actionChecklistJson);
                        return items.map((it: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-ink-muted dark:text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <span>{it}</span>
                          </div>
                        ));
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Full Legal Gazette Text */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-ink dark:text-slate-100">
                  {t.noticesOriginalGazetteText || 'Original Gazette Text'}
                </div>
                <div className="p-3.5 rounded-2xl bg-surface dark:bg-slate-800 font-serif text-xs text-ink/80 dark:text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-line dark:border-slate-700">
                  {selectedNotice.originalText}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-surface dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-ink dark:text-slate-200 text-xs font-medium rounded-full border border-line dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.noticesDownloadPdfBtn || 'Download Circular PDF'}</span>
                </button>
                <Link
                  href="/dashboard"
                  className="px-4 py-2.5 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>View Affected Schemes</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 text-center text-xs text-ink-muted dark:text-slate-400">
              Select a circular from the feed to view full statutory order details.
            </div>
          )}
        </div>
      </div>

      {/* Mobile Gazette Reader Modal (lg:hidden) */}
      {selectedNotice && isMobileDetailOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-2 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] max-h-[85dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-line dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-line dark:border-slate-800 pb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary dark:text-sky-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                Gazette Order Reader
              </span>
              <button
                onClick={() => setIsMobileDetailOpen(false)}
                className="p-1 rounded-full text-ink-muted hover:text-ink dark:hover:text-white"
                aria-label="Close document reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Header Image Banner */}
            <div className="relative w-full h-28 rounded-2xl overflow-hidden border border-line dark:border-slate-800">
              <Image
                src="/images/plaque-unveiling.jpg"
                alt="Gazette statutory order announcement"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-2 left-3 text-[10px] font-medium text-white">
                Official Gazette Authority Stamp
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-ink-muted dark:text-slate-400 block mb-1">
                Ref #{selectedNotice.id.slice(-8)}
              </span>
              <h2 className="text-base font-semibold text-ink dark:text-slate-100 leading-snug">
                {selectedNotice.title}
              </h2>
              <div className="text-xs text-ink-muted dark:text-slate-300 flex items-center gap-1.5 mt-1">
                <Building2 className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
                <span>{selectedNotice.issuingAuthority}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary dark:text-sky-400" />
                <span>Citizen Summary</span>
              </div>
              <p className="text-xs text-ink dark:text-slate-200 leading-relaxed">
                {selectedNotice.plainSummary}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-ink dark:text-slate-100">Original Gazette Text:</div>
              <div className="p-3 rounded-2xl bg-surface dark:bg-slate-800 font-serif text-xs text-ink/80 dark:text-slate-200 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap border border-line dark:border-slate-700">
                {selectedNotice.originalText}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-surface dark:bg-slate-800 text-ink dark:text-slate-200 text-xs font-medium rounded-full border border-line dark:border-slate-700 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Circular PDF</span>
              </button>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileDetailOpen(false)}
                className="w-full py-2.5 bg-primary text-white text-xs font-medium rounded-full shadow-xs flex items-center justify-center gap-1"
              >
                <span>View Affected Schemes</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
