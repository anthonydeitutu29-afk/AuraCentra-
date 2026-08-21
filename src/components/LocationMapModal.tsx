import React from 'react';
import { X, MapPin, Navigation, ExternalLink, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Business } from '../types';

interface LocationMapModalProps {
  business: Business | null;
  allBusinesses: Business[];
  isOpen: boolean;
  onClose: () => void;
  onSelectBusiness: (business: Business) => void;
}

export const LocationMapModal: React.FC<LocationMapModalProps> = ({
  business,
  allBusinesses,
  isOpen,
  onClose,
  onSelectBusiness,
}) => {
  if (!isOpen || !business) return null;

  const lat = business.coordinates.lat;
  const lng = business.coordinates.lng;

  // OpenStreetMap embed URL
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.04}%2C${lat - 0.04}%2C${lng + 0.04}%2C${lat + 0.04}&layer=mapnik&marker=${lat}%2C${lng}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${lat},${lng}`;

  const nearbyListings = allBusinesses.filter(
    (b) => b.id !== business.id && b.city === business.city
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{business.name} Location</span>
                {business.verificationStatus === 'verified' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {business.address}, {business.city} ({business.digitalAddress || 'Ghana GPS'})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map View & Details */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* Embedded OpenStreetMap Frame */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-800">
            <iframe
              title={`Map of ${business.name}`}
              src={osmUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />

            {/* Quick Floating Directions Pill */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto flex flex-wrap gap-2">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg backdrop-blur-md transition-transform active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open Google Maps Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold shadow-md backdrop-blur-md"
              >
                <span>Apple Maps</span>
              </a>
            </div>
          </div>

          {/* Location info bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                GhanaPost Digital Address
              </div>
              <div className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                {business.digitalAddress || 'GA-019-4821'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                GPS Latitude / Longitude
              </div>
              <div className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                {lat.toFixed(4)}° N, {Math.abs(lng).toFixed(4)}° W
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Contact On Arrival
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {business.phone}
                </div>
              </div>
              <a
                href={`tel:${business.phone}`}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nearby businesses in the same city */}
          {nearbyListings.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Other Verified Businesses in {business.city}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nearbyListings.map((nb) => (
                  <button
                    key={nb.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectBusiness(nb);
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-left hover:border-blue-500 transition-colors flex items-center gap-2.5"
                  >
                    <img src={nb.logo} alt="" className="w-9 h-9 rounded-lg object-cover border shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{nb.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{nb.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
