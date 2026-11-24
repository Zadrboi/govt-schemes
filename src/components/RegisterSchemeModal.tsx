'use client';

import React, { useState } from 'react';
import { 
  X, Plus, ShieldCheck, Building2, MapPin, 
  Coins, Calendar, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import { CANONICAL_SCHEMES, CanonicalProject } from '@/lib/data/canonical';

interface RegisterSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectRegistered?: (project: CanonicalProject) => void;
}

const ASSAM_DISTRICTS = [
  'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang',
  'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat',
  'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong',
  'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari',
  'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tamulpur', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
];

export default function RegisterSchemeModal({
  isOpen,
  onClose,
  onProjectRegistered
}: RegisterSchemeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [workCode, setWorkCode] = useState(`AS-NES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState('');
  const [scheme, setScheme] = useState(CANONICAL_SCHEMES[0].shortName);
  const [fundingAgency, setFundingAgency] = useState('Ministry of Development of North Eastern Region (MDoNER)');
  const [implementingAgency, setImplementingAgency] = useState('PWD (Roads), Assam');
  const [district, setDistrict] = useState('Darrang');
  const [coDistrict, setCoDistrict] = useState('Sipajhar');
  const [block, setBlock] = useState('Sipajhar Dev Block');
  const [governanceType, setGovernanceType] = useState<'SIXTH_SCHEDULE_ADC' | 'PANCHAYAT_GRAM_SABHA'>('PANCHAYAT_GRAM_SABHA');
  const [adcArea, setAdcArea] = useState<'BTC' | 'KAAC' | 'NCHAC' | ''>('');
  const [villageWard, setVillageWard] = useState('');
  const [latitude, setLatitude] = useState('26.4320');
  const [longitude, setLongitude] = useState('92.0160');
  const [sanctionedCost, setSanctionedCost] = useState('4.50');
  const [fundReleased, setFundReleased] = useState('1.50');
  const [physicalCompletionPct, setPhysicalCompletionPct] = useState('25');
  const [executingOfficer, setExecutingOfficer] = useState('Executive Engineer, Sipajhar Division');
  const [beneficiaries, setBeneficiaries] = useState('4200');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      const sCost = parseFloat(sanctionedCost);
      const fReleased = parseFloat(fundReleased);
      const physPct = parseInt(physicalCompletionPct, 10);
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (!title.trim()) throw new Error('Project title is required.');
      if (isNaN(sCost) || sCost <= 0) throw new Error('Sanctioned cost must be greater than 0.');
      if (isNaN(lat) || lat < 24.0 || lat > 28.5) throw new Error('Latitude must be within Assam/NER bounds (24.0° - 28.5°).');
      if (isNaN(lng) || lng < 89.0 || lng > 96.5) throw new Error('Longitude must be within Assam/NER bounds (89.0° - 96.5°).');

      const newProject: CanonicalProject = {
        id: `proj-${Date.now()}`,
        workCode: workCode.trim(),
        title: title.trim(),
        scheme,
        fundingAgency,
        sanctionDate: new Date().toISOString().split('T')[0],
        sanctionedCost: sCost,
        revisedCost: null,
        state: 'Assam',
        district,
        coDistrict: coDistrict.trim() || district,
        block: block.trim() || 'Headquarters Block',
        governanceType,
        adcArea: governanceType === 'SIXTH_SCHEDULE_ADC' ? (adcArea as 'BTC' | 'KAAC' | 'NCHAC') : null,
        villageWard: villageWard.trim() || 'Village Cluster',
        latitude: lat,
        longitude: lng,
        implementingAgency,
        executingOfficer: executingOfficer.trim(),
        plannedStartDate: new Date().toISOString().split('T')[0],
        plannedEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        physicalCompletionPct: Math.min(100, Math.max(0, physPct)),
        financialSanction: sCost,
        fundReleased: fReleased,
        expenditure: fReleased,
        ucStatus: 'PENDING',
        pendingAmount: fReleased,
        pendingUcAgeDays: 14,
        lastInspectionDate: new Date().toISOString().split('T')[0],
        daysSinceLastInspection: 0,
        outcomeIndicators: {
          beneficiaries: parseInt(beneficiaries, 10) || 1000
        },
        imagePath: '/images/road-bridge.jpg',
        status: physPct >= 100 ? 'COMPLETED' : 'ONGOING',
        delayRiskScore: 18,
        evidenceScore: 75,
        milestones: [
          {
            id: `m1-${Date.now()}`,
            name: 'Administrative & Technical Sanction / Site Mobilisation',
            plannedDate: new Date().toISOString().split('T')[0],
            actualDate: new Date().toISOString().split('T')[0],
            completionPct: 20,
            verified: true,
            verifiedBy: executingOfficer
          },
          {
            id: `m2-${Date.now()}`,
            name: 'Core Civil Infrastructure Execution',
            plannedDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completionPct: 60,
            verified: false
          },
          {
            id: `m3-${Date.now()}`,
            name: 'Final Commissioning & Social Audit Plaque Handover',
            plannedDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completionPct: 100,
            verified: false
          }
        ],
        inspections: [],
        grievancesCount: 0
      };

      // Attempt API POST
      try {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        });
      } catch {
        // Continue even if network/offline
      }

      setSuccess(true);
      if (onProjectRegistered) {
        onProjectRegistered(newProject);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'Failed to register scheme work.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[28px] border border-line dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-line dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary dark:text-sky-400">
                Statutory Scheme Registry
              </span>
            </div>
            <h3 className="text-xl font-bold text-ink dark:text-slate-100">
              Register New Decentralised Scheme Work
            </h3>
            <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
              Enters the canonical ledger with GPS cadastral coordinates, administrative hierarchy &amp; initial milestones.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="my-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            Scheme work registered successfully! Telemetry pins and ledger updated.
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="my-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-800 dark:text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Work Code */}
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Work Code (Statutory Ref)
              </label>
              <input
                type="text"
                value={workCode}
                onChange={(e) => setWorkCode(e.target.value)}
                required
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Scheme Category (11 Schemes) */}
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Scheme Framework (11 Schemes)
              </label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CANONICAL_SCHEMES.map((s) => (
                  <option key={s.code} value={s.shortName}>
                    {s.shortName} — {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Construction of 10km All-Weather Corridor under NESIDS-Roads"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Agencies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Funding Agency
              </label>
              <input
                type="text"
                value={fundingAgency}
                onChange={(e) => setFundingAgency(e.target.value)}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Implementing Agency
              </label>
              <input
                type="text"
                value={implementingAgency}
                onChange={(e) => setImplementingAgency(e.target.value)}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Administrative Hierarchy (District, Co-District, Block) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                District (Assam)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {ASSAM_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Co-District / Subdivision
              </label>
              <input
                type="text"
                value={coDistrict}
                onChange={(e) => setCoDistrict(e.target.value)}
                placeholder="e.g. Sipajhar, Bajali, Rangia"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Block / Municipality
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="e.g. Sipajhar Dev Block"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Governance Type & Sixth Schedule ADC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface/60 dark:bg-slate-800/40 p-3 rounded-2xl border border-line dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Governance Jurisdiction
              </label>
              <select
                value={governanceType}
                onChange={(e) => setGovernanceType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-line dark:border-slate-700 text-ink dark:text-slate-100"
              >
                <option value="PANCHAYAT_GRAM_SABHA">Panchayat &amp; Gram Sabha</option>
                <option value="SIXTH_SCHEDULE_ADC">Sixth Schedule Autonomous Council</option>
              </select>
            </div>

            {governanceType === 'SIXTH_SCHEDULE_ADC' ? (
              <div>
                <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                  Autonomous District Council (ADC)
                </label>
                <select
                  value={adcArea}
                  onChange={(e) => setAdcArea(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-line dark:border-slate-700 text-ink dark:text-slate-100"
                >
                  <option value="">Select Council</option>
                  <option value="BTC">Bodoland Territorial Council (BTC)</option>
                  <option value="KAAC">Karbi Anglong Autonomous Council (KAAC)</option>
                  <option value="NCHAC">North Cachar Hills Autonomous Council (NCHAC)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                  Village / Ward / Habitation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hazarikapara, Ward 4"
                  value={villageWard}
                  onChange={(e) => setVillageWard(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-line dark:border-slate-700 text-ink dark:text-slate-100"
                />
              </div>
            )}
          </div>

          {/* Coordinates & Financials */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Latitude (24.0° - 28.5°)
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Longitude (89.0° - 96.5°)
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Sanctioned (₹ Cr)
              </label>
              <input
                type="number"
                step="0.01"
                value={sanctionedCost}
                onChange={(e) => setSanctionedCost(e.target.value)}
                required
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Fund Released (₹ Cr)
              </label>
              <input
                type="number"
                step="0.01"
                value={fundReleased}
                onChange={(e) => setFundReleased(e.target.value)}
                required
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100"
              />
            </div>
          </div>

          {/* Physical Progress & Beneficiaries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Physical Progress ({physicalCompletionPct}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={physicalCompletionPct}
                onChange={(e) => setPhysicalCompletionPct(e.target.value)}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink dark:text-slate-300 mb-1">
                Target Beneficiaries (Count)
              </label>
              <input
                type="number"
                value={beneficiaries}
                onChange={(e) => setBeneficiaries(e.target.value)}
                placeholder="4200"
                className="w-full text-xs px-3 py-2 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink dark:text-slate-100"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-line dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-ink-muted dark:text-slate-400 hover:text-ink hover:bg-surface dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Recording in Ledger...' : 'Commit Work to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
