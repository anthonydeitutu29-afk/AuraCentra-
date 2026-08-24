import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { Business } from '../types';
import { REJECTION_PRESETS, RejectionPreset, dispatchRejectionNotification } from '../utils/notificationService';

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
  const [copied, setCopied] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: RejectionPreset) => {
    setSelectedPreset(preset);
    setCustomReason(preset.defaultReason);
    setCustomResolution(preset.resolutionGuide);
  };

  const handleConfirm = (openWhatsAppDirectly: boolean = false) => {
    setIsDispatching(true);
    const finalReason = customReason.trim() || selectedPreset.defaultReason;
    const finalResolution = customResolution.trim() || selectedPreset.resolutionGuide;

    // Trigger automated notification dispatch
    const result = dispatchRejectionNotification(
      business,
      finalReason,
      finalResolution,
      adminNotes.trim() || undefined
    );

    onConfirmReject(business.id, finalReason, finalResolution, adminNotes.trim() || undefined);

    if (openWhatsAppDirectly && result.whatsappUrl) {
      window.open(result.whatsappUrl, '_blank');
    }

    onShowToast?.(
      'Rejection Notice Dispatched',
      `Automated notification recorded for ${business.name}. Owner contact alerted.`,
      'warning'
    );

    setIsDispatching(false);
    onClose();
  };

  const handleCopyNotice = () => {
    const result = dispatchRejectionNotification(
      business,
      customReason,
      customResolution,
      adminNotes
    );
    navigator.clipboard.writeText(result.whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onShowToast?.('Message Copied', 'Rejection notification text copied to clipboard.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-rose-950/70 border-b border-rose-900/60 p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Reject & Notify Business Owner</span>
              </h3>
              <p className="text-xs text-rose-300">
                Send structured feedback to <strong className="text-white">{business.name}</strong> with actionable next steps.
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
        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Target Business Quick Summary */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3.5">
            <img 
              src={business.logo} 
              alt="" 
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate">{business.name}</div>
              <div className="text-xs text-slate-400">{business.city}, {business.region} • {business.phone}</div>
              <div className="text-[11px] text-blue-400 font-mono mt-0.5">{business.email}</div>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                Pending Queue
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
              Rejection Reason & Deficiencies (Sent to User):
            </label>
            <textarea
              rows={3}
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
              placeholder="e.g., Called phone line, no answer after 3 attempts on 24 Aug."
            />
          </div>

          {/* Automated Notification Overview */}
          <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-900/50 flex items-start gap-2.5 text-xs text-blue-300">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-blue-200">Automated Notification System</div>
              <p className="text-[11px] text-blue-300/90 leading-relaxed">
                Confirming rejection will update the listing status to <strong>Rejected</strong>, create an in-app alert for the user’s account, and generate a pre-filled WhatsApp alert for instant communication with <strong>{business.phone || 'the owner'}</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            type="button"
            onClick={handleCopyNotice}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDispatching}
              onClick={() => handleConfirm(false)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-900/30 transition-all cursor-pointer"
            >
              <span>Reject & Save</span>
            </button>

            <button
              type="button"
              disabled={isDispatching}
              onClick={() => handleConfirm(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
              title="Reject and immediately launch WhatsApp notice to owner"
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
