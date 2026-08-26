import { CookieConsentPreferences, VisitorTrackingData } from '../types';

/**
 * Robust Cookie Manager & Visitor Intelligence Tracker for AuraCentra Ghana
 * Complies with Ghana Data Protection Act (Act 843) & GDPR standards
 */

// Helper to set a cookie with standard attributes
export function setCookie(name: string, value: string, days: number = 365, path: string = '/'): void {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    // SameSite=Lax allows standard navigation preservation while protecting against CSRF
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};${expires};path=${path};SameSite=Lax${secure}`;
  } catch (e) {
    console.warn('[Cookie Manager] Error setting cookie:', e);
  }
}

// Helper to get a cookie value by name
export function getCookie(name: string): string | null {
  try {
    const encodedName = `${encodeURIComponent(name)}=`;
    const decodedCookie = decodeURIComponent(document.cookie || '');
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(encodedName) === 0) {
        return decodeURIComponent(c.substring(encodedName.length, c.length));
      }
    }
  } catch (e) {
    console.warn('[Cookie Manager] Error reading cookie:', e);
  }
  return null;
}

// Helper to delete a cookie
export function deleteCookie(name: string, path: string = '/'): void {
  try {
    document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};SameSite=Lax`;
  } catch (e) {
    console.warn('[Cookie Manager] Error deleting cookie:', e);
  }
}

// Helper to get all cookies as key-value pairs
export function getAllCookies(): Record<string, string> {
  const cookies: Record<string, string> = {};
  try {
    const decodedCookie = decodeURIComponent(document.cookie || '');
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const parts = ca[i].trim().split('=');
      if (parts.length >= 2) {
        const key = decodeURIComponent(parts[0]);
        const val = decodeURIComponent(parts.slice(1).join('='));
        cookies[key] = val;
      }
    }
  } catch (e) {
    console.warn('[Cookie Manager] Error parsing all cookies:', e);
  }
  return cookies;
}

// Cookie Constants
export const COOKIE_KEYS = {
  CONSENT: 'auracentra_cookie_consent',
  VISITOR_ID: 'auracentra_visitor_id',
  SESSION_ID: 'auracentra_session_id',
  VISIT_COUNT: 'auracentra_visit_count',
  FIRST_VISIT: 'auracentra_first_visit',
  LAST_VISIT: 'auracentra_last_visit',
  PREFERRED_REGION: 'auracentra_pref_region',
  PREFERRED_CITY: 'auracentra_pref_city',
  RECENT_SEARCH: 'auracentra_recent_query',
  THEME_PREF: 'auracentra_theme_mode',
  PAGES_VISITED: 'auracentra_viewed_pages',
};

// Detect Device Type
function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Detect Browser Name
function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1 && ua.indexOf('OPR') === -1) return 'Google Chrome';
  if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Apple Safari';
  if (ua.indexOf('Firefox') > -1) return 'Mozilla Firefox';
  if (ua.indexOf('Edg') > -1) return 'Microsoft Edge';
  if (ua.indexOf('OPR') > -1 || ua.indexOf('Opera') > -1) return 'Opera';
  return 'Modern Web Browser';
}

// Detect Operating System
function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.indexOf('Win') !== -1) return 'Windows';
  if (ua.indexOf('Mac') !== -1) return 'macOS';
  if (ua.indexOf('Linux') !== -1) return 'Linux';
  if (ua.indexOf('Android') !== -1) return 'Android';
  if (ua.indexOf('like Mac') !== -1) return 'iOS';
  return 'Standard OS';
}

/**
 * Get or initialize Cookie Consent Preferences
 */
export function getCookieConsent(): CookieConsentPreferences | null {
  const raw = getCookie(COOKIE_KEYS.CONSENT) || localStorage.getItem(COOKIE_KEYS.CONSENT);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save Cookie Consent Preferences
 */
export function saveCookieConsent(preferences: CookieConsentPreferences): void {
  const serialized = JSON.stringify(preferences);
  // Set cookie for 180 days
  setCookie(COOKIE_KEYS.CONSENT, serialized, 180);
  try {
    localStorage.setItem(COOKIE_KEYS.CONSENT, serialized);
  } catch {
    // ignore
  }
}

/**
 * Initialize / Track Visitor Information and Store in Cookies + Storage
 */
export function initializeAndTrackVisitor(currentPath: string = '/'): VisitorTrackingData {
  const now = new Date().toISOString();
  
  // 1. Visitor ID (Unique across visits)
  let visitorId = getCookie(COOKIE_KEYS.VISITOR_ID) || localStorage.getItem(COOKIE_KEYS.VISITOR_ID);
  let isFirstVisitEver = false;
  if (!visitorId) {
    visitorId = `vst-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    isFirstVisitEver = true;
    setCookie(COOKIE_KEYS.VISITOR_ID, visitorId, 365);
    try {
      localStorage.setItem(COOKIE_KEYS.VISITOR_ID, visitorId);
    } catch {}
  }

  // 2. Session ID (Unique per browsing session)
  let sessionId = sessionStorage.getItem(COOKIE_KEYS.SESSION_ID);
  if (!sessionId) {
    sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    try {
      sessionStorage.setItem(COOKIE_KEYS.SESSION_ID, sessionId);
    } catch {}
  }
  setCookie(COOKIE_KEYS.SESSION_ID, sessionId, 1);

  // 3. Visit Count
  const prevCountStr = getCookie(COOKIE_KEYS.VISIT_COUNT) || localStorage.getItem(COOKIE_KEYS.VISIT_COUNT) || '0';
  let visitCount = parseInt(prevCountStr, 10) || 0;
  
  // Check if this is a new session
  const lastVisit = getCookie(COOKIE_KEYS.LAST_VISIT) || localStorage.getItem(COOKIE_KEYS.LAST_VISIT);
  if (!sessionStorage.getItem('auracentra_session_counted')) {
    visitCount += 1;
    setCookie(COOKIE_KEYS.VISIT_COUNT, visitCount.toString(), 365);
    try {
      localStorage.setItem(COOKIE_KEYS.VISIT_COUNT, visitCount.toString());
      sessionStorage.setItem('auracentra_session_counted', 'true');
    } catch {}
  }

  // 4. First Visit & Last Visit Timestamps
  let firstVisitAt = getCookie(COOKIE_KEYS.FIRST_VISIT) || localStorage.getItem(COOKIE_KEYS.FIRST_VISIT) || now;
  if (isFirstVisitEver) {
    firstVisitAt = now;
    setCookie(COOKIE_KEYS.FIRST_VISIT, firstVisitAt, 365);
    try {
      localStorage.setItem(COOKIE_KEYS.FIRST_VISIT, firstVisitAt);
    } catch {}
  }
  setCookie(COOKIE_KEYS.LAST_VISIT, now, 365);
  try {
    localStorage.setItem(COOKIE_KEYS.LAST_VISIT, now);
  } catch {}

  // 5. Track Visited Pages List
  let pagesViewed: string[] = [];
  try {
    const rawPages = getCookie(COOKIE_KEYS.PAGES_VISITED) || localStorage.getItem(COOKIE_KEYS.PAGES_VISITED);
    if (rawPages) {
      pagesViewed = JSON.parse(rawPages);
    }
  } catch {}
  if (!pagesViewed.includes(currentPath)) {
    pagesViewed = [...pagesViewed, currentPath].slice(-10); // Keep last 10 pages
    setCookie(COOKIE_KEYS.PAGES_VISITED, JSON.stringify(pagesViewed), 30);
    try {
      localStorage.setItem(COOKIE_KEYS.PAGES_VISITED, JSON.stringify(pagesViewed));
    } catch {}
  }

  // 6. Consent Status
  const consent = getCookieConsent();
  const consentStatus = consent ? consent.status : 'pending';

  // 7. Device, Browser, Screen Info
  const deviceType = detectDeviceType();
  const browser = detectBrowser();
  const os = detectOS();
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const referrer = document.referrer || 'Direct Visit';

  const preferredRegion = getCookie(COOKIE_KEYS.PREFERRED_REGION) || undefined;
  const preferredCity = getCookie(COOKIE_KEYS.PREFERRED_CITY) || undefined;

  const trackingData: VisitorTrackingData = {
    visitorId,
    sessionId,
    visitCount,
    firstVisitAt,
    lastVisitAt: now,
    referrer,
    deviceType,
    browser,
    os,
    screenResolution,
    preferredRegion,
    preferredCity,
    pagesViewed,
    consentStatus,
  };

  // Save composite visitor summary to localStorage for fast portal diagnostics
  try {
    localStorage.setItem('auracentra_visitor_summary', JSON.stringify(trackingData));
  } catch {}

  return trackingData;
}

/**
 * Remember preferred region or city in cookies for customized exploration
 */
export function trackRegionPreference(region: string, city?: string): void {
  if (region && region !== 'All Regions') {
    setCookie(COOKIE_KEYS.PREFERRED_REGION, region, 90);
  }
  if (city && city !== 'All Cities') {
    setCookie(COOKIE_KEYS.PREFERRED_CITY, city, 90);
  }
}
