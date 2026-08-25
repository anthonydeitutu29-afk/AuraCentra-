import React, { useState, useEffect, useMemo } from 'react';
import { 
   MapPin, 
   Navigation, 
   Compass, 
   ShieldCheck, 
   Smartphone, 
   Monitor, 
   Tablet, 
   Globe, 
   RefreshCw, 
   Download, 
   Search, 
   Filter, 
   CheckCircle2, 
   Clock, 
   AlertCircle, 
   ExternalLink, 
   Activity, 
   Users, 
   Zap,
   Wifi,
   Radio,
   Crosshair,
   Layers,
   Copy,
   Check
} from 'lucide-react';
import { UserLocationRecord, UserProfile } from '../types';
import { getTrackedUserLocations, saveTrackedUserLocations, trackAndVerifyCurrentLocation, fetchServerUserLocations } from '../utils/userLocationTracker';
import { GHANA_REGIONS } from '../utils/geolocationService';

interface AdminLocationTrackerProps {
  currentUser: UserProfile;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AdminLocationTracker: React.FC<AdminLocationTrackerProps> = ({
  currentUser,
  onShowToast,
}) => {
  const [locations, setLocations] = useState<UserLocationRecord[]>(() => getTrackedUserLocations());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<'all' | 'gps' | 'ghana_only' | 'diaspora'>('all');
  const [selectedLocation, setSelectedLocation] = useState<UserLocationRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLivePinging, setIsLivePinging] = useState(false);

  // Load locations on mount
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchServerUserLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Force a live location verification for current user session
  const handleForcePing = async () => {
    setIsLivePinging(true);
    try {
      const newRec = await trackAndVerifyCurrentLocation(currentUser, '/admin/dashboard');
      const updated = await fetchServerUserLocations();
      setLocations(updated);
      onShowToast?.(
        'Location Verified ✓',
        `Current session geocoded to ${newRec.city}, ${newRec.region} (${newRec.digitalAddressGrid || 'GPS Grid Verified'}).`,
        'success'
      );
    } catch (err) {
      onShowToast?.('Ping Failed', 'Could not refresh GPS coordinates.', 'error');
    } finally {
      setIsLivePinging(false);
    }
  };

  // Copy coordinates to clipboard
  const handleCopyCoords = (loc: UserLocationRecord) => {
    const coordStr = `${loc.coordinates.lat}, ${loc.coordinates.lng}`;
    navigator.clipboard.writeText(coordStr);
    setCopiedId(loc.id);
    setTimeout(() => setCopiedId(null), 2500);
    onShowToast?.('Coordinates Copied', coordStr, 'info');
  };

  // Export location logs to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Country', 'Region', 'City', 'GhanaPost Grid', 'Latitude', 'Longitude', 'Accuracy (m)', 'Method', 'Device', 'OS', 'IP Address', 'First Seen', 'Last Active'];
    const rows = locations.map(l => [
      l.id,
      `"${l.userName || 'Anonymous'}"`,
      `"${l.userEmail || 'N/A'}"`,
      l.country,
      `"${l.region}"`,
      `"${l.city}"`,
      l.digitalAddressGrid || 'N/A',
      l.coordinates.lat,
      l.coordinates.lng,
      l.coordinates.accuracyMeters || 'N/A',
      l.verificationMethod,
      l.deviceInfo.browser,
      l.deviceInfo.os,
      l.ipAddress,
      l.firstSeenAt,
      l.lastActiveAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auracentra_user_locations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast?.('Export Completed', 'Location logs downloaded successfully.', 'success');
  };

  // Compute stats
  const stats = useMemo(() => {
    const total = locations.length;
    const ghanaCount = locations.filter(l => l.isGhanaLocation).length;
    const diasporaCount = locations.filter(l => !l.isGhanaLocation).length;
    const gpsHighPrecision = locations.filter(l => l.verificationMethod === 'gps_high_precision').length;
    const mobileUsers = locations.filter(l => l.deviceInfo.platform === 'mobile').length;
    const desktopUsers = locations.filter(l => l.deviceInfo.platform === 'desktop').length;

    // Regional breakdown in Ghana
    const regionalCounts: Record<string, number> = {};
    GHANA_REGIONS.forEach(r => {
      regionalCounts[r.name] = 0;
    });

    locations.forEach(l => {
      if (l.isGhanaLocation && l.region) {
        regionalCounts[l.region] = (regionalCounts[l.region] || 0) + 1;
      }
    });

    return {
      total,
      ghanaCount,
      diasporaCount,
      gpsHighPrecision,
      mobileUsers,
      desktopUsers,
      regionalCounts,
      ghanaPercent: total > 0 ? Math.round((ghanaCount / total) * 100) : 0,
      gpsPercent: total > 0 ? Math.round((gpsHighPrecision / total) * 100) : 0
    };
  }, [locations]);

  // Filtered list
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = loc.userName?.toLowerCase().includes(q);
        const matchEmail = loc.userEmail?.toLowerCase().includes(q);
        const matchCity = loc.city?.toLowerCase().includes(q);
        const matchRegion = loc.region?.toLowerCase().includes(q);
        const matchGrid = loc.digitalAddressGrid?.toLowerCase().includes(q);
        const matchIp = loc.ipAddress?.toLowerCase().includes(q);
        const matchDevice = loc.deviceInfo.browser?.toLowerCase().includes(q) || loc.deviceInfo.os?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchCity && !matchRegion && !matchGrid && !matchIp && !matchDevice) {
          return false;
        }
      }

      // Region filter
      if (filterRegion !== 'all' && loc.region !== filterRegion) {
        return false;
      }

      // Method / Category filter
      if (filterMethod === 'gps' && loc.verificationMethod !== 'gps_high_precision') {
        return false;
      }
      if (filterMethod === 'ghana_only' && !loc.isGhanaLocation) {
        return false;
      }
      if (filterMethod === 'diaspora' && loc.isGhanaLocation) {
        return false;
      }

      return true;
    });
  }, [locations, searchQuery, filterRegion, filterMethod]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">Live User Geolocation & Activity Tracker</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Presence Tracking Active
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time GPS coordinate geocoding and Ghana National Digital Addressing System (NDPAS) verification for all active visitors and merchants across all 16 regions of Ghana and the diaspora.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleForcePing}
            disabled={isLivePinging}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLivePinging ? 'animate-spin' : ''}`} />
            <span>{isLivePinging ? 'Verifying GPS...' : 'Verify My GPS Location'}</span>
          </button>

          <button
            type="button"
            onClick={loadLocations}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh location list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Total Active Sessions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Active Visitors Tracked</span>
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Real-time
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-slate-400" />
              <span>{stats.mobileUsers} Mobile</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Monitor className="w-3 h-3 text-slate-400" />
              <span>{stats.desktopUsers} Desktop</span>
            </span>
          </div>
        </div>

        {/* Stat 2: Verified in Ghana */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Verified Inside Ghana</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              🇬🇭
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.ghanaCount}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ({stats.ghanaPercent}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Accra, Kumasi, Takoradi, Volta, Tamale + 11 regions</span>
          </div>
        </div>

        {/* Stat 3: High Precision GPS Verified */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">GPS Precision Verified</span>
            <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
              <Compass className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.gpsHighPrecision}</span>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              ({stats.gpsPercent}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-3 h-3 text-cyan-500" />
            <span>High precision (≤ 25m accuracy)</span>
          </div>
        </div>

        {/* Stat 4: Diaspora / International */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Diaspora & Global</span>
            <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Globe className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.diasporaCount}</span>
            <span className="text-xs text-slate-500">Connecting overseas</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>UK, US, Canada, EU investors & buyers</span>
          </div>
        </div>

      </div>

      {/* Ghana 16 Regions Distribution Panel */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Active Ghanaian Regional Distribution (All 16 Regions)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any region to filter user locations in the table below.
            </p>
          </div>

          {filterRegion !== 'all' && (
            <button
              type="button"
              onClick={() => setFilterRegion('all')}
              className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
            >
              Clear Region Filter (Show All)
            </button>
          )}
        </div>

        {/* Regional Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {GHANA_REGIONS.map((reg) => {
            const count = stats.regionalCounts[reg.name] || 0;
            const isSelected = filterRegion === reg.name;

            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => setFilterRegion(isSelected ? 'all' : reg.name)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : count > 0
                      ? 'bg-blue-50/50 dark:bg-slate-800 border-blue-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 hover:border-blue-400'
                      : 'bg-slate-50 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{reg.name}</div>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className={isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}>{reg.capital}</span>
                  <span className={`px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected 
                      ? 'bg-white text-blue-600' 
                      : count > 0 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, city, GhanaPost grid, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setFilterMethod('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterMethod === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Users ({locations.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMethod('ghana_only')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterMethod === 'ghana_only'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              🇬🇭 Ghana ({stats.ghanaCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMethod('gps')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterMethod === 'gps'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              🎯 GPS High Precision ({stats.gpsHighPrecision})
            </button>
            <button
              type="button"
              onClick={() => setFilterMethod('diaspora')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterMethod === 'diaspora'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              🌍 Diaspora ({stats.diasporaCount})
            </button>
          </div>
        </div>

        {filterRegion !== 'all' && (
          <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
            <MapPin className="w-3.5 h-3.5" />
            <span>Filtering strictly for region: <strong>{filterRegion}</strong></span>
            <button
              type="button"
              onClick={() => setFilterRegion('all')}
              className="ml-auto font-bold underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Locations Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-850/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">User / Session</th>
                <th className="py-3.5 px-4">Ghanaian Region & City</th>
                <th className="py-3.5 px-4">GhanaPost GPS Grid</th>
                <th className="py-3.5 px-4">Geocoded Coordinates</th>
                <th className="py-3.5 px-4">Verification Level</th>
                <th className="py-3.5 px-4">Device & Carrier</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="font-bold text-sm">No user locations matching this filter</p>
                    <p className="text-xs text-slate-500 mt-0.5">Try changing your search terms or clearing the region filter.</p>
                  </td>
                </tr>
              ) : (
                filteredLocations.map((loc) => {
                  const isCurrent = loc.userEmail === currentUser.email;

                  return (
                    <tr 
                      key={loc.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isCurrent ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* User / Session */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
                            {loc.userName ? loc.userName.charAt(0).toUpperCase() : 'V'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{loc.userName || 'Anonymous Visitor'}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-[10px] font-black">
                                  YOU
                                </span>
                              )}
                              {loc.userRole === 'admin' && (
                                <span className="px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[9px] font-bold">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {loc.userEmail || loc.sessionId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Region & City */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <span>{loc.isGhanaLocation ? '🇬🇭' : '🌍'}</span>
                            <span>{loc.city}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {loc.region} {loc.district ? `• ${loc.district}` : ''}
                          </div>
                        </div>
                      </td>

                      {/* GhanaPost GPS Grid */}
                      <td className="py-3.5 px-4">
                        {loc.digitalAddressGrid ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-cyan-400 font-mono font-bold text-xs">
                            <Navigation className="w-3 h-3 text-blue-600" />
                            <span>{loc.digitalAddressGrid}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A (Diaspora)</span>
                        )}
                      </td>

                      {/* Geocoded Coordinates */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="space-y-0.5">
                          <div className="text-slate-900 dark:text-slate-200 font-bold">
                            {loc.coordinates.lat}° N, {loc.coordinates.lng}° {loc.coordinates.lng < 0 ? 'W' : 'E'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Accuracy: ±{loc.coordinates.accuracyMeters || 15}m
                          </div>
                        </div>
                      </td>

                      {/* Verification Level */}
                      <td className="py-3.5 px-4">
                        {loc.verificationMethod === 'gps_high_precision' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>GPS Verified (High)</span>
                          </span>
                        ) : loc.verificationMethod === 'gps_standard' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                            <Compass className="w-3 h-3 text-blue-600" />
                            <span>GPS Standard</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                            <Wifi className="w-3 h-3 text-slate-400" />
                            <span>Network Triangulated</span>
                          </span>
                        )}
                      </td>

                      {/* Device & Carrier */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          <div className="text-slate-800 dark:text-slate-300 flex items-center gap-1">
                            {loc.deviceInfo.platform === 'mobile' ? (
                              <Smartphone className="w-3 h-3 text-slate-400" />
                            ) : (
                              <Monitor className="w-3 h-3 text-slate-400" />
                            )}
                            <span>{loc.deviceInfo.browser} ({loc.deviceInfo.os})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={loc.networkCarrier}>
                            {loc.networkCarrier || loc.ipAddress}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyCoords(loc)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Copy Lat/Lng Coordinates"
                          >
                            {copiedId === loc.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <a
                            href={`https://www.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors inline-flex items-center"
                            title="Open Google Maps Pin"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => setSelectedLocation(loc)}
                            className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-cyan-400 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Showing <strong>{filteredLocations.length}</strong> of <strong>{locations.length}</strong> active user sessions
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>GPS Verified</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Standard GPS</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Triangulated</span>
            </span>
          </div>
        </div>
      </div>

      {/* Coordinate Inspection Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 text-[10px] font-bold">
                  User Location Dossier
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedLocation.userName || 'Active Visitor'}
                </h3>
                <p className="text-xs text-slate-400">{selectedLocation.userEmail || selectedLocation.sessionId}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLocation(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Country & Region</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedLocation.country} • {selectedLocation.region}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">City / District</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedLocation.city}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">GhanaPost GPS Grid</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">{selectedLocation.digitalAddressGrid || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">GPS Accuracy</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">±{selectedLocation.coordinates.accuracyMeters || 15} meters</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Latitude</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedLocation.coordinates.lat}°</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Longitude</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedLocation.coordinates.lng}°</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">IP Address & Network</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedLocation.ipAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">ISP Carrier</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedLocation.networkCarrier || 'Cellular/Fiber'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://www.google.com/maps?q=${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  handleCopyCoords(selectedLocation);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Lat/Lng</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
