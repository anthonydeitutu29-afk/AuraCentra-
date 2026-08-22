import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Image as ImageIcon, 
  ArrowRight, 
  ArrowLeft,
  Building,
  Plus,
  Trash2,
  AlertCircle,
  Camera,
  Layers
} from 'lucide-react';
import { Business, Category, DocumentType, VerificationDocument } from '../types';
import confetti from 'canvas-confetti';

interface BusinessRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onRegisterBusiness: (newBusiness: Business) => void;
}

export const BusinessRegistrationModal: React.FC<BusinessRegistrationModalProps> = ({
  isOpen,
  onClose,
  categories,
  onRegisterBusiness,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'restaurants');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  // Location
  const [city, setCity] = useState('Accra');
  const [region, setRegion] = useState('Greater Accra');
  const [address, setAddress] = useState('');
  const [digitalAddress, setDigitalAddress] = useState('');

  // Services
  const [serviceInput, setServiceInput] = useState('');
  const [services, setServices] = useState<string[]>([
    'Consultation',
    'Customer Support',
  ]);

  // ID Verification
  const [docType, setDocType] = useState<DocumentType>('ghana_card');
  const [docNumber, setDocNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);

  // Gallery and Photos uploaded from device/gallery
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Generic file reader helper for gallery uploads
  const handleSingleImageUpload = (
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

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file from your gallery.');
    };
    reader.readAsDataURL(file);
  };

  // Multiple gallery photos upload
  const handleMultiGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];
    let countProcessed = 0;
    const totalFiles = files.length;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          newPhotos.push(reader.result as string);
        }
        countProcessed++;
        if (countProcessed === totalFiles) {
          setGalleryPreviews((prev) => [...prev, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryPhoto = (indexToRemove: number) => {
    setGalleryPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter your business name.');
      setStep(1);
      return;
    }

    const verificationDocs: VerificationDocument[] = [];
    if (frontImagePreview) {
      verificationDocs.push({
        id: `doc-${Date.now()}`,
        type: docType,
        documentNumber: docNumber || 'PENDING-ID-992',
        holderName: holderName || name,
        expiryDate: '2032-12-31',
        frontImageUrl: frontImagePreview,
        backImageUrl: backImagePreview || undefined,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      });
    }

    // Default clean placeholders only if user didn't pick from gallery
    const finalLogo = logoPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
    const finalCover = coverPreview || (galleryPreviews.length > 0 ? galleryPreviews[0] : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80');
    const finalGallery = galleryPreviews.length > 0 ? galleryPreviews : [finalCover];

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
      phone: phone.trim() || '0508203673',
      whatsapp: whatsapp.trim() || phone.trim() || '233508203673',
      email: email.trim() || 'tonysdigitalmarketing@gmail.com',
      website: website.trim() || undefined,
      city,
      region,
      address: address.trim() || `${city} Commercial District`,
      digitalAddress: digitalAddress.trim() || 'GA-019-4821',
      coordinates: {
        lat: 5.6037,
        lng: -0.1870,
      },
      priceLevel: '$$',
      rating: 5.0,
      reviewCount: 0,
      verificationStatus: frontImagePreview ? 'pending' : 'unverified',
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
      features: ['Official AuraCentra Member', 'Direct WhatsApp Access'],
      views: 1,
      leadsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onRegisterBusiness(newBiz);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <span>Enlist Your Business on AuraCentra</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step {step} of 4: {
                step === 1 ? 'Business Contact & Details' :
                step === 2 ? 'Location & GhanaPost GPS' :
                step === 3 ? 'Identity Verification (Ghana Card)' :
                'Direct Gallery Photos & Logo Upload'
              }
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tony's Enterprise Hub"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quality Ghanaian Services & Customer Satisfaction"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell potential clients about your services, products, mission, and why they should choose your business..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0508203673"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="233508203673"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="tonysdigitalmarketing@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website or Social Media Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://mybusiness.com or https://instagram.com/mybrand"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Location & Address */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Accra, Kumasi, Tema, Takoradi..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Area / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Greater Accra, Ashanti, Central..."
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Physical Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ring Road Central, Adjacent Shell Station"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GhanaPost GPS Digital Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. GA-183-9021 or AK-049-8812"
                  value={digitalAddress}
                  onChange={(e) => setDigitalAddress(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Enables clients to navigate GPS directions straight to your business location.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Identity Verification Upload (Ghana Card, etc.) */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 dark:text-blue-200">
                  <strong>Verification Boost:</strong> Upload your official Ghana Card or National ID from your phone gallery to receive the Verified badge and increase customer trust.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Document Type *
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="ghana_card">Ghana Card (National ID)</option>
                    <option value="voters_id">Voter's ID Card</option>
                    <option value="drivers_license">Driver's License (DVLA)</option>
                    <option value="passport">Ghana Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document / Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GHA-729104820-9"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name as Shown on ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anthony Kwesi Mensah"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Direct Gallery Upload for ID Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Front Side Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Front Side ID Photo</span>
                    <span className="text-[10px] text-blue-600 font-bold">Pick from Gallery</span>
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                    {frontImagePreview ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden group">
                        <img
                          src={frontImagePreview}
                          alt="Front Document"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          <label className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700">
                            <span>Change Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleSingleImageUpload(e, setFrontImagePreview)}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFrontImagePreview(null)}
                            className="p-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center py-4">
                        <Camera className="w-8 h-8 text-blue-600 mb-2" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Upload Front from Gallery
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Choose image file from phone or computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSingleImageUpload(e, setFrontImagePreview)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Back Side Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Back Side ID Photo (Optional)</span>
                    <span className="text-[10px] text-blue-600 font-bold">Pick from Gallery</span>
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                    {backImagePreview ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden group">
                        <img
                          src={backImagePreview}
                          alt="Back Document"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          <label className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700">
                            <span>Change Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleSingleImageUpload(e, setBackImagePreview)}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setBackImagePreview(null)}
                            className="p-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center py-4">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Upload Back from Gallery
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Choose image file from phone or computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSingleImageUpload(e, setBackImagePreview)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Services & Direct Gallery Image Uploads */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Services Offered */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Services & Products Offered
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. SEO Marketing, Catering, Hair Braiding"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {services.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800/50"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(s)}
                        className="p-0.5 text-blue-500 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Direct Gallery Uploads (Logo & Showcase Photos)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your official logo, storefront banner, and work portfolio photos directly from your phone gallery or computer. No links or URLs required.
                </p>

                {/* 1. Logo & Cover Upload Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* LOGO UPLOAD */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                      Business Logo Photo
                    </label>

                    {logoPreview ? (
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-500 bg-white shrink-0 shadow-sm">
                          <img src={logoPreview} alt="Business Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="block px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors"
                          >
                            Change Logo
                          </button>
                          <button
                            type="button"
                            onClick={() => setLogoPreview(null)}
                            className="block text-xs text-rose-600 hover:underline cursor-pointer"
                          >
                            Remove Logo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer group bg-white dark:bg-slate-800"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Upload Logo from Gallery
                        </span>
                        <span className="text-[10px] text-slate-400">Tap to select photo (PNG, JPG)</span>
                      </button>
                    )}

                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSingleImageUpload(e, setLogoPreview)}
                    />
                  </div>

                  {/* COVER BANNER PHOTO UPLOAD */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                      Storefront / Cover Banner Photo
                    </label>

                    {coverPreview ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-700">
                        <img src={coverPreview} alt="Cover Banner" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700"
                          >
                            Change Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverPreview(null)}
                            className="p-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer group bg-white dark:bg-slate-800"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Camera className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Upload Banner from Gallery
                        </span>
                        <span className="text-[10px] text-slate-400">Storefront, office, or work area</span>
                      </button>
                    )}

                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSingleImageUpload(e, setCoverPreview)}
                    />
                  </div>
                </div>

                {/* 2. Additional Portfolio / Gallery Photos */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Additional Gallery Photos ({galleryPreviews.length} uploaded)
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Upload photos of your completed projects, products, menu, or facility directly from your gallery.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Pick Photos</span>
                    </button>
                  </div>

                  {galleryPreviews.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
                      {galleryPreviews.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-700">
                          <img src={imgUrl} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add More Tile */}
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-[10px] font-bold mt-1">Add More</span>
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => galleryInputRef.current?.click()}
                      className="p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-center cursor-pointer transition-colors bg-white dark:bg-slate-800"
                    >
                      <Layers className="w-7 h-7 text-blue-600 mx-auto mb-1.5" />
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Tap here to select multiple photos from your device gallery
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Showcase your finished work, items, and products
                      </div>
                    </div>
                  )}

                  <input
                    ref={galleryInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleMultiGalleryUpload}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!name.trim() || !description.trim())) {
                  alert('Please provide business name and description.');
                  return;
                }
                setStep((prev) => (prev + 1) as any);
              }}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitRegistration}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enlist Business Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
