import { UserProfile } from '../types';
import { saveRegisteredAccount, findRegisteredAccountByEmail } from '../utils/storage';

// Default Google OAuth Client ID for web / GIS integration
export const GOOGLE_CLIENT_ID = 
  (typeof process !== 'undefined' && process.env?.VITE_GOOGLE_CLIENT_ID) ||
  '1052678912345-auracentra-ghana-client.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: any }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

/**
 * Decodes Google JWT ID token payload
 */
export function decodeGoogleIdToken(token: string): {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
} | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to decode Google ID Token:', err);
    return null;
  }
}

/**
 * Transforms Google payload into a Customer UserProfile
 * STRICT: All Google Sign-ups are customers by default (unless explicitly registering a business)
 * Customers NEVER receive Admin roles.
 */
export function convertGoogleDataToUserProfile(data: {
  email: string;
  name?: string;
  picture?: string;
  sub?: string;
  accountType?: 'customer' | 'business_owner';
  businessName?: string;
}): UserProfile {
  const cleanEmail = data.email.trim().toLowerCase();
  const existing = findRegisteredAccountByEmail(cleanEmail);
  
  const displayName = (data.name || '').trim() || cleanEmail.split('@')[0] || 'Google User';
  const role = data.accountType === 'business_owner' ? 'business_owner' : (existing?.role === 'business_owner' || existing?.role === 'verified_owner' ? existing.role : 'customer');
  
  const userId = existing?.id || `usr-google-${Date.now()}`;
  const username = existing?.username || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');

  const profile: UserProfile = {
    id: userId,
    name: displayName,
    username: username,
    email: cleanEmail,
    emailVerified: true,
    phone: existing?.phone || '+233 24 000 0000',
    phoneVerified: true,
    role: role, // Strictly 'customer' or 'business_owner' - NEVER 'admin'
    accountType: (role === 'business_owner' || role === 'verified_owner') ? 'business_owner' : 'customer',
    avatar: data.picture || existing?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=155DFC&color=fff&bold=true`,
    authProvider: 'google',
    savedBusinessIds: existing ? [] : [],
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  // Persist registered account record
  saveRegisteredAccount({
    id: profile.id,
    name: profile.name,
    username: profile.username,
    email: profile.email,
    emailVerified: true,
    phone: profile.phone,
    phoneVerified: true,
    role: profile.role,
    authProvider: 'google',
    avatar: profile.avatar,
    businessName: data.businessName || existing?.businessName,
    createdAt: profile.createdAt,
    lastLoginAt: new Date().toISOString(),
  });

  return profile;
}

/**
 * Initializes Google Identity Services (One Tap & Sign In)
 */
export function initGoogleIdentityServices(onSuccess: (profile: UserProfile) => void) {
  if (typeof window === 'undefined') return;

  if (window.google?.accounts?.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential?: string }) => {
          if (response?.credential) {
            const decoded = decodeGoogleIdToken(response.credential);
            if (decoded?.email) {
              const profile = convertGoogleDataToUserProfile({
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
                sub: decoded.sub,
              });
              onSuccess(profile);
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    } catch (e) {
      console.warn('Google Identity Services initialization notice:', e);
    }
  }
}
