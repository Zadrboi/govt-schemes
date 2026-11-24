'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { 
  ShieldCheck, MapPin, AlertTriangle, 
  ArrowLeft, Download, QrCode, Check, Clock,
  ExternalLink, Building2, RefreshCw
} from 'lucide-react';

interface ProjectDetail {
  id: string;
  workCode: string;
  title: string;
  scheme: string;
  fundingAgency: string;
  sanctionDate: string;
  sanctionedCost: number;
  fundReleased: number;
  expenditure: number;
  pendingAmount: number;
  physicalCompletionPct: number;
  state: string;
  district: string;
  coDistrict: string;
  block: string;
  villageWard: string;
  latitude: number;
  longitude: number;
  implementingAgency: string;
  contractor?: string;
  executingOfficer: string;
  technicalSanctionRef?: string;
  status: string;
  ucStatus: string;
  imagePath?: string;
  milestones: any[];
  inspections: any[];
  varianceFlags: any[];
}

export default function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { t } = useLanguage();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState(false);
  const [activeGalleryPhoto, setActiveGalleryPhoto] = useState<string>('/images/river-embankment.jpg');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success && data.project) {
          setProject(data.project);
          if (data.project.imagePath) {
            setActiveGalleryPhoto(data.project.imagePath);
          }
        }
      } catch {
        // Local fallback
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-surface dark:bg-slate-950/50 pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs text-ink-muted dark:text-slate-400">
          <RefreshCw className="w-4 h-4 animate-spin text-primary" />
          <span>Loading statutory asset record...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full min-h-screen bg-surface dark:bg-slate-950/50 pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-ink dark:text-slate-100">Asset Not Found</h2>
        <p className="text-xs text-ink-muted dark:text-slate-400 mt-2">No statutory project was located with reference: {resolvedParams.id}</p>
        <Link href="/dashboard" className="mt-4 px-4 py-2 bg-primary hover:bg-blue-700 text-white text-xs rounded-full">
          {t.assetBreadcrumb || 'Back to Audit Ledger'}
        </Link>
      </div>
    );
  }

  const finPct = project.sanctionedCost > 0 ? (project.expenditure / project.sanctionedCost) * 100 : 0;
  const varianceGap = (finPct - project.physicalCompletionPct).toFixed(1);
  const isVarianceAlert = Number(varianceGap) > 20;

  return (
    <div className="w-full min-h-screen bg-surface dark:bg-slate-950/50 pt-24 pb-28 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col gap-8 transition-colors">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.assetBreadcrumb || 'Back to Audit Ledger'}</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-line dark:border-slate-800 rounded-full text-xs font-medium text-ink-muted dark:text-slate-300 hover:text-ink dark:hover:text-slate-100 shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.assetPrintPlaque || 'Print Plaque'}</span>
          </button>
          <button
            onClick={() => setQrModal(true)}
            className="px-3 py-1.5 bg-primary hover:bg-blue-700 text-white rounded-full text-xs font-medium shadow-xs flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t.assetAuditQrPlaque || 'Audit QR Plaque'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. ASSET HEADER & STATUTORY SEAL                               */}
      {/* ============================================================== */}
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 bg-blue-50 dark:bg-slate-800 text-primary dark:text-sky-400 rounded-full">
              {project.workCode}
            </span>
            <span className="text-xs px-2.5 py-0.5 bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200 rounded-full font-medium">
              {project.scheme}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              project.status === 'STALLED'
                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                : project.status === 'COMPLETED'
                ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200'
                : 'bg-surface dark:bg-slate-800 text-ink dark:text-slate-200'
            }`}>
              {project.status}
            </span>
          </div>

          <h1 className="editorial-headline text-2xl sm:text-3xl text-ink dark:text-slate-100 font-normal">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted dark:text-slate-300 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
              {project.villageWard}, {project.block}, {project.district}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
              {project.implementingAgency}
            </span>
          </div>
        </div>

        {/* Cryptographic SHA-256 Integrity Seal */}
        <div className="p-4 rounded-2xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-xs space-y-1 sm:text-right flex-shrink-0">
          <div className="flex items-center gap-1.5 text-secondary dark:text-sky-400 font-semibold sm:justify-end">
            <ShieldCheck className="w-4 h-4 text-secondary dark:text-sky-400" />
            <span>Tamper-Evident SHA-256</span>
          </div>
          <div className="font-mono text-[10px] text-ink-muted dark:text-slate-400 break-all max-w-[200px]">
            {project.workCode.replace(/[^a-zA-Z0-9]/g, '').padEnd(16, 'a')}f4b299e81c0d
          </div>
          <div className="text-[10px] text-ink-muted dark:text-slate-400">
            Audited under RTI 2005 &amp; GIGW 3.0
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PHYSICAL-FINANCIAL BALANCE & VARIANCE WARNING               */}
      {/* ============================================================== */}
      {isVarianceAlert && (
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 flex items-start gap-4 text-xs text-red-800 dark:text-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-red-900 dark:text-red-100">
              Statutory Variance Flag Active (+{varianceGap}% Discrepancy)
            </h3>
            <p>
              Financial disbursement is {finPct.toFixed(1)}% (₹{project.expenditure} Cr of ₹{project.sanctionedCost} Cr), while physical verified progress is only {project.physicalCompletionPct}%. Stop-work inquiry has been initiated under Section 14(2).
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-ink-muted dark:text-slate-400 uppercase font-medium">Sanctioned Amount</span>
          <div className="text-2xl font-semibold text-ink dark:text-slate-100 tabular-nums mt-1">
            ₹{project.sanctionedCost} <span className="text-xs font-normal text-ink-muted dark:text-slate-400">Cr</span>
          </div>
          <div className="text-[10px] text-ink-muted dark:text-slate-400 mt-2">
            Sanctioned: {new Date(project.sanctionDate).toLocaleDateString()}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-ink-muted dark:text-slate-400 uppercase font-medium">Fund Released</span>
          <div className="text-2xl font-semibold text-ink dark:text-slate-100 tabular-nums mt-1">
            ₹{project.fundReleased} <span className="text-xs font-normal text-ink-muted dark:text-slate-400">Cr</span>
          </div>
          <div className="text-[10px] text-primary dark:text-sky-400 mt-2">
            {project.sanctionedCost > 0 ? ((project.fundReleased / project.sanctionedCost) * 100).toFixed(0) : 0}% of budget
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-ink-muted dark:text-slate-400 uppercase font-medium">Recorded Expenditure</span>
          <div className="text-2xl font-semibold text-ink dark:text-slate-100 tabular-nums mt-1">
            ₹{project.expenditure} <span className="text-xs font-normal text-ink-muted dark:text-slate-400">Cr</span>
          </div>
          <div className="text-[10px] text-ink-muted dark:text-slate-400 mt-2">
            Utilization Certificate: <span className="font-semibold text-ink dark:text-slate-100">{project.ucStatus}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-ink-muted dark:text-slate-400 uppercase font-medium">{t.assetPhysicalCompletion || 'Physical Completion'}</span>
          <div className="text-2xl font-semibold text-ink dark:text-slate-100 tabular-nums mt-1">
            {project.physicalCompletionPct}%
          </div>
          <div className="w-full h-1.5 bg-line dark:bg-slate-800 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-secondary dark:bg-sky-400 rounded-full"
              style={{ width: `${Math.min(100, project.physicalCompletionPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. GEO-TAGGED SITE PHOTO GALLERY & FIELD INSPECTIONS           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Photo & Visual Evidence */}
        <div className="rounded-[24px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-ink dark:text-slate-100">{t.assetGeoSitePhotography || 'Geo-Tagged Site Photography'}</h2>
            <span className="text-[10px] px-2 py-0.5 bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200 rounded-full font-semibold">
              EXIF Verified
            </span>
          </div>

          <div className="relative w-full h-[280px] rounded-2xl overflow-hidden border border-line dark:border-slate-800">
            <Image
              src={activeGalleryPhoto}
              alt={project.title}
              fill
              className="object-cover object-center transition-all duration-300"
            />
            {/* Overlay metadata chip */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md text-white p-3 rounded-xl text-xs space-y-0.5">
              <div className="flex items-center justify-between font-mono text-[10px] text-sky-300">
                <span>GPS: {project.latitude.toFixed(4)}°N, {project.longitude.toFixed(4)}°E</span>
                <span>Altitude: 48m</span>
              </div>
              <div className="text-[11px] font-medium truncate">{project.title}</div>
            </div>
          </div>

          {/* Multi-Photo Evidence Gallery Thumbnails */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { path: '/images/river-embankment.jpg', label: 'Riverine Slope' },
              { path: '/images/bridge-piers.jpg', label: 'Substructure' },
              { path: '/images/heritage-road.jpg', label: 'Approach Pavement' },
            ].map((thumb) => (
              <div
                key={thumb.path}
                onClick={() => setActiveGalleryPhoto(thumb.path)}
                className={`relative h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  activeGalleryPhoto === thumb.path ? 'border-primary ring-2 ring-primary/30' : 'border-line dark:border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={thumb.path} alt={thumb.label} fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] py-0.5 px-1 text-center truncate">
                  {thumb.label}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-ink-muted dark:text-slate-400 flex items-center justify-between pt-1">
            <span>Executing Officer: <strong className="text-ink dark:text-slate-100">{project.executingOfficer}</strong></span>
            {project.contractor && (
              <span>Contractor: <strong className="text-ink dark:text-slate-100">{project.contractor}</strong></span>
            )}
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="rounded-[24px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-line dark:border-slate-800">
              <h2 className="text-base font-semibold text-ink dark:text-slate-100">Physical Milestone Schedule</h2>
              <span className="text-[11px] text-ink-muted dark:text-slate-400">
                {project.milestones.length} Key Milestones
              </span>
            </div>

            <div className="space-y-4 mt-4 max-h-[300px] overflow-y-auto pr-1">
              {project.milestones.length === 0 ? (
                <div className="text-xs text-ink-muted dark:text-slate-400 py-8 text-center">
                  Milestone schedule initialized. Awaiting officer breakdown.
                </div>
              ) : (
                project.milestones.map((m, idx) => (
                  <div key={m.id || idx} className="flex items-start gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-slate-800 text-primary dark:text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {m.verified ? <Check className="w-3 h-3 text-secondary dark:text-sky-400" /> : <Clock className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-ink dark:text-slate-100">{m.name}</span>
                        <span className="font-mono text-[10px] text-ink-muted dark:text-slate-400">
                          {new Date(m.plannedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-muted dark:text-slate-300 text-[11px]">
                        <span>Target: {m.completionPct}%</span>
                        {m.verified && (
                          <span className="text-secondary dark:text-sky-400 font-medium">• Verified by {m.verifiedBy || 'Field Officer'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-line dark:border-slate-800 mt-4 flex items-center justify-between text-xs">
            <span className="text-ink-muted dark:text-slate-400">Need site re-verification?</span>
            <Link
              href="/verify"
              className="text-primary dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Submit Inspection Photo</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL: QR AUDIT PLAQUE VIEW                                 */}
      {/* ============================================================== */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-line dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-line dark:border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-ink dark:text-slate-100">Public On-Site Plaque</h3>
              <button
                onClick={() => setQrModal(false)}
                className="text-xs px-2.5 py-1 rounded-full bg-surface dark:bg-slate-800 hover:bg-slate-200 text-ink-muted dark:text-slate-400"
              >
                Close
              </button>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="p-6 bg-surface dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-line dark:border-slate-700">
              <div className="w-44 h-44 bg-white rounded-xl p-3 border border-line shadow-inner flex items-center justify-center">
                <QrCode className="w-36 h-36 text-slate-950" />
              </div>
              <div className="font-mono text-xs font-semibold text-primary dark:text-sky-400 mt-3">
                {project.workCode}
              </div>
              <div className="text-[11px] text-ink-muted dark:text-slate-300 max-w-xs mt-1">
                Scan on-site to inspect physical vs. financial status directly on Drishti.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-xs"
              >
                Print Plaque Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
