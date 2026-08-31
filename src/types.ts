export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'unverified';

export type DocumentType = 'ghana_card' | 'voters_id' | 'drivers_license' | 'passport' | 'business_registration' | 'tin_certificate';

export interface VerificationDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  holderName: string;
  expiryDate: string;
  frontImageUrl: string;
  backImageUrl?: string;
  selfieUrl?: string;
  submittedAt: string;
  reviewedAt?: string;
  status: VerificationStatus;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface BusinessUpdate {
  id: string;
  title: string;
  content: string;
  type: 'promo' | 'announcement' | 'event' | 'new_product' | 'discount';
  badgeLabel?: string;
  discountPercentage?: number;
  imageUrl?: string;
  validUntil?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BusinessReview {
  id: string;
  businessId: string;
  userName: string;
  userAvatar?: string;
  userEmail?: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
  helpfulCount: number;
  ownerReply?: {
    date: string;
    text: string;
  };
}

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Business {
  id: string;
  name: string;
  tagline?: string;
  slug: string;
  category: string;
  subCategory?: string;
  description: string;
  logo: string;
  coverImage: string;
  gallery: string[];
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
  city: string;
  region: string;
  address: string;
  digitalAddress?: string; // e.g. GA-183-9021 (GhanaPost GPS)
  coordinates: {
    lat: number;
    lng: number;
  };
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  listingStatus?: 'active' | 'pending_approval' | 'rejected';
  verificationDetails?: {
    verifiedAt: string;
    badgeType: 'Gold Enterprise' | 'Standard Verified' | 'Community Partner' | string;
    documentType?: DocumentType;
    officialRegistrationNumber?: string;
    gpsVerified?: boolean;
    tinNumber?: string;
    businessRegNumber?: string;
    verifiedByAdmin?: string;
  };
  verificationDocuments?: VerificationDocument[];
  openingHours: OpeningHours;
  services: string[];
  features: string[];
  isFeatured?: boolean;
  isPromoted?: boolean;
  views: number;
  leadsCount: number;
  websiteClicks?: number;
  phoneClicks?: number;
  whatsappClicks?: number;
  directionsClicks?: number;
  savesCount?: number;
  updates?: BusinessUpdate[];
  ownerId?: string;
  ownerEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  itemCount: number;
  featuredImageUrl?: string;
}

export type UserRole = 'visitor' | 'customer' | 'business_owner' | 'verified_owner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  role: UserRole;
  accountType?: 'customer' | 'business_owner';
  avatar?: string;
  authProvider?: 'google' | 'apple' | 'email';
  savedBusinessIds: string[];
  ownedBusinessIds?: string[];
  twoFactorEnabled?: boolean;
  createdAt: string;
}

export interface UserAccountRecord {
  id: string;
  name: string;
  username?: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  role: UserRole;
  avatar?: string;
  authProvider?: 'google' | 'apple' | 'email';
  passwordHash?: string;
  password?: string;
  businessName?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface BusinessInquiry {
  id: string;
  businessId: string;
  businessName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceRequested: string;
  budgetRange?: string;
  message: string;
  contactMethod: 'whatsapp' | 'call' | 'email';
  createdAt: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface FilterState {
  searchQuery: string;
  category: string;
  city: string;
  region: string;
  verificationOnly: boolean;
  minRating: number;
  priceLevel: string;
  openNowOnly: boolean;
  sortBy: 'featured' | 'rating' | 'reviews' | 'name' | 'nearest' | 'leads';
  userLat?: number;
  userLng?: number;
  maxDistanceKm?: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

export interface PromotionalAnnouncement {
  id: string;
  type: 'urgent' | 'offer' | 'event' | 'alert';
  badge: string;
  title: string;
  subtitle: string;
  highlightText?: string;
  promoCode?: string;
  countdownTarget?: string;
  ctaText: string;
  ctaAction: 'register' | 'category' | 'verify' | 'quote' | 'explore' | 'link';
  ctaTarget?: string;
  isUrgent?: boolean;
  active: boolean;
}

export type ReportReason = 
  | 'inappropriate_content'
  | 'fake_verification'
  | 'fraud_or_scam'
  | 'incorrect_information'
  | 'closed_or_non_existent'
  | 'harassment_or_abuse'
  | 'other';

export interface BusinessReport {
  id: string;
  businessId: string;
  businessName: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  reason: ReportReason;
  reasonLabel: string;
  details: string;
  reportedAt: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  adminNotes?: string;
}

export interface CategorySuggestion {
  id: string;
  categoryName: string;
  suggestedBy: string;
  userEmail?: string;
  userPhone?: string;
  industry?: string;
  description: string;
  exampleBusinesses?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export interface PlatformFeedback {
  id: string;
  type: 'general' | 'category_suggestion' | 'feature_request' | 'business_review' | 'bug_report';
  name: string;
  email?: string;
  rating?: number;
  subject: string;
  message: string;
  targetBusinessId?: string;
  targetBusinessName?: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'resolved';
  adminReply?: string;
}

export type GhanaNewsCategory = 
  | 'all'
  | 'forex_fx'
  | 'banking_economy'
  | 'smes_startups'
  | 'trade_afcfta'
  | 'tech_telecoms'
  | 'energy_commodities';

export interface ForexRate {
  currencyCode: string; // e.g. USD, GBP, EUR, NGN, CNY, CAD
  currencyName: string;
  flag: string; // emoji flag or symbol
  interbankBuy: number; // in GHS
  interbankSell: number; // in GHS
  bureauBuy: number; // in GHS
  bureauSell: number; // in GHS
  change24h: number; // percentage e.g. -0.12 or +0.05
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface GhanaNewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keyTakeaways?: string[];
  category: GhanaNewsCategory;
  categoryLabel: string;
  source: 'Bank of Ghana' | 'Joy Business' | 'Citi Business News' | 'B&FT' | 'Graphic Business' | 'GhanaWeb Business' | 'Ministry of Finance';
  sourceUrl: string;
  author: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  isBreaking?: boolean;
  isTrending?: boolean;
  fxHighlight?: string;
  views: number;
  likes: number;
  tags: string[];
}

export interface GhanaMarketSummary {
  bogPolicyRate: number; // e.g. 27.0%
  headlineInflation: number; // e.g. 20.4%
  gseCompositeIndex: number; // e.g. 4,320.15
  gseChange: number; // e.g. +1.4%
  crudeOilBrent: number; // in USD
  cocoaPerTonne: number; // in USD
  goldPerOunce: number; // in USD
  lastRefreshed: string;
}

export interface UserNotification {
  id: string;
  userId?: string;
  userEmail?: string;
  businessId: string;
  businessName: string;
  type: 'approval' | 'rejection' | 'update';
  title: string;
  message: string;
  reason?: string;
  badgeType?: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  whatsappNoticeText?: string;
}

export interface UserLocationRecord {
  id: string;
  sessionId: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  ipAddress: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  district?: string;
  digitalAddressGrid?: string;
  coordinates: {
    lat: number;
    lng: number;
    accuracyMeters?: number;
  };
  deviceInfo: {
    browser: string;
    os: string;
    platform: 'mobile' | 'desktop' | 'tablet';
    userAgent: string;
    screenResolution?: string;
  };
  verificationMethod: 'gps_high_precision' | 'gps_standard' | 'network_triangulated' | 'ip_lookup';
  isGhanaLocation: boolean;
  firstSeenAt: string;
  lastActiveAt: string;
  status: 'online' | 'active' | 'idle' | 'offline';
  pagePath?: string;
  networkCarrier?: string;
}

export interface CookieConsentPreferences {
  essential: boolean; // Always true
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  timestamp: string;
  status: 'accepted_all' | 'essential_only' | 'custom';
}

export interface VisitorTrackingData {
  visitorId: string;
  sessionId: string;
  visitCount: number;
  firstVisitAt: string;
  lastVisitAt: string;
  referrer: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screenResolution: string;
  preferredRegion?: string;
  preferredCity?: string;
  pagesViewed: string[];
  consentStatus: 'accepted_all' | 'essential_only' | 'custom' | 'pending';
}
