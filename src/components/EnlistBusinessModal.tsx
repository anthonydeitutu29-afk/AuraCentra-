import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Trash2,
  Plus,
  Lock,
  Eye,
  Camera,
  Layers,
  Clock,
  ExternalLink,
  Save
} from 'lucide-react';

interface EnlistBusinessModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess: (businessId?: string) => void;
  onOpenDashboard?: (businessId: string) => void;
  asPage?: boolean;
}

const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Western North',
  'Central',
  'Eastern',
  'Volta',
  'Oti',
  'Northern',
  'Savannah',
  'North East',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
];

const BUSINESS_CATEGORIES = [
  'Restaurants & Food',
  'Fashion & Beauty',
  'Automotive & Transport',
  'Home & Living',
  'Electronics & Gadgets',
  'Services & Repairs',
  'Real Estate & Property',
  'Shopping & Retail',
  'Health & Wellness',
  'Education & Training',
  'Business & Professional',
  'Technology',
  'Entertainment',
  'Agriculture',
  'Travel & Tourism',
  'Other',
];

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Limited Liability Company (LLC)',
  'Partnership',
  'Enterprise',
  'Cooperative',
  'Non-Profit / NGO',
  'Other'
];

const STEPS = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Business' },
  { id: 3, label: 'Location' },
  { id: 4, label: 'Media' },
  { id: 5, label: 'Offerings' },
  { id: 6, label: 'Contact' },
  { id: 7, label: 'Verify' },
  { id: 8, label: 'Review' },
  { id: 9, label: 'Submit' }
];

export const EnlistBusinessModal: React.FC<EnlistBusinessModalProps> = ({
  isOpen = true,
  onClose,
  onSuccess,
  onOpenDashboard,
  asPage = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // STEP 1: Account
  const [ownerFullName, setOwnerFullName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // STEP 2: Business Info
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Sole Proprietorship');
  const [description, setDescription] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState('Technology');
  const [additionalCategories, setAdditionalCategories] = useState<string[]>([]);
  const [sector, setSector] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [employeesCount, setEmployeesCount] = useState('1-10');
  const [businessPhone, setBusinessPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // STEP 3: Location
  const [region, setRegion] = useState('Greater Accra');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [streetDescription, setStreetDescription] = useState('');
  const [ghanaPostGps, setGhanaPostGps] = useState('');
  const [latitude, setLatitude] = useState(5.6037);
  const [longitude, setLongitude] = useState(-0.1870);

  // STEP 4: Media & Socials
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    tiktok: '',
    x: '',
    linkedin: '',
    youtube: '',
  });

  // STEP 5: Products & Services
  const [items, setItems] = useState<Array<{
    id: string;
    type: 'product' | 'service';
    name: string;
    description: string;
    price: string;
  }>>([
    { id: 'item-1', type: 'service', name: 'Primary Service Consultation', description: 'Comprehensive consultation and direct service delivery', price: 'GH₵ 150.00' }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'product' | 'service'>('product');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // STEP 6: Contact & Hours
  const [contactChannels, setContactChannels] = useState({
    phone: true,
    whatsapp: true,
    email: true,
    website: true,
    social: true,
  });
  const [openingHours, setOpeningHours] = useState('Mon - Fri: 8:00 AM - 5:00 PM');
  const [acceptEnquiries, setAcceptEnquiries] = useState(true);

  // STEP 7: Verification (Private)
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [ghanaCardNumber, setGhanaCardNumber] = useState('');
  const [proofOfAddress, setProofOfAddress] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  // STEP 9: Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // STEP 10: Submission Success State
  const [submittedData, setSubmittedData] = useState<{
    submissionId: string;
    businessId: string;
    businessName: string;
    submissionDate: string;
  } | null>(null);

  // Auto-fill owner info into business contact by default
  const handleAutoFillContact = () => {
    if (!businessPhone) setBusinessPhone(ownerPhone);
    if (!whatsappNumber) setWhatsappNumber(ownerPhone);
    if (!businessEmail) setBusinessEmail(ownerEmail);
  };

  // Restore saved draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('auracentra_enlistment_draft');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.businessName) setBusinessName(d.businessName);
        if (d.ownerFullName) setOwnerFullName(d.ownerFullName);
        if (d.ownerEmail) setOwnerEmail(d.ownerEmail);
        if (d.ownerPhone) setOwnerPhone(d.ownerPhone);
        if (d.city) setCity(d.city);
        if (d.region) setRegion(d.region);
      }
    } catch {}
  }, []);

  const handleSaveDraft = () => {
    try {
      const draft = {
        businessName,
        ownerFullName,
        ownerEmail,
        ownerPhone,
        region,
        city,
        area,
        primaryCategory,
        description,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('auracentra_enlistment_draft', JSON.stringify(draft));
      alert('Enlistment progress saved! You can resume anytime.');
    } catch {}
  };

  if (!isOpen) return null;

  // Add Item
  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        type: newItemType,
        name: newItemName.trim(),
        description: newItemDesc.trim(),
        price: newItemPrice.trim()
      }
    ]);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Final Submission to Backend
  const handleFinalSubmit = async () => {
    if (!declarationAccepted) {
      setSubmissionError('Please confirm the legal declaration before submitting.');
      return;
    }

    setLoading(true);
    setSubmissionError(null);

    const payload = {
      ownerFullName,
      ownerEmail,
      ownerPhone,
      name: businessName,
      businessType,
      description,
      category: primaryCategory,
      additionalCategories,
      sector: sector || primaryCategory,
      yearEstablished,
      employeesCount,
      phone: businessPhone || ownerPhone,
      whatsapp: whatsappNumber || businessPhone,
      email: businessEmail || ownerEmail,
      website: websiteUrl,
      region,
      city,
      area: area || city,
      streetDescription,
      ghanaPostGps,
      latitude,
      longitude,
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      photos,
      socialLinks,
      productsAndServices: items,
      contactChannels,
      openingHours,
      acceptEnquiries,
      registrationNumber,
      ghanaCardNumber,
      proofOfAddress,
      verificationNotes
    };

    try {
      const res = await fetch('/api/enlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmissionError(data.error || 'Failed to submit business listing.');
      } else {
        localStorage.removeItem('auracentra_enlistment_draft');
        setSubmittedData({
          submissionId: data.submissionId,
          businessId: data.businessId,
          businessName: data.businessName,
          submissionDate: data.submissionDate
        });
        setCurrentStep(10); // STEP 10 SUCCESS
        onSuccess(data.businessId);
      }
    } catch {
      setSubmissionError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!asPage && !isOpen) return null;

  const cardContent = (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl max-w-4xl w-full flex flex-col overflow-hidden ${asPage ? 'shadow-sm' : 'max-h-[92vh] shadow-2xl my-auto animate-in zoom-in-95'}`}>
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                AuraCentra Business Enlistment
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official Ghanaian Digital Business Onboarding System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 10 && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                title="Save draft"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Progress</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-step Progress Bar (Steps 1 to 9) */}
        {currentStep <= 9 && (
          <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none shrink-0">
            <div className="flex items-center justify-between min-w-[620px] gap-2">
              {STEPS.map((s) => {
                const isPassed = currentStep > s.id;
                const isCurrent = currentStep === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => isPassed && setCurrentStep(s.id)}
                    disabled={!isPassed && !isCurrent}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                      isCurrent
                        ? 'text-blue-600 dark:text-blue-400'
                        : isPassed
                        ? 'text-emerald-600 dark:text-emerald-400 cursor-pointer'
                        : 'text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {isPassed ? <Check className="w-3 h-3" /> : s.id}
                    </span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {submissionError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 1: CREATE BUSINESS ACCOUNT */}
          {/* ==================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Create Your Business Account
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Join AuraCentra and make your business easier to discover across Ghana and worldwide.
                </p>
              </div>

              {/* Quick Google Option */}
              <button
                type="button"
                onClick={() => {
                  setOwnerFullName('Kwame Boateng');
                  setOwnerEmail('kwame.enterprise@gmail.com');
                  setOwnerPhone('+233 24 555 0192');
                  setTermsAccepted(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative text-center">
                <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 relative z-10">or register with email</span>
                <div className="absolute inset-0 top-1/2 border-t border-slate-200 dark:border-slate-800" />
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Business Owner's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerFullName}
                    onChange={e => setOwnerFullName(e.target.value)}
                    placeholder="e.g. Samuel Kojo Mensah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      onChange={e => setOwnerEmail(e.target.value)}
                      placeholder="owner@business.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={ownerPhone}
                      onChange={e => setOwnerPhone(e.target.value)}
                      placeholder="+233 24 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="termsAccept"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="termsAccept" className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                    I agree to AuraCentra's <span className="text-blue-600 font-bold">Terms & Conditions</span> and <span className="text-blue-600 font-bold">Privacy Policy</span>.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: BUSINESS INFORMATION */}
          {/* ==================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Tell Us About Your Business
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provide core identity and industry details for your directory presence.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Asanka Local Kitchen Osu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Business Legal Structure *
                  </label>
                  <select
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-hidden cursor-pointer"
                  >
                    {BUSINESS_TYPES.map(bt => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Business Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe what makes your business unique, your specialities, customer offerings, and brand promise..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Business Category *
                  </label>
                  <select
                    value={primaryCategory}
                    onChange={e => setPrimaryCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-hidden cursor-pointer"
                  >
                    {BUSINESS_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Business Sector *
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    placeholder="e.g. Hospitality & Food Services"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Year Established
                  </label>
                  <input
                    type="text"
                    value={yearEstablished}
                    onChange={e => setYearEstablished(e.target.value)}
                    placeholder="e.g. 2018"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Number of Employees (Optional)
                  </label>
                  <select
                    value={employeesCount}
                    onChange={e => setEmployeesCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="1-5">1-5 Employees</option>
                    <option value="5-15">5-15 Employees</option>
                    <option value="15-50">15-50 Employees</option>
                    <option value="50+">50+ Employees</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Business Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={businessPhone}
                    onChange={e => setBusinessPhone(e.target.value)}
                    placeholder="+233 30 222 3344"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value)}
                    placeholder="+233 24 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={e => setBusinessEmail(e.target.value)}
                    placeholder="contact@company.com.gh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={e => setWebsiteUrl(e.target.value)}
                    placeholder="https://company.com.gh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: BUSINESS LOCATION */}
          {/* ==================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Where Is Your Business Located?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Accurate location information helps customers discover your business.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ghana Region *
                  </label>
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-hidden cursor-pointer"
                  >
                    {GHANA_REGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Accra, Kumasi, Takoradi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Area / Community *
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    placeholder="e.g. Osu, East Legon, Ahodwo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    GhanaPost GPS / Digital Address *
                  </label>
                  <input
                    type="text"
                    value={ghanaPostGps}
                    onChange={e => setGhanaPostGps(e.target.value.toUpperCase())}
                    placeholder="e.g. GA-183-9021"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Street & Landmark Description
                  </label>
                  <input
                    type="text"
                    value={streetDescription}
                    onChange={e => setStreetDescription(e.target.value)}
                    placeholder="e.g. Oxford Street, Opposite TotalEnergies station"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Interactive Location Pin Placement Simulation */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200/80 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Interactive Location Coordinates Pin</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Lat: {latitude.toFixed(4)}, Long: {longitude.toFixed(4)}
                  </span>
                </div>
                <div className="relative aspect-21/9 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded shadow-xs">
                      {businessName || 'Business Location Pin'} ({city || region})
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Note: Do not expose private residential information unless intentionally intended as your public customer venue.
                </p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: BUSINESS MEDIA & SOCIALS */}
          {/* ==================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Show Customers Your Business
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload official brand imagery and connect your public social channels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Logo Upload Simulation */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Business Logo (PNG, JPG max 5MB)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={e => setLogoUrl(e.target.value)}
                      placeholder="Image URL or upload..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Cover Image Upload Simulation */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Cover Banner Image (1200x600 recommended)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                      {coverImage ? (
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={e => setCoverImage(e.target.value)}
                      placeholder="Cover URL or upload..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Connect Your Social Media
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Facebook</label>
                    <input
                      type="url"
                      value={socialLinks.facebook}
                      onChange={e => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                      placeholder="https://facebook.com/yourbusiness"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Instagram</label>
                    <input
                      type="url"
                      value={socialLinks.instagram}
                      onChange={e => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="https://instagram.com/yourbusiness"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">TikTok</label>
                    <input
                      type="url"
                      value={socialLinks.tiktok}
                      onChange={e => setSocialLinks(prev => ({ ...prev, tiktok: e.target.value }))}
                      placeholder="https://tiktok.com/@yourbusiness"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">X (Twitter)</label>
                    <input
                      type="url"
                      value={socialLinks.x}
                      onChange={e => setSocialLinks(prev => ({ ...prev, x: e.target.value }))}
                      placeholder="https://x.com/yourbusiness"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={socialLinks.linkedin}
                      onChange={e => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/company/yourbusiness"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">YouTube</label>
                    <input
                      type="url"
                      value={socialLinks.youtube}
                      onChange={e => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                      placeholder="https://youtube.com/@yourbusiness"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 5: PRODUCTS & SERVICES */}
          {/* ==================================================== */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  What Do You Offer?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add products or services your enterprise provides. Prices are optional.
                </p>
              </div>

              {/* Add form */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">
                  + Add Product or Service
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Type</label>
                    <select
                      value={newItemType}
                      onChange={e => setNewItemType(e.target.value as 'product' | 'service')}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="product">Product</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Name *</label>
                    <input
                      type="text"
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      placeholder="e.g. Banku with Tilapia or Solar Panel Installation"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={newItemDesc}
                      onChange={e => setNewItemDesc(e.target.value)}
                      placeholder="Brief details..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Price / Range (Optional)</label>
                    <input
                      type="text"
                      value={newItemPrice}
                      onChange={e => setNewItemPrice(e.target.value)}
                      placeholder="e.g. GH₵ 80 or Free Estimate"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add to Offerings
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                  Current Offerings ({items.length})
                </span>
                {items.map(item => (
                  <div key={item.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.price && <span className="font-bold text-emerald-600 font-mono">{item.price}</span>}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 6: CONTACT AND BUSINESS HOURS */}
          {/* ==================================================== */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Contact Channels & Operating Hours
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control how clients can communicate with you and specify availability.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Allowed Customer Contact Methods:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {['phone', 'whatsapp', 'email', 'website', 'social'].map(ch => (
                      <label key={ch} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(contactChannels as any)[ch]}
                          onChange={e => setContactChannels(prev => ({ ...prev, [ch]: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="capitalize font-bold text-slate-800 dark:text-slate-200">{ch}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Operating Days & Hours *
                  </label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={e => setOpeningHours(e.target.value)}
                    placeholder="e.g. Mon - Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Accept customer enquiries through AuraCentra</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Receive verified customer quotes and messages in your Business Dashboard.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={acceptEnquiries}
                    onChange={e => setAcceptEnquiries(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 7: BUSINESS VERIFICATION (CONFIDENTIAL) */}
          {/* ==================================================== */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Verify Your Business
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  To maintain AuraCentra's trusted directory, submissions go through administrative review before appearing publicly.
                </p>
              </div>

              {/* Important Privacy Guarantee Callout */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <strong>Information Separated for Security:</strong>
                  <p className="leading-relaxed">
                    Private verification documents (Ghana Card, certificates) are kept in secure administrative storage and will <strong>NEVER</strong> be displayed on your public business profile.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registrar General's Dept (RGD) / Business Registration Number
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={e => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. CS-09281-2021 or BN-82910-2022"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ghana Card Identification Number (Owner / Director)
                  </label>
                  <input
                    type="text"
                    value={ghanaCardNumber}
                    onChange={e => setGhanaCardNumber(e.target.value)}
                    placeholder="GHA-000000000-0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Proof of Business Location / Additional Verification Notes
                  </label>
                  <textarea
                    rows={3}
                    value={verificationNotes}
                    onChange={e => setVerificationNotes(e.target.value)}
                    placeholder="Enter any additional details, tenancy certificate notes, or municipal license reference..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 8: REVIEW YOUR LISTING */}
          {/* ==================================================== */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Review Your Listing
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Preview your listing exactly as customers across Ghana will see it.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 text-xs font-bold uppercase">
                  Pending Submission
                </span>
              </div>

              {/* Complete Live Preview Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg space-y-4">
                {/* Cover & Logo */}
                <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <img
                    src={coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold">
                    {primaryCategory}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white">
                        {businessName || 'Business Name Here'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{city || 'City'}, {region} • {ghanaPostGps || 'GPS Address'}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-blue-600"
                    >
                      Edit Info
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {description || 'No description provided.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs font-bold">
                    <button type="button" onClick={() => setCurrentStep(3)} className="text-blue-600 hover:underline text-left">
                      Edit Location →
                    </button>
                    <button type="button" onClick={() => setCurrentStep(4)} className="text-blue-600 hover:underline text-left">
                      Edit Media →
                    </button>
                    <button type="button" onClick={() => setCurrentStep(5)} className="text-blue-600 hover:underline text-left">
                      Edit Offerings ({items.length}) →
                    </button>
                    <button type="button" onClick={() => setCurrentStep(7)} className="text-blue-600 hover:underline text-left">
                      Edit Verification →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 9: DECLARATION AND SUBMISSION */}
          {/* ==================================================== */}
          {currentStep === 9 && (
            <div className="space-y-6 max-w-xl mx-auto text-center sm:text-left">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Declaration and Submission
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please review the legal declaration before submitting your enterprise for verification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
                <p>
                  By submitting this application, you declare that all business details, operating addresses, contact channels, and verification documents provided are authentic, true, and legally authorized by the entity.
                </p>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
                  <strong>Important Notice:</strong> Businesses are not automatically verified upon submission. Your application will initially be placed in <strong>PENDING REVIEW</strong> status until vetted by AuraCentra's team.
                </div>
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="finalDeclaration"
                  checked={declarationAccepted}
                  onChange={e => setDeclarationAccepted(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                />
                <label htmlFor="finalDeclaration" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                  I confirm that the information provided is accurate and that I am authorized to submit this business for listing on AuraCentra.
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  disabled={loading || !declarationAccepted}
                  onClick={handleFinalSubmit}
                  className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting for Verification...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Business for Verification</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 10: SUBMISSION SUCCESS */}
          {/* ==================================================== */}
          {currentStep === 10 && submittedData && (
            <div className="space-y-6 text-center max-w-lg mx-auto py-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Your business has been submitted!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Thank you for choosing AuraCentra. Our team will review your submission and verification information before your business is published.
                </p>
              </div>

              {/* Submission Receipt Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div><span className="text-slate-400">Submission ID:</span> <strong className="text-slate-900 dark:text-white font-mono">{submittedData.submissionId}</strong></div>
                <div><span className="text-slate-400">Business Name:</span> <strong className="text-slate-900 dark:text-white">{submittedData.businessName}</strong></div>
                <div><span className="text-slate-400">Submission Date:</span> <strong className="text-slate-900 dark:text-white">{new Date(submittedData.submissionDate).toLocaleString()}</strong></div>
                <div><span className="text-slate-400">Current Status:</span> <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold uppercase text-[10px] border border-amber-500/30">Pending Review</span></div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenDashboard) onOpenDashboard(submittedData.businessId);
                  }}
                  className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Go to Business Dashboard
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  Return to Directory
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls (Steps 1 to 8) */}
        {currentStep <= 8 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/90 shrink-0">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentStep === 1) {
                  if (!ownerFullName || !ownerEmail || !ownerPhone) {
                    setSubmissionError('Please complete required owner details.');
                    return;
                  }
                  if (!termsAccepted) {
                    setSubmissionError('Please accept the Terms & Conditions.');
                    return;
                  }
                  handleAutoFillContact();
                }
                if (currentStep === 2 && !businessName.trim()) {
                  setSubmissionError('Please specify your business name.');
                  return;
                }
                setSubmissionError(null);
                setCurrentStep(prev => Math.min(9, prev + 1));
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
  );

  if (asPage) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-200">
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>
          {currentStep < 10 && (
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Progress</span>
            </button>
          )}
        </div>
        {cardContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {cardContent}
    </div>
  );
};
