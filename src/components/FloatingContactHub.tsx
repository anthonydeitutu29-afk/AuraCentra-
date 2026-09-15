import React, { useState, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Headphones, 
  ArrowUpRight,
  ExternalLink,
  GripHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

interface FloatingContactHubProps {
  onOpenSupportPage?: () => void;
}

export const FloatingContactHub: React.FC<FloatingContactHubProps> = ({
  onOpenSupportPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMsg, setQuickMsg] = useState('');
  const isDraggingRef = useRef(false);

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
    <motion.div 
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        // Small delay to prevent drag end from immediately triggering click toggle
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 120);
      }}
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 touch-none" 
      id="floating-admin-contact-hub"
    >
      {/* Expanded Quick Contact Card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/15 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[#155DFC] border border-blue-400/30 flex items-center justify-center text-white shadow-xs">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>Tony's Support Hub</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#155DFC] fill-blue-50 dark:fill-transparent" />
                </h4>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Online • Direct Assistance
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
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
            className="w-full inline-flex items-center justify-between p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold border border-emerald-600/40 transition-transform active:scale-[0.98]"
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
            className="w-full inline-flex items-center justify-between p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold transition-all"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="truncate">{adminEmail}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 shrink-0" />
          </a>

          {/* Direct Phone Dial */}
          <a
            href={`tel:${adminPhone}`}
            className="w-full inline-flex items-center justify-between p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200/60 dark:border-slate-700/60 transition-all"
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
                className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#155DFC] hover:bg-blue-700 text-white transition-colors cursor-pointer"
                title="Send on WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {onOpenSupportPage && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenSupportPage();
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Full Support Hub Page</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Floating Trigger Button (Logo Blue Style) */}
      <button
        type="button"
        id="floating-hub-toggle-btn"
        onClick={() => {
          if (!isDraggingRef.current) {
            setIsOpen(!isOpen);
          }
        }}
        className="relative group inline-flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#155DFC] hover:bg-blue-700 active:scale-95 text-white border border-blue-400/40 shadow-xl shadow-blue-600/35 transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
        aria-label="Direct contact Tony's Digital Marketing & Business Hub WhatsApp and Email (Draggable)"
        title="Chat with Support (Drag to reposition)"
      >
        <div className="relative flex items-center justify-center">
          <div className="p-1 rounded-full bg-white text-[#155DFC] shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white dark:border-slate-900" />
        </div>
        <span className="hidden sm:inline text-xs font-bold tracking-wide text-white">
          Direct Hub Contact
        </span>
      </button>
    </motion.div>
  );
};
