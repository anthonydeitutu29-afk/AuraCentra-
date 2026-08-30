import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Plus, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  MessageSquare, 
  Users, 
  Star, 
  Share2, 
  FileText, 
  Award, 
  ExternalLink, 
  ArrowLeft, 
  LogOut, 
  Save, 
  MessageCircle, 
  Send, 
  Layers, 
  HelpCircle,
  Camera,
  Navigation,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  Business, 
  Category, 
  BusinessInquiry, 
  BusinessReview, 
  UserProfile, 
  DocumentType, 
  VerificationDocument, 
  OpeningHours 
} from '../types';
import { verifyGhanaPostGPS, GPSVerificationResult } from '../utils/gpsVerification';
import { Logo } from './Logo';
import confetti from 'canvas-confetti';

interface BusinessOwnerDashboardProps {
  currentUser: UserProfile;
  businesses: Business[];
  categories: Category[];
  inquiries: BusinessInquiry[];
  reviews: BusinessReview[];
  onUpdateBusiness: (updated: Business) => void;
  onAddBusiness?: (newBiz: Business) => void;
  onDeleteBusiness?: (businessId: string) => void;
  onOpenAccountSettings?: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onBackToPortal: () => void;
  onSignOut: () => void;
  onOpenLivePreview?: (business: Business) => void;
  onOpenCertificateModal?: (business: Business) => void;
  onOpenInquiryReply?: (inquiry: BusinessInquiry) => void;
}

export const BusinessOwnerDashboard: React.FC<BusinessOwnerDashboardProps> = ({
  currentUser,
  businesses,
  categories,
  inquiries,
  reviews,
  onUpdateBusiness,
  onAddBusiness,
  onDeleteBusiness,
  onOpenAccountSettings,
  onShowToast,
  onBackToPortal,
  onSignOut,
  onOpenLivePreview,
  onOpenCertificateModal,
}) => {
  // Find all businesses owned or associated with this user
  const userBusinesses = useMemo(() => {
    const ownedIds = currentUser.ownedBusinessIds || [];
    const directOwned = businesses.filter(
      (b) =>
        ownedIds.includes(b.id) ||
        b.ownerId === currentUser.id ||
        (b.ownerEmail && b.ownerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
        (b.email && b.email.toLowerCase() === currentUser.email.toLowerCase())
    );

    // If none found by strict match, fallback to any business if user is a business owner or recently created
    if (directOwned.length > 0) return directOwned;
    return [];
  }, [businesses, currentUser]);

  // Selected active business being managed in dashboard
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    userBusinesses[0]?.id || businesses[0]?.id || ''
  );

  const activeBusiness = useMemo(() => {
    return businesses.find((b) => b.id === selectedBusinessId) || userBusinesses[0] || businesses[0];
  }, [businesses, selectedBusinessId, userBusinesses]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'media' | 'contact' | 'location' | 'hours' | 'inquiries' | 'reviews' | 'verification' | 'settings'
  >('overview');

  // Form states for active business
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priceLevel, setPriceLevel] = useState<'$' | '$$' | '$$$' | '$$$$'>('$$');

  // Media
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Contact
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [socials, setSocials] = useState<{
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  }>({});

  // Location
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [digitalAddress, setDigitalAddress] = useState('');

  // Opening Hours
  const [openingHours, setOpeningHours] = useState<OpeningHours>({
    monday: '08:00 - 18:00',
    tuesday: '08:00 - 18:00',
    wednesday: '08:00 - 18:00',
    thursday: '08:00 - 18:00',
    friday: '08:00 - 18:00',
    saturday: '09:00 - 16:00',
    sunday: 'Closed',
  });

  // Services & Features
  const [services, setServices] = useState<string[]>([]);
  const [newServiceInput, setNewServiceInput] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Owner Review Reply state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Unsaved changes tracking
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Sync state when active business changes
  useEffect(() => {
    if (activeBusiness) {
      setName(activeBusiness.name || '');
      setTagline(activeBusiness.tagline || '');
      setCategory(activeBusiness.category || categories[0]?.id || 'services');
      setSubCategory(activeBusiness.subCategory || '');
      setDescription(activeBusiness.description || '');
      setPriceLevel(activeBusiness.priceLevel || '$$');

      setLogo(activeBusiness.logo || '');
      setCoverImage(activeBusiness.coverImage || '');
      setGallery(activeBusiness.gallery || []);

      setPhone(activeBusiness.phone || '');
      setWhatsapp(activeBusiness.whatsapp || '');
      setEmail(activeBusiness.email || '');
      setWebsite(activeBusiness.website || '');
      setSocials(activeBusiness.socials || {});

      setCity(activeBusiness.city || 'Accra');
      setRegion(activeBusiness.region || 'Greater Accra');
      setAddress(activeBusiness.address || '');
      setDigitalAddress(activeBusiness.digitalAddress || '');

      setOpeningHours(
        activeBusiness.openingHours || {
          monday: '08:00 - 18:00',
          tuesday: '08:00 - 18:00',
          wednesday: '08:00 - 18:00',
          thursday: '08:00 - 18:00',
          friday: '08:00 - 18:00',
          saturday: '09:00 - 16:00',
          sunday: 'Closed',
        }
      );

      setServices(activeBusiness.services || ['Customer Support', 'Consultation']);
      setFeatures(activeBusiness.features || ['Official Member', 'Verified Contact']);
      setHasChanges(false);
    }
  }, [activeBusiness, categories]);

  // Real-time GPS verification check for the digital address
  const gpsCheck: GPSVerificationResult = useMemo(() => {
    return verifyGhanaPostGPS(digitalAddress);
  }, [digitalAddress]);

  // Filter inquiries for this business
  const businessInquiries = useMemo(() => {
    if (!activeBusiness) return [];
    return inquiries.filter(
      (inq) => inq.businessId === activeBusiness.id || inq.businessName === activeBusiness.name
    );
  }, [inquiries, activeBusiness]);

  // Filter reviews for this business
  const businessReviews = useMemo(() => {
    if (!activeBusiness) return [];
    return reviews.filter((r) => r.businessId === activeBusiness.id);
  }, [reviews, activeBusiness]);

  // Calculate Profile Completeness Score
  const completeness = useMemo(() => {
    let score = 0;
    const checklist: { label: string; done: boolean; points: number }[] = [];

    const hasName = Boolean(name && name.trim().length > 2);
    checklist.push({ label: 'Business Name & Tagline', done: hasName, points: 15 });
    if (hasName) score += 15;

    const hasDesc = Boolean(description && description.trim().length > 30);
    checklist.push({ label: 'Comprehensive Description (30+ chars)', done: hasDesc, points: 15 });
    if (hasDesc) score += 15;

    const hasLogo = Boolean(logo && !logo.includes('placeholder'));
    checklist.push({ label: 'Brand Logo Uploaded', done: hasLogo, points: 15 });
    if (hasLogo) score += 15;

    const hasCover = Boolean(coverImage && !coverImage.includes('placeholder'));
    checklist.push({ label: 'Cover Banner Photo', done: hasCover, points: 10 });
    if (hasCover) score += 10;

    const hasGallery = Boolean(gallery && gallery.length >= 2);
    checklist.push({ label: 'Gallery Photos (2+ images)', done: hasGallery, points: 15 });
    if (hasGallery) score += 15;

    const hasContacts = Boolean(phone && whatsapp && email);
    checklist.push({ label: 'Full Contact Info (Phone, WhatsApp, Email)', done: hasContacts, points: 15 });
    if (hasContacts) score += 15;

    const hasGPS = Boolean(gpsCheck.isValid || digitalAddress);
    checklist.push({ label: 'GhanaPost GPS Digital Address', done: hasGPS, points: 15 });
    if (hasGPS) score += 15;

    return { score, checklist };
  }, [name, description, logo, coverImage, gallery, phone, whatsapp, email, digitalAddress, gpsCheck]);

  // Handle single image upload (Logo / Cover)
  const handleSingleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB limit. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
      setHasChanges(true);
    };
    reader.onerror = () => {
      setUploadError('Failed to process image file from your device.');
    };
    reader.readAsDataURL(file);
  };

  // Handle multi-gallery photos upload
  const handleMultiGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];
    let processed = 0;
    const total = files.length;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          newPhotos.push(reader.result as string);
        }
        processed++;
        if (processed === total) {
          setGallery((prev) => [...prev, ...newPhotos]);
          setHasChanges(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Save all profile changes
  const handleSaveAll = () => {
    if (!activeBusiness) return;
    setIsSaving(true);

    const nowIso = new Date().toISOString();
    const updatedCoordinates = gpsCheck.isValid && gpsCheck.approxCoordinates
      ? gpsCheck.approxCoordinates
      : activeBusiness.coordinates || { lat: 5.6037, lng: -0.1870 };

    const updatedBiz: Business = {
      ...activeBusiness,
      name: name.trim() || activeBusiness.name,
      tagline: tagline.trim() || activeBusiness.tagline,
      category,
      subCategory: subCategory.trim() || undefined,
      description: description.trim() || activeBusiness.description,
      priceLevel,
      logo: logo || activeBusiness.logo,
      coverImage: coverImage || activeBusiness.coverImage,
      gallery: gallery.length > 0 ? gallery : activeBusiness.gallery,
      phone: phone.trim() || activeBusiness.phone,
      whatsapp: whatsapp.trim() || activeBusiness.whatsapp,
      email: email.trim() || activeBusiness.email,
      website: website.trim() || undefined,
      socials,
      city: city.trim() || activeBusiness.city,
      region: gpsCheck.isValid ? gpsCheck.regionName.replace(' Region', '') : region,
      address: address.trim() || activeBusiness.address,
      digitalAddress: gpsCheck.isValid ? gpsCheck.formattedAddress : (digitalAddress.trim() || activeBusiness.digitalAddress),
      coordinates: updatedCoordinates,
      openingHours,
      services: services.length > 0 ? services : activeBusiness.services,
      features: features.length > 0 ? features : activeBusiness.features,
      ownerId: currentUser.id,
      ownerEmail: currentUser.email,
      updatedAt: nowIso,
    };

    onUpdateBusiness(updatedBiz);
    setHasChanges(false);

    setTimeout(() => {
      setIsSaving(false);
      onShowToast(
        'Profile Saved Successfully!',
        `${updatedBiz.name} profile updates are now live on AuraCentra Ghana.`,
        'success'
      );
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 400);
  };

  // Add Service Tag
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceInput.trim()) return;
    if (!services.includes(newServiceInput.trim())) {
      setServices((prev) => [...prev, newServiceInput.trim()]);
      setHasChanges(true);
    }
    setNewServiceInput('');
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setServices((prev) => prev.filter((s) => s !== serviceToRemove));
    setHasChanges(true);
  };

  // Add Feature Chip
  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureInput.trim()) return;
    if (!features.includes(newFeatureInput.trim())) {
      setFeatures((prev) => [...prev, newFeatureInput.trim()]);
      setHasChanges(true);
    }
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (featToRemove: string) => {
    setFeatures((prev) => prev.filter((f) => f !== featToRemove));
    setHasChanges(true);
  };

  // Submit Official Owner Reply to a Review
  const handleSubmitOwnerReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    const nowIso = new Date().toISOString();

    // Update the review record in local state and through parent if available
    const targetReview = reviews.find((r) => r.id === reviewId);
    if (targetReview) {
      targetReview.ownerReply = {
        date: nowIso,
        text: replyText.trim(),
      };
      onShowToast(
        'Owner Reply Published',
        'Your official response has been added to the customer review.',
        'success'
      );
      setReplyingReviewId(null);
      setReplyText('');
    }
  };

  // If no business exists yet for this user
  if (!activeBusiness) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 sm:p-10 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Business Owner Portal</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Welcome, <span className="font-bold">{currentUser.name}</span>. You don't have an enlisted business profile linked to your account yet.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={onBackToPortal}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              List Your Business Now
            </button>
            <button
              type="button"
              onClick={onBackToPortal}
              className="w-full py-2.5 px-4 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ← Back to Discovery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col" id="business-admin-dashboard">
      
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <button
              type="button"
              onClick={onBackToPortal}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Return to Public Portal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <Logo size="sm" showTagline={false} />
              <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 text-[11px] font-black uppercase tracking-wider">
                  Business Admin Desk
                </span>
              </div>
            </div>
          </div>

          {/* Business Selector (if user owns multiple) & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {userBusinesses.length > 1 && (
              <select
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
              >
                {userBusinesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}

            {/* Live Profile Preview Button */}
            <button
              type="button"
              onClick={() => onOpenLivePreview?.(activeBusiness)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>View Public Profile</span>
            </button>

            {/* Save All Changes Button */}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : hasChanges ? 'Save Changes *' : 'Save Updates'}</span>
            </button>

            {/* Sign out */}
            <button
              type="button"
              onClick={onSignOut}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Business Overview Hero Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 min-w-0">
              {/* Logo Preview */}
              <div className="relative group shrink-0">
                <img
                  src={logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80'}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold transition-opacity cursor-pointer"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Change</span>
                </button>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={(e) => handleSingleImageUpload(e, setLogo)}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Name, Tagline, Verification Pill */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                    {name || activeBusiness.name}
                  </h1>
                  {activeBusiness.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{activeBusiness.verificationDetails?.badgeType || 'Verified Business'}</span>
                    </span>
                  ) : activeBusiness.verificationStatus === 'pending' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pending Admin Verification</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                      <span>Standard Listing</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xl">
                  {tagline || activeBusiness.tagline || `${city}, ${region}`}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{city || 'Ghana'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeBusiness.rating || 5.0}</span>
                    <span>({activeBusiness.reviewCount || 0} reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeBusiness.views || 1} views</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Shortcut */}
            {activeBusiness.verificationStatus === 'verified' && (
              <button
                type="button"
                onClick={() => onOpenCertificateModal?.(activeBusiness)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Verified Certificate</span>
              </button>
            )}

          </div>

          {/* 3. Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Performance', icon: TrendingUp },
              { id: 'profile', label: 'Edit Profile & Services', icon: Sliders },
              { id: 'media', label: 'Photos & Gallery', icon: ImageIcon },
              { id: 'contact', label: 'Contact & Socials', icon: Phone },
              { id: 'location', label: 'Location & GPS', icon: MapPin },
              { id: 'hours', label: 'Opening Hours', icon: Clock },
              { id: 'inquiries', label: `Inquiries & Leads (${businessInquiries.length})`, icon: MessageSquare },
              { id: 'reviews', label: `Reviews (${businessReviews.length})`, icon: Star },
              { id: 'verification', label: 'Verification Center', icon: ShieldCheck },
              { id: 'settings', label: 'Settings & Deletion', icon: Trash2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDanger = tab.id === 'settings';
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? isDanger ? 'bg-rose-600 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                      : isDanger
                      ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 4. Tab Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Views</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {activeBusiness.views || 1}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  Active directory discovery
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Direct Inquiries</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {businessInquiries.length}
                </div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-1">
                  Quotes & lead requests
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {activeBusiness.rating || 5.0}
                </div>
                <div className="text-[11px] text-slate-500 font-bold mt-1">
                  Based on {activeBusiness.reviewCount || 0} reviews
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Trust Badge</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                  {activeBusiness.verificationDetails?.badgeType || (activeBusiness.verificationStatus === 'verified' ? 'Verified' : 'Under Review')}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  Ghana Verified Desk
                </div>
              </div>
            </div>

            {/* Profile Completeness Checklist */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Profile Completeness Score
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    High completeness boosts your business rank in discovery search results.
                  </p>
                </div>
                <span className="text-xl font-black text-blue-600 dark:text-cyan-400">
                  {completeness.score}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full transition-all duration-500 ${
                    completeness.score >= 85 ? 'bg-emerald-500' : completeness.score >= 60 ? 'bg-blue-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${completeness.score}%` }}
                />
              </div>

              {/* Checklist Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                {completeness.checklist.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs transition-colors ${
                      item.done
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      item.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {item.done ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </div>
                    <span className="font-semibold truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-left transition-all group cursor-pointer shadow-xs"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Edit Profile & Services</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Update business name, category, description, and list your specialized services.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-left transition-all group cursor-pointer shadow-xs"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Manage Photos & Gallery</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload high-res logos, cover banner, and showcase your workplace or products.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-left transition-all group cursor-pointer shadow-xs"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Contact & WhatsApp Desk</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ensure phone numbers and WhatsApp links are up to date for customer calls.
                </p>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: EDIT PROFILE & SERVICES */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                General Business Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update how your enterprise appears in search results and category directory.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="e.g. Accra Premier Logistics"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => {
                    setTagline(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="e.g. Reliable Freight & Same-Day Delivery Across Ghana"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Price Level Tier
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['$', '$$', '$$$', '$$$$'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => {
                        setPriceLevel(tier);
                        setHasChanges(true);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all border ${
                        priceLevel === tier
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Business Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setHasChanges(true);
                }}
                placeholder="Describe your products, background, team experience, delivery areas, and unique value proposition..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Services Offered Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Services & Products Offered</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add key offerings for customers to search.</p>
                </div>
              </div>

              <form onSubmit={handleAddService} className="flex gap-2">
                <input
                  type="text"
                  value={newServiceInput}
                  onChange={(e) => setNewServiceInput(e.target.value)}
                  placeholder="e.g. Express Courier, Warehousing, Corporate Logistics"
                  className="flex-1 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-1">
                {services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 text-xs font-semibold border border-blue-200/80 dark:border-blue-800/80"
                  >
                    <span>{srv}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(srv)}
                      className="text-blue-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Features & Highlights */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Business Features & Amenities</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Highlights displayed on your business card.</p>
              </div>

              <form onSubmit={handleAddFeature} className="flex gap-2">
                <input
                  type="text"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  placeholder="e.g. Free Wi-Fi, Mobile Money Accepted, 24/7 Support"
                  className="flex-1 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-1">
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feat)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PHOTOS & MEDIA (GALLERY MANAGEMENT) */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {uploadError && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Logo and Cover Banner Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Brand Logo Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Business Logo</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Square avatar (1:1 aspect ratio)</p>
                </div>

                <div className="relative group w-32 h-32 mx-auto rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md">
                  <img
                    src={logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=300&auto=format&fit=crop&q=80'}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs font-bold transition-opacity cursor-pointer"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    <span>Upload New</span>
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    Select Logo File
                  </button>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={(e) => handleSingleImageUpload(e, setLogo)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Cover Banner Card */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Cover Banner Image</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Wide header photo displayed on your listing page</p>
                </div>

                <div className="relative group w-full h-36 sm:h-44 rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md">
                  <img
                    src={coverImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'}
                    alt="Cover"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs font-bold transition-opacity cursor-pointer"
                  >
                    <Upload className="w-6 h-6 mb-1" />
                    <span>Upload Cover Banner</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Recommended: 1200x500 PNG or JPG</span>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    Change Cover Photo
                  </button>
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={(e) => handleSingleImageUpload(e, setCoverImage)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

            </div>

            {/* Photo Gallery Management */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Showcase Photo Gallery ({gallery.length} photos)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload photos of your storefront, menu, staff, and completed projects from your device gallery.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Photos from Device</span>
                </button>
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleMultiGalleryUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Gallery Grid */}
              {gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map((photoUrl, index) => (
                    <div
                      key={index}
                      className="relative group rounded-2xl overflow-hidden aspect-4/3 border border-slate-200 dark:border-slate-800 shadow-xs bg-slate-100 dark:bg-slate-800"
                    >
                      <img
                        src={photoUrl}
                        alt={`Gallery ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                        <span className="text-[10px] text-white font-bold">Photo #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setGallery((prev) => prev.filter((_, idx) => idx !== index));
                            setHasChanges(true);
                          }}
                          className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No gallery photos added yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                  >
                    Select Images from Gallery
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: CONTACT & SOCIALS */}
        {activeTab === 'contact' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Direct Contact & Communication Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ensure customers can reach your executive desk and customer support immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setHasChanges(true);
                    }}
                    placeholder="e.g. 024 000 0000 or +233 24 000 0000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  WhatsApp Business Number *
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => {
                      setWhatsapp(e.target.value);
                      setHasChanges(true);
                    }}
                    placeholder="e.g. 233508203673"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Business Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setHasChanges(true);
                    }}
                    placeholder="e.g. info@business.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Website URL (Optional)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => {
                      setWebsite(e.target.value);
                      setHasChanges(true);
                    }}
                    placeholder="e.g. https://www.yourbusiness.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Channels */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Social Media Links</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Connect with clients across platforms.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Instagram Handle / URL
                  </label>
                  <input
                    type="text"
                    value={socials.instagram || ''}
                    onChange={(e) => {
                      setSocials((prev) => ({ ...prev, instagram: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="@yourbusiness"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Facebook Page
                  </label>
                  <input
                    type="text"
                    value={socials.facebook || ''}
                    onChange={(e) => {
                      setSocials((prev) => ({ ...prev, facebook: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="facebook.com/yourpage"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    LinkedIn / Twitter / TikTok
                  </label>
                  <input
                    type="text"
                    value={socials.linkedin || ''}
                    onChange={(e) => {
                      setSocials((prev) => ({ ...prev, linkedin: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="linkedin.com/company/yourbusiness"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: LOCATION & GHANAPOST GPS */}
        {activeTab === 'location' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Physical Location & GhanaPost GPS
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pinpoint your premises accurately so customers and couriers can find you without stress.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  City / Town *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="e.g. Accra, Kumasi, Tema, Takoradi"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Region *
                </label>
                <select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {[
                    'Greater Accra',
                    'Ashanti',
                    'Western',
                    'Central',
                    'Eastern',
                    'Volta',
                    'Northern',
                    'Upper East',
                    'Upper West',
                    'Bono',
                    'Bono East',
                    'Ahafo',
                    'Oti',
                    'Savannah',
                    'North East',
                    'Western North',
                  ].map((r) => (
                    <option key={r} value={r}>
                      {r} Region
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Street Address & Landmark *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="e.g. 14 Oxford Street, Near Shell Filling Station, Osu"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* GhanaPost GPS Validator */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      GhanaPost GPS Digital Address
                    </span>
                  </div>
                  {gpsCheck.isValid ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                      ✓ Valid {gpsCheck.regionName}
                    </span>
                  ) : digitalAddress ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Format: GA-183-9021
                    </span>
                  ) : null}
                </div>

                <input
                  type="text"
                  value={digitalAddress}
                  onChange={(e) => {
                    setDigitalAddress(e.target.value.toUpperCase());
                    setHasChanges(true);
                  }}
                  placeholder="e.g. GA-183-9021 or AK-039-4821"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm tracking-wider font-bold"
                />

                {gpsCheck.isValid && (
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      GPS Coordinates mapped: Lat {gpsCheck.approxCoordinates?.lat.toFixed(4)}, Lng {gpsCheck.approxCoordinates?.lng.toFixed(4)} ({gpsCheck.regionName})
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: OPENING HOURS */}
        {activeTab === 'hours' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Business Working Hours
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Let customers know when you are open for visits, walk-ins, and calls.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpeningHours({
                    monday: '08:00 - 18:00',
                    tuesday: '08:00 - 18:00',
                    wednesday: '08:00 - 18:00',
                    thursday: '08:00 - 18:00',
                    friday: '08:00 - 18:00',
                    saturday: '09:00 - 16:00',
                    sunday: 'Closed',
                  });
                  setHasChanges(true);
                  onShowToast('Standard Hours Applied', 'Monday to Friday 08:00-18:00 applied.', 'info');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Set Standard Mon-Sat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                <div key={day} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-xs font-bold capitalize text-slate-800 dark:text-slate-200 w-28">
                    {day}
                  </span>
                  <input
                    type="text"
                    value={openingHours[day] || '08:00 - 18:00'}
                    onChange={(e) => {
                      setOpeningHours((prev) => ({ ...prev, [day]: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="e.g. 08:00 - 18:00 or Closed"
                    className="flex-1 max-w-[200px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-right"
                  />
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 7: INQUIRIES & LEADS HUB */}
        {activeTab === 'inquiries' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Customer Inquiries & Quote Leads ({businessInquiries.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real customer quote requests sent directly to {activeBusiness.name}.
              </p>
            </div>

            {businessInquiries.length > 0 ? (
              <div className="space-y-4">
                {businessInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{inq.clientName}</div>
                        <div className="text-xs text-slate-500">{inq.clientPhone} • {inq.clientEmail}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inq.status === 'new'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300'
                            : inq.status === 'contacted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {inq.status.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold">Requested Service:</span> {inq.serviceRequested}
                      {inq.budgetRange && <span className="ml-2 font-bold text-emerald-600">• Budget: {inq.budgetRange}</span>}
                    </div>

                    {inq.message && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        "{inq.message}"
                      </p>
                    )}

                    {/* Quick Reply Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      {inq.clientPhone && (
                        <a
                          href={`https://wa.me/${inq.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${inq.clientName}, regarding your inquiry for ${activeBusiness.name} on AuraCentra Ghana:`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Reply</span>
                        </a>
                      )}

                      {inq.clientPhone && (
                        <a
                          href={`tel:${inq.clientPhone}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Client</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-400" />
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No Inquiries Received Yet</div>
                <p className="text-xs text-slate-500">When visitors request quotes, they will appear right here.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: CUSTOMER REVIEWS & OWNER REPLIES */}
        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Customer Reviews & Reputation ({businessReviews.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Read customer ratings and publish official verified business replies.
              </p>
            </div>

            {businessReviews.length > 0 ? (
              <div className="space-y-4">
                {businessReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">{rev.userName}</div>
                          <div className="flex items-center gap-1 text-[11px] text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(rev.date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {rev.comment}
                    </p>

                    {/* Existing Owner Reply */}
                    {rev.ownerReply && (
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-xs space-y-1">
                        <div className="font-bold text-blue-700 dark:text-cyan-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Official Response from {activeBusiness.name}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 italic">{rev.ownerReply.text}</p>
                      </div>
                    )}

                    {/* Write Owner Reply Form */}
                    {!rev.ownerReply && (
                      <div className="pt-2">
                        {replyingReviewId === rev.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a professional reply to your customer..."
                              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSubmitOwnerReply(rev.id)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                <span>Publish Reply</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingReviewId(null);
                                  setReplyText('');
                                }}
                                className="px-3 py-1.5 rounded-xl text-slate-500 text-xs font-bold"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingReviewId(rev.id);
                              setReplyText('');
                            }}
                            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reply to Customer as Business Owner</span>
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                <Star className="w-10 h-10 mx-auto text-amber-400" />
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No Reviews Yet</div>
                <p className="text-xs text-slate-500">Satisfied customers can rate and review your business.</p>
              </div>
            )}

          </div>
        )}

        {/* TAB 9: VERIFICATION CENTER */}
        {activeTab === 'verification' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Official Verification & Trust Badge
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official AuraCentra Ghana verification confirms your business registration and physical presence.
              </p>
            </div>

            {/* Current Status Card */}
            <div className="p-6 rounded-3xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                    Status: {activeBusiness.verificationStatus.toUpperCase()}
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {activeBusiness.verificationDetails?.badgeType || 'Gold Enterprise Verification'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Verified ID, GhanaPost GPS & Registered Business Cert
                  </div>
                </div>
              </div>

              {activeBusiness.verificationStatus === 'verified' && (
                <button
                  type="button"
                  onClick={() => onOpenCertificateModal?.(activeBusiness)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <Award className="w-4 h-4" />
                  <span>Download Official Certificate</span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* TAB 10: SETTINGS & DELETION */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Danger Zone: Delete Single Business Listing */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Delete Business Listing: {activeBusiness.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Remove this specific business from AuraCentra Ghana while keeping your user account active.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <p>
                  Removing <strong>{activeBusiness.name}</strong> will delete its public page, logo, photos, GPS digital address, customer reviews, and leads from the directory.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to permanently delete "${activeBusiness.name}" from AuraCentra Ghana? This cannot be undone.`)) {
                      if (onDeleteBusiness) {
                        onDeleteBusiness(activeBusiness.id);
                      } else {
                        onShowToast('Business Deleted', `${activeBusiness.name} has been removed.`, 'info');
                      }
                    }
                  }}
                  className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Listing "{activeBusiness.name}"</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: Delete Entire Business Owner Account */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-rose-200 dark:border-rose-900/60 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tracking-tight">
                    Permanently Delete Business Account & All Data
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Permanently wipe your user login ({currentUser.email}), personal credentials, and all registered businesses.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300 space-y-2">
                <p className="font-bold">Important Notice:</p>
                <p>
                  This will completely delete your account from AuraCentra Ghana. You will immediately be signed out, and all associated enterprise profiles, customer reviews, and inquiries will be permanently purged.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAccountSettings) {
                      onOpenAccountSettings();
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Open Permanent Account Deletion Modal</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
