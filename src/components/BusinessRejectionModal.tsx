import React, { useState, useMemo } from 'react';
import { 
  X, 
  AlertTriangle, 
  Send, 
  MessageSquare, 
  FileWarning, 
  CheckCircle2, 
  Info, 
  Building2,
  Copy,
  Check,
  Mail,
  ExternalLink,
  FileText,
  Sparkles
} from 'lucide-react';
import { Business } from '../types';
import { REJECTION_PRESETS, RejectionPreset, dispatchRejectionNotification } from '../utils/notificationService';
import { generateRejectionEmailTemplate } from '../utils/rejectionEmailGenerator';

interface BusinessRejectionModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (businessId: string, reason: string, resolutionGuide?: string, adminNotes?: string) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const BusinessRejectionModal: React.FC<BusinessRejectionModalProps> = ({
  business,
  isOpen,
  onClose,
  onConfirmReject,
  onShowToast,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<RejectionPreset>(REJECTION_PRESETS[0]);
  const [customReason, setCustomReason] = useState(REJECTION_PRESETS[0].defaultReason);
  const [customResolution, setCustomResolution] = useState(REJECTION_PRESETS[0].resolutionGuide);
  const [adminNotes, setAdminNotes] = useState('');
  const [copiedType, setCopiedType] = useState<'none' | 'whatsapp' | 'email' | 'url'>('none');
  const [activePreviewTab, setActivePreviewTab] = useState<'email' | 'whatsapp'>('email');
  const [isDispatching, setIsDispatching] = useState(false);

  // Compute origin and direct link to dashboard
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://auracentra.com';
  const directDashboardUrl = `${origin}/#dashboard-${business.id}`;

  const finalReason = customReason.trim() || selectedPreset.defaultReason;
  const finalResolution = customResolution.trim() || selectedPreset.resolutionGuide;

  // Automated Email Template Generator
  const generatedEmailTemplate = useMemo(() => {
    return generateRejectionEmailTemplate({
      business,
      reason: finalReason,
      resolutionGuide: finalResolution,
      adminNotes: adminNotes.trim() || undefined,
      directDashboardUrl,
    });
  }, [business, finalReason, finalResolution, adminNotes, directDashboardUrl]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: RejectionPreset) => {
    setSelectedPreset(preset);
    setCustomReason(preset.defaultReason);
    setCustomResolution(preset.resolutionGuide);
  };

  const handleConfirm = (actionType: 'save' | 'whatsapp' | 'email' = 'save') => {
    setIsDispatching(true);

    // Trigger automated notification dispatch
    const result = dispatchRejectionNotification(
      business,
      finalReason,
      finalResolution,
      adminNotes.trim() || undefined,
      generatedEmailTemplate
    );

    onConfirmReject(business.id, finalReason, finalResolution, adminNotes.trim() || undefined);

    if (actionType === 'whatsapp' && result.whatsappUrl) {
      window.open(result.whatsappUrl, '_blank');
    } else if (actionType === 'email' && generatedEmailTemplate.mailtoUrl) {
      window.location.href = generatedEmailTemplate.mailtoUrl;
    }

    onShowToast?.(
      'Rejection Notice Dispatched',
      `Automated email template and notice generated for "${business.name}". Owner can use direct link to edit and resubmit.`,
      'warning'
    );

    setIsDispatching(false);
    onClose();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(generatedEmailTemplate.textBody);
    setCopiedType('email');
    setTimeout(() => setCopiedType('none'), 2500);
    onShowToast?.('Email Template Copied', 'Automated email text with direct dashboard link copied to clipboard.', 'info');
  };

  const handleCopyWhatsApp = () => {
    const result = dispatchRejectionNotification(
      business,
      finalReason,
      finalResolution,
      adminNotes,
      generatedEmailTemplate
    );
    navigator.clipboard.writeText(result.whatsappMessage);
    setCopiedType('whatsapp');
    setTimeout(() => setCopiedType('none'), 2500);
    onShowToast?.('WhatsApp Notice Copied', 'Rejection notification text copied to clipboard.', 'info');
  };

  const handleCopyDirectLink = () => {
    navigator.clipboard.writeText(directDashboardUrl);
    setCopiedType('url');
    setTimeout(() => setCopiedType('none'), 2500);
    onShowToast?.('Direct Link Copied', 'Dashboard direct link copied to clipboard.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-rose-950/70 border-b border-rose-900/60 p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Reject & Send Automated Resolution Notice</span>
              </h3>
              <p className="text-xs text-rose-300">
                Generate an automated email template with direct dashboard link for <strong className="text-white">{business.name}</strong> to edit and resubmit.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* Target Business Quick Summary */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-3.5">
            <div className="flex items-center gap-3.5 min-w-0">
              <img 
                src={business.logo} 
                alt="" 
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" 
              />
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{business.name}</div>
                <div className="text-xs text-slate-400">{business.city}, {business.region} • {business.phone}</div>
                <div className="text-[11px] text-amber-400 font-mono mt-0.5">{business.email || 'No email specified'}</div>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-1">
                <FileWarning className="w-3 h-3" />
                <span>Verification Review</span>
              </span>
            </div>
          </div>

          {/* Preset Reason Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Select Primary Rejection Reason:</span>
              <span className="text-[11px] text-slate-400 font-normal">Choose standard preset</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REJECTION_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl text-left text-xs transition-all border ${
                      isSelected
                        ? 'bg-rose-950/60 border-rose-600 text-white font-bold shadow-xs'
                        : 'bg-slate-800/50 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileWarning className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                      <span className="truncate">{preset.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 font-normal">
                      {preset.defaultReason}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Reason Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Rejection Reason & Deficiencies (Pulls into Automated Template):
            </label>
            <textarea
              rows={2}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
              placeholder="Explain why this listing could not be approved..."
            />
          </div>

          {/* Actionable Resolution Guide */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              How the Owner Can Fix & Resubmit:
            </label>
            <textarea
              rows={2}
              value={customResolution}
              onChange={(e) => setCustomResolution(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-200 text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
              placeholder="Give step-by-step instructions for the owner..."
            />
          </div>

          {/* Direct Dashboard Link Preview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Direct Dashboard Resubmission Link:
              </span>
              <span className="text-xs font-mono text-amber-400 truncate block">
                {directDashboardUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyDirectLink}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
              title="Copy Direct Link"
            >
              {copiedType === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'url' ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Automated Template Preview Switcher */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">Automated Notification Previews</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('email')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    activePreviewTab === 'email'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3 h-3" />
                  <span>Email Template</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('whatsapp')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    activePreviewTab === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>WhatsApp Notice</span>
                </button>
              </div>
            </div>

            {/* Email Preview Box */}
            {activePreviewTab === 'email' ? (
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-slate-400">
                      <strong>To:</strong> {business.email || business.ownerEmail || 'owner@business.com'}
                    </div>
                    <div className="text-[11px] text-slate-200 font-bold">
                      <strong>Subject:</strong> {generatedEmailTemplate.subject}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'email' ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>

                <div className="font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                  {generatedEmailTemplate.textBody}
                </div>
              </div>
            ) : (
              /* WhatsApp Preview Box */
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="text-[11px] text-slate-400">
                    <strong>Recipient WhatsApp:</strong> {business.whatsapp || business.phone || 'Ghanaian Mobile'}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyWhatsApp}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedType === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'whatsapp' ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="font-mono text-[11px] text-emerald-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto p-2 bg-emerald-950/20 rounded-xl border border-emerald-900/40">
                  {dispatchRejectionNotification(business, finalReason, finalResolution, adminNotes, generatedEmailTemplate).whatsappMessage}
                </div>
              </div>
            )}
          </div>

          {/* Internal Administrative Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">
              Internal Admin Notes (Private / Not visible to user):
            </label>
            <input
              type="text"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 text-xs placeholder:text-slate-600 focus:outline-hidden focus:border-slate-600"
              placeholder="e.g., Ghana Card expired 2023. Called phone line on 24 Aug."
            />
          </div>

        </div>

        {/* Modal Actions */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedType === 'email' ? 'Email Copied' : 'Copy Email'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              {copiedType === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{copiedType === 'whatsapp' ? 'WA Copied' : 'Copy WA'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDispatching}
              onClick={() => handleConfirm('save')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-900/30 transition-all cursor-pointer"
            >
              <span>Reject & Save</span>
            </button>

            <button
              type="button"
              disabled={isDispatching}
              onClick={() => handleConfirm('email')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-900/30 transition-all cursor-pointer"
              title="Reject and launch your default email client with the generated template"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Reject & Email</span>
            </button>

            <button
              type="button"
              disabled={isDispatching}
              onClick={() => handleConfirm('whatsapp')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
              title="Reject and launch WhatsApp notice to owner"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reject & WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
