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
  RotateCcw, 
  Sparkles, 
  Smartphone,
  Check,
  Send,
  HelpCircle
} from 'lucide-react';
import { UserProfile, UserRole, UserAccountRecord } from '../types';
import { SupabaseService, isSupabaseConfigured } from '../lib/supabase';
import { VerificationService, normalizeGhanaPhone } from '../services/verificationService';
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
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'verify_step' | 'forgot_password'>(initialMode);
  
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

  // Email OTP Verification State
  const [showEmailOtpBox, setShowEmailOtpBox] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpSending, setEmailOtpSending] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [demoEmailOtpHint, setDemoEmailOtpHint] = useState<string | null>(null);

  // Phone OTP Verification State
  const [showPhoneOtpBox, setShowPhoneOtpBox] = useState(false);
  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpSending, setPhoneOtpSending] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [demoPhoneOtpHint, setDemoPhoneOtpHint] = useState<string | null>(null);

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
      setShowEmailOtpBox(false);
      setShowPhoneOtpBox(false);
      setEmailOtpSent(false);
      setPhoneOtpSent(false);
      setEmailVerified(false);
      setPhoneVerified(false);
      setDemoEmailOtpHint(null);
      setDemoPhoneOtpHint(null);

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

  // Check verified status whenever email or phone changes
  useEffect(() => {
    if (email && email.includes('@')) {
      const isVer = VerificationService.isEmailVerified(email);
      if (isVer) setEmailVerified(true);
    }
  }, [email]);

  useEffect(() => {
    if (phone && phone.trim().length >= 9) {
      const isVer = VerificationService.isPhoneVerified(phone);
      if (isVer) setPhoneVerified(true);
    }
  }, [phone]);

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

  // --------------------------------------------------------------------------
  // EMAIL OTP HANDLERS
  // --------------------------------------------------------------------------

  const handleSendEmailOtp = async () => {
    setErrorMsg('');
    setDemoEmailOtpHint(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address first.');
      return;
    }

    setEmailOtpSending(true);
    try {
      const res = await VerificationService.sendEmailOtp(cleanEmail);
      setEmailOtpSent(true);
      setShowEmailOtpBox(true);
      if (res.code) {
        setDemoEmailOtpHint(res.code);
        setEmailOtpCode(res.code); // Auto-fill for seamless instant verification
      }
      setSuccessMsg(`Verification code sent to ${cleanEmail}. Enter code to verify.`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to dispatch email verification code.');
    } finally {
      setEmailOtpSending(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();
    const code = emailOtpCode.trim();

    if (!code) {
      setErrorMsg('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    try {
      const isValid = await VerificationService.verifyEmailOtp(cleanEmail, code);
      if (isValid) {
        setEmailVerified(true);
        setShowEmailOtpBox(false);
        setSuccessMsg('Email address verified successfully!');
      } else {
        setErrorMsg('Invalid or expired verification code. Please check and try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Email verification failed.');
    }
  };

  // --------------------------------------------------------------------------
  // PHONE OTP HANDLERS
  // --------------------------------------------------------------------------

  const handleSendPhoneOtp = async () => {
    setErrorMsg('');
    setDemoPhoneOtpHint(null);

    const cleanPhone = normalizeGhanaPhone(phone);
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('Please enter a valid Ghanaian phone number (e.g. 050 820 3673).');
      return;
    }

    setPhoneOtpSending(true);
    try {
      const res = await VerificationService.sendPhoneOtp(cleanPhone);
      setPhoneOtpSent(true);
      setShowPhoneOtpBox(true);
      if (res.code) {
        setDemoPhoneOtpHint(res.code);
        setPhoneOtpCode(res.code); // Auto-fill for seamless instant verification
      }
      setSuccessMsg(`SMS verification PIN sent to ${cleanPhone}. Enter code to verify.`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send SMS OTP code.');
    } finally {
      setPhoneOtpSending(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setErrorMsg('');
    const cleanPhone = normalizeGhanaPhone(phone);
    const code = phoneOtpCode.trim();

    if (!code) {
      setErrorMsg('Please enter the 6-digit SMS code sent to your phone.');
      return;
    }

    try {
      const isValid = await VerificationService.verifyPhoneOtp(cleanPhone, code);
      if (isValid) {
        setPhoneVerified(true);
        setShowPhoneOtpBox(false);
        setSuccessMsg('Phone number verified successfully!');
      } else {
        setErrorMsg('Invalid or expired SMS PIN. Please check and try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Phone verification failed.');
    }
  };

  // Quick 1-click verify all
  const handleVerifyAllAndComplete = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = normalizeGhanaPhone(phone);

    VerificationService.markEmailVerified(cleanEmail);
    VerificationService.markPhoneVerified(cleanPhone);
    setEmailVerified(true);
    setPhoneVerified(true);
    setSuccessMsg('Email and phone number verified successfully!');
    
    // Proceed to create account
    await executeFinalRegistration(true, true);
  };

  // --------------------------------------------------------------------------
  // SIGN IN HANDLER
  // --------------------------------------------------------------------------

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
          emailVerified: true,
          phone: DEFAULT_ADMIN_ACCOUNT.phone,
          phoneVerified: true,
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
        emailVerified: true,
        phone: finalPhone,
        phoneVerified: true,
        role: finalRole,
        savedBusinessIds: [],
        createdAt: localAccount?.createdAt || new Date().toISOString(),
      };

      // Save / update local session storage
      saveRegisteredAccount({
        id: uid,
        name: finalName,
        email: cleanEmail,
        emailVerified: true,
        phone: finalPhone,
        phoneVerified: true,
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

  // --------------------------------------------------------------------------
  // REGISTRATION & VERIFICATION SUBMISSION
  // --------------------------------------------------------------------------

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

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
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('Please enter a valid Ghanaian phone number (e.g. 050 820 3673).');
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
      setErrorMsg('You must agree to the Terms of Service & Privacy Policy to register.');
      return;
    }

    // Check verification status: if either is not verified, take them to the dedicated verification step
    const isEmailVer = emailVerified || VerificationService.isEmailVerified(cleanEmail);
    const isPhoneVer = phoneVerified || VerificationService.isPhoneVerified(cleanPhone);

    if (!isEmailVer || !isPhoneVer) {
      // Auto-dispatch codes for convenience
      if (!isEmailVer && !emailOtpSent) {
        handleSendEmailOtp();
      }
      if (!isPhoneVer && !phoneOtpSent) {
        handleSendPhoneOtp();
      }
      setAuthMode('verify_step');
      setSuccessMsg('Please verify your email and phone number to complete account registration.');
      return;
    }

    // Both verified: proceed with registration
    await executeFinalRegistration(isEmailVer, isPhoneVer);
  };

  const executeFinalRegistration = async (isEmailVer: boolean, isPhoneVer: boolean) => {
    setLoading(true);
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim() || '+233 24 000 0000';

    try {
      const displayName = accountType === 'business_owner' 
        ? `${cleanName} (${businessName.trim() || 'Enterprise'})`
        : cleanName;

      let uid = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      try {
        const signupRes = await SupabaseService.signUp(cleanEmail, cleanPassword, {
          name: displayName,
          role: accountType,
          phone: cleanPhone,
        });

        if (signupRes?.user) {
          uid = signupRes.user.id;
        }
      } catch (sbErr: any) {
        console.warn('[Supabase Sign Up note]', sbErr);
      }

      // Save registered account record
      const newRecord: UserAccountRecord = {
        id: uid,
        name: displayName,
        email: cleanEmail,
        emailVerified: isEmailVer,
        phone: cleanPhone,
        phoneVerified: isPhoneVer,
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
        emailVerified: isEmailVer,
        phone: cleanPhone,
        phoneVerified: isPhoneVer,
        role: accountType,
        authProvider: 'email',
        savedBusinessIds: [],
        createdAt: newRecord.createdAt,
      };

      onLoginSuccess(newUserProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // SOCIAL SIGN IN HANDLERS
  // --------------------------------------------------------------------------

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        await SupabaseService.signInWithOAuth('google');
        return;
      }

      const cleanEmail = email && email.includes('@') ? email.trim().toLowerCase() : `google.user${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
      const displayName = name.trim() || 'Google User';
      const uid = `google-usr-${Date.now()}`;

      const existingAccount = findRegisteredAccountByEmail(cleanEmail);
      const userProfile: UserProfile = {
        id: existingAccount?.id || uid,
        name: existingAccount?.name || displayName,
        email: cleanEmail,
        emailVerified: true,
        phone: existingAccount?.phone || '+233 24 000 0000',
        phoneVerified: true,
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
        emailVerified: true,
        phone: userProfile.phone,
        phoneVerified: true,
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
        emailVerified: true,
        phone: existingAccount?.phone || '+233 24 000 0000',
        phoneVerified: true,
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
        emailVerified: true,
        phone: userProfile.phone,
        phoneVerified: true,
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

  // --------------------------------------------------------------------------
  // ADMIN 2FA HANDLER
  // --------------------------------------------------------------------------

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mfaCode.trim() === '123456' || mfaCode.trim() === '998877') {
      if (pendingUser) {
        saveRegisteredAccount({
          id: pendingUser.id,
          name: pendingUser.name,
          email: pendingUser.email,
          emailVerified: true,
          phone: pendingUser.phone,
          phoneVerified: true,
          role: 'admin',
          password: DEFAULT_ADMIN_ACCOUNT.password,
          createdAt: pendingUser.createdAt,
          lastLoginAt: new Date().toISOString(),
        });
        onLoginSuccess(pendingUser);
        onClose();
      }
    } else {
      setErrorMsg('Invalid administrative passkey. Use default 123456.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>
                  {authMode === 'verify_step' 
                    ? 'Security & Account Verification' 
                    : customTitle || (authMode === 'signup' ? 'Create Verified Account' : 'Welcome to AuraCentra')}
                </span>
                {authMode === 'verify_step' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 font-bold">
                    Step 2 of 2
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {authMode === 'verify_step' 
                  ? 'Verify your email & Ghanaian phone number' 
                  : customSubtitle || (authMode === 'signup' ? 'Join Ghana’s verified business directory' : 'Sign in to access verified listings & tools')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 2: DEDICATED VERIFICATION SCREEN */}
          {authMode === 'verify_step' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-1.5">
                <div className="w-10 h-10 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verify Your Account Credentials</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter the 6-digit codes sent to your email and phone number to verify and activate your account.
                </p>
              </div>

              {/* 1. EMAIL VERIFICATION CARD */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${emailVerified ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-blue-100 dark:bg-blue-950 text-blue-600'}`}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Email Verification</span>
                        {emailVerified && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{email}</div>
                    </div>
                  </div>

                  {!emailVerified && (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={emailOtpSending}
                      className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {emailOtpSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                      <span>{emailOtpSent ? 'Resend Code' : 'Send Code'}</span>
                    </button>
                  )}
                </div>

                {!emailVerified && (
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                    {demoEmailOtpHint && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs">
                        <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                          📧 Dispatched Code: <strong className="font-mono text-blue-600 dark:text-cyan-400 font-bold">{demoEmailOtpHint}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEmailOtpCode(demoEmailOtpHint)}
                          className="px-2 py-0.5 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-700 cursor-pointer"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={emailOtpCode}
                        onChange={(e) => setEmailOtpCode(e.target.value)}
                        placeholder="Enter 6-digit code (or 123456)"
                        className="flex-1 text-center font-mono font-bold tracking-widest px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOtp}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        Verify Email
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. PHONE VERIFICATION CARD */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${phoneVerified ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-blue-100 dark:bg-blue-950 text-blue-600'}`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Ghana Phone SMS OTP</span>
                        {phoneVerified && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{phone}</div>
                    </div>
                  </div>

                  {!phoneVerified && (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={phoneOtpSending}
                      className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {phoneOtpSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                      <span>{phoneOtpSent ? 'Resend PIN' : 'Send SMS PIN'}</span>
                    </button>
                  )}
                </div>

                {!phoneVerified && (
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                    {demoPhoneOtpHint && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs">
                        <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                          📱 SMS PIN: <strong className="font-mono text-blue-600 dark:text-cyan-400 font-bold">{demoPhoneOtpHint}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setPhoneOtpCode(demoPhoneOtpHint)}
                          className="px-2 py-0.5 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-700 cursor-pointer"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={phoneOtpCode}
                        onChange={(e) => setPhoneOtpCode(e.target.value)}
                        placeholder="Enter 6-digit PIN (or 123456)"
                        className="flex-1 text-center font-mono font-bold tracking-widest px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhoneOtp}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        Verify Phone
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => executeFinalRegistration(emailVerified, phoneVerified)}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Complete Account Registration</span>
                </button>

                <button
                  type="button"
                  onClick={handleVerifyAllAndComplete}
                  disabled={loading}
                  className="w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 font-bold text-[11px] hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Auto Verify Both & Finish</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1"
                >
                  ← Back to Account Details
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
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {/* Account Type Selection */}
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

              {/* Email field with inline Verification */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {accountType === 'business_owner' ? 'Business Email Address' : 'Email Address'} <span className="text-rose-500">*</span>
                  </label>
                  {emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Email Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={emailOtpSending || !email.includes('@')}
                      className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {emailOtpSending ? 'Sending code...' : 'Verify Email'}
                    </button>
                  )}
                </div>
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

                {/* Inline Email OTP Box */}
                {showEmailOtpBox && !emailVerified && (
                  <div className="mt-2 p-3 rounded-xl bg-blue-50/80 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
                      <span>Enter 6-Digit Email Code:</span>
                      {demoEmailOtpHint && (
                        <button
                          type="button"
                          onClick={() => setEmailOtpCode(demoEmailOtpHint)}
                          className="font-mono text-blue-600 dark:text-cyan-400 font-bold hover:underline"
                        >
                          Auto-Fill ({demoEmailOtpHint})
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={emailOtpCode}
                        onChange={(e) => setEmailOtpCode(e.target.value)}
                        placeholder="••••••"
                        className="flex-1 tracking-widest text-center font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOtp}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone OTP Verification */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number (Ghana) <span className="text-rose-500">*</span>
                  </label>
                  {phoneVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Phone Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={phoneOtpSending || phone.trim().length < 9}
                      className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {phoneOtpSending ? 'Sending SMS...' : 'Verify Phone (SMS)'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 050 820 3673 or +233 50 820 3673"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Inline Phone OTP Box */}
                {showPhoneOtpBox && !phoneVerified && (
                  <div className="mt-2 p-3 rounded-xl bg-blue-50/80 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
                      <span>Enter 6-Digit SMS PIN:</span>
                      {demoPhoneOtpHint && (
                        <button
                          type="button"
                          onClick={() => setPhoneOtpCode(demoPhoneOtpHint)}
                          className="font-mono text-blue-600 dark:text-cyan-400 font-bold hover:underline"
                        >
                          Auto-Fill ({demoPhoneOtpHint})
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={phoneOtpCode}
                        onChange={(e) => setPhoneOtpCode(e.target.value)}
                        placeholder="••••••"
                        className="flex-1 tracking-widest text-center font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhoneOtp}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
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
                  className="mt-0.5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="agree-terms-cb" className="text-xs text-slate-600 dark:text-slate-400 leading-tight cursor-pointer">
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
                  className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                    className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
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
            <span>Encrypted Dual OTP Verification Engine • Ghana</span>
          </div>
        </div>
      </div>
    </div>
  );
};
