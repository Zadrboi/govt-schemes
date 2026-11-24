'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, MapPin, Search, Phone, 
  Clock, ArrowUpRight, ChevronRight, X 
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface DirectoryEntity {
  id: string;
  name: string;
  type: 'TRANSPORT' | 'BLOCK_OFFICE' | 'VERIFY_CENTER';
  district: string;
  location: string;
  coordinates: string;
  timing: string;
  contact?: string;
  officerInCharge?: string;
  services: string[];
  schedule?: string[];
  details: string;
  imagePath: string;
}

const DIRECTORY_DATA: DirectoryEntity[] = [
  {
    id: 'astc-sipajhar',
    name: 'ASTC Rural Transit Hub — Sipajhar Bus Station',
    type: 'TRANSPORT',
    district: 'Darrang',
    location: 'NH-15 Junction, Sipajhar Town, Darrang',
    coordinates: '26.4182° N, 91.8923° E',
    timing: '05:30 AM – 08:30 PM (Daily)',
    contact: '03713-264100',
    officerInCharge: 'Station Superintendent, ASTC Mangaldai Division',
    imagePath: '/images/ASTC_multi_level_parking_at_Paltanbazar,_Guwahati.jpg',
    services: [
      'Direct rural feeder to NESIDS Piped Water Project Sites',
      'Solar-powered charging point for citizen field officers',
      'Public grievance submission kiosk (RTPS 2012)',
    ],
    schedule: [
      '06:15 AM (Mangaldai Express)',
      '08:45 AM (Sipajhar - Patharighat Feeder)',
      '11:30 AM (Guwahati Inter-District)',
      '02:15 PM (Tangla Border Route)',
      '05:45 PM (Darrang Night Transit)',
    ],
    details:
      'Crucial transit interchange connecting 18 Gaon Panchayats to the district administrative headquarters and major PM-DevINE infrastructure corridors.',
  },
  {
    id: 'ghat-dhubri-phulbari',
    name: 'Inland Waterways Ferry Terminal — Dhubri River Ghat',
    type: 'TRANSPORT',
    district: 'Dhubri',
    location: 'Brahmaputra South Bank, Dhubri Old Port',
    coordinates: '26.0205° N, 89.9744° E',
    timing: '06:00 AM – 05:00 PM (Subject to river current)',
    contact: '1800-345-3999',
    officerInCharge: 'IWT Field Inspector, Dhubri Division',
    imagePath: '/images/A_ferry_on_the_river_Brahmaputra.jpg',
    services: [
      'Public Ro-Pax river transit across Assam-Meghalaya bridge alignment',
      'Material transport for bridge construction inspection teams',
      'Life-jacket and safety equipment kiosk',
    ],
    schedule: ['07:00 AM', '09:30 AM', '12:00 PM', '02:30 PM', '04:30 PM'],
    details:
      'Provides daily riverine logistics for local communities and statutory monitors observing the Dhubri-Phulbari Brahmaputra Bridge construction.',
  },
  {
    id: 'dc-darrang-mangaldai',
    name: 'District Commissioner Office — Darrang',
    type: 'BLOCK_OFFICE',
    district: 'Darrang',
    location: 'DC Office Complex, Mangaldai Town',
    coordinates: '26.4442° N, 92.0336° E',
    timing: '09:30 AM – 05:00 PM (Monday to Saturday)',
    contact: '03713-222135',
    officerInCharge: 'District Commissioner & District Magistrate',
    imagePath: '/images/Legislativrat_des_Bodolands_in_Kokrajhar.jpg',
    services: [
      'District Planning Committee (DPC) sanction registries',
      'Statutory stop-work notice appeals & reconciliations',
      'RTI 2005 First Appellate Authority hearing room',
    ],
    details:
      'Apex district authority overseeing 1,420+ decentralised scheme budgets, technical approvals, and public land settlements.',
  },
  {
    id: 'phe-lab-kamrup',
    name: 'PHE Regional Water Quality & Material Testing Laboratory',
    type: 'VERIFY_CENTER',
    district: 'Kamrup',
    location: 'Betkuchi, Near ISBT, Guwahati',
    coordinates: '26.1158° N, 91.7312° E',
    timing: '10:00 AM – 04:30 PM (Working days)',
    contact: '0361-2270911',
    officerInCharge: 'Chief Chemist & Material Testing Officer',
    imagePath: '/images/Community_hall,_Tezpur_University.jpg',
    services: [
      'Chemical & bacteriological test report verification',
      'Fluoride and arsenic filtration verification for NESIDS piped schemes',
      'Cement compressive strength & bitumen grade testing',
    ],
    details:
      'Statutory testing facility providing independent laboratory certificates for physical verification checkpoints under Section 12.',
  },
  {
    id: 'bdo-sipajhar',
    name: 'Block Development Office — Sipajhar Dev Block',
    type: 'BLOCK_OFFICE',
    district: 'Darrang',
    location: 'Sipajhar Block Campus, Darrang',
    coordinates: '26.4210° N, 91.8890° E',
    timing: '09:30 AM – 05:00 PM',
    contact: '03713-264220',
    officerInCharge: 'Block Development Officer (BDO)',
    imagePath: '/images/Circuit_House,Golaghat.jpg',
    services: [
      'Gaon Panchayat DPR counter-signing & GPS asset mapping',
      'Beneficiary muster roll verification',
      'Social audit public hearings schedule display',
    ],
    details:
      'Primary administrative clearinghouse for rural decentralised funds, Gaon Sabha resolutions, and contractor measurement books.',
  },
  {
    id: 'rtps-jorhat',
    name: 'Jorhat Citizen Facilitation Center (RTPS Seva Kendra)',
    type: 'VERIFY_CENTER',
    district: 'Jorhat',
    location: 'Revenue Circle Office, Jorhat West',
    coordinates: '26.7509° N, 94.2037° E',
    timing: '09:00 AM – 06:00 PM',
    contact: '1905 (State RTPS Helpline)',
    officerInCharge: 'Circle Officer & Designated Public Grievance Officer',
    imagePath: '/images/District_Library,_Golaghat.png',
    services: [
      'Filing of delayed scheme grievances under RTPS Act 2012',
      'Digital land NOC application for Assam Darshan heritage grants',
      'Certified copies of physical completion certificates',
    ],
    details:
      'Enforces mandatory 15-day statutory resolution windows for delayed public infrastructure works across Upper Assam.',
  },
];

export default function DirectoryPage() {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [drawerEntity, setDrawerEntity] = useState<DirectoryEntity | null>(null);

  const filteredEntities = DIRECTORY_DATA.filter((item) => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesDistrict = selectedDistrict === 'ALL' || item.district === selectedDistrict;
    const q = search.toLowerCase();
    const matchesSearch =
      search.trim() === '' ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.details.toLowerCase().includes(q);
    return matchesType && matchesDistrict && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-surface dark:bg-slate-950/50 pt-32 pb-28 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col gap-8 transition-colors">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-line dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary dark:text-sky-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary dark:text-sky-400">
              {t.dirBadge || 'Civic Access & Transport Connectivity'}
            </span>
          </div>
          <h1 className="editorial-headline text-3xl sm:text-4xl text-ink dark:text-slate-100">
            {t.dirHeading || 'Shared Transport & Civic Access Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-300 mt-1">
            Locate ASTC bus connections, river ferry ghats, block offices, and testing laboratories.
          </p>
        </div>

        {/* Search & District Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transit route, BDO, lab..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-full bg-white dark:bg-slate-900 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:border-primary shadow-xs"
            />
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs px-3 py-2 rounded-full bg-white dark:bg-slate-900 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:border-primary shadow-xs"
          >
            <option value="ALL">All Districts</option>
            <option value="Darrang">Darrang</option>
            <option value="Kamrup">Kamrup</option>
            <option value="Jorhat">Jorhat</option>
            <option value="Dhubri">Dhubri</option>
          </select>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
        {[
          { id: 'ALL', label: t.dirAllHubs || 'All Civic Points', count: DIRECTORY_DATA.length },
          { id: 'TRANSPORT', label: t.dirRiverineFerries || '🚌 ASTC Buses & Ferries', count: DIRECTORY_DATA.filter((d) => d.type === 'TRANSPORT').length },
          { id: 'BLOCK_OFFICE', label: t.dirBlockOffices || '🏛️ Block Offices & DCs', count: DIRECTORY_DATA.filter((d) => d.type === 'BLOCK_OFFICE').length },
          { id: 'VERIFY_CENTER', label: t.dirLaboratories || '🔬 Water Labs & RTPS Kiosks', count: DIRECTORY_DATA.filter((d) => d.type === 'VERIFY_CENTER').length },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterType(btn.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 whitespace-nowrap ${
              filterType === btn.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 hover:bg-surface dark:hover:bg-slate-800 text-ink-muted dark:text-slate-300 border border-line dark:border-slate-800'
            }`}
          >
            <span>{btn.label}</span>
            <span className="ml-1.5 text-[10px] opacity-75">({btn.count})</span>
          </button>
        ))}
      </div>

      {/* Directory Grid with Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntities.map((entity) => {
          return (
            <div
              key={entity.id}
              onClick={() => setDrawerEntity(entity)}
              className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-xs hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 overflow-hidden"
            >
              {/* Entity Thumbnail */}
              <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-line dark:border-slate-800">
                <Image src={entity.imagePath} alt={entity.name} fill className="object-cover" />
                <div className="absolute top-2.5 left-2.5">
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md ${
                    entity.type === 'TRANSPORT'
                      ? 'bg-sky-900/80 text-sky-200'
                      : entity.type === 'BLOCK_OFFICE'
                      ? 'bg-blue-900/80 text-blue-200'
                      : 'bg-slate-900/80 text-slate-200'
                  }`}>
                    {entity.type === 'TRANSPORT' ? 'Shared Transport' : entity.type === 'BLOCK_OFFICE' ? 'Administration' : 'Testing / Facilitation'}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono">
                  {entity.district}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-ink dark:text-slate-100 line-clamp-2 leading-snug">
                  {entity.name}
                </h3>

                <div className="text-xs text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary dark:text-sky-400 flex-shrink-0" />
                  <span className="truncate">{entity.location}</span>
                </div>

                <p className="text-xs text-ink-muted dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {entity.details}
                </p>
              </div>

              <div className="pt-3 border-t border-line/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-ink-muted dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary dark:text-sky-400" />
                  <span className="text-[11px]">{entity.timing.split('(')[0]}</span>
                </span>
                <span className="text-primary dark:text-sky-400 font-semibold flex items-center gap-1 hover:underline">
                  <span>View Details</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Frosted Detail Drawer */}
      {drawerEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs p-2 sm:p-6">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-lg w-full h-[92dvh] sm:h-[90vh] max-h-[720px] p-5 sm:p-8 flex flex-col justify-between shadow-2xl border border-line dark:border-slate-800 overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-line dark:border-slate-800 pb-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary dark:text-sky-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {drawerEntity.type}
                </span>
                <button
                  onClick={() => setDrawerEntity(null)}
                  className="p-1 rounded-full text-ink-muted dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-surface dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Photo Banner */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-line dark:border-slate-800">
                <Image src={drawerEntity.imagePath} alt={drawerEntity.name} fill className="object-cover" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-ink dark:text-slate-100">{drawerEntity.name}</h2>
                <div className="text-xs text-ink-muted dark:text-slate-400 flex items-center gap-1.5 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
                  <span>{drawerEntity.location} ({drawerEntity.district})</span>
                </div>
              </div>

              {/* Coordinates & Operating Hours */}
              <div className="p-4 rounded-2xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted dark:text-slate-400">Coordinates:</span>
                  <span className="font-mono text-ink dark:text-slate-100 font-medium">{drawerEntity.coordinates}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted dark:text-slate-400">Timing:</span>
                  <span className="text-ink dark:text-slate-100 font-medium">{drawerEntity.timing}</span>
                </div>
                {drawerEntity.contact && (
                  <div className="flex justify-between items-center">
                    <span className="text-ink-muted dark:text-slate-400">Helpline / Contact:</span>
                    <a href={`tel:${drawerEntity.contact}`} className="text-primary dark:text-sky-400 font-semibold hover:underline">
                      {drawerEntity.contact}
                    </a>
                  </div>
                )}
                {drawerEntity.officerInCharge && (
                  <div className="flex justify-between items-center">
                    <span className="text-ink-muted dark:text-slate-400">Officer in Charge:</span>
                    <span className="text-ink dark:text-slate-100 font-semibold">{drawerEntity.officerInCharge}</span>
                  </div>
                )}
              </div>

              {/* Schedule if Transport */}
              {drawerEntity.schedule && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-ink dark:text-slate-100 block">
                    Departure Timetable (ASTC / Inland Waterways):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {drawerEntity.schedule.map((tim, i) => (
                      <span key={i} className="px-2.5 py-1 bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 rounded-lg font-mono text-[11px] text-ink dark:text-slate-200">
                        {tim}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Offered Services */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-ink dark:text-slate-100 block">Available Public Facilities:</span>
                <div className="flex flex-wrap gap-2">
                  {drawerEntity.services.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-pill text-blue-900 dark:bg-blue-950 dark:text-blue-200 text-xs rounded-full font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-ink-muted dark:text-slate-300 leading-relaxed">
                {drawerEntity.details}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-line dark:border-slate-800 mt-6 flex gap-2">
              <Link
                href="/dashboard"
                className="flex-1 py-2.5 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-full text-center shadow-xs"
              >
                Inspect District Schemes
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
