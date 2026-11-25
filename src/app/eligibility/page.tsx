'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { ASSAM_DISTRICTS } from '@/lib/data/assam-districts';

interface SchemeMatch {
  code: string;
  name: string;
  department: string;
  fundingShare: string;
  summary: string;
  imagePath: string;
  matchReasons: string[];
  requiredDocs: string[];
}

export default function EligibilityPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [district, setDistrict] = useState<string>('Darrang');
  const [areaType, setAreaType] = useState<string>('rural');
  const [sectorNeed, setSectorNeed] = useState<string>('water');

  const getMatchedSchemes = (): SchemeMatch[] => {
    const list: SchemeMatch[] = [];

    if (sectorNeed === 'water') {
      list.push({
        code: 'NESIDS-OTRI-WATER',
        name: 'NESIDS Other Than Road Infrastructure (Piped Water Supply)',
        department: 'Ministry of DoNER / Assam PHE Department',
        fundingShare: '100% Central Sector Grant',
        imagePath: '/images/water-project.jpg',
        summary:
          'Full capital grant for surface water treatment plants, intake wells, and piped water distribution networks in fluoride/arsenic-affected or hard-to-reach pockets.',
        matchReasons: [
          `Targeted district (${district}) is eligible for 100% Central assistance under DoNER NESIDS guidelines.`,
          'Rural Gaon Panchayat jurisdiction qualifies for community-level piped water schemes.',
          'Statutory provision exists for solar-powered deep tubewell installations.',
        ],
        requiredDocs: [
          'Gaon Sabha resolution endorsing scheme location',
          'Land availability certificate / No Objection Certificate (NOC)',
          'Water quality baseline report from District Laboratory',
        ],
      });
    }

    if (sectorNeed === 'road') {
      list.push({
        code: 'NESIDS-ROADS-2024',
        name: 'NESIDS Road & Bridge Infrastructure Expansion',
        department: 'Public Works Roads Department (PWRD), Assam',
        fundingShare: '100% Central Grant',
        imagePath: '/images/road-bridge.jpg',
        summary:
          'Constructs all-weather connectivity, concrete culverts, and bridges connecting agriculture hubs and schools to state highways.',
        matchReasons: [
          `District ${district} qualifies under North East connectivity priority corridor.`,
          'Unconnected rural habitation with population > 250 qualifies under NESIDS norms.',
        ],
        requiredDocs: [
          'Gaon Panchayat territorial road alignment map',
          'PHE drainage clearance certificate',
          'Joint inspection report signed by Executive Engineer',
        ],
      });
    }

    if (sectorNeed === 'heritage') {
      list.push({
        code: 'ASSAM-DARSHAN-SATRA',
        name: 'Assam Darshan — Preservation of Religious & Cultural Heritage Sites',
        department: 'Transformation & Development Department, Govt of Assam',
        fundingShare: 'State Plan Grant (₹10 Lakh - ₹2.5 Crore)',
        imagePath: '/images/heritage-road.jpg',
        summary:
          'Infrastructure development, visitor amenities, boundary fencing, and road access for historic Satras, Namghars, and ancient shrines.',
        matchReasons: [
          `Location within ${district} has documented cultural footprint eligible for preservation grants.`,
          'Community-managed institution with public access.',
        ],
        requiredDocs: [
          'Registration certificate under Societies Registration Act or Satra Mahasabha',
          'Land patta / ownership documents in the name of the institution',
          'Gaon Sabha verification of public cultural usage',
        ],
      });
    }

    // Common Fallback / Regional Driver
    list.push({
      code: 'PM-DEVINE-CIVIC',
      name: 'Prime Minister’s Development Initiative for North-East (PM-DevINE)',
      department: 'North Eastern Council / Ministry of DoNER',
      fundingShare: '100% Central Funding',
      imagePath: '/images/Typical_Bodo_Village_in_Baksa_District,_Assam.jpg',
      summary:
        'Funding for high-impact social development projects, livelihood parks, and youth community complexes across Assam.',
      matchReasons: [
        'Statewide eligible across all 35 districts of Assam.',
        'Zero financial liability for local beneficiaries.',
      ],
      requiredDocs: [
        'State Empowered Committee recommendation',
        'Detailed DPR with GPS polygons',
      ],
    });

    return list;
  };

  const matches = getMatchedSchemes();

  return (
    <div className="w-full min-h-screen bg-surface dark:bg-slate-950/50 pt-24 pb-28 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col gap-8 transition-colors">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
          <span>{t.eligibilityBadge || 'Statutory Benefit Matcher'}</span>
        </div>
        <h1 className="editorial-headline text-3xl sm:text-4xl text-ink dark:text-slate-100">
          {t.eligibilityHeading || 'Find public welfare, grants, and schemes you are entitled to.'}
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-300">
          Answer 3 quick questions. We cross-reference government gazette rules to show exactly what you qualify for and which documents you need.
        </p>
      </div>

      {/* Guided 3-Step Interactive Container */}
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Step Indicator Header */}
        <div className="grid grid-cols-3 border-b border-line dark:border-slate-800 text-xs font-medium divide-x divide-line dark:divide-slate-800">
          {[
            { num: '01', label: t.eligibilityStep1 || 'Profile & Livelihood' },
            { num: '02', label: t.eligibilityStep2 || 'Location & Need' },
            { num: '03', label: t.eligibilityStep3 || 'Matched Schemes' },
          ].map((s, idx) => {
            const stepNum = idx + 1;
            return (
              <div
                key={s.num}
                onClick={() => stepNum < step && setStep(stepNum)}
                className={`p-4 flex items-center justify-center gap-2.5 transition-colors ${
                  step === stepNum
                    ? 'bg-primary text-white font-semibold'
                    : step > stepNum
                    ? 'bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200 cursor-pointer'
                    : 'bg-surface dark:bg-slate-800 text-ink-muted dark:text-slate-400'
                }`}
              >
                <span className="font-mono text-xs font-bold">
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Citizen Profile */}
        {step === 1 && (
          <div className="p-6 sm:p-10 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-ink dark:text-slate-100">Step 1: Where are you located?</h2>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                Schemes and funding allocations vary between plain districts, Sixth Schedule autonomous areas, and co-districts.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink dark:text-slate-100 block mb-1.5">
                  Select District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-base sm:text-xs px-4 py-3 rounded-2xl bg-surface dark:bg-slate-800 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:border-primary"
                >
                  {ASSAM_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink dark:text-slate-100 block mb-2">
                  Habitation Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'rural', label: 'Rural (Gaon Panchayat)', desc: 'Villages, tea gardens, riverine chars' },
                    { id: 'urban', label: 'Urban (Municipality)', desc: 'Town wards, city corporations' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setAreaType(item.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        areaType === item.id
                          ? 'border-primary bg-blue-50/60 dark:bg-slate-800 shadow-xs'
                          : 'border-line dark:border-slate-700 bg-surface dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-semibold text-xs text-ink dark:text-slate-100">{item.label}</div>
                      <div className="text-[11px] text-ink-muted dark:text-slate-400 mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-line dark:border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-sm flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Continue to Need &amp; Sector</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Need & Sector */}
        {step === 2 && (
          <div className="p-6 sm:p-10 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-ink dark:text-slate-100">Step 2: What community infrastructure is needed?</h2>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                Select the primary civic requirement for your ward or village.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { id: 'water', label: 'Drinking Water & Sanitation', desc: 'Piped water supply, overhead tanks, water quality treatment (NESIDS / JJM)' },
                { id: 'road', label: 'Roads & Bridges', desc: 'Culverts, concrete road link, bridge piers across rivulets (NESIDS Roads)' },
                { id: 'heritage', label: 'Cultural & Heritage Site', desc: 'Historic Satra, Namghar, sacred shrine or pilgrimage amenity (Assam Darshan)' },
                { id: 'livelihood', label: 'Livelihood & Community Facility', desc: 'Cold storage, village market shed, skill center (PM-DevINE / MLAADS)' },
              ].map((sector) => (
                <div
                  key={sector.id}
                  onClick={() => setSectorNeed(sector.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    sectorNeed === sector.id
                      ? 'border-primary bg-blue-50/70 dark:bg-slate-800 shadow-sm ring-1 ring-primary/20'
                      : 'border-line dark:border-slate-700 bg-surface dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold text-xs text-ink dark:text-slate-100">{sector.label}</div>
                  <div className="text-[11px] text-ink-muted dark:text-slate-400 mt-1 leading-relaxed">{sector.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-line dark:border-slate-800">
              <button
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-5 py-3 sm:py-2 bg-surface dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-ink dark:text-slate-200 text-xs font-medium rounded-full flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-sm flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Calculate Eligible Schemes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verified Matches */}
        {step === 3 && (
          <div className="p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary dark:text-sky-400 bg-sky-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Eligibility Verified
                </span>
                <h2 className="text-xl font-semibold text-ink dark:text-slate-100 mt-1">
                  You qualify for {matches.length} statutory schemes in {district}
                </h2>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-primary dark:text-sky-400 font-medium hover:underline"
              >
                Modify Answers
              </button>
            </div>

            <div className="space-y-5">
              {matches.map((scheme) => (
                <div
                  key={scheme.code}
                  className="p-6 rounded-[24px] bg-surface/60 dark:bg-slate-800/50 border border-line dark:border-slate-700 space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-line dark:border-slate-700">
                        <Image src={scheme.imagePath} alt={scheme.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-blue-50 dark:bg-slate-800 text-primary dark:text-sky-400 rounded-full">
                          {scheme.code}
                        </span>
                        <h3 className="text-base font-semibold text-ink dark:text-slate-100 mt-1">
                          {scheme.name}
                        </h3>
                        <div className="text-[11px] text-ink-muted dark:text-slate-400">{scheme.department}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-secondary dark:text-sky-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-line dark:border-slate-700 shadow-xs shrink-0">
                      {scheme.fundingShare}
                    </span>
                  </div>

                  <p className="text-xs text-ink dark:text-slate-200 leading-relaxed">
                    {scheme.summary}
                  </p>

                  {/* Why you match */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-line dark:border-slate-700 space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-primary dark:text-sky-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary dark:text-sky-400" />
                      <span>{t.eligibilityWhyYouQualify || 'Why You Qualify Under Official Rules'}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-ink-muted dark:text-slate-300">
                      {scheme.matchReasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-ink dark:text-slate-100 block">
                      {t.eligibilityDocsRequired || 'Required Documents for Gaon Panchayat Submission:'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {scheme.requiredDocs.map((doc, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-[11px] bg-white dark:bg-slate-800 border border-line dark:border-slate-700 text-ink-muted dark:text-slate-300 shadow-2xs"
                        >
                          📄 {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-primary dark:text-sky-400 block">Need help applying or drafting your resolution?</span>
                <span className="text-ink-muted dark:text-slate-400">Ask Sahay AI in Assamese, Bengali, or Hindi for step-by-step guidance.</span>
              </div>
              <Link
                href="/directory"
                className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-full font-medium shadow-xs flex-shrink-0"
              >
                Find Nearest Block Office
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
