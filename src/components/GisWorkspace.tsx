'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  CanonicalProject, 
  CANONICAL_PROJECTS, 
  CANONICAL_SCHEMES 
} from '@/lib/data/canonical';
import { ASSAM_DISTRICTS } from '@/lib/data/assam-districts';
import { 
  MapPin, Layers, Filter, AlertTriangle, ShieldCheck, 
  ExternalLink, CheckCircle2, Flame, Eye, Table as TableIcon,
  RotateCcw, Compass, ArrowUpRight
} from 'lucide-react';

interface GisWorkspaceProps {
  projects?: CanonicalProject[];
  activeProject?: CanonicalProject | null;
  onSelectProject?: (project: CanonicalProject) => void;
  className?: string;
}

export default function GisWorkspace({
  projects = CANONICAL_PROJECTS,
  activeProject,
  onSelectProject,
  className = ''
}: GisWorkspaceProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const heatmapLayerRef = useRef<any>(null);

  // View state
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [baseLayer, setBaseLayer] = useState<'map' | 'satellite'>('map');
  const [showRiskHeatmap, setShowRiskHeatmap] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // 5-Level Administrative Filters
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedCoDistrict, setSelectedCoDistrict] = useState<string>('ALL');
  const [selectedBlock, setSelectedBlock] = useState<string>('ALL');
  const [selectedGovernance, setSelectedGovernance] = useState<string>('ALL');
  const [selectedScheme, setSelectedScheme] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    setMounted(true);
    // Detect dark mode from documentElement
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Filter options derived from data & canonical districts
  const districts = useMemo(() => {
    return ASSAM_DISTRICTS;
  }, []);

  const coDistricts = useMemo(() => {
    const set = new Set<string>();
    projects
      .filter(p => selectedDistrict === 'ALL' || p.district === selectedDistrict)
      .forEach(p => p.coDistrict && set.add(p.coDistrict));
    return Array.from(set).sort();
  }, [projects, selectedDistrict]);

  const blocks = useMemo(() => {
    const set = new Set<string>();
    projects
      .filter(p => 
        (selectedDistrict === 'ALL' || p.district === selectedDistrict) &&
        (selectedCoDistrict === 'ALL' || p.coDistrict === selectedCoDistrict)
      )
      .forEach(p => p.block && set.add(p.block));
    return Array.from(set).sort();
  }, [projects, selectedDistrict, selectedCoDistrict]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (selectedDistrict !== 'ALL' && p.district !== selectedDistrict) return false;
      if (selectedCoDistrict !== 'ALL' && p.coDistrict !== selectedCoDistrict) return false;
      if (selectedBlock !== 'ALL' && p.block !== selectedBlock) return false;
      if (selectedGovernance !== 'ALL' && p.governanceType !== selectedGovernance) return false;
      if (selectedScheme !== 'ALL' && p.scheme !== selectedScheme) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      return true;
    });
  }, [projects, selectedDistrict, selectedCoDistrict, selectedBlock, selectedGovernance, selectedScheme, selectedStatus]);

  // Leaflet Map Initialization & Updates
  useEffect(() => {
    if (!mounted || viewMode !== 'map' || !mapContainerRef.current) return;

    let isSubscribed = true;

    // Dynamically load leaflet on client only
    import('leaflet').then((L) => {
      if (!isSubscribed || !mapContainerRef.current) return;

      // If map is already initialized, just update layers
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [26.2006, 92.9376], // Assam geographic center
          zoom: 7,
          minZoom: 6,
          maxZoom: 16,
          maxBounds: [
            [23.5, 89.0], // Southwest NER bounds
            [28.8, 97.0]  // Northeast NER bounds
          ],
          zoomControl: false
        });

        // Add custom top-right zoom control
        L.control.zoom({ position: 'topright' }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Update Tile Layer: Keyless OpenStreetMap (default) vs Keyless Esri World Imagery (satellite)
      const tileUrl = baseLayer === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileAttribution = baseLayer === 'satellite'
        ? '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

      // Remove existing tile layers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: tileAttribution,
      }).addTo(map);

      // Manage Risk Heatmap Overlay
      if (heatmapLayerRef.current) {
        map.removeLayer(heatmapLayerRef.current);
        heatmapLayerRef.current = null;
      }

      if (showRiskHeatmap) {
        const heatmapGroup = L.layerGroup();

        // 1. Darrang / Sipajhar High-Risk Cluster (74-day Stalled NESIDS Water Supply)
        L.circle([26.4320, 92.0160], {
          radius: 18000,
          color: '#dc2626',
          fillColor: '#ef4444',
          fillOpacity: 0.22,
          weight: 2,
          dashArray: '4, 4'
        }).bindTooltip('<div class="font-sans text-xs font-semibold text-red-600">Darrang High Risk: 74-Day Inspection Stalled (AS-DAR-0821)</div>', {
          permanent: false,
          direction: 'top'
        }).addTo(heatmapGroup);

        // 2. Kokrajhar BTC Border Corridor Risk
        L.circle([26.4010, 90.2715], {
          radius: 22000,
          color: '#d97706',
          fillColor: '#f59e0b',
          fillOpacity: 0.18,
          weight: 1.5,
          dashArray: '3, 3'
        }).bindTooltip('<div class="font-sans text-xs font-semibold text-amber-600">Sixth Schedule BTC: Inter-Agency Delay Watch (AS-KOK-1102)</div>', {
          permanent: false,
          direction: 'top'
        }).addTo(heatmapGroup);

        // 3. Dhubri Riverine Flood Protection Risk
        L.circle([26.0207, 89.9740], {
          radius: 16000,
          color: '#d97706',
          fillColor: '#f59e0b',
          fillOpacity: 0.18,
          weight: 1.5
        }).bindTooltip('<div class="font-sans text-xs font-semibold text-amber-600">Dhubri: Critical Embankment Physical Gap Watch</div>', {
          permanent: false,
          direction: 'top'
        }).addTo(heatmapGroup);

        // 4. Majuli River Island Preservation
        L.circle([26.9600, 94.2200], {
          radius: 14000,
          color: '#0284c7',
          fillColor: '#38bdf8',
          fillOpacity: 0.15,
          weight: 1.5
        }).addTo(heatmapGroup);

        heatmapGroup.addTo(map);
        heatmapLayerRef.current = heatmapGroup;
      }

      // Manage Status Markers Layer
      if (markersLayerRef.current) {
        map.removeLayer(markersLayerRef.current);
        markersLayerRef.current = null;
      }

      const markersGroup = L.layerGroup();

      filteredProjects.forEach((proj) => {
        if (!proj.latitude || !proj.longitude) return;

        // Distinct shapes and colors based on status (accessible for color-blind users)
        let iconHtml = '';
        const isStalled = proj.status === 'STALLED' || proj.stalledAlert;
        const isSelected = activeProject?.id === proj.id || activeProject?.workCode === proj.workCode;

        if (isStalled) {
          // Stalled: Red Octagon with pulsating animation
          iconHtml = `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-125 z-40' : 'z-20'}">
              <span class="absolute w-8 h-8 rounded-full bg-red-500/30 animate-ping"></span>
              <div class="w-7 h-7 bg-red-600 text-white rounded-md flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 rotate-45 transform">
                <span class="-rotate-45 font-bold text-[10px]">!</span>
              </div>
            </div>
          `;
        } else if (proj.status === 'COMPLETED') {
          // Completed: Cerulean Circle with check
          iconHtml = `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-125 z-40' : 'z-10'}">
              <div class="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
          `;
        } else if (proj.mismatchAlert || (proj.fundReleased / proj.sanctionedCost * 100 - proj.physicalCompletionPct) >= 20) {
          // Mismatch: Purple Diamond with split
          iconHtml = `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-125 z-40' : 'z-20'}">
              <div class="w-6 h-6 bg-purple-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 rotate-45 transform">
                <span class="-rotate-45 font-bold text-[9px]">Δ</span>
              </div>
            </div>
          `;
        } else if (proj.delayRiskScore > 40) {
          // Delayed: Amber Triangle with clock
          iconHtml = `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-125 z-40' : 'z-20'}">
              <div class="w-6 h-6 bg-amber-500 text-slate-950 rounded-sm flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                <span class="font-bold text-[10px]">⏱</span>
              </div>
            </div>
          `;
        } else {
          // On Track / Ongoing: Cobalt Shield
          iconHtml = `
            <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-125 z-40' : 'z-10'}">
              <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                <div class="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>
          `;
        }

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'leaflet-custom-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -16]
        });

        const marker = L.marker([proj.latitude, proj.longitude], { icon: customIcon });

        // Financial & Physical Progress Calculations
        const finPct = Math.min(100, Math.round((proj.fundReleased / proj.sanctionedCost) * 100));
        const physPct = proj.physicalCompletionPct;
        const varianceGap = Math.max(0, finPct - physPct);

        // Rich Popup Card
        const popupContent = `
          <div style="font-family: inherit; min-width: 260px; max-width: 320px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #1d4ed8;">${proj.workCode}</span>
              <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 9999px; background: ${
                proj.status === 'STALLED' ? '#fee2e2; color: #991b1b;' : proj.status === 'COMPLETED' ? '#e0f2fe; color: #075985;' : '#e0e7ff; color: #3730a3;'
              }">${proj.status}</span>
            </div>

            <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; line-height: 1.3;">
              ${proj.title}
            </h4>

            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
              <span style="font-size: 10px; background: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px;">${proj.scheme}</span>
              <span style="font-size: 10px; background: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px;">${proj.coDistrict || proj.district}</span>
              ${proj.adcArea ? `<span style="font-size: 10px; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Sixth Schedule: ${proj.adcArea}</span>` : ''}
            </div>

            ${isStalled ? `
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 6px; margin-bottom: 8px; font-size: 11px; color: #991b1b; display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: bold;">⚠️ Stalled:</span> No inspection for ${proj.daysSinceLastInspection || 74} days (Disbursed ${finPct}% vs Verified ${physPct}%)
              </div>
            ` : ''}

            <div style="background: #f8fafc; border-radius: 6px; padding: 8px; margin-bottom: 10px; border: 1px solid #e2e8f0;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="color: #64748b;">Financial Disbursed:</span>
                <span style="font-weight: 600; color: #0f172a;">₹${proj.fundReleased} Cr (${finPct}%)</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span style="color: #64748b;">Physical Completed:</span>
                <span style="font-weight: 600; color: ${physPct < finPct - 15 ? '#b91c1c' : '#0284c7'};">${physPct}%</span>
              </div>
              ${varianceGap > 15 ? `
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #dc2626; font-weight: 600;">
                  <span>Variance Gap:</span>
                  <span>+${varianceGap}% ahead</span>
                </div>
              ` : ''}
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
                <span>Evidence Score: <strong>${proj.evidenceScore}/100</strong></span>
                <span>Delay Risk: <strong style="color: ${proj.delayRiskScore > 50 ? '#dc2626' : '#16a34a'};">${proj.delayRiskScore}/100</strong></span>
              </div>
            </div>

            <div style="display: flex; gap: 6px; margin-top: 8px;">
              <a href="/asset/${proj.workCode}" style="flex: 1; text-align: center; background: #1d4ed8; color: #ffffff; padding: 6px 8px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">
                Asset Card →
              </a>
              <a href="/verify?project=${proj.workCode}" style="flex: 1; text-align: center; background: #0f172a; color: #ffffff; padding: 6px 8px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">
                Verify Site
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 320,
          className: 'custom-leaflet-popup'
        });

        marker.on('click', () => {
          if (onSelectProject) {
            onSelectProject(proj);
          }
        });

        marker.addTo(markersGroup);
      });

      markersGroup.addTo(map);
      markersLayerRef.current = markersGroup;

      // If active project is selected, pan to it
      if (activeProject?.latitude && activeProject?.longitude) {
        map.setView([activeProject.latitude, activeProject.longitude], 10, { animate: true });
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [mounted, viewMode, baseLayer, isDarkMode, showRiskHeatmap, filteredProjects, activeProject, onSelectProject]);

  // Clean reset to Assam center
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([26.2006, 92.9376], 7, { animate: true });
    }
  };

  const handleResetFilters = () => {
    setSelectedDistrict('ALL');
    setSelectedCoDistrict('ALL');
    setSelectedBlock('ALL');
    setSelectedGovernance('ALL');
    setSelectedScheme('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className={`rounded-[24px] bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-sm p-4 sm:p-6 flex flex-col gap-4 ${className}`}>
      {/* Header Bar with Views and Risk Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-ink dark:text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary dark:text-sky-400" />
              Interactive GIS Project Workspace
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-medium">
              {filteredProjects.length} Works Mapped
            </span>
          </div>
          <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
            Keyless OpenStreetMap telemetry layer with optional Esri World Imagery satellite view, 5-level administrative drilldown &amp; Sixth Schedule ADC boundaries
          </p>
        </div>

        {/* View Switcher & Heatmap Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowRiskHeatmap(!showRiskHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
              showRiskHeatmap
                ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 shadow-sm'
                : 'bg-surface dark:bg-slate-800 border-line dark:border-slate-700 text-ink-muted dark:text-slate-400'
            }`}
            title="Toggle District Risk Heatmap Halos"
          >
            <Flame className={`w-3.5 h-3.5 ${showRiskHeatmap ? 'text-red-600' : 'text-slate-400'}`} />
            Risk Heatmap
          </button>

          {/* Map vs Table View Mode */}
          <div className="flex items-center bg-surface dark:bg-slate-800 rounded-xl p-0.5 border border-line dark:border-slate-700">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-primary dark:text-sky-400 shadow-sm'
                  : 'text-ink-muted dark:text-slate-400 hover:text-ink'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Map
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-primary dark:text-sky-400 shadow-sm'
                  : 'text-ink-muted dark:text-slate-400 hover:text-ink'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Accessible Table
            </button>
          </div>

          {/* Reset Zoom */}
          {viewMode === 'map' && (
            <button
              onClick={handleResetView}
              className="p-1.5 rounded-xl bg-surface dark:bg-slate-800 border border-line dark:border-slate-700 text-ink-muted dark:text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors"
              title="Reset View to Assam"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 5-Level Administrative Drilldown Controls Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-surface/80 dark:bg-slate-800/60 p-3 rounded-2xl border border-line dark:border-slate-800">
        {/* Level 1: District */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">1. District</label>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedCoDistrict('ALL');
              setSelectedBlock('ALL');
            }}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Districts ({districts.length})</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Level 2: Co-District / Subdivision */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">2. Co-District</label>
          <select
            value={selectedCoDistrict}
            onChange={(e) => {
              setSelectedCoDistrict(e.target.value);
              setSelectedBlock('ALL');
            }}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Co-Districts</option>
            {coDistricts.map(cd => (
              <option key={cd} value={cd}>{cd}</option>
            ))}
          </select>
        </div>

        {/* Level 3: Block */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">3. Block</label>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Blocks</option>
            {blocks.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Level 4: Governance Type */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">4. Governance</label>
          <select
            value={selectedGovernance}
            onChange={(e) => setSelectedGovernance(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Governance</option>
            <option value="SIXTH_SCHEDULE_ADC">Sixth Schedule (BTC / KAAC / NCHAC)</option>
            <option value="PANCHAYAT_GRAM_SABHA">Panchayat / Gram Sabha</option>
          </select>
        </div>

        {/* Level 5: Scheme */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">5. Scheme</label>
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Schemes ({CANONICAL_SCHEMES.length})</option>
            {CANONICAL_SCHEMES.map(s => (
              <option key={s.code} value={s.shortName}>{s.shortName} ({s.code})</option>
            ))}
          </select>
        </div>

        {/* Status / Clear Filter */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">Status</label>
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-primary dark:text-sky-400 hover:underline"
            >
              Reset
            </button>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-ink dark:text-slate-100 border border-line dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONGOING">Ongoing</option>
            <option value="STALLED">Stalled (Critical)</option>
            <option value="COMPLETED">Completed</option>
            <option value="PLANNED">Planned</option>
          </select>
        </div>
      </div>

      {/* Main View Area: Leaflet Map or Accessible Table */}
      {viewMode === 'map' ? (
        <div className="relative w-full h-[360px] lg:h-[500px] rounded-2xl overflow-hidden border border-line dark:border-slate-800 bg-[#eef4fc] dark:bg-slate-950">
          {/* Leaflet DOM container - only drishti-osm-map in Map mode so dark mode filter does not invert satellite */}
          <div
            ref={mapContainerRef}
            className={`w-full h-full z-0 ${baseLayer === 'map' ? 'drishti-osm-map' : ''}`}
            style={{ minHeight: '360px' }}
          />

          {/* Compact Map | Satellite Layer Toggle Overlay (Top Left inside map) */}
          <div className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-line dark:border-slate-800 shadow-md flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setBaseLayer('map')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                baseLayer === 'map'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted dark:text-slate-300 hover:text-ink'
              }`}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setBaseLayer('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                baseLayer === 'satellite'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted dark:text-slate-300 hover:text-ink'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Map Legend Overlay (Bottom Left) */}
          <div className="absolute bottom-3 left-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-line dark:border-slate-800 shadow-md flex flex-wrap items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
              <span className="text-ink dark:text-slate-200 font-medium">Stalled (&gt;60d)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rotate-45 bg-purple-600 inline-block"></span>
              <span className="text-ink dark:text-slate-200 font-medium">Variance Gap (&gt;15%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-500 rounded-sm inline-block"></span>
              <span className="text-ink dark:text-slate-200 font-medium">Delayed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              <span className="text-ink dark:text-slate-200 font-medium">On Track</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-600 inline-block"></span>
              <span className="text-ink dark:text-slate-200 font-medium">Completed</span>
            </div>
          </div>
        </div>
      ) : (
        /* Accessible Non-Map Table View (WCAG AA Compliant) */
        <div className="w-full max-h-[500px] overflow-auto rounded-2xl border border-line dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-left text-xs" aria-label="Decentralised Schemes Project Ledger">
            <thead className="sticky top-0 bg-surface dark:bg-slate-800 border-b border-line dark:border-slate-700 text-ink-muted dark:text-slate-300 font-semibold z-10">
              <tr>
                <th scope="col" className="px-4 py-3">Work Code & Title</th>
                <th scope="col" className="px-3 py-3">Scheme</th>
                <th scope="col" className="px-3 py-3">District / Co-District</th>
                <th scope="col" className="px-3 py-3">Governance</th>
                <th scope="col" className="px-3 py-3 text-right">Disbursed vs Phys %</th>
                <th scope="col" className="px-3 py-3 text-center">Status</th>
                <th scope="col" className="px-3 py-3 text-center">Delay Risk</th>
                <th scope="col" className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-slate-800">
              {filteredProjects.map((p) => {
                const finPct = Math.min(100, Math.round((p.fundReleased / p.sanctionedCost) * 100));
                return (
                  <tr key={p.id} className="hover:bg-surface/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono text-[11px] font-bold text-primary dark:text-sky-400">{p.workCode}</div>
                      <div className="font-medium text-ink dark:text-slate-100 max-w-xs truncate" title={p.title}>{p.title}</div>
                      <div className="text-[10px] text-ink-muted dark:text-slate-400 mt-0.5">{p.villageWard}, {p.block}</div>
                    </td>
                    <td className="px-3 py-3 font-medium text-ink dark:text-slate-200">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                        {p.scheme}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-ink dark:text-slate-200">
                      <div>{p.district}</div>
                      <div className="text-[10px] text-ink-muted dark:text-slate-400">Co: {p.coDistrict}</div>
                    </td>
                    <td className="px-3 py-3">
                      {p.adcArea ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium text-[10px]">
                          Sixth Schedule: {p.adcArea}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                          Panchayat
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="font-medium text-ink dark:text-slate-100">₹{p.fundReleased} Cr ({finPct}%)</div>
                      <div className={`text-[11px] font-semibold ${p.physicalCompletionPct < finPct - 15 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {p.physicalCompletionPct}% Physical
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.status === 'STALLED' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' 
                          : p.status === 'COMPLETED' 
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`font-mono text-xs font-bold ${
                        p.delayRiskScore > 60 ? 'text-red-600' : p.delayRiskScore > 30 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {p.delayRiskScore}/100
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/asset/${p.workCode}`}
                          className="px-2.5 py-1 rounded-lg bg-primary text-white hover:bg-blue-700 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                        >
                          Asset Card
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
