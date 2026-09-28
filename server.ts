import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// ==========================================
// SECURE ADMIN CREDENTIALS & SESSIONS
// Stored strictly on backend; never in frontend
// ==========================================
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admindashboard@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin12$';
const ADMIN_VERIFY_CODE = process.env.ADMIN_VERIFY_CODE || '8009';

// In-memory session and 2FA stores with expiration
interface AdminSession {
  token: string;
  email: string;
  role: 'ADMIN';
  createdAt: number;
  expiresAt: number;
}

interface TempLoginSession {
  tempToken: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

const activeAdminSessions = new Map<string, AdminSession>();
const pending2FASessions = new Map<string, TempLoginSession>();

// Rate limiting & Brute force protection
const loginAttempts = new Map<string, { count: number; lockedUntil?: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;
  if (record.lockedUntil && record.lockedUntil > now) {
    return false;
  }
  if (record.lockedUntil && record.lockedUntil <= now) {
    loginAttempts.delete(ip);
    return true;
  }
  return record.count < 6;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0 };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = now + 5 * 60 * 1000; // 5-minute lockout
  }
  loginAttempts.set(ip, record);
}

function clearRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

// Authentication middleware
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.cookies?.auracentra_admin_session;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Administrator access required.' });
  }

  const session = activeAdminSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeAdminSessions.delete(token);
    return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });
  }

  (req as any).adminUser = session;
  next();
}

// ==========================================
// AUDIT LOG & BUSINESS SUBMISSION STORES
// ==========================================
export interface AdminAuditLogEntry {
  id: string;
  action: string;
  businessId?: string;
  businessName?: string;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  adminEmail: string;
  timestamp: string;
}

const auditLogs: AdminAuditLogEntry[] = [
  {
    id: 'log-seed-1',
    action: 'System Initialized',
    businessName: 'AuraCentra Core Ecosystem',
    newStatus: 'OPERATIONAL',
    reason: 'Security & administration rules bootstrapped',
    adminEmail: 'admindashboard@gmail.com',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  }
];

export interface EnlistmentSubmission {
  id: string;
  submissionId: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  name: string;
  businessType: string;
  description: string;
  category: string;
  additionalCategories: string[];
  sector: string;
  yearEstablished?: string;
  employeesCount?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  region: string;
  city: string;
  area: string;
  streetDescription?: string;
  ghanaPostGps?: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  coverImage?: string;
  photos: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
    linkedin?: string;
    youtube?: string;
  };
  productsAndServices: Array<{
    id: string;
    type: 'product' | 'service';
    name: string;
    description: string;
    price?: string;
    image?: string;
  }>;
  contactChannels: {
    phone: boolean;
    whatsapp: boolean;
    email: boolean;
    website: boolean;
    social: boolean;
  };
  openingHours: string;
  acceptEnquiries: boolean;
  // Verification details - PRIVATE, NEVER PUBLIC
  verification: {
    registrationNumber?: string;
    ghanaCardNumber?: string;
    documentUrls?: string[];
    proofOfAddress?: string;
    notes?: string;
  };
  status: 'pending_review' | 'under_review' | 'verification_required' | 'approved' | 'published' | 'rejected' | 'suspended';
  verified: boolean;
  featured?: boolean;
  correctionNotes?: string;
  internalAdminNotes?: string[];
  submissionHistory: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  metrics: {
    views: number;
    enquiries: number;
    phoneClicks: number;
    whatsappClicks: number;
    websiteClicks: number;
    socialClicks: number;
  };
  createdAt: string;
  updatedAt: string;
}

// In-memory submissions store initialized empty - only authentic user-enlisted businesses are stored
const submissionsStore = new Map<string, EnlistmentSubmission>();
const seedSubmissions: EnlistmentSubmission[] = [];

// ==========================================
// 1. SECURE ADMIN AUTHENTICATION FLOW
// ==========================================

// SCREEN 1: Email & Password verification -> returns tempToken
app.post('/api/admin/login-stage1', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      success: false,
      error: 'Too many failed login attempts. Account temporarily locked for 5 minutes for security.'
    });
  }

  const { email, password } = req.body;
  const genericError = 'Invalid administrator credentials.';

  if (!email || !password) {
    recordFailedAttempt(ip);
    return res.status(401).json({ success: false, error: genericError });
  }

  const trimmedEmail = String(email).trim().toLowerCase();
  const trimmedPassword = String(password).trim();

  // Compare strictly on server
  if (trimmedEmail !== ADMIN_EMAIL.toLowerCase() || trimmedPassword !== ADMIN_PASSWORD) {
    recordFailedAttempt(ip);
    return res.status(401).json({ success: false, error: genericError });
  }

  // Issue 2FA temporary stage token valid for 5 minutes
  const tempToken = crypto.randomBytes(32).toString('hex');
  pending2FASessions.set(tempToken, {
    tempToken,
    email: ADMIN_EMAIL,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  return res.json({
    success: true,
    tempToken,
    message: 'Stage 1 verified. Please provide administrator verification code.'
  });
});

// SCREEN 2: 2FA Verification Code -> returns full admin session token
app.post('/api/admin/login-stage2', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      success: false,
      error: 'Too many attempts. Locked for 5 minutes.'
    });
  }

  const { tempToken, verificationCode } = req.body;
  const genericError = 'Invalid administrator credentials.';

  if (!tempToken || !verificationCode) {
    recordFailedAttempt(ip);
    return res.status(401).json({ success: false, error: genericError });
  }

  const pending = pending2FASessions.get(tempToken);
  if (!pending || pending.expiresAt < Date.now()) {
    if (pending) pending2FASessions.delete(tempToken);
    recordFailedAttempt(ip);
    return res.status(401).json({ success: false, error: 'Verification session expired. Please restart login.' });
  }

  const cleanCode = String(verificationCode).trim();
  if (cleanCode !== ADMIN_VERIFY_CODE) {
    recordFailedAttempt(ip);
    return res.status(401).json({ success: false, error: genericError });
  }

  // Verified! Clean up temp session and rate limits
  pending2FASessions.delete(tempToken);
  clearRateLimit(ip);

  // Generate secure admin session token (valid for 12 hours)
  const sessionToken = crypto.randomBytes(48).toString('hex');
  const session: AdminSession = {
    token: sessionToken,
    email: ADMIN_EMAIL,
    role: 'ADMIN',
    createdAt: Date.now(),
    expiresAt: Date.now() + 12 * 60 * 60 * 1000
  };

  activeAdminSessions.set(sessionToken, session);

  // Set httpOnly cookie for extra security
  res.cookie('auracentra_admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 1000
  });

  // Record in audit log
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Administrator Authenticated',
    adminEmail: ADMIN_EMAIL,
    reason: 'Two-stage authentication successful',
    timestamp: new Date().toISOString()
  });

  return res.json({
    success: true,
    admin: {
      email: ADMIN_EMAIL,
      role: 'ADMIN',
      name: 'System Administrator'
    },
    token: sessionToken
  });
});

// Admin verification status check
app.get('/api/admin/me', requireAdmin, (req, res) => {
  const admin = (req as any).adminUser;
  res.json({
    authenticated: true,
    admin: {
      email: admin.email,
      role: admin.role
    }
  });
});

// Admin Logout
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = req.headers.authorization?.substring(7) || req.cookies?.auracentra_admin_session;
  if (token) {
    activeAdminSessions.delete(token);
  }
  res.clearCookie('auracentra_admin_session');

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Administrator Logged Out',
    adminEmail: ADMIN_EMAIL,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// 2. ADMIN DASHBOARD & REVIEW ENDPOINTS
// ==========================================

// Dashboard stats overview
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const all = Array.from(submissionsStore.values());

  const stats = {
    totalBusinesses: all.length,
    pendingSubmissions: all.filter(s => s.status === 'pending_review').length,
    underReview: all.filter(s => s.status === 'under_review').length,
    approvedBusinesses: all.filter(s => s.status === 'approved').length,
    publishedBusinesses: all.filter(s => s.status === 'published').length,
    rejectedBusinesses: all.filter(s => s.status === 'rejected').length,
    suspendedBusinesses: all.filter(s => s.status === 'suspended').length,
    verificationRequired: all.filter(s => s.status === 'verification_required').length,
    reportedListings: 0,
    recentSubmissions: all.slice(-5).reverse(),
    recentActivity: auditLogs.slice(0, 10)
  };

  res.json({ success: true, stats });
});

// List submissions with search, filters, and sorting
app.get('/api/admin/businesses', requireAdmin, (req, res) => {
  let list = Array.from(submissionsStore.values());

  const { status, category, region, query, sort } = req.query;

  if (status && status !== 'all') {
    list = list.filter(s => s.status === status);
  }
  if (category && category !== 'all') {
    list = list.filter(s => s.category.toLowerCase().includes(String(category).toLowerCase()));
  }
  if (region && region !== 'all') {
    list = list.filter(s => s.region.toLowerCase().includes(String(region).toLowerCase()));
  }
  if (query) {
    const q = String(query).toLowerCase();
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.ownerFullName.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.submissionId.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'oldest') {
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ success: true, count: list.length, businesses: list });
});

// Get single structured submission for detailed review
app.get('/api/admin/businesses/:id', requireAdmin, (req, res) => {
  const businessId = String(req.params.id);
  const business = submissionsStore.get(businessId);
  if (!business) {
    return res.status(404).json({ success: false, error: 'Business submission not found.' });
  }
  res.json({ success: true, business });
});

// Admin Review Actions: Approve, Request Changes, Reject, Suspend, Restore, Toggle Verification, Add Note
app.post('/api/admin/businesses/:id/action', requireAdmin, (req, res) => {
  const businessId = String(req.params.id);
  const business = submissionsStore.get(businessId);
  if (!business) {
    return res.status(404).json({ success: false, error: 'Business submission not found.' });
  }

  const { action, reason, note, markVerified } = req.body;
  const previousStatus = business.status;
  const now = new Date().toISOString();

  switch (action) {
    case 'approve':
      business.status = 'published';
      business.verified = markVerified !== undefined ? Boolean(markVerified) : business.verified;
      business.correctionNotes = undefined;
      business.submissionHistory.push({
        status: 'published',
        timestamp: now,
        note: reason || 'Application approved and published to AuraCentra public directory.'
      });
      break;

    case 'request_changes':
      business.status = 'verification_required';
      business.correctionNotes = reason || 'Additional verification information or correction required.';
      business.submissionHistory.push({
        status: 'verification_required',
        timestamp: now,
        note: `Correction requested: ${reason || 'Details need update'}`
      });
      break;

    case 'reject':
      business.status = 'rejected';
      business.correctionNotes = reason || 'Submission did not meet directory verification criteria.';
      business.submissionHistory.push({
        status: 'rejected',
        timestamp: now,
        note: `Rejected: ${reason || 'Guidelines not met'}`
      });
      break;

    case 'suspend':
      business.status = 'suspended';
      business.submissionHistory.push({
        status: 'suspended',
        timestamp: now,
        note: `Suspended: ${reason || 'Administrative hold'}`
      });
      break;

    case 'restore':
      business.status = 'published';
      business.submissionHistory.push({
        status: 'published',
        timestamp: now,
        note: 'Listing restored to active directory.'
      });
      break;

    case 'toggle_verified':
      business.verified = !business.verified;
      business.submissionHistory.push({
        status: business.status,
        timestamp: now,
        note: business.verified ? 'Granted official verified enterprise badge' : 'Verified badge revoked'
      });
      break;

    case 'add_note':
      business.internalAdminNotes = business.internalAdminNotes || [];
      business.internalAdminNotes.push(`${new Date().toLocaleDateString()}: ${note}`);
      break;

    default:
      return res.status(400).json({ success: false, error: 'Invalid administrative action.' });
  }

  business.updatedAt = now;
  submissionsStore.set(business.id, business);

  // Log in Audit Trail
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: `Business ${action.replace('_', ' ').toUpperCase()}`,
    businessId: business.id,
    businessName: business.name,
    previousStatus,
    newStatus: business.status,
    reason: reason || note,
    adminEmail: ADMIN_EMAIL,
    timestamp: now
  });

  res.json({
    success: true,
    business,
    message: `Action ${action} executed successfully.`
  });
});

// Audit Logs endpoint
app.get('/api/admin/audit-logs', requireAdmin, (req, res) => {
  res.json({ success: true, count: auditLogs.length, logs: auditLogs });
});

// ==========================================
// 3. BUSINESS ENLISTMENT & OWNER DASHBOARD
// ==========================================

// Submit complete 11-step business application
app.post('/api/enlist/submit', (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.phone || !data.category || !data.region || !data.city) {
      return res.status(400).json({
        success: false,
        error: 'Missing required business fields (Name, Phone, Category, Region, City).'
      });
    }

    const id = `biz-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const submissionId = `AC-GH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newSubmission: EnlistmentSubmission = {
      id,
      submissionId,
      ownerFullName: data.ownerFullName || 'Business Owner',
      ownerEmail: data.ownerEmail || data.email || '',
      ownerPhone: data.ownerPhone || data.phone || '',
      name: data.name.trim(),
      businessType: data.businessType || 'Sole Proprietorship',
      description: data.description || '',
      category: data.category,
      additionalCategories: Array.isArray(data.additionalCategories) ? data.additionalCategories : [],
      sector: data.sector || data.category,
      yearEstablished: data.yearEstablished || '',
      employeesCount: data.employeesCount || '',
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      email: data.email || '',
      website: data.website || '',
      region: data.region,
      city: data.city,
      area: data.area || data.city,
      streetDescription: data.streetDescription || '',
      ghanaPostGps: data.ghanaPostGps || '',
      latitude: data.latitude || 5.6037,
      longitude: data.longitude || -0.1870,
      logoUrl: data.logoUrl || '',
      coverImage: data.coverImage || '',
      photos: Array.isArray(data.photos) ? data.photos : [],
      socialLinks: data.socialLinks || {},
      productsAndServices: Array.isArray(data.productsAndServices) ? data.productsAndServices : [],
      contactChannels: data.contactChannels || { phone: true, whatsapp: true, email: true, website: false, social: false },
      openingHours: data.openingHours || 'Mon - Fri: 8:00 AM - 5:00 PM',
      acceptEnquiries: data.acceptEnquiries !== undefined ? Boolean(data.acceptEnquiries) : true,
      verification: {
        registrationNumber: data.registrationNumber || '',
        ghanaCardNumber: data.ghanaCardNumber || '',
        documentUrls: Array.isArray(data.documentUrls) ? data.documentUrls : [],
        proofOfAddress: data.proofOfAddress || '',
        notes: data.verificationNotes || ''
      },
      // INITIAL STATUS MUST ALWAYS BE PENDING_REVIEW; NEVER AUTO-VERIFIED
      status: 'pending_review',
      verified: false,
      featured: false,
      submissionHistory: [
        {
          status: 'pending_review',
          timestamp: now,
          note: 'Business application submitted for official verification review.'
        }
      ],
      metrics: {
        views: 0,
        enquiries: 0,
        phoneClicks: 0,
        whatsappClicks: 0,
        websiteClicks: 0,
        socialClicks: 0
      },
      createdAt: now,
      updatedAt: now
    };

    submissionsStore.set(id, newSubmission);

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      action: 'New Business Submitted',
      businessId: id,
      businessName: newSubmission.name,
      newStatus: 'pending_review',
      adminEmail: 'system',
      timestamp: now
    });

    res.json({
      success: true,
      submissionId,
      businessId: id,
      businessName: newSubmission.name,
      submissionDate: now,
      status: 'Pending Review',
      message: 'Your business has been submitted! Our team will review your submission and verification information before your business is published.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to submit business listing.' });
  }
});

// Business Owner Dashboard
app.get('/api/owner/business/:id', (req, res) => {
  const business = submissionsStore.get(String(req.params.id));
  if (!business) {
    return res.status(404).json({ success: false, error: 'Business listing not found.' });
  }

  // Calculate profile completeness %
  let score = 0;
  if (business.name) score += 10;
  if (business.description && business.description.length > 30) score += 15;
  if (business.logoUrl) score += 15;
  if (business.coverImage) score += 10;
  if (business.ghanaPostGps) score += 10;
  if (business.productsAndServices.length > 0) score += 15;
  if (business.openingHours) score += 10;
  if (business.verification.registrationNumber || business.verification.ghanaCardNumber) score += 15;

  const completeness = Math.min(100, score);

  res.json({
    success: true,
    business: {
      id: business.id,
      submissionId: business.submissionId,
      name: business.name,
      category: business.category,
      region: business.region,
      city: business.city,
      status: business.status,
      verified: business.verified,
      correctionNotes: business.correctionNotes,
      completeness,
      metrics: business.metrics,
      history: business.submissionHistory,
      createdAt: business.createdAt
    }
  });
});

// Owner resubmission after corrections
app.post('/api/owner/business/:id/resubmit', (req, res) => {
  const business = submissionsStore.get(String(req.params.id));
  if (!business) {
    return res.status(404).json({ success: false, error: 'Business not found.' });
  }

  const updates = req.body;
  Object.assign(business, updates);
  business.status = 'pending_review';
  business.correctionNotes = undefined;
  business.updatedAt = new Date().toISOString();
  business.submissionHistory.push({
    status: 'pending_review',
    timestamp: business.updatedAt,
    note: 'Resubmitted by owner with requested corrections.'
  });

  submissionsStore.set(business.id, business);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'Business Resubmitted',
    businessId: business.id,
    businessName: business.name,
    newStatus: 'pending_review',
    adminEmail: 'owner',
    timestamp: business.updatedAt
  });

  res.json({ success: true, message: 'Corrections submitted for review.', business });
});

// Public Listings Endpoint (returns published enterprises + verified badges)
app.get('/api/listings', (req, res) => {
  const published = Array.from(submissionsStore.values())
    .filter(s => s.status === 'published' || s.status === 'approved')
    .map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      description: s.description,
      region: s.region,
      city: s.city,
      address: s.streetDescription || s.area,
      phone: s.phone,
      whatsapp: s.whatsapp,
      email: s.email,
      website: s.website,
      verified: s.verified,
      featured: s.featured,
      rating: 4.8,
      reviews_count: 94,
      logo_url: s.logoUrl,
      cover_image: s.coverImage,
      operating_hours: s.openingHours,
      created_at: s.createdAt
    }));

  res.json({ success: true, count: published.length, businesses: published });
});

// Track metrics
app.post('/api/business/:id/track-click', (req, res) => {
  const business = submissionsStore.get(String(req.params.id));
  if (business) {
    const { type } = req.body;
    if (type === 'view') business.metrics.views += 1;
    if (type === 'phone') business.metrics.phoneClicks += 1;
    if (type === 'whatsapp') business.metrics.whatsappClicks += 1;
    if (type === 'website') business.metrics.websiteClicks += 1;
    if (type === 'social') business.metrics.socialClicks += 1;
    if (type === 'enquiry') business.metrics.enquiries += 1;
  }
  res.json({ success: true });
});

// ==========================================
// VITE DEV SERVER / PRODUCTION STATIC SERVER
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AuraCentra Core] Server running on port ${PORT} (dev mode: ${!isProd})`);
  });
}

startServer().catch(err => {
  console.error('[AuraCentra Core] Startup error:', err);
  process.exit(1);
});
