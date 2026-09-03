import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Sparkles,
  Bot,
  AlertCircle
} from 'lucide-react';
import { Business, UserProfile, DirectMessage } from '../types';
import { DirectMessagingService, generateThreadId } from '../services/directMessagingService';

interface DirectMessageModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  initialMessage?: string;
}

export const DirectMessageModal: React.FC<DirectMessageModalProps> = ({
  business,
  isOpen,
  onClose,
  currentUser,
  onShowToast,
  initialMessage = '',
}) => {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [inputText, setInputText] = useState(initialMessage);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load identity from currentUser or localStorage
  useEffect(() => {
    if (currentUser) {
      setSenderName(currentUser.name || '');
      setSenderEmail(currentUser.email || '');
      setSenderPhone(currentUser.phone || '');
    } else {
      const savedName = localStorage.getItem('auracentra_guest_name') || '';
      const savedEmail = localStorage.getItem('auracentra_guest_email') || '';
      const savedPhone = localStorage.getItem('auracentra_guest_phone') || '';
      if (savedName) setSenderName(savedName);
      if (savedEmail) setSenderEmail(savedEmail);
      if (savedPhone) setSenderPhone(savedPhone);
    }
  }, [currentUser]);

  // Load thread messages and subscribe to real-time updates
  useEffect(() => {
    if (!isOpen || !business) return;

    const emailToUse = currentUser?.email || senderEmail || localStorage.getItem('auracentra_guest_email') || '';
    if (!emailToUse) {
      setMessages([]);
      return;
    }

    const threadId = generateThreadId(business.id, emailToUse);
    const msgs = DirectMessagingService.getMessagesForThread(threadId);
    setMessages(msgs);
    DirectMessagingService.markThreadAsRead(threadId, 'customer');

    // Subscribe to live incoming replies
    const unsubscribe = DirectMessagingService.subscribeToMessages(() => {
      const updatedMsgs = DirectMessagingService.getMessagesForThread(threadId);
      setMessages(updatedMsgs);
      DirectMessagingService.markThreadAsRead(threadId, 'customer');
    });

    return () => unsubscribe();
  }, [isOpen, business, currentUser, senderEmail]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen || !business) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const finalName = senderName.trim() || currentUser?.name || 'Valued Customer';
    const finalEmail = senderEmail.trim() || currentUser?.email;

    if (!finalEmail) {
      onShowToast('Email Required', 'Please provide your email address so the business can reply to you.', 'warning');
      return;
    }

    // Save guest credentials in localStorage
    if (!currentUser) {
      localStorage.setItem('auracentra_guest_name', finalName);
      localStorage.setItem('auracentra_guest_email', finalEmail);
      if (senderPhone) localStorage.setItem('auracentra_guest_phone', senderPhone);
    }

    setIsSending(true);

    try {
      await DirectMessagingService.sendMessage({
        businessId: business.id,
        businessName: business.name,
        customerId: currentUser?.id || `guest-${finalEmail}`,
        customerName: finalName,
        customerEmail: finalEmail,
        customerPhone: senderPhone.trim() || undefined,
        sender: 'customer',
        senderName: finalName,
        message: inputText.trim(),
      });

      setInputText('');
      onShowToast('Message Sent', `Your message was delivered directly to ${business.name}. You will be notified instantly when they reply.`, 'success');
    } catch (err) {
      onShowToast('Send Failed', 'Could not send message. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const quickQuestions = [
    'Hello! Is this service currently available?',
    'What are your pricing packages and rates?',
    'Where is your exact office located in Accra?',
    'Can I schedule an appointment or consultation?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src={business.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'} 
              alt={business.name} 
              className="w-10 h-10 rounded-xl object-cover bg-white p-0.5 border border-white/20 shadow-xs shrink-0" 
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-white truncate">{business.name}</h3>
                {business.verificationStatus === 'verified' && (
                  <span title="Verified Business">
                    <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-100">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Direct Live Messaging Desk</span>
                <span>•</span>
                <span className="truncate">{business.city}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sender Credentials Prompt (If guest or not yet filled) */}
        {(!currentUser && (!senderEmail || !senderName)) && (
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 space-y-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-200">
              <User className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Enter your contact details so the business can reach you:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Your Full Name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Your Email (for notifications)"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Chat History Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
          {/* Welcome Notice from AuraCentra */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AuraCentra Direct Chat Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Messages sent here are delivered instantly to the official owner desk of <strong>{business.name}</strong>. You will receive real-time alerts on your screen when they reply.
            </p>
          </div>

          {/* Render Thread Messages */}
          {messages.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 mx-auto flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No previous messages with {business.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Type your message below or tap one of the quick prompts to start a live conversation.
              </p>

              {/* Quick Inquiry Chips */}
              <div className="flex flex-wrap gap-1.5 justify-center pt-3">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(q);
                    }}
                    className="px-2.5 py-1.5 text-[11px] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors cursor-pointer text-left shadow-2xs"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isCustomer = m.sender === 'customer';
              const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div 
                  key={m.id} 
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-1 px-1 flex items-center gap-1">
                    <span>{isCustomer ? 'You' : m.senderName || business.name}</span>
                    <span>•</span>
                    <span>{timeStr}</span>
                  </div>
                  <div 
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                      isCustomer 
                        ? 'bg-blue-600 text-white rounded-tr-xs' 
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.message}</p>
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder={`Message ${business.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
