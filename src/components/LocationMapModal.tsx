import React, { useState, useMemo } from 'react';
import {
  X,
  MapPin,
  Navigation,
  ExternalLink,
  Phone,
  MessageSquare,
  CheckCircle2,
  Layers,
  Flame,
  Building2,
  Compass,
  Star,
  Search,
  ChevronRight,
  Filter,
  Eye
} from 'lucide-react';
import { Business } from '../types';

interface LocationMapModalProps {
  business: Business | null;
  allBusinesses: Business[];
  isOpen: boolean;
  onClose: () => void;
  onSelectBusiness: (business: Business) => void;
}

interface DensityCluster {
  id: string;
  name: string;
  region: string;
  city: string;
  count: number;
  verifiedCount: number;
  avgRating: number;
  centroidLat: number;
  centroidLng: number;
  densityTier: 'ultra' | 'high' | 'moderate';
  topCategories: string[];
  businesses: Business[];
}

export const LocationMapModal: React.FC<LocationMapModalProps> = ({
  business,
  allBusinesses,
  isOpen,
  onClose,
  onSelectBusiness,
}) => {
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(business);
  const [selectedClusterId, setSelectedClusterId] = useState<string>('auto');
  const [mapMode, setMapMode] = useState<'enterprise' | 'cluster' | 'overview'>('enterprise');
  const [clusterSearch, setClusterSearch] = useState('');

  // Sync activeBusiness when prop changes
  React.useEffect(() => {
    if (business) {
      setActiveBusiness(business);
      setSelectedClusterId('auto');
      setMapMode('enterprise');
    }
  }, [business]);

  // Compute regional & high-density clusters across Ghana
  const clusters: DensityCluster[] = useMemo(() => {
    if (!allBusinesses || allBusinesses.length === 0) return [];

    const clusterGroups: Record<string, { name: string; region: string; city: string; businesses: Business[] }> = {
      'accra-metro': {
        name: 'Greater Accra Commercial Core',
        region: 'Greater Accra',
        city: 'Accra',
        businesses: [],
      },
      'tema-industrial': {
        name: 'Tema Industrial & Harbour Corridor',
        region: 'Greater Accra',
        city: 'Tema',
        businesses: [],
      },
      'kumasi-metro': {
        name: 'Ashanti Commercial Hub',
        region: 'Ashanti',
        city: 'Kumasi',
        businesses: [],
      },
      'takoradi-maritime': {
        name: 'Western Oil & Maritime Zone',
        region: 'Western',
        city: 'Takoradi',
        businesses: [],
      },
      'tamale-north': {
        name: 'Northern Regional Hub',
        region: 'Northern',
        city: 'Tamale',
        businesses: [],
      },
      'capecoast-central': {
        name: 'Central Heritage & Coastal Hub',
        region: 'Central',
        city: 'Cape Coast',
        businesses: [],
      },
      'koforidua-eastern': {
        name: 'Eastern Agribusiness & Commerce',
        region: 'Eastern',
        city: 'Koforidua',
        businesses: [],
      },
    };

    // Distribute businesses into clusters
    allBusinesses.forEach((b) => {
      const cityLower = (b.city || '').toLowerCase();
      const addressLower = (b.address || '').toLowerCase();
      const regionLower = (b.region || '').toLowerCase();

      if (cityLower.includes('tema') || addressLower.includes('tema')) {
        clusterGroups['tema-industrial'].businesses.push(b);
      } else if (cityLower.includes('accra') || regionLower.includes('accra') || addressLower.includes('accra') || addressLower.includes('osu') || addressLower.includes('legon') || addressLower.includes('cantonments') || addressLower.includes('airport') || addressLower.includes('spintex')) {
        clusterGroups['accra-metro'].businesses.push(b);
      } else if (cityLower.includes('kumasi') || regionLower.includes('ashanti') || addressLower.includes('kumasi') || addressLower.includes('adum') || addressLower.includes('ahodwo') || addressLower.includes('nhyiaeso')) {
        clusterGroups['kumasi-metro'].businesses.push(b);
      } else if (cityLower.includes('takoradi') || cityLower.includes('sekondi') || regionLower.includes('western') || addressLower.includes('takoradi')) {
        clusterGroups['takoradi-maritime'].businesses.push(b);
      } else if (cityLower.includes('tamale') || regionLower.includes('northern') || addressLower.includes('tamale')) {
        clusterGroups['tamale-north'].businesses.push(b);
      } else if (cityLower.includes('cape') || cityLower.includes('elmina') || regionLower.includes('central')) {
        clusterGroups['capecoast-central'].businesses.push(b);
      } else if (cityLower.includes('koforidua') || regionLower.includes('eastern')) {
        clusterGroups['koforidua-eastern'].businesses.push(b);
      } else {
        // Fallback into Accra Metro
        clusterGroups['accra-metro'].businesses.push(b);
      }
    });

    // Transform into enriched DensityCluster items
    return Object.entries(clusterGroups)
      .filter(([_, group]) => group.businesses.length > 0)
      .map(([id, group]) => {
        const count = group.businesses.length;
        const verifiedCount = group.businesses.filter((b) => b.verificationStatus === 'verified').length;
        const ratedBusinesses = group.businesses.filter((b) => b.reviewCount > 0 && b.rating > 0);
        const totalRating = ratedBusinesses.reduce((acc, b) => acc + b.rating, 0);
        const avgRating = ratedBusinesses.length > 0 ? Number((totalRating / ratedBusinesses.length).toFixed(1)) : 0;

        const totalLat = group.businesses.reduce((acc, b) => acc + (b.coordinates?.lat || 5.6037), 0);
        const totalLng = group.businesses.reduce((acc, b) => acc + (b.coordinates?.lng || -0.1870), 0);
        const centroidLat = totalLat / count;
        const centroidLng = totalLng / count;

        // Top categories
        const catMap: Record<string, number> = {};
        group.businesses.forEach((b) => {
          catMap[b.category] = (catMap[b.category] || 0) + 1;
        });
        const topCategories = Object.entries(catMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([cat]) => cat);

        let densityTier: 'ultra' | 'high' | 'moderate' = 'moderate';
        if (count >= 7) densityTier = 'ultra';
        else if (count >= 4) densityTier = 'high';

        return {
          id,
          name: group.name,
          region: group.region,
          city: group.city,
          count,
          verifiedCount,
          avgRating,
          centroidLat,
          centroidLng,
          densityTier,
          topCategories,
          businesses: group.businesses,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [allBusinesses]);

  const currentBusiness = activeBusiness || business;

  // Determine active cluster
  const currentCluster = useMemo(() => {
    if (!currentBusiness) return clusters[0] || null;
    if (selectedClusterId !== 'auto') {
      const match = clusters.find((c) => c.id === selectedClusterId);
      if (match) return match;
    }
    // Auto find cluster for currentBusiness
    const autoMatch = clusters.find((c) =>
      c.businesses.some((b) => b.id === currentBusiness.id)
    );
    return autoMatch || clusters[0] || null;
  }, [clusters, selectedClusterId, currentBusiness]);

  if (!isOpen || !business) return null;

  // Coordinates calculation based on map mode
  let activeLat = currentBusiness.coordinates.lat;
  let activeLng = currentBusiness.coordinates.lng;
  let zoomDelta = 0.035;

  if (mapMode === 'cluster' && currentCluster) {
    activeLat = currentCluster.centroidLat;
    activeLng = currentCluster.centroidLng;
    zoomDelta = 0.08;
  } else if (mapMode === 'overview') {
    // Zoom out to show wider Ghana region
    activeLat = 5.85;
    activeLng = -0.65;
    zoomDelta = 0.45;
  }

  // OpenStreetMap embed URL
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${activeLng - zoomDelta}%2C${activeLat - zoomDelta}%2C${activeLng + zoomDelta}%2C${activeLat + zoomDelta}&layer=mapnik&marker=${activeLat}%2C${activeLng}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentBusiness.coordinates.lat},${currentBusiness.coordinates.lng}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${currentBusiness.coordinates.lat},${currentBusiness.coordinates.lng}`;

  // Filter businesses in the active cluster
  const clusterBusinesses = (currentCluster?.businesses || []).filter((b) => {
    if (!clusterSearch.trim()) return true;
    const q = clusterSearch.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh] my-auto">
        
        {/* Modal Top Navigation Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-md shadow-blue-600/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                  High-Density Business Cluster Navigator
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 text-[10px] font-extrabold border border-cyan-200 dark:border-cyan-800">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>Interactive Pins</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                Exploring <strong className="text-blue-600 dark:text-cyan-400">{currentCluster?.name || 'Commercial Hub'}</strong> • {allBusinesses.length} Verified Listings
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* High-Density Regional Cluster Pill Switcher */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Density Clusters:</span>
          </span>

          {clusters.map((cluster) => {
            const isSelected = currentCluster?.id === cluster.id;
            return (
              <button
                key={cluster.id}
                type="button"
                onClick={() => {
                  setSelectedClusterId(cluster.id);
                  setMapMode('cluster');
                  if (cluster.businesses.length > 0) {
                    setActiveBusiness(cluster.businesses[0]);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{cluster.city}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-cyan-300'
                }`}>
                  {cluster.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Map Controls & Mode Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMapMode('enterprise')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mapMode === 'enterprise'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                📍 Focused Pin: {currentBusiness.name.slice(0, 16)}...
              </button>
              <button
                type="button"
                onClick={() => setMapMode('cluster')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mapMode === 'cluster'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🗺️ Cluster Zone ({currentCluster?.count || 0} Pins)
              </button>
              <button
                type="button"
                onClick={() => setMapMode('overview')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mapMode === 'overview'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🇬🇭 Ghana Overview
              </button>
            </div>

            {/* Cluster Stats Quick Badge */}
            {currentCluster && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{currentCluster.avgRating} Avg Rating</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-blue-600 dark:text-cyan-400">
                  {currentCluster.verifiedCount} Verified Badges
                </span>
              </div>
            )}
          </div>

          {/* Embedded Map Display with Interactive Pin Overlays */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800">
            <iframe
              title={`Map cluster of ${currentCluster?.name || 'Ghana'}`}
              src={osmUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />

            {/* Top-Right Floating Cluster Density Badge */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-white backdrop-blur-md border border-white/20 shadow-lg text-xs font-black flex items-center gap-2 pointer-events-auto">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
                <span>{currentCluster?.name}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px]">
                  {currentCluster?.count} Listings
                </span>
              </div>
            </div>

            {/* Bottom Floating Interactive Directions Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-600/30 backdrop-blur-md transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-md backdrop-blur-md transition-all"
                >
                  <span>Apple Maps</span>
                </a>
              </div>

              {/* Pin Coordinates Indicator */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 text-white backdrop-blur-md text-[11px] font-mono pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{activeLat.toFixed(4)}° N, {Math.abs(activeLng).toFixed(4)}° W</span>
              </div>
            </div>
          </div>

          {/* Active Enterprise Quick Info Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={currentBusiness.logo}
                alt={currentBusiness.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {currentBusiness.name}
                  </h3>
                  {currentBusiness.verificationStatus === 'verified' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentBusiness.address}, {currentBusiness.city} • <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">{currentBusiness.digitalAddress || 'GA-019-4821'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${currentBusiness.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {currentBusiness.phone}</span>
              </a>

              {currentBusiness.whatsapp && (
                <a
                  href={`https://wa.me/${currentBusiness.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectBusiness(currentBusiness);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full Profile</span>
              </button>
            </div>
          </div>

          {/* Clustered Enterprises in Active Region */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Discovered Enterprises in {currentCluster?.name || 'Cluster'} ({clusterBusinesses.length})
                </h3>
              </div>

              {/* Quick Filter Search inside Cluster */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={clusterSearch}
                  onChange={(e) => setClusterSearch(e.target.value)}
                  placeholder="Filter cluster pins..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Cluster Business Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {clusterBusinesses.map((b) => {
                const isActive = currentBusiness.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setActiveBusiness(b);
                      setMapMode('enterprise');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      isActive
                        ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={b.logo}
                        alt={b.name}
                        className="w-10 h-10 rounded-xl object-cover border shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1">
                          <span>{b.name}</span>
                          {b.verificationStatus === 'verified' && (
                            <CheckCircle2 className="w-3 h-3 text-blue-600 fill-blue-50 shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {b.category} • {b.city}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{b.rating} ({b.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveBusiness(b);
                        setMapMode('enterprise');
                      }}
                      className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-700'
                      }`}
                      title="Focus Pin on Map"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
