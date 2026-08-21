import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink,
  Calendar,
  DollarSign,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';
import { BusinessInquiry } from '../types';

interface InquiriesManagerModalProps {
  inquiries: BusinessInquiry[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (inquiryId: string, status: 'new' | 'contacted' | 'completed') => void;
  onDeleteInquiry: (inquiryId: string) => void;
}

export const InquiriesManagerModal: React.FC<InquiriesManagerModalProps> = ({
  inquiries,
  isOpen,
  onClose,
  onUpdateStatus,
  onDeleteInquiry,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredInquiries = inquiries.filter((inq) => {
    if (filterStatus !== 'all' && inq.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inq.clientName.toLowerCase().includes(q) ||
        inq.businessName.toLowerCase().includes(q) ||
        inq.serviceRequested.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleLaunchWhatsApp = (inquiry: BusinessInquiry) => {
    const cleanPhone = inquiry.clientPhone.replace(/\D/g, '');
    const text = `Hello ${inquiry.clientName}! This is ${inquiry.businessName} regarding your inquiry on AuraCentra Ghana about *${inquiry.serviceRequested}*. How can we assist you today?`;
    window.open(`https://wa.me/${cleanPhone.startsWith('233') ? cleanPhone : '233' + cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`, '_blank');
    onUpdateStatus(inquiry.id, 'contacted');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh] my-auto"
        id="inquiries-manager-modal"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Client Inquiries & Quotes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage incoming service leads received through AuraCentra
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by client name, business, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {(['all', 'new', 'contacted', 'completed'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Inquiries List */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {inq.clientName}
                      </h4>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                        → {inq.businessName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Service: <strong>{inq.serviceRequested}</strong></span>
                      <span>•</span>
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) => onUpdateStatus(inq.id, e.target.value as any)}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border-0 cursor-pointer ${
                        inq.status === 'new'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : inq.status === 'contacted'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => onDeleteInquiry(inq.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl">
                  "{inq.message || 'No additional message provided'}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">📞 {inq.clientPhone}</span>
                    {inq.clientEmail && <span>📧 {inq.clientEmail}</span>}
                    {inq.budgetRange && <span>💰 {inq.budgetRange}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLaunchWhatsApp(inq)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply on WhatsApp</span>
                    </button>

                    <a
                      href={`tel:${inq.clientPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white font-bold text-xs transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No inquiries found
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Customer quotes and requests will appear here when users contact businesses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
