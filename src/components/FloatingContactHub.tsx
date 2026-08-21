import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  Headphones, 
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

export const FloatingContactHub: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMsg, setQuickMsg] = useState('');

  const adminPhone = '0508203673';
  const adminWhatsAppGhana = '233508203673';
  const adminEmail = 'tonysdigitalmarketing@gmail.com';

  const handleSendWhatsAppQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = quickMsg.trim() 
      ? encodeURIComponent(`Hello Tony's Digital Marketing & AuraCentra Support,\n\n${quickMsg}`) 
      : encodeURIComponent("Hello Tony's Digital Marketing & AuraCentra, I would like to inquire about business verification and digital growth services.");
    
    window.open(`https://wa.me/${adminWhatsAppGhana}?text=${text}`, '_blank');
    setQuickMsg('');
  };

  const handleSendEmailQuery = () => {
    const subject = encodeURIComponent('AuraCentra & Tony\'s Digital Marketing Hub Inquiry');
    const body = encodeURIComponent(quickMsg.trim() || 'Hello Tony\'s Team,\n\nI would like to inquire about AuraCentra platform verification and digital marketing services.');
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-30" id="floating-admin-contact-hub">
      {/* Expanded Quick Contact Card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-200 dark:border-slate-800 p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>Tony's Support Hub</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
                </h4>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Online • Typically replies instantly
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Need help listing a business, verifying your Ghana Card, or accelerating digital growth? Connect directly with Tony's Business Hub team.
          </p>

          {/* Direct WhatsApp Action Link */}
          <a
            href={`https://wa.me/${adminWhatsAppGhana}?text=${encodeURIComponent("Hello Tony's Digital Marketing, I found you on AuraCentra and would like to chat.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-between p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp ({adminPhone})</span>
            </div>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {/* Direct Email Action Link */}
          <a
            href={`mailto:${adminEmail}?subject=AuraCentra%20Business%20Support%20%26%20Inquiry`}
            className="w-full inline-flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="truncate">{adminEmail}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-blue-600 shrink-0" />
          </a>

          {/* Direct Phone Dial */}
          <a
            href={`tel:${adminPhone}`}
            className="w-full inline-flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Call Helpline: {adminPhone}</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* Quick Message Input Box */}
          <form onSubmit={handleSendWhatsAppQuery} className="pt-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Type a quick message..."
                value={quickMsg}
                onChange={(e) => setQuickMsg(e.target.value)}
                className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                title="Send on WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        id="floating-hub-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group inline-flex items-center gap-2.5 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 text-white shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20"
        aria-label="Direct contact Tony's Digital Marketing & Business Hub WhatsApp and Email"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-white/20" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-blue-600 animate-ping" />
        </div>
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Direct Hub Contact
        </span>
      </button>
    </div>
  );
};
