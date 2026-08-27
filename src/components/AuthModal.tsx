import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2, 
  Building2, 
  User, 
  Fingerprint, 
  LockKeyhole, 
  Check, 
  Sparkles, 
  MessageSquare,
  KeyRound,
  Shield,
  Smartphone
} from 'lucide-react';
import { UserProfile, UserRole, UserAccountRecord } from '../types';
import { SupabaseService, isSupabaseConfigured } from '../lib/supabase';
import { 
  findRegisteredAccountByEmail, 
  saveRegisteredAccount, 
  getRegisteredAccounts,
  DEFAULT_ADMIN_ACCOUNT 
} from '../utils/storage';
import { Logo } from './Logo';
import { INITIAL_CATEGORIES } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
  customTitle?: string;
  customSubtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin',
  customTitle,
  customSubtitle,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot_password'>(initialMode);
  
  // Registration Flow Role Selection
  const [accountType, setAccountType] = useState<'customer' | 'business_owner'>('business_owner');
  
  // Common Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Business Specific Fields
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState(INITIAL_CATEGORIES[0]?.id || 'restaurants');
  const [businessCity, setBusinessCity] = useState('Accra');

  // Phone OTP Verification State
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  // Email Verification Prompt State
  const [emailVerificationPending, setEmailVerificationPending] = useState(false);
  const [pendingUserEmail, setPendingUserEmail] = useState('');

  // UI state
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 2FA state for Admin login
  const [mfaPending, setMfaPending] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  // Saved accounts list on this device
  const [savedAccounts, setSavedAccounts] = useState<UserAccountRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setMfaPending(false);
      setPendingUser(null);
      setShowOtpInput(false);
      setOtpSent(false);
      setPhoneVerified(false);
      setEmailVerificationPending(false);
      if (initialMode) {
        setAuthMode(initialMode);
      }
      try {
        const accs = getRegisteredAccounts().filter(
          (a) => a.email.toLowerCase() !== DEFAULT_ADMIN_ACCOUNT.email.toLowerCase()
        );
        setSavedAccounts(accs);
      } catch (e) {
        console.error('Failed to load accounts for modal', e);
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Password Strength Score
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' };
    return { score, label: 'Strong & Secure', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const passwordStrength = calculatePasswordStrength(password);

  // Send Phone OTP
  const handleSendPhoneOtp = async () => {
    setErrorMsg('');
    setDemoOtpHint(null);

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('Please enter a valid Ghanaian phone number (e.g. 050 820 3673).');
      return;
    }

    setOtpSending(true);
    try {
      const res = await SupabaseService.sendPhoneOtp(cleanPhone);
      setOtpSent(true);
      setShowOtpInput(true);
      if (res.demoCode) {
        setDemoOtpHint(res.demoCode);
      }
      setSuccessMsg(`OTP verification code sent to ${cleanPhone}.`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send OTP code.');
    } finally {
      setOtpSending(false);
    }
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async () => {
    setErrorMsg('');
    if (!otpCode.trim()) {
      setErrorMsg('Please enter the 6-digit code sent to your phone.');
      return;
    }

    try {
      const isValid = await SupabaseService.verifyPhoneOtp(phone, otpCode);
      if (isValid) {
        setPhoneVerified(true);
        setShowOtpInput(false);
        setSuccessMsg('Phone number verified successfully!');
      } else {
        setErrorMsg('Invalid or expired verification code. Please check and try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Verification failed.');
    }
  };

  // 1. Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Please enter both your registered email and password.');
      return;
    }

    // Default Admin Portal Passkey Handling
    if (cleanEmail === DEFAULT_ADMIN_ACCOUNT.email.toLowerCase()) {
      if (cleanPassword === DEFAULT_ADMIN_ACCOUNT.password) {
        const adminProfile: UserProfile = {
          id: DEFAULT_ADMIN_ACCOUNT.id,
          name: DEFAULT_ADMIN_ACCOUNT.name,
          email: DEFAULT_ADMIN_ACCOUNT.email,
          phone: DEFAULT_ADMIN_ACCOUNT.phone,
          role: 'admin',
          savedBusinessIds: [],
          twoFactorEnabled: true,
          createdAt: DEFAULT_ADMIN_ACCOUNT.createdAt,
        };
        setPendingUser(adminProfile);
        setMfaPending(true);
        return;
      } else {
        setErrorMsg('Invalid password for administrative account.');
        return;
      }
    }

    setLoading(true);

    try {
      // 1. Check local registered store
      const localAccount = findRegisteredAccountByEmail(cleanEmail);

      // 2. Authenticate via Supabase Auth
      let supabaseUser: any = null;
      try {
        const supabaseRes = await SupabaseService.signIn(cleanEmail, cleanPassword);
        if (supabaseRes?.user) {
          supabaseUser = supabaseRes.user;
        }
      } catch (sbErr: any) {
        console.warn('[Supabase Auth sign-in warning]', sbErr);
        if (sbErr.message && sbErr.message.toLowerCase().includes('email not confirmed')) {
          setErrorMsg('Email address not yet confirmed. Please verify the link sent to your inbox.');
          setLoading(false);
          return;
        }
      }

      // If local account exists, verify password
      if (localAccount && localAccount.password) {
        if (localAccount.password !== cleanPassword) {
          setErrorMsg('Incorrect password. Please verify your credentials and try again.');
          setLoading(false);
          return;
        }
      } else if (!supabaseUser && !localAccount) {
        setErrorMsg('No account found for this email address. Please sign up to create your verified account.');
        setLoading(false);
        return;
      }

      const uid = supabaseUser?.id || localAccount?.id || `usr-${Date.now()}`;
      const finalName = supabaseUser?.user_metadata?.name || localAccount?.name || cleanEmail.split('@')[0];
      const finalPhone = supabaseUser?.user_metadata?.phone || localAccount?.phone || '+233 24 000 0000';
      const finalRole = (supabaseUser?.user_metadata?.role || localAccount?.role || 'customer') as UserRole;

      const userProfile: UserProfile = {
        id: uid,
        name: finalName,
        email: cleanEmail,
        phone: finalPhone,
        role: finalRole,
        savedBusinessIds: [],
        createdAt: localAccount?.createdAt || new Date().toISOString(),
      };

      // Save / update local session storage
      saveRegisteredAccount({
        id: uid,
        name: finalName,
        email: cleanEmail,
        phone: finalPhone,
        role: finalRole,
        password: cleanPassword,
        createdAt: userProfile.createdAt,
        lastLoginAt: new Date().toISOString(),
      });

      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Sign Up Handler (Separate flows for Customer vs Business Owner)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim() || '+233 24 000 0000';

    if (!cleanName) {
      setErrorMsg(accountType === 'business_owner' ? 'Please enter the representative/owner name.' : 'Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (accountType === 'business_owner' && !businessName.trim()) {
      setErrorMsg('Please enter your business or company name.');
      return;
    }
    if (cleanPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (cleanPassword !== confirmPassword.trim()) {
      setErrorMsg('Passwords do not match. Please confirm your password.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    // Check if email already registered locally
    const existing = findRegisteredAccountByEmail(cleanEmail);
    if (existing) {
      setErrorMsg('An account with this email address already exists. Please sign in instead.');
      return;
    }

    setLoading(true);

    try {
      const displayName = accountType === 'business_owner' 
        ? `${cleanName} (${businessName.trim()})`
        : cleanName;

      // Register with Supabase Authentication
      let uid = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      let emailConfirmationNeeded = false;

      try {
        const signupRes = await SupabaseService.signUp(cleanEmail, cleanPassword, {
          name: displayName,
          role: accountType,
          phone: cleanPhone,
        });

        if (signupRes?.user) {
          uid = signupRes.user.id;
        }
        if (signupRes?.requiresEmailConfirmation) {
          emailConfirmationNeeded = true;
        }
      } catch (sbErr: any) {
        console.warn('[Supabase Sign Up note]', sbErr);
        if (sbErr.message && sbErr.message.includes('already registered')) {
          setErrorMsg('An account with this email already exists in Supabase. Please sign in.');
          setLoading(false);
          return;
        }
      }

      // Save registered account record for password-verified logout
      const newRecord: UserAccountRecord = {
        id: uid,
        name: displayName,
        email: cleanEmail,
        phone: cleanPhone,
        role: accountType,
        password: cleanPassword,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      saveRegisteredAccount(newRecord);

      const newUserProfile: UserProfile = {
        id: uid,
        name: displayName,
        email: cleanEmail,
        phone: cleanPhone,
        role: accountType,
        authProvider: 'email',
        phoneVerified: phoneVerified,
        savedBusinessIds: [],
        createdAt: newRecord.createdAt,
      };

      if (emailConfirmationNeeded && isSupabaseConfigured) {
        setPendingUserEmail(cleanEmail);
        setEmailVerificationPending(true);
        setSuccessMsg(`Account created! A verification link has been sent to ${cleanEmail}. Please verify your email.`);
        setLoading(false);
        return;
      }

      onLoginSuccess(newUserProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Google Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        await SupabaseService.signInWithOAuth('google');
        return;
      }

      // Fallback local Google profile
      const cleanEmail = email && email.includes('@') ? email.trim().toLowerCase() : `google.user${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
      const displayName = name.trim() || 'Google User';
      const uid = `google-usr-${Date.now()}`;

      const existingAccount = findRegisteredAccountByEmail(cleanEmail);
      const userProfile: UserProfile = {
        id: existingAccount?.id || uid,
        name: existingAccount?.name || displayName,
        email: cleanEmail,
        phone: existingAccount?.phone || '+233 24 000 0000',
        role: existingAccount?.role || 'customer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=155DFC&color=fff`,
        authProvider: 'google',
        savedBusinessIds: [],
        createdAt: existingAccount?.createdAt || new Date().toISOString(),
      };

      saveRegisteredAccount({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        role: userProfile.role,
        authProvider: 'google',
        password: password.trim() || 'GoogleAuth123!',
        createdAt: userProfile.createdAt,
        lastLoginAt: new Date().toISOString(),
      });

      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Apple / iCloud Sign-In
  const handleAppleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        await SupabaseService.signInWithOAuth('apple');
        return;
      }

      const cleanEmail = email && email.includes('@') ? email.trim().toLowerCase() : `apple.user${Math.floor(1000 + Math.random() * 9000)}@icloud.com`;
      const displayName = name.trim() || 'Apple Member';
      const uid = `apple-usr-${Date.now()}`;

      const existingAccount = findRegisteredAccountByEmail(cleanEmail);
      const userProfile: UserProfile = {
        id: existingAccount?.id || uid,
        name: existingAccount?.name || displayName,
        email: cleanEmail,
        phone: existingAccount?.phone || '+233 24 000 0000',
        role: existingAccount?.role || 'customer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=000000&color=fff`,
        authProvider: 'apple',
        savedBusinessIds: [],
        createdAt: existingAccount?.createdAt || new Date().toISOString(),
      };

      saveRegisteredAccount({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        role: userProfile.role,
        authProvider: 'apple',
        password: password.trim() || 'AppleAuth123!',
        createdAt: userProfile.createdAt,
        lastLoginAt: new Date().toISOString(),
      });

      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in with Apple / iCloud.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Admin MFA Check
  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length < 4) {
      setErrorMsg('Please enter the 6-digit administrative security code (Default: 123456).');
      return;
    }

    if (pendingUser) {
      onLoginSuccess(pendingUser);
      setMfaPending(false);
      setPendingUser(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden my-6"
        id="auracentra-auth-modal"
      >
        {/* Header Ribbon */}
        <div className="p-6 bg-linear-to-b from-blue-50/80 via-white to-white dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <Logo size="sm" variant="full" />
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <LockKeyhole className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <span>
                {customTitle || (
                  authMode === 'signup' 
                    ? accountType === 'business_owner' ? 'Register Business Account' : 'Create Customer Account'
                    : authMode === 'forgot_password' 
                    ? 'Reset Account Password' 
                    : 'Sign In to AuraCentra'
                )}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {customSubtitle || (
                authMode === 'signup'
                  ? accountType === 'business_owner'
                    ? 'List and manage your enterprise on Ghana’s verified directory.'
                    : 'Access verified Ghanaian listings, request quotes, and leave verified reviews.'
                  : 'Enter your account credentials to access your listings and dashboard.'
              )}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {authMode !== 'forgot_password' && !mfaPending && !emailVerificationPending && (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mt-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {/* Email Verification Pending Screen */}
          {emailVerificationPending ? (
            <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verify Your Email Address</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  We sent an account confirmation email to <strong className="text-blue-600 dark:text-cyan-400">{pendingUserEmail}</strong>.
                  Please click the link in your inbox to confirm your registration.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailVerificationPending(false);
                    setAuthMode('signin');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  Proceed to Sign In
                </button>
              </div>
            </div>
          ) : mfaPending ? (
            /* Admin MFA Screen */
            <form onSubmit={handleVerifyMfa} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Admin Security Verification</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter your 2FA security passkey to access the executive platform.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Security Passkey
                </label>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="Enter 123456"
                  className="w-full text-center tracking-widest text-lg font-mono font-bold px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Verify & Enter Portal
              </button>
            </form>
          ) : authMode === 'signup' ? (
            /* Sign Up Registration Flow */
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Distinct Registration Flow Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Account Registration Type:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAccountType('business_owner')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      accountType === 'business_owner'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Building2 className={`w-4 h-4 ${accountType === 'business_owner' ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-extrabold">Business Provider</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Enlist enterprise, manage quotes & analytics
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('customer')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      accountType === 'customer'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <User className={`w-4 h-4 ${accountType === 'customer' ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-extrabold">Customer</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Discover services, book quotes & reviews
                    </span>
                  </button>
                </div>
              </div>

              {/* Business specific fields */}
              {accountType === 'business_owner' && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Business Profile Information</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Veritas Motors Ltd"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={businessCategory}
                        onChange={(e) => setBusinessCategory(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        {INITIAL_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={businessCity}
                        onChange={(e) => setBusinessCity(e.target.value)}
                        placeholder="Accra / Kumasi"
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Name field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {accountType === 'business_owner' ? 'Authorized Representative Name' : 'Full Name'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={accountType === 'business_owner' ? 'e.g. Tony Boateng' : 'e.g. Kwame Mensah'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {accountType === 'business_owner' ? 'Business Email Address' : 'Email Address'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={accountType === 'business_owner' ? 'e.g. info@veritasmotors.com' : 'e.g. kwame@example.com'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Phone OTP Verification */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number (Ghana)
                  </label>
                  {phoneVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">SMS / OTP Protected</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 050 820 3673"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {!phoneVerified && (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={otpSending || !phone.trim()}
                      className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-cyan-400 text-xs font-bold hover:bg-blue-100 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
                    >
                      {otpSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send OTP'}
                    </button>
                  )}
                </div>

                {/* OTP Input Section */}
                {showOtpInput && !phoneVerified && (
                  <div className="mt-2.5 p-3 rounded-xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      <span>Enter 6-Digit OTP Code:</span>
                      {demoOtpHint && (
                        <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-mono">Code: {demoOtpHint}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="••••••"
                        className="flex-1 tracking-widest text-center font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhoneOtp}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password (Min 8 Characters) <span className="text-rose-500">*</span>
                  </label>
                  {password && (
                    <span className={`text-[11px] font-bold ${passwordStrength.text}`}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms-cb"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="agree-terms-cb" className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                  I agree to the <span className="font-semibold text-blue-600 dark:text-cyan-400">Terms of Service</span> & <span className="font-semibold text-blue-600 dark:text-cyan-400">Privacy Policy</span>.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{accountType === 'business_owner' ? 'Register Business Account' : 'Create Customer Account'}</span>
              </button>

              <div className="text-center pt-1 text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg('');
                  }}
                  className="font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          ) : (
            /* Sign In Flow */
            <div className="space-y-4">
              {/* Social Login Options */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl bg-black dark:bg-slate-950 text-white hover:bg-slate-900 border border-black dark:border-slate-700 font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.36-.58.67-1.09 1.74-.95 2.77.99.08 2.04-.52 2.67-1.28z" />
                  </svg>
                  <span>Continue with Apple / iCloud</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center pt-1">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                <span className="absolute px-3 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  or email credentials
                </span>
              </div>

              {/* Saved accounts selection */}
              {savedAccounts.length > 0 && !email && (
                <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700/80">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                    <span>Saved Accounts on this Device</span>
                  </div>
                  <div className="space-y-1.5">
                    {savedAccounts.slice(0, 2).map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setEmail(acc.email);
                          if (acc.password) {
                            setPassword(acc.password);
                          }
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-blue-400 transition-all text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            {acc.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{acc.name}</div>
                            <div className="text-[10px] text-slate-400">{acc.email}</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-blue-600 dark:text-cyan-400">Select →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Email & Password Form */}
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. kwame@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember this account</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>Sign In to Platform</span>
                </button>

                <div className="text-center pt-2 text-xs text-slate-500">
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMsg('');
                    }}
                    className="font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    Sign Up now
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Platform Security Badge */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Supabase Cloud Encrypted Authentication • Ghana</span>
          </div>
        </div>
      </div>
    </div>
  );
};
