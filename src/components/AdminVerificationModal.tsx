// Source: Google Maps Platform Code Assist
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  ExternalLink, 
  Navigation, 
  Award, 
  Globe, 
  Building2, 
  Compass, 
  Info,
  Check,
  AlertCircle,
  Star,
  Sparkles
} from 'lucide-react';
import { Business } from '../types';
import { 
  performGoogleMapsGeocodeVerification, 
  LocationAlignmentReport,
  calculateDistanceKm 
} from '../utils/googleMapsGeocoding';
import { verifyGhanaPostGPS } from '../utils/gpsVerification';

interface AdminVerificationModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (businessId: string, badgeType: string, verifiedCoords?: { lat: number; lng: number }, isFeatured?: boolean) => void;
  onReject?: (businessId: string, reason: string) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AdminVerificationModal: React.FC<AdminVerificationModalProps> = ({
  business,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onShowToast,
}) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [alignmentReport, setAlignmentReport] = useState<LocationAlignmentReport | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string>('Gold Enterprise');
  const [isFeaturedChoice, setIsFeaturedChoice] = useState<boolean>(business.isFeatured ?? true);
  const [customReason, setCustomReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Digital Address validation
  const gpsInfo = verifyGhanaPostGPS(business.digitalAddress || '');

  const runGeocodeAudit = async () => {
    setIsGeocoding(true);
    try {
      const report = await performGoogleMapsGeocodeVerification({
        address: business.address,
        city: business.city,
        region: business.region,
        digitalAddress: business.digitalAddress,
        providedCoordinates: business.coordinates,
      });

      setAlignmentReport(report);
      if (report.verificationBadgeRecommendation === 'Flagged - Needs Address Clarification') {
        setSelectedBadge('Standard Verified');
      } else {
        setSelectedBadge(report.verificationBadgeRecommendation);
      }
    } catch (err) {
      console.error('Geocoding verification audit failed:', err);
      onShowToast?.('Audit Error', 'Unable to complete real-time geocoding audit.', 'error');
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    if (isOpen && business) {
      runGeocodeAudit();
      setShowRejectForm(false);
      setCustomReason('');
    }
  }, [isOpen, business.id]);

  if (!isOpen) return null;

  const handleApproveWithGPS = () => {
    const coordsToSave = alignmentReport?.geocoded?.coordinates || business.coordinates;
    onApprove(business.id, selectedBadge, coordsToSave, isFeaturedChoice);
    onShowToast?.(
      'Business Verified with GPS',
      `"${business.name}" has been approved ${isFeaturedChoice ? 'under Featured Categories' : 'as standard listing'} with verified coordinates.`,
      'success'
    );
    onClose();
  };

  const handleConfirmReject = () => {
    const reason = customReason.trim() || 'Address / GPS coordinates could not be verified.';
    onReject?.(business.id, reason);
    onShowToast?.('Business Listing Rejected', `Listing flagged: ${reason}`, 'warning');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Google Maps Geocoding & GPS Verification</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-[10px] font-bold">
                  Live Audit
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Auditing <strong className="text-white">{business.name}</strong> • Claimed: {business.city}, {business.region}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TOP METRIC / STATUS SUMMARY BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 1. Overall Confidence */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                (alignmentReport?.confidenceScore || 0) >= 80 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : (alignmentReport?.confidenceScore || 0) >= 50
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {isGeocoding ? <RefreshCw className="w-4 h-4 animate-spin" /> : `${alignmentReport?.confidenceScore || 0}%`}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Alignment Score</div>
                <div className="text-sm font-bold text-white">
                  {isGeocoding ? 'Analyzing...' : alignmentReport?.status.replace('_', ' ') || 'Pending'}
                </div>
              </div>
            </div>

            {/* 2. Region & City Match */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                alignmentReport?.regionMatched 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {alignmentReport?.regionMatched ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Territory Alignment</div>
                <div className="text-sm font-bold text-white">
                  {alignmentReport?.regionMatched ? 'Region Verified' : 'Region Mismatched'}
                </div>
              </div>
            </div>

            {/* 3. Distance Variance */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Coordinate Variance</div>
                <div className="text-sm font-bold text-white">
                  {alignmentReport?.distanceDiscrepancyKm !== undefined 
                    ? `± ${alignmentReport.distanceDiscrepancyKm} km`
                    : 'Within Bounds'}
                </div>
              </div>
            </div>

          </div>

          {/* TWO-COLUMN AUDIT COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Claimed Information */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Applicant's Claimed Location</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                  Self-Reported
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Business Address:</span>
                  <span className="font-semibold text-white">{business.address || 'Not specified'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block">Claimed City:</span>
                    <span className="font-semibold text-white">{business.city}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Claimed Region:</span>
                    <span className="font-semibold text-white">{business.region}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block">GhanaPost GPS Digital Address:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      {business.digitalAddress || 'GA-019-4821'}
                    </span>
                    {gpsInfo.isValid && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Valid Grid ({gpsInfo.regionName})
                      </span>
                    )}
                  </div>
                </div>

                {business.coordinates && (
                  <div>
                    <span className="text-slate-400 block">Provided GPS Coordinates:</span>
                    <span className="font-mono text-slate-300">
                      {business.coordinates.lat.toFixed(5)}, {business.coordinates.lng.toFixed(5)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Google Maps Geocoded Result */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-300">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Google Maps Geocoding API</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-bold">
                  Verified Engine
                </span>
              </div>

              {isGeocoding ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                  <span className="text-xs">Querying Google Maps Geocoding & Regional Boundaries...</span>
                </div>
              ) : alignmentReport?.geocoded ? (
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Resolved Formatted Address:</span>
                    <span className="font-semibold text-emerald-300">
                      {alignmentReport.geocoded.formattedAddress}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block">Resolved Locality:</span>
                      <span className="font-semibold text-white">
                        {alignmentReport.geocoded.city || business.city}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Resolved Administrative Region:</span>
                      <span className="font-semibold text-white">
                        {alignmentReport.geocoded.region || business.region}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Precision Coordinates (Lat / Lng):</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {alignmentReport.geocoded.coordinates.lat.toFixed(5)}, {alignmentReport.geocoded.coordinates.lng.toFixed(5)}
                    </span>
                    <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                      {alignmentReport.geocoded.locationType}
                    </span>
                  </div>

                  <div className="pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${alignmentReport.geocoded.coordinates.lat},${alignmentReport.geocoded.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      <span>Inspect Location in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No geocoded data retrieved.
                </div>
              )}
            </div>

          </div>

          {/* AUDIT LOGS & CHECKLIST */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>Geographic Validation Checkpoints</span>
              </span>
              <button
                type="button"
                onClick={runGeocodeAudit}
                disabled={isGeocoding}
                className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isGeocoding ? 'animate-spin' : ''}`} />
                <span>Re-run Audit</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {alignmentReport?.auditNotes.map((note, idx) => (
                <div 
                  key={idx} 
                  className={`text-xs p-2 rounded-lg flex items-start gap-2 ${
                    note.startsWith('✓')
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/40'
                      : note.startsWith('⚠️')
                      ? 'bg-rose-950/40 text-rose-300 border border-rose-900/40'
                      : 'bg-slate-850 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className="mt-0.5">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BADGE SELECTION FOR APPROVAL */}
          {!showRejectForm && (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Verification Tier & Badge
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedBadge('Gold Enterprise')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedBadge === 'Gold Enterprise'
                      ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500/50'
                      : 'bg-slate-850 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">Gold Enterprise</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Full GhanaPost GPS & Google Maps precision match.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBadge('Standard Verified')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedBadge === 'Standard Verified'
                      ? 'bg-blue-950/70 border-blue-500 text-blue-200 ring-1 ring-blue-500/50'
                      : 'bg-slate-850 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">Standard Verified</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Verified address with standard municipal alignment.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBadge('Locally Verified')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedBadge === 'Locally Verified'
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50'
                      : 'bg-slate-850 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">Locally Verified</span>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Verified neighborhood SME provider.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* FEATURED BUSINESS CATEGORY STATUS SELECTION */}
          {!showRejectForm && (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Featured Business Categories Status</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-700/60 text-amber-300 font-bold">
                  Admin Placement
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose whether this approved business should be placed under the <strong>Featured business categories</strong> and VIP homepage spotlights.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsFeaturedChoice(true)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isFeaturedChoice
                      ? 'bg-amber-950/60 border-amber-500 text-amber-100 ring-1 ring-amber-500/60 shadow-md'
                      : 'bg-slate-850 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-amber-300">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      Include in Featured Categories
                    </span>
                    {isFeaturedChoice && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug mt-1">
                    Placed under Featured Business Categories, VIP Spotlight, Trending priority, and search highlights.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFeaturedChoice(false)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    !isFeaturedChoice
                      ? 'bg-blue-950/60 border-blue-500 text-blue-100 ring-1 ring-blue-500/60 shadow-md'
                      : 'bg-slate-850 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-blue-300">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      Standard Category Listing
                    </span>
                    {!isFeaturedChoice && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug mt-1">
                    Enlisted under its standard primary category and general categories (Trending, Newly Verified, All Categories).
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* REJECT FORM (TOGGLEABLE) */}
          {showRejectForm && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Specify Reason for Verification Rejection</span>
              </div>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="E.g., GPS coordinates deviate significantly from claimed Greater Accra region, or GhanaPost address code is invalid..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-800 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-rose-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-850 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Google Maps Platform Integration • AuraCentra Verification Gateway</span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            {!showRejectForm && (
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 hover:bg-rose-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Reject Listing
              </button>
            )}

            <button
              type="button"
              onClick={handleApproveWithGPS}
              disabled={isGeocoding}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Approve & Save Verified GPS</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
