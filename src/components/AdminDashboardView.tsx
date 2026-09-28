import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Building2, 
  User, 
  Phone, 
  Globe, 
  MapPin, 
  Clock, 
  Eye, 
  Check, 
  X, 
  RotateCcw, 
  FileText, 
  ExternalLink, 
  Calendar, 
  ChevronRight, 
  LogOut, 
  Sparkles, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  History,
  Info,
  BadgeCheck,
  Ban,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { EnlistmentSubmission, AdminAuditLogEntry } from '../../server';

interface AdminDashboardViewProps {
  onBackToSite: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBackToSite }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStage, setAuthStage] = useState<'credentials' | 'verification'>('credentials');
  const [tempToken, setTempToken] = useState('');
  
  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Data State
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'submissions' | 'audit'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [submissions, setSubmissions] = useState<EnlistmentSubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogEntry[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<EnlistmentSubmission | null>(null);

  // Action Modals State
  const [actionModal, setActionModal] = useState<{
    type: 'approve' | 'request_changes' | 'reject' | 'suspend' | null;
    submission: EnlistmentSubmission | null;
  }>({ type: null, submission: null });
  const [actionReason, setActionReason] = useState('');
  const [markVerified, setMarkVerified] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [internalNoteText, setInternalNoteText] = useState('');

  // Check existing session on load
  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    const token = localStorage.getItem('auracentra_admin_token');
    if (!token) return;

    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        loadDashboardData(token);
      } else {
        localStorage.removeItem('auracentra_admin_token');
      }
    } catch {
      localStorage.removeItem('auracentra_admin_token');
    }
  };

  const loadDashboardData = async (token?: string) => {
    const authToken = token || localStorage.getItem('auracentra_admin_token');
    if (!authToken) return;

    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      const [statsRes, bizRes, logsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/businesses', { headers }),
        fetch('/api/admin/audit-logs', { headers })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
      if (bizRes.ok) {
        const bizData = await bizRes.json();
        setSubmissions(bizData.businesses);
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAuditLogs(logsData.logs);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Stage 1: Email & Password verification
  const handleStage1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/login-stage1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid administrator credentials.');
      } else {
        setTempToken(data.tempToken);
        setAuthStage('verification');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Stage 2: 2FA Verification Code
  const handleStage2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/login-stage2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, verificationCode })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid administrator credentials.');
      } else {
        localStorage.setItem('auracentra_admin_token', data.token);
        setIsAuthenticated(true);
        loadDashboardData(data.token);
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('auracentra_admin_token');
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {}
    }
    localStorage.removeItem('auracentra_admin_token');
    setIsAuthenticated(false);
    setAuthStage('credentials');
    setEmail('');
    setPassword('');
    setVerificationCode('');
  };

  // Execute review action on business
  const handleExecuteAction = async () => {
    if (!actionModal.submission || !actionModal.type) return;

    setActionLoading(true);
    const token = localStorage.getItem('auracentra_admin_token');

    try {
      const res = await fetch(`/api/admin/businesses/${actionModal.submission.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: actionModal.type,
          reason: actionReason,
          markVerified: markVerified
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Update local list
        setSubmissions(prev =>
          prev.map(item => (item.id === data.business.id ? data.business : item))
        );
        if (selectedSubmission?.id === data.business.id) {
          setSelectedSubmission(data.business);
        }
        setActionModal({ type: null, submission: null });
        setActionReason('');
        setMarkVerified(false);
        loadDashboardData();
      }
    } catch (err) {
      console.error('Error executing admin action:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddInternalNote = async () => {
    if (!selectedSubmission || !internalNoteText.trim()) return;

    const token = localStorage.getItem('auracentra_admin_token');
    try {
      const res = await fetch(`/api/admin/businesses/${selectedSubmission.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'add_note',
          note: internalNoteText.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedSubmission(data.business);
        setInternalNoteText('');
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleToggleVerifiedBadge = async (sub: EnlistmentSubmission) => {
    const token = localStorage.getItem('auracentra_admin_token');
    try {
      const res = await fetch(`/api/admin/businesses/${sub.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'toggle_verified' })
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(prev => prev.map(s => (s.id === data.business.id ? data.business : s)));
        if (selectedSubmission?.id === data.business.id) {
          setSelectedSubmission(data.business);
        }
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered submissions for table
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = 
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ownerFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.submissionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || s.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // ==========================================
  // VIEW: AUTHENTICATION (SCREENS 1 & 2)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {authStage === 'credentials'
                ? 'AuraCentra Administrator Login'
                : 'Administrator Verification'}
            </h1>
            <p className="text-xs text-slate-400">
              {authStage === 'credentials'
                ? 'Authorized personnel only. Access strictly audited.'
                : 'Two-stage security: enter your assigned 4-digit verification code.'}
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {authStage === 'credentials' ? (
            /* SCREEN 1: Email and Password */
            <form onSubmit={handleStage1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admindashboard@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm font-medium focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm font-medium focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {authLoading ? 'Verifying...' : 'Continue'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* SCREEN 2: Verification Code */
            <form onSubmit={handleStage2Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    placeholder="8009"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white font-mono text-base tracking-widest text-center focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {authLoading ? 'Authenticating...' : 'Verify & Access Dashboard'}
                  <Check className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthStage('credentials');
                    setAuthError(null);
                  }}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 text-center border-t border-slate-700/60">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← Return to AuraCentra Website
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base text-white tracking-tight">
                AuraCentra
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                Admin Console
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Role: System Administrator • admindashboard@gmail.com
            </p>
          </div>
        </div>

        {/* Tab Switcher & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => { setActiveAdminTab('overview'); setSelectedSubmission(null); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeAdminTab === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => { setActiveAdminTab('submissions'); setSelectedSubmission(null); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeAdminTab === 'submissions' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Businesses ({submissions.length})
            </button>
            <button
              onClick={() => { setActiveAdminTab('audit'); setSelectedSubmission(null); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeAdminTab === 'audit' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Audit Log ({auditLogs.length})
            </button>
          </nav>

          <button
            onClick={onBackToSite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* TAB 1: OVERVIEW METRICS */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-8">
            
            {/* 10-stat grid overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Submissions</span>
                <p className="text-2xl font-black text-white">{stats?.totalBusinesses || submissions.length}</p>
              </div>

              <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Pending Review</span>
                <p className="text-2xl font-black text-amber-300">
                  {submissions.filter(s => s.status === 'pending_review').length}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-sky-500/30 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Under Review</span>
                <p className="text-2xl font-black text-sky-300">
                  {submissions.filter(s => s.status === 'under_review').length}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Published Active</span>
                <p className="text-2xl font-black text-emerald-300">
                  {submissions.filter(s => s.status === 'published' || s.status === 'approved').length}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-purple-500/30 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Verified Badges</span>
                <p className="text-2xl font-black text-purple-300">
                  {submissions.filter(s => s.verified).length}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Corrections Req.</span>
                <p className="text-2xl font-black text-rose-300">
                  {submissions.filter(s => s.status === 'verification_required').length}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejected</span>
                <p className="text-2xl font-black text-slate-300">
                  {submissions.filter(s => s.status === 'rejected').length}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suspended</span>
                <p className="text-2xl font-black text-slate-300">
                  {submissions.filter(s => s.status === 'suspended').length}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reported Listings</span>
                <p className="text-2xl font-black text-slate-300">0</p>
              </div>

              <div className="bg-slate-800/80 border border-blue-500/30 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Audit Trail Logs</span>
                <p className="text-2xl font-black text-blue-300">{auditLogs.length}</p>
              </div>

            </div>

            {/* Recent Submissions pending review */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Action Required: Submissions Awaiting Verification
                  </h3>
                  <p className="text-xs text-slate-400">
                    Review incoming business documents and grant directory publishing permissions.
                  </p>
                </div>
                <button
                  onClick={() => { setActiveAdminTab('submissions'); setStatusFilter('pending_review'); }}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  View All Pending →
                </button>
              </div>

              <div className="divide-y divide-slate-700/60">
                {submissions
                  .filter(s => s.status === 'pending_review' || s.status === 'under_review')
                  .slice(0, 4)
                  .map(sub => (
                    <div key={sub.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{sub.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {sub.submissionId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Owner: {sub.ownerFullName} • {sub.category} • {sub.city}, {sub.region}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setActiveAdminTab('submissions');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Review Submission
                        </button>
                      </div>
                    </div>
                  ))}

                {submissions.filter(s => s.status === 'pending_review' || s.status === 'under_review').length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No pending submissions right now. All submissions reviewed!
                  </div>
                )}
              </div>
            </div>

            {/* Recent Audit Activity */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-3xl p-6 space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Recent Administrative Activity Log
              </h3>
              <div className="divide-y divide-slate-700/60">
                {auditLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-200">{log.action}</span>
                      {log.businessName && (
                        <span className="text-slate-400"> on <span className="text-white font-medium">{log.businessName}</span></span>
                      )}
                      {log.reason && (
                        <p className="text-[11px] text-slate-500 mt-0.5">Note: {log.reason}</p>
                      )}
                    </div>
                    <span className="text-slate-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()} • {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BUSINESS SUBMISSIONS LIST & STRUCTURED REVIEW */}
        {activeAdminTab === 'submissions' && (
          <div className="space-y-6">
            
            {/* If an individual submission is selected for review */}
            {selectedSubmission ? (
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in">
                
                {/* Header with status and quick actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700">
                  <div>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-2 cursor-pointer"
                    >
                      ← Back to Business Submissions
                    </button>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        {selectedSubmission.name}
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        selectedSubmission.status === 'published' || selectedSubmission.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : selectedSubmission.status === 'pending_review'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : selectedSubmission.status === 'verification_required'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {selectedSubmission.status.replace('_', ' ')}
                      </span>
                      {selectedSubmission.verified && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1">
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Verified Directory Badge</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      ID: {selectedSubmission.submissionId} • Submitted: {new Date(selectedSubmission.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Top Review Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActionModal({ type: 'approve', submission: selectedSubmission })}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => setActionModal({ type: 'request_changes', submission: selectedSubmission })}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/30 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      onClick={() => setActionModal({ type: 'reject', submission: selectedSubmission })}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleToggleVerifiedBadge(selectedSubmission)}
                      className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>{selectedSubmission.verified ? 'Revoke Verification' : 'Grant Verified Badge'}</span>
                    </button>
                  </div>
                </div>

                {/* 10 Structured Review Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                  
                  {/* 1. Business Information */}
                  <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                    <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>1. Business Information</span>
                    </h3>
                    <div className="space-y-1.5 text-slate-300">
                      <div><strong className="text-white">Business Name:</strong> {selectedSubmission.name}</div>
                      <div><strong className="text-white">Legal Structure:</strong> {selectedSubmission.businessType}</div>
                      <div><strong className="text-white">Primary Category:</strong> {selectedSubmission.category}</div>
                      <div><strong className="text-white">Sector:</strong> {selectedSubmission.sector}</div>
                      <div><strong className="text-white">Year Established:</strong> {selectedSubmission.yearEstablished || 'N/A'}</div>
                      <div><strong className="text-white">Staff Size:</strong> {selectedSubmission.employeesCount || 'Unspecified'}</div>
                      <div className="pt-1">
                        <strong className="text-white block mb-0.5">Description:</strong>
                        <p className="text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                          {selectedSubmission.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Owner & 3. Contact Information */}
                  <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>2. Owner Information</span>
                      </h3>
                      <div className="space-y-1 text-slate-300">
                        <div><strong className="text-white">Full Name:</strong> {selectedSubmission.ownerFullName}</div>
                        <div><strong className="text-white">Owner Email:</strong> {selectedSubmission.ownerEmail}</div>
                        <div><strong className="text-white">Owner Phone:</strong> {selectedSubmission.ownerPhone}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>3. Public Contact Details</span>
                      </h3>
                      <div className="space-y-1 text-slate-300">
                        <div><strong className="text-white">Business Phone:</strong> {selectedSubmission.phone}</div>
                        <div><strong className="text-white">WhatsApp:</strong> {selectedSubmission.whatsapp || 'N/A'}</div>
                        <div><strong className="text-white">Email:</strong> {selectedSubmission.email || 'N/A'}</div>
                        <div><strong className="text-white">Website:</strong> {selectedSubmission.website || 'N/A'}</div>
                        <div><strong className="text-white">Opening Hours:</strong> {selectedSubmission.openingHours}</div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Location Information */}
                  <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                    <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>4. Business Location</span>
                    </h3>
                    <div className="space-y-1.5 text-slate-300">
                      <div><strong className="text-white">Ghana Region:</strong> {selectedSubmission.region}</div>
                      <div><strong className="text-white">City / Town:</strong> {selectedSubmission.city}</div>
                      <div><strong className="text-white">Area / Community:</strong> {selectedSubmission.area}</div>
                      <div><strong className="text-white">Street Description:</strong> {selectedSubmission.streetDescription || 'N/A'}</div>
                      <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/50 text-blue-300">
                        <strong>GhanaPost GPS Address:</strong> {selectedSubmission.ghanaPostGps || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  {/* 5. Business Media & 7. Social Links */}
                  <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                    <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>5. Media & Social Profiles</span>
                    </h3>
                    <div className="flex items-center gap-4">
                      {selectedSubmission.logoUrl ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                          <img src={selectedSubmission.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-slate-700 flex items-center justify-center text-slate-500">No logo</div>
                      )}
                      <div>
                        <span className="text-white font-bold">Cover & Gallery:</span>
                        <p className="text-slate-400 mt-0.5">
                          Cover uploaded: {selectedSubmission.coverImage ? 'Yes' : 'No'} • Gallery photos: {selectedSubmission.photos.length}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 text-slate-300">
                      <strong className="text-white block mb-1">Connected Socials:</strong>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedSubmission.socialLinks).map(([k, v]) => v ? (
                          <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold border border-slate-700 flex items-center gap-1">
                            <span>{k}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : null)}
                      </div>
                    </div>
                  </div>

                  {/* 6. Products & Services */}
                  <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                    <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      <span>6. Products & Services ({selectedSubmission.productsAndServices.length})</span>
                    </h3>
                    <div className="space-y-2">
                      {selectedSubmission.productsAndServices.map(item => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">{item.name}</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] uppercase font-bold text-slate-300">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-0.5">{item.description}</p>
                          </div>
                          {item.price && (
                            <span className="font-bold text-emerald-400 font-mono">{item.price}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 8. Verification Details (PRIVATE - NEVER SHOWN PUBLICLY) */}
                  <div className="bg-blue-950/20 border-2 border-blue-500/40 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-blue-300 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-4.5 h-4.5 text-blue-400" />
                        <span>8. Confidential Verification Data</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                        PRIVATE • NEVER EXPOSED TO PUBLIC
                      </span>
                    </div>

                    <div className="space-y-2 text-slate-200">
                      <div>
                        <strong className="text-blue-300">Registration / RGD Number:</strong>{' '}
                        {selectedSubmission.verification.registrationNumber || 'Not provided'}
                      </div>
                      <div>
                        <strong className="text-blue-300">Ghana Card / Owner ID:</strong>{' '}
                        {selectedSubmission.verification.ghanaCardNumber || 'Not provided'}
                      </div>
                      {selectedSubmission.verification.notes && (
                        <div>
                          <strong className="text-blue-300">Verification Notes:</strong>{' '}
                          {selectedSubmission.verification.notes}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* 9. Submission History & 10. Internal Admin Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-700 text-xs">
                  {/* Submission History */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <History className="w-4 h-4" />
                      <span>9. Submission Audit Trail</span>
                    </h3>
                    <div className="space-y-2">
                      {selectedSubmission.submissionHistory.map((hist, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="flex items-center justify-between font-bold text-slate-300">
                            <span className="uppercase text-[11px] text-blue-400">{hist.status}</span>
                            <span className="text-[10px] text-slate-500">{new Date(hist.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-400 mt-1">{hist.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal Admin Notes */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>10. Internal Admin Review Notes</span>
                    </h3>
                    <div className="space-y-2">
                      {selectedSubmission.internalAdminNotes?.map((note, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                          {note}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={internalNoteText}
                        onChange={e => setInternalNoteText(e.target.value)}
                        placeholder="Add private note for administrative team..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                      />
                      <button
                        onClick={handleAddInternalNote}
                        className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Submissions Table & Filters */
              <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 space-y-6">
                
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search business name, owner, city, ID..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status filter */}
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-hidden cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="under_review">Under Review</option>
                      <option value="published">Published / Approved</option>
                      <option value="verification_required">Verification Required</option>
                      <option value="rejected">Rejected</option>
                      <option value="suspended">Suspended</option>
                    </select>

                    <button
                      onClick={() => loadDashboardData()}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Refresh listings"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Submissions Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold text-[11px] border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Business & ID</th>
                        <th className="py-3 px-4">Owner</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Verification</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredSubmissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-750 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div>{sub.name}</div>
                            <span className="text-[10px] font-mono font-normal text-slate-400">{sub.submissionId}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>{sub.ownerFullName}</div>
                            <span className="text-[11px] text-slate-400">{sub.phone}</span>
                          </td>
                          <td className="py-3.5 px-4">{sub.category}</td>
                          <td className="py-3.5 px-4">{sub.city}, {sub.region}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              sub.status === 'published' || sub.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : sub.status === 'pending_review'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : sub.status === 'verification_required'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}>
                              {sub.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {sub.verified ? (
                              <span className="inline-flex items-center gap-1 text-blue-400 font-bold">
                                <BadgeCheck className="w-3.5 h-3.5" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="text-slate-500">Unverified</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all cursor-pointer"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredSubmissions.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            No business submissions found matching current search or filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 3: AUDIT TRAIL LOG */}
        {activeAdminTab === 'audit' && (
          <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Administrator Security Audit Log
              </h2>
              <p className="text-xs text-slate-400">
                Permanent immutable record of all administrative decisions, status shifts, and directory modifications.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Administrator</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target Business</th>
                    <th className="py-3 px-4">Status Transition</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-750">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">{log.adminEmail}</td>
                      <td className="py-3 px-4 text-blue-400 font-bold">{log.action}</td>
                      <td className="py-3 px-4">{log.businessName || 'N/A'}</td>
                      <td className="py-3 px-4">
                        {log.newStatus && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">
                            {log.previousStatus ? `${log.previousStatus} → ` : ''}{log.newStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{log.reason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Review Action Modal (Approve, Request Changes, Reject, Suspend) */}
      {actionModal.type && actionModal.submission && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {actionModal.type === 'approve' && 'Approve & Publish Business'}
                {actionModal.type === 'request_changes' && 'Request Changes from Business Owner'}
                {actionModal.type === 'reject' && 'Reject Business Submission'}
                {actionModal.type === 'suspend' && 'Suspend Business Listing'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Target: <strong className="text-white">{actionModal.submission.name}</strong> ({actionModal.submission.submissionId})
              </p>
            </div>

            {actionModal.type === 'approve' && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="markVerifiedCheck"
                  checked={markVerified}
                  onChange={e => setMarkVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="markVerifiedCheck" className="text-xs font-bold text-white cursor-pointer select-none">
                  Grant Official "Verified Enterprise" Badge
                </label>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {actionModal.type === 'approve' ? 'Approval Note (Optional)' : 'Reason & Explanation for Owner'}
              </label>
              <textarea
                rows={3}
                required={actionModal.type !== 'approve'}
                value={actionReason}
                onChange={e => setActionReason(e.target.value)}
                placeholder={
                  actionModal.type === 'request_changes'
                    ? 'Specify exact corrections required (e.g. proof of address mismatch, please upload valid Ghana Card)...'
                    : 'Enter reason or notes...'
                }
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal({ type: null, submission: null })}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || (actionModal.type !== 'approve' && !actionReason.trim())}
                onClick={handleExecuteAction}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer ${
                  actionModal.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    : actionModal.type === 'request_changes'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                }`}
              >
                {actionLoading ? 'Executing...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
