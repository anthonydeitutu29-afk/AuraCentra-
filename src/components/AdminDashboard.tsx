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
  Clock
} from 'lucide-react';
import { Business, Category, UserProfile, VerificationDocument, DocumentType } from '../types';
import { Logo } from './Logo';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  currentUser: UserProfile;
  businesses: Business[];
  categories: Category[];
  showExecutiveSection: boolean;
  onToggleExecutiveSection: (visible: boolean) => void;
  onUpdateBusiness: (business: Business) => void;
  onAddBusiness: (business: Business) => void;
  onDeleteBusiness: (businessId: string) => void;
  onApproveVerification: (businessId: string, badgeType: 'Gold Enterprise' | 'Standard Verified') => void;
  onRejectVerification: (businessId: string, reason: string) => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onSignOut: () => void;
  onBackToPortal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  businesses,
  categories,
  showExecutiveSection,
  onToggleExecutiveSection,
  onUpdateBusiness,
  onAddBusiness,
  onDeleteBusiness,
  onApproveVerification,
  onRejectVerification,
  onAddCategory,
  onDeleteCategory,
  onSignOut,
  onBackToPortal,
}) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'businesses' | 'categories' | 'settings'>('verification');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Verification Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<{
    business: Business;
    doc: VerificationDocument;
  } | null>(null);

  // Business Edit / Create Modal State
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);

  // Add Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [showAddCatModal, setShowAddCatModal] = useState(false);

  // Stats Calculations
  const verifiedCount = businesses.filter((b) => b.verificationStatus === 'verified').length;
  const pendingCount = businesses.filter((b) => b.verificationStatus === 'pending').length;
  const totalViews = businesses.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalLeads = businesses.reduce((acc, b) => acc + (b.leadsCount || 0), 0);

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingBusinesses = businesses.filter((b) => b.verificationStatus === 'pending');

  const handleCreateNewBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) return;

    if (isCreatingBusiness) {
      onAddBusiness({
        ...editingBusiness,
        id: `biz-${Date.now()}`,
        slug: editingBusiness.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      onUpdateBusiness({
        ...editingBusiness,
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Businesses</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{businesses.length}</div>
            <div className="text-[11px] text-emerald-400 font-medium">Active in database</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Pending Verifications</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-[11px] text-amber-300">Requires Ghana ID review</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Verified Enterprises</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{verifiedCount}</div>
            <div className="text-[11px] text-slate-400">Gold & Standard badges</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Customer Inquiries</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400">{totalLeads}</div>
            <div className="text-[11px] text-slate-400">WhatsApp & Phone leads</div>
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
            <span>ID Verification Submissions</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {pendingCount}
              </span>
            )}
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

        {/* TAB 1: ID Verification Submissions & Approvals */}
        {activeTab === 'verification' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Ghana ID Document Verification Review</span>
                  <span className="text-xs font-normal text-slate-400">
                    (Ghana Card, Voter's ID, Driver's License, Passport)
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect submitted identity documents and official registration records before granting verified badges.
                </p>
              </div>
            </div>

            {pendingBusinesses.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-800/40 border border-slate-800 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <span>All business verification queues are cleared! No pending submissions.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  return (
                    <div
                      key={biz.id}
                      className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={biz.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                            <div>
                              <h4 className="text-sm font-bold text-white">{biz.name}</h4>
                              <p className="text-xs text-slate-400">{biz.city} • {biz.category}</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 text-[10px] font-bold uppercase">
                            Pending Review
                          </span>
                        </div>

                        {/* Document details box with preview button */}
                        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Document Type:</span>
                            <span className="font-semibold text-blue-400 capitalize">
                              {doc.type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">ID Number:</span>
                            <span className="font-mono text-slate-200">{doc.documentNumber}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Holder Name:</span>
                            <span className="font-semibold text-slate-200">{doc.holderName}</span>
                          </div>

                          {/* Image preview capability */}
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc({ business: biz, doc })}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold border border-blue-500/40 transition-colors"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>View Document Photo Preview</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Approval Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
                        <button
                          type="button"
                          onClick={() => {
                            onApproveVerification(biz.id, 'Gold Enterprise');
                            confetti({ particleCount: 70, spread: 60 });
                          }}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve (Gold Badge)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:') || 'Incomplete document information';
                            onRejectVerification(biz.id, reason);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-950/80 border border-rose-800 hover:bg-rose-900 text-rose-300 text-xs font-bold transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject Submission</span>
                        </button>
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
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Rating</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredBusinesses.map((b) => (
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
                          {b.verificationStatus === 'verified' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold text-[10px]">
                              Verified ({b.verificationDetails?.badgeType || 'Gold'})
                            </span>
                          ) : b.verificationStatus === 'pending' ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 font-semibold text-[10px]">
                              Pending Review
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
                                if (confirm(`Are you sure you want to remove "${b.name}" from AuraCentra?`)) {
                                  onDeleteBusiness(b.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors"
                              title="Delete business"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
    </div>
  );
};
