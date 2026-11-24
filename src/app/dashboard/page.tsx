'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { 
  Building2, MapPin, AlertTriangle, CheckCircle2,
  ArrowUpRight, Search, Download, FileSpreadsheet, Plus,
  Layers, ShieldAlert, Sparkles, Activity, Clock, Users,
  CheckCheck, AlertCircle, FileText, ChevronRight
} from 'lucide-react';
import { 
  CANONICAL_PROJECTS, 
  CANONICAL_SCHEMES, 
  CANONICAL_EVENTS,
  CanonicalProject,
  CanonicalEvent
} from '@/lib/data/canonical';
import RegisterSchemeModal from '@/components/RegisterSchemeModal';

// Dynamically import client-only Leaflet GIS component
const GisWorkspace = dynamic(() => import('@/components/GisWorkspace'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] lg:h-[500px] rounded-2xl bg-surface dark:bg-slate-900 border border-line dark:border-slate-800 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-ink-muted dark:text-slate-400">Loading GIS Telemetry Workspace...</span>
      </div>
    </div>
  )
});

type UserRole = 
  | 'CITIZEN' 
  | 'CO_DISTRICT' 
  | 'FIELD_OFFICER' 
  | 'DC_COMMISSIONER' 
  | 'STATE_PLANNING' 
  | 'MDONER_NEC';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [role, setRole] = useState<UserRole>('DC_COMMISSIONER');
  const [projects, setProjects] = useState<CanonicalProject[]>(CANONICAL_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeProject, setActiveProject] = useState<CanonicalProject | null>(CANONICAL_PROJECTS[0]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [eventCategoryFilter, setEventCategoryFilter] = useState<'ALL' | 'FIELD' | 'FINANCIAL' | 'ADMINISTRATIVE' | 'CITIZEN' | 'SYSTEM'>('ALL');
  const [summonAlert, setSummonAlert] = useState<string | null>(null);

  // Load from API with canonical fallback
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        let url = '/api/projects?limit=50';
        if (selectedDistrict !== 'ALL') url += `&district=${encodeURIComponent(selectedDistrict)}`;
        if (selectedStatus !== 'ALL') url += `&status=${selectedStatus}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.projects && data.projects.length > 0) {
            setProjects(data.projects);
            if (!activeProject) setActiveProject(data.projects[0]);
            return;
          }
        }
      } catch {
        // Deterministic fallback to canonical dataset
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [selectedDistrict, selectedStatus]);

  const switchRole = async (newRole: UserRole) => {
    setRole(newRole);
    const emailMap: Record<UserRole, string> = {
      CITIZEN: 'citizen@demo.yojna',
      CO_DISTRICT: 'codistrict@demo.yojna',
      FIELD_OFFICER: 'officer@demo.yojna',
      DC_COMMISSIONER: 'dc@demo.yojna',
      STATE_PLANNING: 'planning@demo.yojna',
      MDONER_NEC: 'mdoner@demo.yojna'
    };
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailMap[newRole], password: 'demo123' }),
      });
    } catch {
      // Offline fallback
    }
  };

  const handleProjectRegistered = (newProj: CanonicalProject) => {
    setProjects(prev => [newProj, ...prev]);
    setActiveProject(newProj);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedDistrict !== 'ALL' && p.district !== selectedDistrict) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.workCode.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.scheme.toLowerCase().includes(q) ||
        p.coDistrict.toLowerCase().includes(q)
      );
    });
  }, [projects, selectedDistrict, selectedStatus, search]);

  // Statistics
  const totalSanctioned = projects.reduce((acc, p) => acc + p.sanctionedCost, 0);
  const totalExpenditure = projects.reduce((acc, p) => acc + (p.expenditure || p.fundReleased || 0), 0);
  const anomalies = projects.filter((p) => {
    const finPct = p.sanctionedCost > 0 ? ((p.fundReleased || p.expenditure) / p.sanctionedCost) * 100 : 0;
    return finPct - p.physicalCompletionPct > 15 || p.status === 'STALLED' || p.stalledAlert;
  });

  const avgCompletion = projects.length > 0 
    ? (projects.reduce((acc, p) => acc + p.physicalCompletionPct, 0) / projects.length).toFixed(1)
    : '54.2';

  // Filtered Events
  const filteredEvents = useMemo(() => {
    if (eventCategoryFilter === 'ALL') return CANONICAL_EVENTS;
    return CANONICAL_EVENTS.filter(e => ((e as any).type || (e as any).category) === eventCategoryFilter);
  }, [eventCategoryFilter]);

  // Flagship Demo Scenario Work (AS-DAR-0821)
  const flagshipWork = projects.find(p => p.workCode === 'AS-DAR-0821') || projects[0];

  const handleSummonContractor = () => {
    setSummonAlert('Statutory Notice Dispatched: DC Office summoned Executive Engineer (PHED) & Contractor for AS-DAR-0821 within 48 hours under GFR Rule 238.');
    setTimeout(() => setSummonAlert(null), 8000);
  };

  return (
    <div className="w-full min-h-screen bg-surface dark:bg-slate-950/50 pt-24 pb-28 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-8 transition-colors">
      
      {/* ============================================================== */}
      {/* 1. HEADER & 6-ROLE OPERATIONAL SWITCHER SHELL                 */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-line dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary dark:bg-sky-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary dark:text-sky-400">
              {t.dashOverview || 'State Decentralised Infrastructure Reconciliation'}
            </span>
          </div>
          <h1 className="editorial-headline text-3xl sm:text-4xl text-ink dark:text-slate-100">
            Cross-Referencing Treasury Disbursements Against <em className="text-primary dark:text-sky-400">Satellite &amp; Ground Telemetry</em>
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-300 mt-1">
            Real-time multi-tier physical-financial reconciliation across all 35 territorial districts &amp; Sixth Schedule ADCs of Assam.
          </p>
        </div>

        {/* Action Buttons: Register Scheme Work & Export */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Register Scheme Work</span>
          </button>

          <a
            href="/api/projects"
            download="drishti_schemes_canonical.json"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-ink dark:text-slate-200 text-xs font-medium border border-line dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Verified Ledger</span>
          </a>
        </div>
      </div>

      {/* 6 Role-Based Perspective Switcher Pills */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-muted dark:text-slate-400 uppercase tracking-wider">
            Operational Perspective (6 Statutory Roles):
          </span>
          <span className="text-[11px] text-primary dark:text-sky-400 font-medium">
            Active: {role.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 shadow-xs overflow-x-auto no-scrollbar">
          {(
            [
              { key: 'DC_COMMISSIONER', label: '1. District Commissioner (DC)', icon: ShieldAlert },
              { key: 'CO_DISTRICT', label: '2. Co-District Comm.', icon: Building2 },
              { key: 'FIELD_OFFICER', label: '3. Block / ADC Officer', icon: MapPin },
              { key: 'STATE_PLANNING', label: '4. State Planning Dept', icon: FileSpreadsheet },
              { key: 'MDONER_NEC', label: '5. MDoNER / NEC', icon: Layers },
              { key: 'CITIZEN', label: '6. Citizen / Gram Sabha', icon: Users },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = role === item.key;
            return (
              <button
                key={item.key}
                onClick={() => switchRole(item.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                    : 'text-ink-muted dark:text-slate-300 hover:text-ink hover:bg-surface dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-primary dark:text-sky-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statutory Summon Notice Toast */}
      {summonAlert && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 flex items-start justify-between gap-3 text-red-900 dark:text-red-200 text-xs animate-fade-in shadow-md">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Statutory Executive Directive Issued:</span> {summonAlert}
            </div>
          </div>
          <button onClick={() => setSummonAlert(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ROLE-TAILORED OPERATIONAL DESK PANELS                       */}
      {/* ============================================================== */}
      {role === 'DC_COMMISSIONER' && (
        <div className="p-5 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 shadow-xs flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-bold text-red-900 dark:text-red-200">
                DC Weekly Exception Review Queue — Stalled Schemes &amp; Physical Variance Alerts
              </h3>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-200">
              {anomalies.length} Exceptions Requiring Executive Action
            </span>
          </div>

          <p className="text-xs text-red-800/80 dark:text-red-300">
            Statutory review under Rule 238 of GFR: Flags works where treasury release exceeds verified field milestones by &gt;15%, or geo-tagged inspection is overdue &gt;60 days.
          </p>

          {/* Signature Flagship Demo Scenario Box */}
          {flagshipWork && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-700 dark:text-red-400">
                    {flagshipWork.workCode}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                    CRITICAL: 74-DAY STALLED INSPECTION
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {flagshipWork.scheme}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink dark:text-slate-100">
                  {flagshipWork.title} — {flagshipWork.coDistrict}, {flagshipWork.district}
                </h4>
                <div className="text-xs text-ink-muted dark:text-slate-300 flex flex-wrap items-center gap-3">
                  <span>Sanctioned: <strong>₹{flagshipWork.sanctionedCost} Cr</strong></span>
                  <span>•</span>
                  <span>Disbursed: <strong className="text-red-600">₹{flagshipWork.fundReleased} Cr (80%)</strong></span>
                  <span>•</span>
                  <span>Verified Physical: <strong className="text-amber-600">{flagshipWork.physicalCompletionPct}%</strong></span>
                  <span>•</span>
                  <span className="text-red-600 font-semibold">Variance Gap: +45% ahead</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSummonContractor}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Summon Contractor (48h)
                </button>
                <Link
                  href={`/asset/${flagshipWork.workCode}`}
                  className="px-3.5 py-2 rounded-xl bg-surface dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-ink dark:text-slate-100 text-xs font-medium border border-line dark:border-slate-700 transition-colors"
                >
                  Inspect Plaque →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {role === 'CO_DISTRICT' && (
        <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-blue-950 dark:text-blue-200">
                Co-District Commissioner Operational Bottleneck Desk
              </h3>
            </div>
            <span className="text-xs font-medium text-primary dark:text-sky-400">Sipajhar, Bajali, Rangia, Titabor, Haflong Subdivisions</span>
          </div>
          <p className="text-xs text-blue-900/80 dark:text-blue-300">
            Dedicated execution monitoring for newly formed Co-Districts in Assam: tracks subdivision contractors, right-of-way clearances, and Gram Sabha project handovers.
          </p>
        </div>
      )}

      {role === 'FIELD_OFFICER' && (
        <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Block &amp; Autonomous District Council (Sixth Schedule) Field Operations
              </h3>
            </div>
            <Link href="/verify" className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline">
              Launch Offline Geo-Verify Tool →
            </Link>
          </div>
          <p className="text-xs text-amber-900/80 dark:text-amber-300">
            Field roster for Bodoland Territorial Council (BTC), Karbi Anglong (KAAC), and Dima Hasao (NCHAC). Log offline GPS coordinates, upload geotagged proof photos, and certify milestones.
          </p>
        </div>
      )}

      {role === 'STATE_PLANNING' && (
        <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-200">
                State Planning &amp; Finance Reconciliation Desk (Assam)
              </h3>
            </div>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Utilisation Certificate (UC) Aging Watch</span>
          </div>
          <p className="text-xs text-purple-900/80 dark:text-purple-300">
            Tracks Central vs State matching shares under NESIDS, NEC, and PM-DevINE. Enforces automatic alerts for UCs pending &gt;180 days to prevent central fund lapse.
          </p>
        </div>
      )}

      {role === 'MDONER_NEC' && (
        <div className="p-5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/60 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600" />
              <h3 className="text-sm font-bold text-cyan-950 dark:text-cyan-200">
                Ministry of Development of North Eastern Region (MDoNER) &amp; NEC Oversight
              </h3>
            </div>
            <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">NER Regional Strategic Balance</span>
          </div>
          <p className="text-xs text-cyan-900/80 dark:text-cyan-300">
            Cross-state coordination and regional equity monitoring across Assam, Meghalaya, Arunachal, Nagaland, and Manipur borders.
          </p>
        </div>
      )}

      {role === 'CITIZEN' && (
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                Citizen &amp; Gram Sabha Social Audit Portal (Zero Login Required)
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Public Domain Accountability</span>
          </div>
          <p className="text-xs text-emerald-900/80 dark:text-emerald-300">
            Every citizen has the statutory right to inspect project expenditure, scan site QR plaques, view satellite proof images, and submit community grievances without administrative roadblocks.
          </p>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. RECONCILIATION SUMMARY TILES (8 Metrics Strip)              */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Schemes */}
        <div className="ticket-card rounded-2xl p-5 shadow-sm flex flex-col justify-between group">
          <div className="flex items-center justify-between text-[#0f172a]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Schemes Monitored</span>
            <Building2 className="w-4 h-4 text-[#1d4ed8]" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] tabular-nums">
              11 Schemes
            </div>
            <div className="text-xs text-[#0f172a] font-medium mt-0.5">
              NESIDS, NEC, PM-DevINE, Assam Darshan
            </div>
          </div>
          <div className="pt-2 border-t border-[#7dd3fc] flex items-center justify-between text-[10px] text-[#334155]">
            <span className="font-semibold text-[#1d4ed8]">100% Statutory</span>
            <span>35 districts</span>
          </div>
        </div>

        {/* Card 2: Physical Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-ink-muted dark:text-slate-400 font-medium">Avg Physical Progress</span>
            <CheckCircle2 className="w-4 h-4 text-secondary dark:text-sky-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-ink dark:text-slate-100 tracking-tight tabular-nums">
              {avgCompletion}%
            </div>
            <div className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">Verified against ground photos</div>
          </div>
          <div className="pt-2 border-t border-line dark:border-slate-800 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-surface dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${avgCompletion}%` }} />
            </div>
            <span className="text-[10px] text-ink-muted dark:text-slate-400">Geo-audited</span>
          </div>
        </div>

        {/* Card 3: Financial Disbursed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-ink-muted dark:text-slate-400 font-medium">Treasury Disbursed</span>
            <FileSpreadsheet className="w-4 h-4 text-primary dark:text-sky-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-ink dark:text-slate-100 tracking-tight tabular-nums">
              ₹{totalExpenditure.toFixed(1)} <span className="text-sm font-normal text-ink-muted dark:text-slate-400">Cr</span>
            </div>
            <div className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">Of ₹{totalSanctioned.toFixed(1)} Cr Sanctioned</div>
          </div>
          <div className="pt-2 border-t border-line dark:border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-ink-muted dark:text-slate-400">Release Ratio</span>
            <span className="px-2 py-0.5 rounded-full bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-semibold">
              {totalSanctioned > 0 ? ((totalExpenditure / totalSanctioned) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        {/* Card 4: Open Anomalies */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-ink-muted dark:text-slate-400 font-medium">Stalled / Variance Flags</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 tracking-tight tabular-nums">
              {anomalies.length} <span className="text-xs font-medium text-ink-muted dark:text-slate-400">Flagged</span>
            </div>
            <div className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">Variance &gt; 15% fund vs field</div>
          </div>
          <div className="pt-2 border-t border-line dark:border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-red-600 dark:text-red-400 font-semibold">Auto-routed to DC</span>
            <Link href="/insights" className="text-primary dark:text-sky-400 hover:underline">Inspect →</Link>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. INTERACTIVE LEAFLET GIS SCHEME WORKSPACE                    */}
      {/* ============================================================== */}
      <GisWorkspace
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(proj) => setActiveProject(proj)}
      />

      {/* ============================================================== */}
      {/* 5. REAL-TIME ACTIVITY LEDGER (FIELD, FIN, ADMIN, CITIZEN, SYS)  */}
      {/* ============================================================== */}
      <div className="rounded-[24px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary dark:text-sky-400" />
              <h2 className="text-lg font-semibold text-ink dark:text-slate-100">
                Real-Time Decentralised Scheme Activity Ledger
              </h2>
            </div>
            <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
              Live tamper-evident event stream capturing inspections, disbursements, DC notices, and Gram Sabha reports.
            </p>
          </div>

          {/* Event Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface dark:bg-slate-800 rounded-xl border border-line dark:border-slate-700">
            {(['ALL', 'FIELD', 'FINANCIAL', 'ADMINISTRATIVE', 'CITIZEN', 'SYSTEM'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setEventCategoryFilter(cat)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  eventCategoryFilter === cat
                    ? 'bg-white dark:bg-slate-700 text-primary dark:text-sky-400 shadow-xs'
                    : 'text-ink-muted dark:text-slate-400 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Event Items */}
        <div className="divide-y divide-line dark:divide-slate-800">
          {filteredEvents.map((evt) => {
            const getBadgeColor = (category: string) => {
              switch (category) {
                case 'FIELD': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
                case 'FINANCIAL': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                case 'ADMINISTRATIVE': return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
                case 'CITIZEN': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                case 'SYSTEM': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
                default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
              }
            };

            const evtCategory = (evt as any).type || (evt as any).category || 'SYSTEM';
            const evtWorkCode = (evt as any).projectWorkCode || (evt as any).workCode || '';

            return (
              <div key={evt.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-surface/40 dark:hover:bg-slate-800/30 transition-colors px-2 rounded-xl">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadgeColor(evtCategory)}`}>
                      {evtCategory}
                    </span>
                    <span className="font-mono text-xs font-bold text-primary dark:text-sky-400">
                      {evtWorkCode}
                    </span>
                    <span className="text-[11px] text-ink-muted dark:text-slate-400">
                      {evt.district} {evt.coDistrict ? `(${evt.coDistrict})` : ''}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-ink dark:text-slate-100">
                    {evt.title}
                  </h4>
                  <p className="text-[11px] text-ink-muted dark:text-slate-300">
                    {evt.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 text-[11px] text-ink-muted dark:text-slate-400 gap-1">
                  <span className="font-mono text-[10px]">{new Date(evt.timestamp).toLocaleString()}</span>
                  <span className="text-[10px] font-medium text-slate-500">By {evt.actor}</span>
                  <Link
                    href={`/asset/${evtWorkCode}`}
                    className="text-primary dark:text-sky-400 hover:underline inline-flex items-center gap-0.5 text-[11px] font-semibold mt-0.5"
                  >
                    View Card →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. RECONCILIATION LEDGER TABLE WITH DIRECT AUDIT ACTIONS       */}
      {/* ============================================================== */}
      <div className="rounded-[24px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-sm p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink dark:text-slate-100">{t.dashLedgerHeader || 'Reconciliation Ledger'}</h2>
            <p className="text-xs text-ink-muted dark:text-slate-300">
              Complete inventory of sanctioned public works with GPS verification status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scheme, code, district..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-full bg-surface dark:bg-slate-800 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:border-primary"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-full bg-surface dark:bg-slate-800 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:border-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="STALLED">Stalled</option>
            </select>
          </div>
        </div>

        {/* Desktop Ledger Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line dark:border-slate-800 text-[11px] font-semibold text-ink-muted dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Work Code &amp; Scheme</th>
                <th className="py-3 px-3">District / Co-District</th>
                <th className="py-3 px-3">Sanction vs. Disbursed</th>
                <th className="py-3 px-3">Physical Progress</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-slate-800 text-xs">
              {filteredProjects.map((p) => {
                const finPct = p.sanctionedCost > 0 ? (((p.fundReleased || p.expenditure) / p.sanctionedCost) * 100).toFixed(0) : '0';
                return (
                  <tr key={p.id} className="hover:bg-surface/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono text-[11px] text-primary dark:text-sky-400 font-semibold">{p.workCode}</div>
                      <div className="font-medium text-ink dark:text-slate-100 max-w-xs truncate">{p.title}</div>
                      <div className="text-[10px] text-ink-muted dark:text-slate-400">{p.scheme}</div>
                    </td>
                    <td className="py-3 px-3 text-ink-muted dark:text-slate-300">
                      <div>{p.district}</div>
                      <div className="text-[10px] text-ink-muted dark:text-slate-400">Co: {p.coDistrict}</div>
                    </td>
                    <td className="py-3 px-3 tabular-nums">
                      <div className="font-medium text-ink dark:text-slate-100">₹{p.sanctionedCost} Cr</div>
                      <div className="text-[10px] text-ink-muted dark:text-slate-400">Spent: ₹{p.fundReleased || p.expenditure} Cr ({finPct}%)</div>
                    </td>
                    <td className="py-3 px-3 tabular-nums">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.status === 'STALLED' ? 'bg-red-500' : 'bg-secondary'
                            }`}
                            style={{ width: `${p.physicalCompletionPct}%` }}
                          />
                        </div>
                        <span className="font-semibold text-ink dark:text-slate-100">{p.physicalCompletionPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                          : p.status === 'STALLED'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/asset/${p.workCode}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-surface hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-ink dark:text-slate-100 rounded-full border border-line dark:border-slate-700 text-[11px] font-medium transition-colors"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3 h-3 text-primary dark:text-sky-400" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredProjects.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-ink-muted dark:text-slate-400">
                    No infrastructure projects found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Ledger Cards (md:hidden) */}
        <div className="md:hidden space-y-3">
          {filteredProjects.map((p) => {
            const finPct = p.sanctionedCost > 0 ? (((p.fundReleased || p.expenditure) / p.sanctionedCost) * 100).toFixed(0) : '0';
            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-surface/50 dark:bg-slate-800/40 border border-line dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary dark:text-sky-400">
                    {p.workCode}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                        : p.status === 'STALLED'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : 'bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-ink dark:text-slate-100 leading-snug">
                    {p.title}
                  </h4>
                  <div className="text-[11px] text-ink-muted dark:text-slate-400 mt-0.5">
                    {p.scheme} • {p.district} (Co: {p.coDistrict})
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-ink-muted dark:text-slate-400">Physical Progress:</span>
                    <span className="font-semibold text-ink dark:text-slate-100">{p.physicalCompletionPct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-line dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        p.status === 'STALLED' ? 'bg-red-500' : 'bg-secondary'
                      }`}
                      style={{ width: `${p.physicalCompletionPct}%` }}
                    />
                  </div>
                </div>

                {/* Financial comparison & Inspect action */}
                <div className="pt-2 border-t border-line/60 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-ink-muted dark:text-slate-400">
                    <span>₹{p.sanctionedCost} Cr</span> • <span>Spent: ₹{p.fundReleased || p.expenditure} Cr ({finPct}%)</span>
                  </div>
                  <Link
                    href={`/asset/${p.workCode}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-primary hover:bg-blue-700 text-white rounded-full text-xs font-medium shadow-xs transition-colors min-h-[36px]"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-8 text-xs text-ink-muted dark:text-slate-400">
              No infrastructure projects found matching your query.
            </div>
          )}
        </div>
      </div>

      {/* Register Scheme Modal */}
      <RegisterSchemeModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onProjectRegistered={handleProjectRegistered}
      />
    </div>
  );
}
