import { UserProfile } from '../types';
import { saveRegisteredAccount, findRegisteredAccountByEmail } from '../utils/storage';

// Get Google OAuth Client ID from environment safely
export const GOOGLE_CLIENT_ID = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) ||
  (typeof process !== 'undefined' && process.env?.VITE_GOOGLE_CLIENT_ID) ||
  '';

export function isGoogleClientConfigured(): boolean {
  return Boolean(
    GOOGLE_CLIENT_ID && 
    !GOOGLE_CLIENT_ID.includes('auracentra-ghana-client') && 
    GOOGLE_CLIENT_ID.endsWith('.apps.googleusercontent.com')
  );
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          disableAutoSelect: () => void;
          cancel: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: any }) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

/**
 * Decodes Google JWT ID token payload safely
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
 * Fetches user profile from Google UserInfo API using an access token
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<{
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email?: boolean;
} | null> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch Google userinfo via token:', e);
  }
  return null;
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
  
  const userId = existing?.id || (data.sub ? `usr-g-${data.sub}` : `usr-google-${Date.now()}`);
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
    savedBusinessIds: existing?.savedBusinessIds || [],
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Persist registered account record locally
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

  // Sync with backend API in background
  try {
    fetch('/api/auth/google-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile,
        googleId: data.sub,
      }),
    }).catch(() => {});
  } catch (_) {}

  return profile;
}

/**
 * Initializes Google Identity Services (One Tap & Sign In)
 */
export function initGoogleIdentityServices(onSuccess: (profile: UserProfile) => void) {
  if (typeof window === 'undefined') return;
  if (!isGoogleClientConfigured()) return;

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

/**
 * Render official Google Sign-In Button inside a container element
 */
export function renderGoogleButton(
  container: HTMLElement,
  onSuccess: (profile: UserProfile) => void,
  options?: { accountType?: 'customer' | 'business_owner'; businessName?: string }
) {
  if (typeof window === 'undefined' || !window.google?.accounts?.id) return;
  if (!isGoogleClientConfigured()) return;

  try {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (res: { credential?: string }) => {
        if (res?.credential) {
          const decoded = decodeGoogleIdToken(res.credential);
          if (decoded?.email) {
            const profile = convertGoogleDataToUserProfile({
              email: decoded.email,
              name: decoded.name,
              picture: decoded.picture,
              sub: decoded.sub,
              accountType: options?.accountType,
              businessName: options?.businessName,
            });
            onSuccess(profile);
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      logo_alignment: 'left',
      width: '100%',
    });
  } catch (err) {
    console.warn('[GSI Render Button Notice]', err);
  }
}

/**
 * Trigger OAuth 2.0 Token Client Popup for user consent (Pops up Google Account Chooser)
 */
export function triggerGoogleOAuthFlow(
  onSuccess: (profile: UserProfile) => void,
  onFailure: (error: string) => void,
  options?: { accountType?: 'customer' | 'business_owner'; businessName?: string }
) {
  if (typeof window === 'undefined') {
    onFailure('Window is undefined');
    return;
  }

  // 1. If Google OAuth2 client is initialized and configured
  if (isGoogleClientConfigured() && window.google?.accounts?.oauth2) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            onFailure(tokenResponse.error);
            return;
          }
          if (tokenResponse.access_token) {
            const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
            if (userInfo && userInfo.email) {
              const profile = convertGoogleDataToUserProfile({
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                sub: userInfo.id,
                accountType: options?.accountType,
                businessName: options?.businessName,
              });
              onSuccess(profile);
              return;
            }
          }
          onFailure('Could not retrieve user info from Google');
        },
      });

      // Forces Google Account Chooser popup with all registered Google accounts on the phone/device
      client.requestAccessToken({ prompt: 'select_account' });
      return;
    } catch (err: any) {
      console.warn('[Google OAuth2 init error]', err);
    }
  }

  // 2. If GIS One Tap is present
  if (isGoogleClientConfigured() && window.google?.accounts?.id) {
    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
          onFailure('prompt_skipped');
        }
      });
      return;
    } catch (err) {
      onFailure('prompt_error');
      return;
    }
  }

  onFailure('gsi_not_ready');
}
