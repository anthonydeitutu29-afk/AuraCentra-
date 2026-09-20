import React, { useState, useMemo } from 'react';
import { 
  Building, 
  MapPin, 
  ShieldCheck, 
  Image as ImageIcon, 
  ArrowRight, 
  ArrowLeft,
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Trash2, 
  Plus, 
  X, 
  Globe2, 
  Navigation, 
  CheckCheck,
  Sun,
  Moon,
  Sparkles,
  Phone,
  Mail,
  FileText,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { Business, Category, DocumentType, VerificationDocument, UserProfile } from '../types';
import { verifyGhanaPostGPS } from '../utils/gpsVerification';
import { markBusinessPermanentlyApproved, unmarkBusinessPermanentlyDeleted } from '../utils/storage';
import { compressImageFile } from '../utils/imageCompressor';
import { Logo } from './Logo';
import confetti from 'canvas-confetti';

interface EnlistBusinessPageProps {
  categories: Category[];
  currentUser?: UserProfile | null;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onBackToPortal: () => void;
  onRegisterBusiness: (newBusiness: Business) => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onOpenBusinessDashboard?: () => void;
  onSelectBusiness?: (business: Business) => void;
}

export const EnlistBusinessPage: React.FC<EnlistBusinessPageProps> = ({
  categories,
  currentUser,
  theme = 'light',
  onToggleTheme,
  onBackToPortal,
  onRegisterBusiness,
  onOpenAuth,
  onOpenBusinessDashboard,
  onSelectBusiness,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedBusiness, setSubmittedBusiness] = useState<Business | null>(null);

  // Form Fields - Step 1: Contact & Details
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'restaurants');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone?.replace(/\D/g, '') || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [website, setWebsite] = useState('');

  // Form Fields - Step 2: Location & Address
  const [city, setCity] = useState('Accra');
  const [region, setRegion] = useState('Greater Accra');
  const [address, setAddress] = useState('');
  const [digitalAddress, setDigitalAddress] = useState('');

  // Form Fields - Step 3: Identity Verification
  const [docType, setDocType] = useState<DocumentType>('ghana_card');
  const [docNumber, setDocNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [idUploadError, setIdUploadError] = useState<string | null>(null);

  // Form Fields - Step 4: Gallery & Services
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState('');
  const [services, setServices] = useState<string[]>([
    'Customer Consultation',
    'Direct Support',
    'Verified Services'
  ]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Live GPS Verification computation
  const gpsCheck = useMemo(() => {
    return verifyGhanaPostGPS(digitalAddress);
  }, [digitalAddress]);

  // Image upload handler with web-compression
  const handleSingleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (dataUrl: string | null) => void
  ) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Image size exceeds 20MB limit. Please select a smaller photo.');
      return;
    }

    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.75);
      setter(compressedDataUrl);
    } catch (err) {
      console.warn('Image compression fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
      };
      reader.onerror = () => {
        setUploadError('Failed to read image file from your device.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultiGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).filter((file) => file.type.startsWith('image/'));
    const compressedPhotos: string[] = [];

    for (const file of fileList) {
      try {
        const compressed = await compressImageFile(file, 1200, 1200, 0.75);
        compressedPhotos.push(compressed);
      } catch {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = () => {
            if (reader.result) compressedPhotos.push(reader.result as string);
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(file);
        });
      }
    }

    if (compressedPhotos.length > 0) {
      setGalleryPreviews((prev) => [...prev, ...compressedPhotos]);
    }
  };

  const handleAddService = () => {
    if (serviceInput.trim() && !services.includes(serviceInput.trim())) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput('');
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter((s) => s !== serviceToRemove));
  };

  // Step transitions with comprehensive validation
  const handleProceedStep = (targetStep: 1 | 2 | 3 | 4) => {
    setValidationError(null);

    if (step === 1) {
      if (!name.trim()) {
        setValidationError('Business Name is required to continue.');
        window.scrollTo({ top: 120, behavior: 'smooth' });
        return;
      }
      if (!description.trim()) {
        setValidationError('Please provide a brief business description.');
        window.scrollTo({ top: 160, behavior: 'smooth' });
        return;
      }
      if (!phone.trim()) {
        setValidationError('A contact phone number is required for customer inquiries.');
        window.scrollTo({ top: 200, behavior: 'smooth' });
        return;
      }
    }

    if (step === 2) {
      if (!city.trim()) {
        setValidationError('Please specify the City or Town for your business.');
        window.scrollTo({ top: 120, behavior: 'smooth' });
        return;
      }
      if (!address.trim()) {
        setValidationError('Physical street address or landmark is required.');
        window.scrollTo({ top: 160, behavior: 'smooth' });
        return;
      }
    }

    if (step === 3 && targetStep > 3) {
      if (!frontImagePreview || !backImagePreview) {
        setIdUploadError('Both the FRONT and BACK photos of your Ghana Card are required for verification.');
        setValidationError('Please upload both the front and back photos of your Ghana Card.');
        window.scrollTo({ top: 180, behavior: 'smooth' });
        return;
      }
      setIdUploadError(null);
    }

    setStep(targetStep);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handleSubmitRegistration = () => {
    setValidationError(null);

    if (!name.trim()) {
      setStep(1);
      setValidationError('Business name is required.');
      return;
    }

    if (!frontImagePreview || !backImagePreview) {
      setStep(3);
      setIdUploadError('Both front and back photos of your Ghana Card are required for verification.');
      setValidationError('Both front and back photos of your Ghana Card are required.');
      return;
    }

    const verificationDocs: VerificationDocument[] = [
      {
        id: `doc-${Date.now()}`,
        type: docType,
        documentNumber: docNumber.trim() || 'GH-CARD-VERIFIED',
        holderName: holderName.trim() || name,
        expiryDate: '2032-12-31',
        frontImageUrl: frontImagePreview,
        backImageUrl: backImagePreview,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      }
    ];

    const finalLogo = logoPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
    const finalCover = coverPreview || (galleryPreviews.length > 0 ? galleryPreviews[0] : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80');
    const finalGallery = galleryPreviews.length > 0 ? galleryPreviews : [finalCover];

    const verifiedCoordinates = gpsCheck.isValid && gpsCheck.approxCoordinates
      ? gpsCheck.approxCoordinates
      : { lat: 5.6037, lng: -0.1870 };

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const cleanPhone = phone.trim() || `024${randomSuffix}`;
    const cleanWhatsapp = whatsapp.trim() || phone.trim() || `23324${randomSuffix}`;
    const cleanEmail = email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'contact'}@auracentra-listed.com`;
    const nowIso = new Date().toISOString();

    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || `Verified Business in ${city}`,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      description: description.trim() || `${name.trim()} provides high-quality services and products in ${city}, ${region}.`,
      logo: finalLogo,
      coverImage: finalCover,
      gallery: finalGallery,
      phone: cleanPhone,
      whatsapp: cleanWhatsapp,
      email: cleanEmail,
      website: website.trim() || undefined,
      city,
      region: gpsCheck.isValid ? gpsCheck.regionName.replace(' Region', '') : region,
      address: address.trim() || `${city} Commercial District`,
      digitalAddress: gpsCheck.isValid ? gpsCheck.formattedAddress : (digitalAddress.trim() || 'GA-019-4821'),
      coordinates: verifiedCoordinates,
      priceLevel: '$$',
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: 'pending',
      listingStatus: 'active',
      isApproved: true,
      permanentlyEnlisted: true,
      underInvestigation: false,
      enlistedAt: nowIso,
      isFeatured: false,
      verificationDetails: undefined,
      verificationDocuments: verificationDocs,
      openingHours: {
        monday: '08:00 - 18:00',
        tuesday: '08:00 - 18:00',
        wednesday: '08:00 - 18:00',
        thursday: '08:00 - 18:00',
        friday: '08:00 - 18:00',
        saturday: '09:00 - 16:00',
        sunday: 'Closed',
      },
      services: services.length > 0 ? services : ['Professional Service'],
      features: ['Official AuraCentra Member', 'Direct Contact Verified'],
      views: 1,
      leadsCount: 0,
      ownerId: currentUser?.id || `owner-${Date.now()}`,
      ownerEmail: currentUser?.email || cleanEmail,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    markBusinessPermanentlyApproved(newBiz.id);
    unmarkBusinessPermanentlyDeleted(newBiz.id);
    onRegisterBusiness(newBiz);

    setSubmittedBusiness(newBiz);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {
      // Confetti fallback
    }
  };

  // SUCCESS SUBMISSION SCREEN (DIRECT ON PAGE - NO FLOATING CARD)
  if (isSubmitted && submittedBusiness) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToPortal}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </button>

            <div onClick={onBackToPortal} className="cursor-pointer hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </div>

            <div className="flex items-center gap-2">
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg ring-8 ring-emerald-50 dark:ring-emerald-950/30">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Automatically Enlisted & Live</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                Business Successfully Enlisted!
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                <span className="font-bold text-slate-900 dark:text-white">{submittedBusiness.name}</span> is now active and searchable across all 16 regions of Ghana.
              </p>
            </div>
          </div>

          {/* Submission Details Summary Directly On Background */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs sm:text-sm">
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-black">Enlistment Summary</span>
              <span className="text-slate-400 font-mono text-xs">ID: {submittedBusiness.id}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
              <div><strong>Enterprise Name:</strong> {submittedBusiness.name}</div>
              <div><strong>Category:</strong> {categories.find((c) => c.id === submittedBusiness.category)?.name || submittedBusiness.category}</div>
              <div><strong>Location:</strong> {submittedBusiness.city}, {submittedBusiness.region}</div>
              <div><strong>Phone Number:</strong> {submittedBusiness.phone}</div>
              <div><strong>GPS Digital Address:</strong> <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">{submittedBusiness.digitalAddress}</span></div>
              <div><strong>Listing Status:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active & Live</span></div>
              <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ghana Card (Front & Back) uploaded for Administrative Verification</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {onOpenBusinessDashboard && (
              <button
                type="button"
                onClick={onOpenBusinessDashboard}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Building className="w-4 h-4" />
                <span>Open Business Dashboard</span>
              </button>
            )}

            {onSelectBusiness ? (
              <button
                type="button"
                onClick={() => onSelectBusiness(submittedBusiness)}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span>View My Listing</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onBackToPortal}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Return to Directory</span>
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200" id="enlist-business-page">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToPortal}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          <div onClick={onBackToPortal} className="cursor-pointer hover:opacity-90 transition-opacity">
            <Logo size="md" />
          </div>

          <div className="flex items-center gap-2">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Body Directly On Page Background (No Floating Card / Modal Overlay) */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Page Hero Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100/80 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 shadow-xs">
            <Building className="w-3.5 h-3.5" />
            <span>Ghana Enterprise Registry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
            Enlist Your Business on AuraCentra
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Expand your customer reach across all 16 regions of Ghana. Direct customer contacts, verified GPS coordinates, and verified business profile.
          </p>
        </div>

        {/* Step Progress Tracker Directly On Background */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
            <span className="text-blue-600 dark:text-blue-400">
              Step {step} of 4: {
                step === 1 ? 'Business Contact & Details' :
                step === 2 ? 'Location & GhanaPost GPS' :
                step === 3 ? 'Identity Verification (Ghana Card)' :
                'Direct Gallery Photos & Logo Upload'
              }
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
              {step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%'} Complete
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (s < step) setStep(s as any);
                  else if (s > step) handleProceedStep(s as any);
                }}
                className="group flex flex-col gap-1 cursor-pointer text-left"
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    s <= step
                      ? 'bg-blue-600 dark:bg-blue-500 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
                <span className={`text-[10px] font-semibold truncate hidden sm:block ${
                  s === step ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                }`}>
                  {s === 1 ? '1. Details' : s === 2 ? '2. Location' : s === 3 ? '3. Verification' : '4. Photos'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* Step 1: Business Contact & Details */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tony's Enterprise Hub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Primary Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs transition-all cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Tagline / Catchphrase
              </label>
              <input
                type="text"
                placeholder="e.g. Quality Ghanaian Services & Customer Satisfaction"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Business Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tell potential clients about your services, products, mission, and why they should choose your business..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs transition-all leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0530918381"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0530918381"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. tonysdigitalmarketing@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Website or Social Media Link (Optional)
              </label>
              <input
                type="text"
                placeholder="https://mybusiness.com or https://instagram.com/mybrand"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs transition-all"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location & GhanaPost GPS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  City / Town <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accra, Kumasi, Tema, Takoradi..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Administrative Region <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Greater Accra, Ashanti, Western..."
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Physical Street Address or Landmark <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ring Road Central, Adjacent Shell Station, Osu"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>

            {/* GhanaPost GPS Verification Box directly on background */}
            <div className="p-5 rounded-3xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>GhanaPost GPS Digital Address</span>
                </label>
                <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <Globe2 className="w-3 h-3" />
                  <span>NDPAS Postal Grid</span>
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GA-183-9024 (Accra), AK-039-4921 (Kumasi)"
                  value={digitalAddress}
                  onChange={(e) => setDigitalAddress(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 text-sm font-mono font-bold tracking-wider rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!digitalAddress.trim()) {
                      setDigitalAddress('GA-183-9024');
                      setCity('Accra');
                      setRegion('Greater Accra');
                    } else if (gpsCheck.isValid) {
                      if (!region) setRegion(gpsCheck.regionName.replace(' Region', ''));
                      if (!city) setCity(gpsCheck.districtName.split(' ')[0] || 'Accra');
                    }
                  }}
                  className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Verify GPS</span>
                </button>
              </div>

              {digitalAddress.trim() && (
                <div className={`p-4 rounded-2xl text-xs border transition-all ${
                  gpsCheck.isValid
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}>
                  {gpsCheck.isValid ? (
                    <div className="space-y-2">
                      <div className="font-bold flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Verified GhanaPost GPS Digital Address</span>
                        </div>
                        <span className="text-[10px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                          Ghana Post Verified ✓
                        </span>
                      </div>
                      <div className="text-xs space-y-1 text-emerald-900 dark:text-emerald-300">
                        <div><strong>Administrative Region:</strong> {gpsCheck.regionName} ({gpsCheck.regionCode})</div>
                        <div><strong>Postal District:</strong> {gpsCheck.districtName}</div>
                        <div><strong>National Grid Number:</strong> <span className="font-mono font-bold">{gpsCheck.formattedAddress}</span></div>
                      </div>

                      {(!region || !city) && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setRegion(gpsCheck.regionName.replace(' Region', ''));
                              setCity(gpsCheck.districtName.split(' ')[0] || 'Accra');
                            }}
                            className="text-xs font-bold text-blue-700 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>Auto-fill City & Region from GPS Grid</span>
                            <span>→</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">{gpsCheck.validationMessage}</div>
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                          Format: 2-letter region prefix (GA, AK, VH, WS, CC, EN) + numbers (e.g. GA-183-9024)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Regional Samples */}
              <div className="space-y-1.5 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Regional Grid Samples:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDigitalAddress('GA-183-9024');
                      setCity('Accra');
                      setRegion('Greater Accra');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:border-blue-500 text-blue-600 dark:text-cyan-400 cursor-pointer font-mono font-bold text-xs"
                  >
                    GA-183-9024 (Accra)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDigitalAddress('AK-039-4921');
                      setCity('Kumasi');
                      setRegion('Ashanti');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:border-blue-500 text-blue-600 dark:text-cyan-400 cursor-pointer font-mono font-bold text-xs"
                  >
                    AK-039-4921 (Kumasi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDigitalAddress('WS-201-9922');
                      setCity('Takoradi');
                      setRegion('Western');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:border-blue-500 text-blue-600 dark:text-cyan-400 cursor-pointer font-mono font-bold text-xs"
                  >
                    WS-201-9922 (Takoradi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDigitalAddress('VH-045-8821');
                      setCity('Ho');
                      setRegion('Volta');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:border-blue-500 text-blue-600 dark:text-cyan-400 cursor-pointer font-mono font-bold text-xs"
                  >
                    VH-045-8821 (Volta)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDigitalAddress('CC-102-4019');
                      setCity('Cape Coast');
                      setRegion('Central');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:border-blue-500 text-blue-600 dark:text-cyan-400 cursor-pointer font-mono font-bold text-xs"
                  >
                    CC-102-4019 (Cape Coast)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Identity Verification (Ghana Card) */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                <strong>Mandatory National ID Verification:</strong> Under AuraCentra Ghanaian marketplace standards, you must upload clear photos of <strong>BOTH the front and back</strong> of your official Ghana Card to verify enterprise identity and protect consumers.
              </div>
            </div>

            {idUploadError && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{idUploadError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Select Document Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="ghana_card">Ghana Card (National ID)</option>
                  <option value="voters_id">Voter's ID Card</option>
                  <option value="drivers_license">Driver's License (DVLA)</option>
                  <option value="passport">Ghana Passport</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Ghana Card / ID Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. GHA-729104820-9"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-mono rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Full Legal Name as Shown on ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Anthony Kwesi Mensah"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Direct Gallery Upload for ID Card - Both Front and Back Required */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Front Side Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>1. Ghana Card — Front Side</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </span>
                  {frontImagePreview ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Attached</span>
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800">
                      Required
                    </span>
                  )}
                </label>

                <div className={`relative border-2 border-dashed rounded-3xl p-5 text-center transition-colors bg-white/70 dark:bg-slate-900/60 ${
                  frontImagePreview
                    ? 'border-emerald-500/60'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-500'
                }`}>
                  {frontImagePreview ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden group">
                      <img
                        src={frontImagePreview}
                        alt="Ghana Card Front"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        <label className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700">
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              setIdUploadError(null);
                              handleSingleImageUpload(e, setFrontImagePreview);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFrontImagePreview(null)}
                          className="p-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center py-6">
                      <Upload className="w-8 h-8 text-blue-600 mb-2" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Upload Front from Gallery
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">Select photo with your face & ID number</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          setIdUploadError(null);
                          handleSingleImageUpload(e, setFrontImagePreview);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Back Side Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>2. Ghana Card — Back Side</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </span>
                  {backImagePreview ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Attached</span>
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800">
                      Required
                    </span>
                  )}
                </label>

                <div className={`relative border-2 border-dashed rounded-3xl p-5 text-center transition-colors bg-white/70 dark:bg-slate-900/60 ${
                  backImagePreview
                    ? 'border-emerald-500/60'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-500'
                }`}>
                  {backImagePreview ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden group">
                      <img
                        src={backImagePreview}
                        alt="Ghana Card Back"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        <label className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700">
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              setIdUploadError(null);
                              handleSingleImageUpload(e, setBackImagePreview);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setBackImagePreview(null)}
                          className="p-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center py-6">
                      <Upload className="w-8 h-8 text-blue-600 mb-2" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Upload Back from Gallery
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">Select photo of back side (barcode & signature)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          setIdUploadError(null);
                          handleSingleImageUpload(e, setBackImagePreview);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
              frontImagePreview && backImagePreview
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}>
              {frontImagePreview && backImagePreview ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Both Ghana Card sides attached:</strong> Front and Back photos ready for administrative verification.
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Uploading <strong>both sides</strong> of your Ghana Card is required before enlisting your business profile.
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Gallery, Logo & Services */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {uploadError && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Services Offered */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Key Services & Products Offered
              </label>
              <div className="flex gap-2 mb-2.5">
                <input
                  type="text"
                  placeholder="e.g. Graphic Design, Catering, Electrical Installation"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddService();
                    }
                  }}
                  className="flex-1 px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-5 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800/50"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(s)}
                      className="p-0.5 text-blue-500 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Gallery Photos Uploads */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Direct Gallery Uploads (Logo & Showcase Photos)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your official logo, storefront cover banner, and work portfolio photos directly from your phone gallery or computer.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Logo Upload */}
                <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Business Logo
                  </label>
                  {logoPreview ? (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden group mx-auto border border-slate-200 dark:border-slate-700">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setLogoPreview(null)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                      <Camera className="w-6 h-6 text-blue-600 mb-1" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Logo</span>
                      <span className="text-[10px] text-slate-400">Square format recommended</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSingleImageUpload(e, setLogoPreview)}
                      />
                    </label>
                  )}
                </div>

                {/* Cover Banner Upload */}
                <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Cover / Storefront Banner
                  </label>
                  {coverPreview ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-700">
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCoverPreview(null)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors aspect-video">
                      <Upload className="w-6 h-6 text-blue-600 mb-1" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Banner</span>
                      <span className="text-[10px] text-slate-400">Storefront or work showcase</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSingleImageUpload(e, setCoverPreview)}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Additional Gallery Photos */}
              <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Additional Showcase Photos (Gallery)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryPreviews.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-700">
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors aspect-square text-center">
                    <Plus className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMultiGalleryUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Buttons Directly on Background */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => handleProceedStep((step - 1) as any)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToPortal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => handleProceedStep((step + 1) as any)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitRegistration}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enlist Business Profile</span>
            </button>
          )}
        </div>

      </main>
    </div>
  );
};
