export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'unverified';

export type DocumentType = 'ghana_card' | 'voters_id' | 'drivers_license' | 'passport';

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
  verificationDetails?: {
    verifiedAt: string;
    badgeType: 'Gold Enterprise' | 'Standard Verified' | 'Community Partner';
    documentType: DocumentType;
    officialRegistrationNumber?: string;
  };
  verificationDocuments?: VerificationDocument[];
  openingHours: OpeningHours;
  services: string[];
  features: string[];
  isFeatured?: boolean;
  isPromoted?: boolean;
  views: number;
  leadsCount: number;
  ownerId?: string;
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
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  savedBusinessIds: string[];
  ownedBusinessIds?: string[];
  twoFactorEnabled?: boolean;
  createdAt: string;
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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  readTime: string;
  publishedAt: string;
  tags: string[];
  views: number;
  likes: number;
}

export interface PopularityTrendData {
  day: string;
  date: string;
  technology: number;
  digitalMarketing: number;
  hospitality: number;
  healthcare: number;
  fashion: number;
  realEstate: number;
  agriTech: number;
}

