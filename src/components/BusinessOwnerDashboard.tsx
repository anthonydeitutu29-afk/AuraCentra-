import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  Eye, 
  Phone, 
  MessageSquare, 
  Globe, 
  Share2, 
  RotateCcw, 
  FileEdit, 
  ChevronRight, 
  ArrowLeft,
  X,
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';

interface BusinessOwnerDashboardProps {
  businessId: string;
  onBackToDirectory: () => void;
  onEditBusiness?: () => void;
}

export const BusinessOwnerDashboard: React.FC<BusinessOwnerDashboardProps> = ({
  businessId,
  onBackToDirectory,
  onEditBusiness,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Correction response state
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [correctionUpdateText, setCorrectionUpdateText] = useState('');
  const [resubmitSuccess, setResubmitSuccess] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [businessId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/owner/business/${businessId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.business);
      } else {
        setError('Business listing not found or unauthorized.');
      }
    } catch {
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResubmitting(true);
    try {
      const res = await fetch(`/api/owner/business/${businessId}/resubmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descriptionUpdate: correctionUpdateText
        })
      });
      if (res.ok) {
        setResubmitSuccess(true);
        fetchDashboardData();
      }
    } catch {
      alert('Failed to resubmit corrections.');
    } finally {
      setIsResubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading your Business Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Dashboard Unavailable</h3>
        <p className="text-xs text-slate-500">{error || 'Could not locate this business record.'}</p>
        <button
          onClick={onBackToDirectory}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending_review: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    under_review: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
    verification_required: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    published: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    approved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    rejected: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
    suspended: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBackToDirectory}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to AuraCentra Directory</span>
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {data.name}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[data.status] || 'bg-slate-100 text-slate-600'}`}>
              {data.status.replace('_', ' ')}
            </span>
            {data.verified && (
              <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking ID: <strong className="text-slate-800 dark:text-slate-200">{data.submissionId}</strong> • {data.category} • {data.city}, {data.region}
          </p>
        </div>

        {onEditBusiness && (
          <button
            onClick={onEditBusiness}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <FileEdit className="w-4 h-4" />
            <span>Update Information</span>
          </button>
        )}
      </div>

      {/* CORRECTION REQUIRED ALERT IF ADMIN REQUESTED CHANGES */}
      {data.status === 'verification_required' && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500/40 rounded-3xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
                Action Required: Corrections Requested by AuraCentra Verifiers
              </h3>
              <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 mt-1">
                {data.correctionNotes || 'Please review your uploaded business documentation or contact details.'}
              </p>
            </div>
          </div>

          {!resubmitSuccess ? (
            <form onSubmit={handleResubmit} className="pt-2 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Provide Clarification / Correction Details:
              </label>
              <textarea
                rows={3}
                required
                value={correctionUpdateText}
                onChange={e => setCorrectionUpdateText(e.target.value)}
                placeholder="State the corrections made or clarify any discrepancies..."
                className="w-full p-3 rounded-xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                disabled={isResubmitting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isResubmitting ? 'Submitting...' : 'Resubmit for Review'}</span>
              </button>
            </form>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              ✓ Corrections submitted! Our administrative review team has been notified.
            </div>
          )}
        </div>
      )}

      {/* Profile Completeness Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Business Profile Completeness</span>
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{data.completeness}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${data.completeness}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Listings with over 80% completeness receive 3.4x more customer engagements and priority placement in search results.
        </p>
      </div>

      {/* Engagement & Click Analytics */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>Customer Engagement Analytics</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span>Listing Views</span>
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{data.metrics?.views || 0}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>Enquiries</span>
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{data.metrics?.enquiries || 0}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Phone className="w-3.5 h-3.5 text-sky-500" />
              <span>Phone Clicks</span>
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{data.metrics?.phoneClicks || 0}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span className="text-emerald-500 font-bold">WA</span>
              <span>WhatsApp</span>
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{data.metrics?.whatsappClicks || 0}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Website Clicks</span>
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{data.metrics?.websiteClicks || 0}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Share2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Social Clicks</span>
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{data.metrics?.socialClicks || 0}</p>
          </div>

        </div>
      </div>

      {/* Application Lifecycle & Verification Status */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Submission Lifecycle & Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent tracking from initial submission to verified directory publication.
          </p>
        </div>

        <div className="space-y-4">
          {data.history?.map((step: any, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {step.status.replace('_', ' ')}
                </div>
                <p className="text-slate-600 dark:text-slate-300">{step.note}</p>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(step.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
