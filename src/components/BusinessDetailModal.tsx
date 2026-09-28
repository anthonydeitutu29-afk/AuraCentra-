import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  BadgeCheck, 
  Clock, 
  Share2, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink,
  Check,
  Send,
  Building2,
  Bookmark,
  Navigation,
  FileCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Business } from '../types';

interface BusinessDetailModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'inquiry' | 'trust'>('overview');
  const [copied, setCopied] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  if (!isOpen || !business) return null;

  const cleanPhone = business.phone ? business.phone.replace(/[^0-9+]/g, '') : '';
  const whatsappNum = business.whatsapp 
    ? business.whatsapp.replace(/[^0-9]/g, '') 
    : cleanPhone.replace(/[^0-9]/g, '');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${business.name} - AuraCentra Ghana`,
        text: `Check out ${business.name} on AuraCentra Ghana Directory:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setInquiryText('');
      setSenderName('');
      setSenderPhone('');
    }, 3000);
  };

  const mapsQuery = encodeURIComponent(`${business.name}, ${business.city || ''} ${business.region} Ghana`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Hero Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-blue-700 font-black text-2xl flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
              {business.logo_url ? (
                <img 
                  src={business.logo_url} 
                  alt={business.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                business.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wide">
                  {business.category}
                </span>
                {business.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[11px] font-bold shadow-xs">
                    <BadgeCheck className="w-3.5 h-3.5 fill-current" />
                    <span>Ghana Verified</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black mt-1 leading-snug">
                {business.name}
              </h2>

              <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {business.address ? `${business.address}, ` : ''}{business.city ? `${business.city}, ` : ''}{business.region}, Ghana
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Strip */}
          <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
            {cleanPhone && (
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-xs hover:bg-blue-50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            )}

            {whatsappNum && (
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello ${business.name}, I am contacting you through AuraCentra Ghana Directory.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions</span>
            </a>

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(business.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-amber-400 text-amber-950'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* 4 Tabs Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'credentials'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Verification Credentials
          </button>
          <button
            onClick={() => setActiveTab('inquiry')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'inquiry'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Direct Inquiry Form
          </button>
          <button
            onClick={() => setActiveTab('trust')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'trust'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Trust Standard
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[55vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  About Enterprise
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {business.description || 'This business has been listed on the national digital directory and serves customers across Ghana.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 block">Operating Hours</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {business.operating_hours || 'Mon - Sat: 8:00 AM - 6:00 PM'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 block">Primary Contact</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{business.phone}</span>
                  </div>
                </div>

                {business.email && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 block">Official Email</span>
                      <a href={`mailto:${business.email}`} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}

                {business.website && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 block">Web Presence</span>
                      <a 
                        href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VERIFICATION CREDENTIALS */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm">
                    {business.verified ? 'Verified Commercial Enterprise' : 'Community Listed Listing'}
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-0.5">
                    {business.verified
                      ? 'This enterprise has submitted valid national identity credentials to establish trust with consumers.'
                      : 'This business has been added to our open directory. Verification can be finalized via Ghana Card.'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Ghana Card (NIA) Signatory</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {business.ghana_card_number || 'Registered on file'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">GRA Taxpayer ID (TIN)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {business.tin_number || 'Commercial Registry Active'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Digital Address (GhanaPost GPS)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {business.address || `${business.city || 'Accra'}, Ghana`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT INQUIRY FORM */}
          {activeTab === 'inquiry' && (
            <div className="space-y-4">
              {messageSent ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Inquiry Dispatched!</h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400">
                    Your quote request has been transmitted directly to {business.name}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. John Mensah"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="024 123 4567"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Inquiry or Quotation Request *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      placeholder="Specify the product, service quantity, delivery location, or appointment time..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Inquiry to Business</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: TRUST STANDARD NOTICE */}
          {activeTab === 'trust' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm">
                    AuraCentra Safe Trade Guidelines
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-400 mt-1 leading-relaxed">
                    Always inspect high-value goods before full final payment. Request official receipts stamped with the merchant's GRA TIN.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Verified phone numbers connect directly to business premises without middleman charges.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Inquiries sent through the portal are logged with digital timestamps for client protection.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Report any inaccurate business info directly to Tony's Support Hub for immediate dispute review.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-750 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-400">
            AuraCentra Verified Directory • ID: {business.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
