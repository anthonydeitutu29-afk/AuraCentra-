import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  FolderPlus, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  Eye, 
  Search, 
  Sliders, 
  SlidersHorizontal, 
  FileText, 
  Image as ImageIcon, 
  Lock, 
  LogOut, 
  Settings, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Layers,
  ChevronRight,
  ExternalLink,
  Upload,
  AlertTriangle,
  Clock,
  Flag,
  ShieldAlert,
  AlertCircle,
  Info,
  UserCheck,
  Smartphone,
  Phone,
  Mail,
  MessageSquare,
  Send,
  User as UserIcon,
  Navigation,
  Check,
  Compass,
  MapPin,
  Radio,
  Crosshair,
  Globe
} from 'lucide-react';
import { Business, Category, UserProfile, VerificationDocument, DocumentType, BusinessReport, CategorySuggestion, PlatformFeedback, UserAccountRecord } from '../types';
import { getRegisteredAccounts } from '../utils/storage';
import { verifyGhanaPostGPS } from '../utils/gpsVerification';
import { Logo } from './Logo';
import { AdminVerificationModal } from './AdminVerificationModal';
import { BusinessRejectionModal } from './BusinessRejectionModal';
import { AdminLocationTracker } from './AdminLocationTracker';
import { dispatchApprovalNotification } from '../utils/notificationService';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  currentUser: UserProfile;
  businesses: Business[];
  categories: Category[];
  reports?: BusinessReport[];
  suggestions?: CategorySuggestion[];
  feedback?: PlatformFeedback[];
  showExecutiveSection: boolean;
  onToggleExecutiveSection: (visible: boolean) => void;
  onUpdateBusiness: (business: Business) => void;
  onAddBusiness: (business: Business) => void;
  onDeleteBusiness: (businessId: string) => void;
  onApproveVerification: (businessId: string, badgeType: string, verifiedCoords?: { lat: number; lng: number }) => void;
  onRejectVerification: (businessId: string, reason: string, resolutionGuide?: string, adminNotes?: string) => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateReportStatus?: (reportId: string, status: BusinessReport['status'], adminNotes?: string) => void;
  onDeleteReport?: (reportId: string) => void;
  onUpdateSuggestionStatus?: (suggestionId: string, status: CategorySuggestion['status'], adminNotes?: string) => void;
  onDeleteSuggestion?: (suggestionId: string) => void;
  onApproveAndCreateCategory?: (suggestion: CategorySuggestion) => void;
  onUpdateFeedbackStatus?: (feedbackId: string, status: PlatformFeedback['status'], adminReply?: string) => void;
  onDeleteFeedback?: (feedbackId: string) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onSignOut: () => void;
  onBackToPortal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  businesses,
  categories,
  reports = [],
  suggestions = [],
  feedback = [],
  showExecutiveSection,
  onToggleExecutiveSection,
  onUpdateBusiness,
  onAddBusiness,
  onDeleteBusiness,
  onApproveVerification,
  onRejectVerification,
  onAddCategory,
  onDeleteCategory,
  onUpdateReportStatus,
  onDeleteReport,
  onUpdateSuggestionStatus,
  onDeleteSuggestion,
  onApproveAndCreateCategory,
  onUpdateFeedbackStatus,
  onDeleteFeedback,
  onShowToast,
  onSignOut,
  onBackToPortal,
}) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'location_tracker' | 'reports' | 'suggestions' | 'feedback' | 'users' | 'businesses' | 'categories' | 'settings'>('verification');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportFilterStatus, setReportFilterStatus] = useState<string>('all');
  const [bizStatusFilter, setBizStatusFilter] = useState<'all' | 'pending' | 'verified' | 'unverified' | 'rejected'>('all');
  const [userFilterProvider, setUserFilterProvider] = useState<string>('all');
  const [registeredUsers, setRegisteredUsers] = useState<UserAccountRecord[]>(() => getRegisteredAccounts());
  
  // Refresh accounts when opening users tab
  const refreshUsers = () => {
    setRegisteredUsers(getRegisteredAccounts());
  };

  // Verification Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<{
    business: Business;
    doc: VerificationDocument;
  } | null>(null);

  // Real-time Google Maps Geocoding & GPS Verification Modal State
  const [verifyingBusiness, setVerifyingBusiness] = useState<Business | null>(null);

  // Business Rejection Modal State with Automated Notification
  const [rejectingBusiness, setRejectingBusiness] = useState<Business | null>(null);

  // Pending Queue Sub-Filter State
  const [pendingSubFilter, setPendingSubFilter] = useState<'all' | 'with_docs' | 'gps_valid'>('all');

  // Business Edit / Create Modal State
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);

  // Add Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [showAddCatModal, setShowAddCatModal] = useState(false);

  // Brevo Testing State
  const [brevoTestEmail, setBrevoTestEmail] = useState('tonysdigitalmarketing@gmail.com');
  const [brevoTesting, setBrevoTesting] = useState(false);
  const [brevoTestResult, setBrevoTestResult] = useState<any>(null);

  // Stats Calculations
  const verifiedCount = businesses.filter((b) => b.verificationStatus === 'verified').length;
  const pendingCount = businesses.filter((b) => b.verificationStatus === 'pending' || b.listingStatus === 'pending_approval').length;
  const rejectedCount = businesses.filter((b) => b.verificationStatus === 'rejected' || b.listingStatus === 'rejected').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const totalViews = businesses.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalLeads = businesses.reduce((acc, b) => acc + (b.leadsCount || 0), 0);

  const filteredBusinesses = businesses.filter((b) => {
    if (bizStatusFilter === 'pending' && b.verificationStatus !== 'pending' && b.listingStatus !== 'pending_approval') return false;
    if (bizStatusFilter === 'verified' && b.verificationStatus !== 'verified') return false;
    if (bizStatusFilter === 'rejected' && b.verificationStatus !== 'rejected' && b.listingStatus !== 'rejected') return false;
    if (bizStatusFilter === 'unverified' && (b.verificationStatus === 'verified' || b.verificationStatus === 'pending' || b.verificationStatus === 'rejected' || b.listingStatus === 'rejected')) return false;

    if (!searchQuery) return true;
    return (
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.phone && b.phone.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredReports = reports.filter((r) => {
    if (reportFilterStatus !== 'all' && r.status !== reportFilterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.businessName.toLowerCase().includes(q) ||
        r.reasonLabel.toLowerCase().includes(q) ||
        r.details.toLowerCase().includes(q) ||
        (r.reporterName && r.reporterName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingBusinesses = businesses.filter((b) => {
    const isPending = b.verificationStatus === 'pending' || b.listingStatus === 'pending_approval';
    if (!isPending) return false;

    if (pendingSubFilter === 'with_docs') {
      return (b.verificationDocuments && b.verificationDocuments.length > 0 && b.verificationDocuments[0].frontImageUrl);
    }
    if (pendingSubFilter === 'gps_valid') {
      const check = verifyGhanaPostGPS(b.digitalAddress || '');
      return check.isValid;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        (b.digitalAddress && b.digitalAddress.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateNewBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) return;

    if (isCreatingBusiness) {
      onAddBusiness({
        ...editingBusiness,
        id: `biz-${Date.now()}`,
        slug: editingBusiness.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        listingStatus: editingBusiness.listingStatus || 'active',
        verificationStatus: editingBusiness.verificationStatus || 'verified',
        verificationDetails: editingBusiness.verificationDetails || {
          verifiedAt: new Date().toISOString(),
          tinNumber: 'TIN-GH-882194',
          businessRegNumber: 'BN-GH-2024-9128',
          badgeType: 'Gold Enterprise',
          verifiedByAdmin: 'Executive Desk',
          gpsVerified: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      onUpdateBusiness({
        ...editingBusiness,
        listingStatus: editingBusiness.listingStatus || (editingBusiness.verificationStatus === 'verified' ? 'active' : 'pending_approval'),
        updatedAt: new Date().toISOString(),
      });
    }

    setEditingBusiness(null);
    setIsCreatingBusiness(false);
  };

  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: Category = {
      id: slug,
      name: newCatName.trim(),
      slug,
      iconName: 'Building2',
      description: newCatDescription.trim() || `Verified ${newCatName} listings across Ghana.`,
      itemCount: 0,
      featuredImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    };

    onAddCategory(newCategory);
    setNewCatName('');
    setNewCatDescription('');
    setShowAddCatModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col" id="admin-dashboard-container">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800 text-blue-300 text-xs font-mono font-semibold">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>EXECUTIVE ADMIN CONSOLE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToPortal}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            ← View Live Website
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Listings</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{businesses.length}</div>
            <div className="text-[11px] text-emerald-400 font-medium">Active in directory</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Pending ID Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-[11px] text-amber-300">Requires review</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Flagged Reports</span>
              <Flag className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{pendingReportsCount}</div>
            <div className="text-[11px] text-rose-300">Requires moderation</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Verified Badges</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{verifiedCount}</div>
            <div className="text-[11px] text-slate-400">Gold & Standard</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Customer Inquiries</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400">{totalLeads}</div>
            <div className="text-[11px] text-slate-400">Direct leads</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'verification'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pending Businesses Queue</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('location_tracker')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'location_tracker'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>User Location Tracker</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-[10px] font-black flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live GPS
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flag className="w-4 h-4 text-rose-400" />
            <span>Business Reports & Flags</span>
            {pendingReportsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {pendingReportsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suggestions')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'suggestions'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Category Suggestions</span>
            {suggestions.filter(s => s.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black">
                {suggestions.filter(s => s.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('feedback')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Customer Feedback & Ratings ({feedback.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              refreshUsers();
              setActiveTab('users');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Registered Users & Inquiries ({registeredUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('businesses')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'businesses'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Manage All Businesses ({businesses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Platform Controls & Executive Section</span>
          </button>
        </div>

        {/* TAB: User Geolocation & Activity Tracker */}
        {activeTab === 'location_tracker' && (
          <AdminLocationTracker 
            currentUser={currentUser} 
            onShowToast={onShowToast} 
          />
        )}

        {/* TAB 1: ID Verification Submissions & Approvals */}
        {activeTab === 'verification' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Header & Sub-filters */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Pending Businesses Moderation & Verification Queue
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                    {pendingBusinesses.length} in Queue
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Review submitted business identity records, geocoding coordinates, and official documents. Approving or rejecting instantly triggers automated user notifications and directory updates.
                </p>
              </div>

              {/* Sub-filters */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/80 self-start md:self-auto overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setPendingSubFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    pendingSubFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  All Submissions ({businesses.filter((b) => b.verificationStatus === 'pending' || b.listingStatus === 'pending_approval').length})
                </button>
                <button
                  type="button"
                  onClick={() => setPendingSubFilter('with_docs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    pendingSubFilter === 'with_docs'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  With Uploaded ID
                </button>
                <button
                  type="button"
                  onClick={() => setPendingSubFilter('gps_valid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    pendingSubFilter === 'gps_valid'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  GPS Validated
                </button>
              </div>
            </div>

            {pendingBusinesses.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">Pending Queue is Completely Cleared!</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  All submitted business listings and verification applications have been reviewed. New user submissions will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {pendingBusinesses.map((biz) => {
                  const doc = biz.verificationDocuments?.[0] || {
                    id: 'doc-auto',
                    type: 'ghana_card' as DocumentType,
                    documentNumber: 'GHA-990184712-4',
                    holderName: biz.name,
                    expiryDate: '2032-12-31',
                    frontImageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
                    submittedAt: biz.createdAt,
                    status: 'pending' as const,
                  };

                  const gpsAnalysis = verifyGhanaPostGPS(biz.digitalAddress || 'GA-019-4821');

                  return (
                    <div
                      key={biz.id}
                      className="p-5 sm:p-6 rounded-3xl bg-slate-800/95 border border-slate-700/90 shadow-xl space-y-4 flex flex-col justify-between hover:border-slate-600 transition-all"
                    >
                      <div className="space-y-4">
                        {/* Business Info Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <img 
                              src={biz.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80'} 
                              alt={biz.name} 
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-sm bg-slate-900" 
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-white leading-tight">{biz.name}</h4>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {biz.city}, {biz.region} • <span className="text-blue-400 font-semibold">{biz.category}</span>
                              </p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{biz.address}</span>
                              </p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-extrabold uppercase shrink-0">
                            Awaiting Review
                          </span>
                        </div>

                        {/* GhanaPost GPS Verification Box */}
                        <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                          gpsAnalysis.isValid 
                            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' 
                            : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1.5">
                              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                              <span>GhanaPost Digital Address</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              gpsAnalysis.isValid ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                            }`}>
                              {gpsAnalysis.isValid ? 'GPS Valid' : 'Check Required'}
                            </span>
                          </div>
                          <div className="font-mono text-white text-xs font-bold">
                            {biz.digitalAddress || 'GA-019-4821'}
                          </div>
                          <div className="text-[11px] text-slate-300">
                            {gpsAnalysis.isValid ? (
                              <span>Region: <strong>{gpsAnalysis.regionName}</strong> ({gpsAnalysis.regionCode}) • Coords: {gpsAnalysis.approxCoordinates?.lat}, {gpsAnalysis.approxCoordinates?.lng}</span>
                            ) : (
                              <span>{gpsAnalysis.validationMessage}</span>
                            )}
                          </div>
                        </div>

                        {/* Document details box with preview button */}
                        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Identity Document:</span>
                            <span className="font-semibold text-blue-400 capitalize">
                              {doc.type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">ID / TIN Number:</span>
                            <span className="font-mono text-slate-200 font-bold">{doc.documentNumber}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Registered Holder:</span>
                            <span className="font-semibold text-slate-200">{doc.holderName}</span>
                          </div>

                          {/* Image preview capability & GPS Audit */}
                          <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc({ business: biz, doc })}
                              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition-colors"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                              <span>View ID Photo</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setVerifyingBusiness(biz)}
                              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold border border-blue-500/40 transition-colors"
                            >
                              <Compass className="w-3.5 h-3.5 text-cyan-400" />
                              <span>GPS & Maps Audit</span>
                            </button>
                          </div>
                        </div>

                        {/* Owner Contact Details & Quick Call/Text Desk */}
                        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="text-slate-400 text-[10px]">Owner Phone & WhatsApp</div>
                            <div className="font-semibold text-white font-mono">{biz.phone || '0508203673'}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${biz.phone || '0508203673'}`}
                              className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </a>
                            <a
                              href={`https://wa.me/${(biz.whatsapp || biz.phone || '233508203673').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${biz.name}, this is AuraCentra Ghana verification desk following up on your business registration.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Prominent Approval, Rejection & Permanent Delete Actions */}
                      <div className="pt-3 border-t border-slate-700/80 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onApproveVerification(biz.id, 'Gold Enterprise');
                              confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                            }}
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Enlist</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRejectingBusiness(biz)}
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-950/80 border border-amber-800/90 hover:bg-amber-900 text-amber-200 text-xs font-bold transition-colors shadow-xs"
                            title="Reject listing with feedback so it won't appear on site"
                          >
                            <XCircle className="w-4 h-4 text-amber-400" />
                            <span>Reject & Exclude</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete "${biz.name}"? It will be removed from the database and will not appear on the website.`)) {
                                onDeleteBusiness(biz.id);
                              }
                            }}
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-950/80 border border-rose-800/90 hover:bg-rose-900 text-rose-200 text-xs font-bold transition-colors shadow-xs"
                            title="Permanently remove business record from database"
                          >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                            <span>Delete Forever</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: Business Reports & Trust Moderation */}
        {activeTab === 'reports' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-400" />
                  <span>Flagged Business Reports & Content Moderation</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Review reported violations, fake verification claims, fraudulent activity, or inaccurate directory details.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto">
                {(['all', 'pending', 'reviewed', 'action_taken', 'dismissed'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setReportFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                      reportFilterStatus === status
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="p-10 rounded-2xl bg-slate-800/40 border border-slate-800 text-center text-slate-400 text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="font-bold text-white">No Reports Matching Filter</div>
                <p className="text-slate-400 max-w-sm mx-auto">
                  There are currently no flagged businesses under this status.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map((report) => {
                  const targetBiz = businesses.find((b) => b.id === report.businessId);

                  return (
                    <div
                      key={report.id}
                      className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-400 flex items-center justify-center shrink-0">
                              <Flag className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <span>{report.businessName}</span>
                                {targetBiz?.verificationStatus === 'verified' && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </h4>
                              <p className="text-xs text-rose-300 font-semibold">{report.reasonLabel}</p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                              report.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : report.status === 'action_taken'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : report.status === 'reviewed'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                : 'bg-slate-700 text-slate-300 border border-slate-600'
                            }`}
                          >
                            {report.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Report description box */}
                        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2 text-xs">
                          <div className="text-slate-300 leading-relaxed font-sans">
                            "{report.details}"
                          </div>

                          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                            <div>
                              <span className="text-slate-500">Reported By:</span>{' '}
                              <span className="text-slate-300 font-semibold">{report.reporterName || 'Anonymous Community Member'}</span>
                              {report.reporterEmail && ` (${report.reporterEmail})`}
                              {report.reporterPhone && ` • ${report.reporterPhone}`}
                            </div>
                            <div>{new Date(report.reportedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>

                      {/* Moderation Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
                        <div className="flex items-center gap-1.5">
                          {targetBiz && (
                            <button
                              type="button"
                              onClick={() => setEditingBusiness(targetBiz)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3 text-blue-400" />
                              <span>Inspect / Edit Listing</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {report.status !== 'action_taken' && onUpdateReportStatus && (
                            <button
                              type="button"
                              onClick={() => onUpdateReportStatus(report.id, 'action_taken')}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                              title="Mark as Action Taken"
                            >
                              Action Taken
                            </button>
                          )}

                          {report.status !== 'reviewed' && onUpdateReportStatus && (
                            <button
                              type="button"
                              onClick={() => onUpdateReportStatus(report.id, 'reviewed')}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                              title="Mark as Reviewed"
                            >
                              Reviewed
                            </button>
                          )}

                          {report.status !== 'dismissed' && onUpdateReportStatus && (
                            <button
                              type="button"
                              onClick={() => onUpdateReportStatus(report.id, 'dismissed')}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold cursor-pointer"
                              title="Dismiss Report"
                            >
                              Dismiss
                            </button>
                          )}

                          {onDeleteReport && (
                            <button
                              type="button"
                              onClick={() => onDeleteReport(report.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-700 cursor-pointer"
                              title="Delete Report Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: Category Suggestions from Community */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Category Expansion Suggestions</span>
                </h3>
                <p className="text-xs text-slate-400">
                  User and business suggestions for expanding Ghanaian industry classification.
                </p>
              </div>
            </div>

            {suggestions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60 text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-slate-500" />
                <div className="font-bold text-white">No Category Suggestions Pending</div>
                <div className="text-xs">All submitted suggestions have been moderated or approved.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase tracking-wider mb-1">
                          {sug.industry || 'Proposed Sector'}
                        </div>
                        <h4 className="text-base font-black text-white">{sug.categoryName}</h4>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          sug.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : sug.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {sug.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      "{sug.description}"
                    </p>

                    {sug.exampleBusinesses && (
                      <div className="text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Examples:</span> {sug.exampleBusinesses}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        By: <span className="text-slate-200 font-semibold">{sug.suggestedBy}</span>
                        {sug.userEmail && ` (${sug.userEmail})`}
                      </div>
                      <div>{new Date(sug.createdAt).toLocaleDateString()}</div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {onApproveAndCreateCategory && sug.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => {
                              onApproveAndCreateCategory(sug);
                              confetti({ particleCount: 50, spread: 60 });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Add Category</span>
                          </button>
                        )}

                        {onUpdateSuggestionStatus && sug.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => onUpdateSuggestionStatus(sug.id, 'rejected', 'Does not meet category criteria.')}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-rose-900 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </div>

                      {onDeleteSuggestion && (
                        <button
                          type="button"
                          onClick={() => onDeleteSuggestion(sug.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="Delete Suggestion"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Customer Feedback & Business Reviews */}
        {activeTab === 'feedback' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Customer Feedback & Rating Moderation</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Reviews, site satisfaction ratings, and customer feedback submitted by visitors.
                </p>
              </div>
            </div>

            {feedback.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60 text-slate-400 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-500" />
                <div className="font-bold text-white">No Customer Feedback Yet</div>
                <div className="text-xs">Ratings and reviews submitted by Ghanaian users will appear here.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60 uppercase">
                            {item.type.replace('_', ' ')}
                          </span>
                          {item.rating && (
                            <span className="text-xs font-black text-amber-400">
                              {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)} ({item.rating}/5)
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{item.subject}</h4>
                        {item.targetBusinessName && (
                          <div className="text-xs text-blue-400 font-semibold">
                            Target Business: {item.targetBusinessName}
                          </div>
                        )}
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          item.status === 'new'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : item.status === 'reviewed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      "{item.message}"
                    </p>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        From: <span className="text-slate-200 font-semibold">{item.name}</span>
                        {item.email && ` (${item.email})`}
                      </div>
                      <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {onUpdateFeedbackStatus && item.status === 'new' && (
                          <button
                            type="button"
                            onClick={() => onUpdateFeedbackStatus(item.id, 'reviewed')}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                          >
                            Mark Reviewed
                          </button>
                        )}
                      </div>

                      {onDeleteFeedback && (
                        <button
                          type="button"
                          onClick={() => onDeleteFeedback(item.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="Delete Feedback"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Registered Users & Inquiries */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <span>Registered Users & Direct Customer Communication</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time list of members signed in via Google, Apple iCloud, and email accounts. Talk to them directly on WhatsApp at 0508203673 for feedback.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/233508203673?text=${encodeURIComponent('Hello Tony, checking user feedback and inquiry logs on AuraCentra Ghana.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open WhatsApp Hub (0508203673)</span>
                </a>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-xs text-slate-400">Total Registered</div>
                <div className="text-xl font-black text-white">{registeredUsers.length}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-xs text-slate-400">Google OAuth</div>
                <div className="text-xl font-black text-blue-400">
                  {registeredUsers.filter((u) => u.authProvider === 'google').length}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-xs text-slate-400">Apple / iCloud</div>
                <div className="text-xl font-black text-slate-200">
                  {registeredUsers.filter((u) => u.authProvider === 'apple').length}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-xs text-slate-400">Direct Email Accounts</div>
                <div className="text-xl font-black text-amber-400">
                  {registeredUsers.filter((u) => !u.authProvider || u.authProvider === 'email').length}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/80">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Provider:</span>
                <select
                  value={userFilterProvider}
                  onChange={(e) => setUserFilterProvider(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Providers</option>
                  <option value="google">Google</option>
                  <option value="apple">Apple / iCloud</option>
                  <option value="email">Email & Password</option>
                </select>
              </div>
            </div>

            {/* Users List */}
            {registeredUsers.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60 text-slate-400 space-y-2">
                <UserIcon className="w-8 h-8 mx-auto text-slate-500" />
                <div className="font-bold text-white">No Registered Users Yet</div>
                <div className="text-xs">User sign-ups and logins will appear here automatically.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredUsers
                  .filter((u) => {
                    if (userFilterProvider !== 'all' && (u.authProvider || 'email') !== userFilterProvider) return false;
                    if (searchQuery) {
                      const q = searchQuery.toLowerCase();
                      return (
                        u.name.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q) ||
                        (u.phone && u.phone.toLowerCase().includes(q))
                      );
                    }
                    return true;
                  })
                  .map((u) => {
                    const cleanUserPhone = u.phone ? u.phone.replace(/\D/g, '') : '';
                    const waTarget = cleanUserPhone ? (cleanUserPhone.startsWith('233') ? cleanUserPhone : '233' + cleanUserPhone.replace(/^0/, '')) : '233508203673';
                    const directWhatsAppUrl = `https://wa.me/${waTarget}?text=${encodeURIComponent(
                      `Hello ${u.name}! This is Tony from AuraCentra Ghana. Reaching out regarding your account (${u.email}) for feedback and support.`
                    )}`;
                    const adminWhatsAppLogUrl = `https://wa.me/233508203673?text=${encodeURIComponent(
                      `👤 *User Record from AuraCentra Ghana:*\n\n• Name: ${u.name}\n• Email: ${u.email}\n• Phone: ${u.phone || 'N/A'}\n• Provider: ${u.authProvider || 'email'}\n• Role: ${u.role}\n• Joined: ${new Date(u.createdAt).toLocaleString()}`
                    )}`;

                    return (
                      <div
                        key={u.id}
                        className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3.5 shadow-md flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{u.name}</h4>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-700 text-slate-300">
                                  {u.role}
                                </span>
                              </div>
                              <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{u.email}</span>
                              </div>
                              {u.phone && (
                                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{u.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Provider Badge */}
                          <div>
                            {u.authProvider === 'google' ? (
                              <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800 flex items-center gap-1">
                                Google
                              </span>
                            ) : u.authProvider === 'apple' ? (
                              <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-950 text-slate-200 border border-slate-700 flex items-center gap-1">
                                Apple / iCloud
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                                Email
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Joined & Activity */}
                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                          <div>Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                          <div>ID: <span className="font-mono text-slate-500">{u.id.substring(0, 10)}...</span></div>
                        </div>

                        {/* Communication Action Bar */}
                        <div className="pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2">
                          <a
                            href={directWhatsAppUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all"
                            title="Direct WhatsApp Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp User</span>
                          </a>

                          <a
                            href={adminWhatsAppLogUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-600"
                            title="Send user details to Tony's WhatsApp (0508203673)"
                          >
                            <Send className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Save to 0508203673</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Manage All Businesses */}
        {activeTab === 'businesses' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setBizStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  bizStatusFilter === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Enterprises ({businesses.length})
              </button>

              <button
                type="button"
                onClick={() => setBizStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  bizStatusFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Pending Approval ({pendingCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setBizStatusFilter('verified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  bizStatusFilter === 'verified'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified ({verifiedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setBizStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  bizStatusFilter === 'rejected'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Rejected / Banned ({rejectedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setBizStatusFilter('unverified')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  bizStatusFilter === 'unverified'
                    ? 'bg-slate-700 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Unverified ({businesses.length - verifiedCount - pendingCount - rejectedCount})
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter businesses by name, city, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingBusiness({
                    id: '',
                    name: '',
                    tagline: '',
                    slug: '',
                    category: categories[0]?.id || 'restaurants',
                    description: '',
                    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
                    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                    gallery: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'],
                    phone: '0508203673',
                    whatsapp: '233508203673',
                    email: 'tonysdigitalmarketing@gmail.com',
                    city: 'Accra',
                    region: 'Greater Accra',
                    address: 'Accra Central',
                    digitalAddress: 'GA-019-4821',
                    coordinates: { lat: 5.6037, lng: -0.1870 },
                    priceLevel: '$$',
                    rating: 5.0,
                    reviewCount: 1,
                    verificationStatus: 'verified',
                    listingStatus: 'active',
                    verificationDetails: {
                      verifiedAt: new Date().toISOString(),
                      tinNumber: 'TIN-GH-882194',
                      businessRegNumber: 'BN-GH-2024-9128',
                      badgeType: 'Gold Enterprise',
                      verifiedByAdmin: 'Executive Desk',
                      gpsVerified: true,
                    },
                    openingHours: {
                      monday: '08:00 - 18:00',
                      tuesday: '08:00 - 18:00',
                      wednesday: '08:00 - 18:00',
                      thursday: '08:00 - 18:00',
                      friday: '08:00 - 18:00',
                      saturday: '09:00 - 15:00',
                      sunday: 'Closed',
                    },
                    services: ['General Consultation'],
                    features: ['Verified Listing'],
                    views: 0,
                    leadsCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                  setIsCreatingBusiness(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Business Directly</span>
              </button>
            </div>

            {/* Businesses Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-800/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Business</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">City & Region</th>
                      <th className="p-3.5">GPS Address</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Rating</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredBusinesses.map((b) => {
                      const isPending = b.verificationStatus === 'pending' || b.listingStatus === 'pending_approval';
                      const gpsInfo = verifyGhanaPostGPS(b.digitalAddress || '');

                      return (
                        <tr key={b.id} className="hover:bg-slate-800/80 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <img src={b.logo} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0" />
                              <div className="min-w-0">
                                <div className="font-bold text-white truncate">{b.name}</div>
                                <div className="text-[11px] text-slate-400">{b.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-300">{b.category}</td>
                          <td className="p-3.5 text-slate-300">{b.city}, {b.region}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-slate-200 text-[11px]">{b.digitalAddress || 'GA-019-4821'}</span>
                              {gpsInfo.isValid && (
                                <span title="Valid GhanaPost GPS">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5">
                            {b.verificationStatus === 'verified' ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold text-[10px]">
                                Verified ({b.verificationDetails?.badgeType || 'Gold'})
                              </span>
                            ) : (b.verificationStatus === 'rejected' || b.listingStatus === 'rejected') ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-800 text-rose-300 font-bold text-[10px] inline-flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-rose-400" />
                                <span>Rejected (Excluded)</span>
                              </span>
                            ) : isPending ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 font-semibold text-[10px] animate-pulse">
                                Pending Approval
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-amber-400 font-bold">★ {b.rating.toFixed(1)}</td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* GPS Geocoding & Location Audit */}
                              <button
                                type="button"
                                onClick={() => setVerifyingBusiness(b)}
                                className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-600 border border-emerald-800/80 text-emerald-300 hover:text-white transition-colors"
                                title="Run Google Maps GPS Geocoding Audit"
                              >
                                <Compass className="w-3.5 h-3.5" />
                              </button>

                              {/* Direct Approve Action for Pending or Rejected Business */}
                              {(isPending || b.verificationStatus === 'rejected' || b.listingStatus === 'rejected') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onApproveVerification(b.id, 'Gold Enterprise');
                                    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                                  title="Approve and publish business on AuraCentra"
                                >
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>{b.verificationStatus === 'rejected' ? 'Re-Approve' : 'Approve'}</span>
                                </button>
                              )}

                              {/* Reject Action if active/pending and not yet rejected */}
                              {b.verificationStatus !== 'rejected' && b.listingStatus !== 'rejected' && (
                                <button
                                  type="button"
                                  onClick={() => setRejectingBusiness(b)}
                                  className="p-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-600 border border-amber-800/80 text-amber-300 hover:text-white transition-colors"
                                  title="Reject and exclude business listing"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingBusiness(b);
                                  setIsCreatingBusiness(false);
                                }}
                                className="p-1.5 rounded-lg bg-slate-700 hover:bg-blue-600 text-slate-200 hover:text-white transition-colors"
                                title="Edit business"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to permanently delete "${b.name}"? This removes the business permanently from the database and it will never appear on the site.`)) {
                                    onDeleteBusiness(b.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors"
                                title="Permanently delete business from database"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Manage Categories */}
        {activeTab === 'categories' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Platform Business Categories</h3>
                <p className="text-xs text-slate-400">Add, customize, or remove categories across AuraCentra.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCatModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const count = businesses.filter((b) => b.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
                      <div className="text-[11px] text-blue-400 font-semibold">{count} Businesses Listed</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          onDeleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-600 text-rose-400 hover:text-white transition-colors shrink-0"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Platform Controls & Executive Section */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Executive Section Control */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Executive Featured Businesses Section</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Control whether the curated executive spotlight showcase appears on the public homepage.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleExecutiveSection(!showExecutiveSection)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    showExecutiveSection
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {showExecutiveSection ? 'Section Visible (Active)' : 'Section Hidden (Removed)'}
                </button>
              </div>
            </div>

            {/* Brevo Transactional Email Gateway Testing */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Brevo (Sendinblue) Email Gateway</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Active Sender: <strong className="text-emerald-400 font-mono">tonysdigitalmarketing@gmail.com</strong> (AuraCentra Ghana)
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  Transactional SMTP
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Send Test Verification Email
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={brevoTestEmail}
                    onChange={(e) => setBrevoTestEmail(e.target.value)}
                    placeholder="tonysdigitalmarketing@gmail.com"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    disabled={brevoTesting}
                    onClick={async () => {
                      setBrevoTesting(true);
                      setBrevoTestResult(null);
                      try {
                        const res = await fetch('/api/test-brevo-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: brevoTestEmail || 'tonysdigitalmarketing@gmail.com' }),
                        });
                        const data = await res.json();
                        setBrevoTestResult(data);
                        if (res.ok) {
                          onShowToast?.('Email Sent!', data.message || 'Live test email dispatched successfully.', 'success');
                        } else {
                          onShowToast?.('Delivery Notice', data.message || 'Could not dispatch email.', 'error');
                        }
                      } catch (err: any) {
                        setBrevoTestResult({ status: 'error', message: err.message });
                        onShowToast?.('Test Failed', err.message, 'error');
                      } finally {
                        setBrevoTesting(false);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shrink-0 disabled:opacity-50"
                  >
                    {brevoTesting ? 'Dispatching...' : 'Send Live Test Email'}
                  </button>
                </div>

                {brevoTestResult && (
                  <div className={`p-3 rounded-xl text-xs ${brevoTestResult.status === 'success' ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300' : 'bg-rose-950/80 border border-rose-800 text-rose-300'}`}>
                    <p className="font-semibold">{brevoTestResult.message}</p>
                    {brevoTestResult.messageId && (
                      <p className="text-[11px] font-mono text-slate-400 mt-1">Brevo Message ID: {brevoTestResult.messageId}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Admin Contact Routing Details */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <h4 className="text-sm font-bold text-white">Direct Admin Contact Integrations</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-slate-400">Official WhatsApp Contact:</span>
                  <div className="font-mono text-emerald-400 font-bold mt-1">0508203673 (+233508203673)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-slate-400">Official Support & Hub Email:</span>
                  <div className="font-mono text-blue-400 font-bold mt-1">tonysdigitalmarketing@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Image Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {previewDoc.business.name} - {previewDoc.doc.type.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="text-xs text-slate-400">
                  Holder: {previewDoc.doc.holderName} • ID: {previewDoc.doc.documentNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-slate-800">
              <img
                src={previewDoc.doc.frontImageUrl}
                alt="Document Full Preview"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onApproveVerification(previewDoc.business.id, 'Gold Enterprise');
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
              >
                Approve Gold Badge
              </button>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Business Modal */}
      {editingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {isCreatingBusiness ? 'Add New Business to AuraCentra' : `Edit ${editingBusiness.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingBusiness(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBusiness} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Business Name</label>
                  <input
                    type="text"
                    required
                    value={editingBusiness.name}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={editingBusiness.category}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tagline</label>
                <input
                  type="text"
                  value={editingBusiness.tagline || ''}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingBusiness.description}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Phone</label>
                  <input
                    type="text"
                    value={editingBusiness.phone}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={editingBusiness.city}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Verification Status</label>
                  <select
                    value={editingBusiness.verificationStatus}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, verificationStatus: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBusiness(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500"
                >
                  Save Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Create New Category</h3>
            <form onSubmit={handleCreateCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Energy & Clean Tech"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe businesses under this category..."
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Real-Time Google Maps Geocoding & GPS Verification Modal */}
      {verifyingBusiness && (
        <AdminVerificationModal
          business={verifyingBusiness}
          isOpen={!!verifyingBusiness}
          onClose={() => setVerifyingBusiness(null)}
          onApprove={(bizId, badge, coords) => {
            onApproveVerification(bizId, badge, coords);
            confetti({ particleCount: 80, spread: 70 });
            setVerifyingBusiness(null);
          }}
          onReject={(bizId, reason) => {
            onRejectVerification(bizId, reason);
            setVerifyingBusiness(null);
          }}
        />
      )}

      {/* Rejection Feedback & Automated Notification Modal */}
      {rejectingBusiness && (
        <BusinessRejectionModal
          business={rejectingBusiness}
          isOpen={!!rejectingBusiness}
          onClose={() => setRejectingBusiness(null)}
          onConfirmReject={(bizId, reason, resolutionGuide, adminNotes) => {
            onRejectVerification(bizId, reason, resolutionGuide, adminNotes);
            setRejectingBusiness(null);
          }}
        />
      )}
    </div>
  );
};
