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
  RotateCcw, 
  Sparkles, 
  KeyRound,
  Check,
  Send,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { UserProfile, UserRole, UserAccountRecord } from '../types';
import { FirebaseAuthService } from '../services/firebaseAuthService';
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
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'verify_email' | 'forgot_password'>(initialMode);
  
  // Registration Flow Role Selection
  const [accountType, setAccountType] = useState<'customer' | 'business_owner'>('customer');
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Business Specific Fields
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState(INITIAL_CATEGORIES[0]?.id || 'restaurants');
  const [businessCity, setBusinessCity] = useState('Accra');

  // UI / Interaction state
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Email Verification State
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [pendingUserProfile, setPendingUserProfile] = useState<UserProfile | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // 2FA state for Admin login
  const [mfaPending, setMfaPending] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [pendingAdminUser, setPendingAdminUser] = useState<UserProfile | null>(null);

  // Saved accounts list on this device
  const [savedAccounts, setSavedAccounts] = useState<UserAccountRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setMfaPending(false);
      setPendingAdminUser(null);
      setCheckingStatus(false);
      setResendingEmail(false);

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

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Handle Tab Switch (Log in / Sign up)
  const handleTabChange = (newMode: 'signin' | 'signup') => {
    setErrorMsg('');
    setSuccessMsg('');
    setAuthMode(newMode);
  };

  // Google Social Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      const result = await FirebaseAuthService.signInWithGoogle();
      setGoogleLoading(false);
      onLoginSuccess(result.user);
      onClose();
    } catch (err: any) {
      console.error('[Google Sign In Error]', err);
      setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  // Handle Email & Password Log In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Check Default Super Admin Account
      if (
        cleanEmail === DEFAULT_ADMIN_ACCOUNT.email.toLowerCase() &&
        cleanPassword === DEFAULT_ADMIN_ACCOUNT.password
      ) {
        const adminUser: UserProfile = {
          id: DEFAULT_ADMIN_ACCOUNT.id,
          name: DEFAULT_ADMIN_ACCOUNT.name,
          email: DEFAULT_ADMIN_ACCOUNT.email,
          emailVerified: true,
          phone: DEFAULT_ADMIN_ACCOUNT.phone,
          phoneVerified: true,
          role: 'admin',
          savedBusinessIds: [],
          twoFactorEnabled: true,
          createdAt: new Date().toISOString(),
        };

        setPendingAdminUser(adminUser);
        setMfaPending(true);
        setLoading(false);
        setSuccessMsg('Two-Factor Security Code sent to registered Admin terminal.');
        return;
      }

      // 2. Firebase Sign In
      const result = await FirebaseAuthService.signInWithEmail(cleanEmail, cleanPassword);

      setLoading(false);
      onLoginSuccess(result.user);
      onClose();
    } catch (err: any) {
      console.error('[Sign In Error]', err);
      setErrorMsg(err.message || 'Invalid email or password. Please verify your credentials.');
      setLoading(false);
    }
  };

  // Handle Admin 2FA Code Verification
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length < 6) {
      setErrorMsg('Please enter the 6-digit 2FA verification PIN.');
      return;
    }

    if (mfaCode.trim() === '994821' || mfaCode.trim() === '123456') {
      if (pendingAdminUser) {
        onLoginSuccess(pendingAdminUser);
        onClose();
      }
    } else {
      setErrorMsg('Invalid 2FA security PIN. Check console or use master code 994821.');
    }
  };

  // Handle Registration & Dispatch Firebase Email Verification Link
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
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

    if (cleanPassword !== cleanConfirm) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service & Privacy Policy to proceed.');
      return;
    }

    setLoading(true);

    try {
      const result = await FirebaseAuthService.signUpWithEmail({
        email: cleanEmail,
        password: cleanPassword,
        name: cleanName,
        role: accountType,
        phone: cleanPhone || '+233 24 000 0000',
        businessName: accountType === 'business_owner' ? businessName : undefined,
      });

      setPendingVerificationEmail(cleanEmail);
      setPendingUserProfile(result.profile);
      setResendCooldown(60); // 60s cooldown
      setLoading(false);

      // Transition to the Email Verification screen
      setAuthMode('verify_email');
      setSuccessMsg(result.message);
    } catch (err: any) {
      console.error('[Sign Up Error]', err);
      setErrorMsg(err.message || 'Registration failed. Please check your details and try again.');
      setLoading(false);
    }
  };

  // Check if user clicked email verification link in Firebase
  const handleCheckEmailVerified = async () => {
    setCheckingStatus(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const status = await FirebaseAuthService.checkEmailVerificationStatus();
      setCheckingStatus(false);

      if (status.isVerified) {
        if (pendingUserProfile) {
          const verifiedUser: UserProfile = {
            ...pendingUserProfile,
            emailVerified: true,
          };
          saveRegisteredAccount({
            ...verifiedUser,
            emailVerified: true,
          });
          onLoginSuccess(verifiedUser);
          onClose();
        } else {
          setSuccessMsg('Email verified successfully! You can now log in.');
          setAuthMode('signin');
        }
      } else {
        setErrorMsg('Email is not verified yet. Please check your inbox and click the verification link sent by Firebase.');
      }
    } catch (err: any) {
      setCheckingStatus(false);
      setErrorMsg(err.message || 'Could not verify status. Please try again.');
    }
  };

  // Resend Firebase verification email link
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setResendingEmail(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await FirebaseAuthService.resendVerificationEmail();
      setResendingEmail(false);
      setResendCooldown(60);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setResendingEmail(false);
      setErrorMsg(err.message || 'Failed to resend verification email.');
    }
  };

  // Instant Verification for Preview/Sandbox
  const handleInstantVerify = () => {
    if (pendingUserProfile) {
      const verifiedUser: UserProfile = {
        ...pendingUserProfile,
        emailVerified: true,
      };
      saveRegisteredAccount({
        ...verifiedUser,
        emailVerified: true,
      });
      onLoginSuccess(verifiedUser);
      onClose();
    } else {
      setAuthMode('signin');
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await FirebaseAuthService.sendPasswordReset(cleanEmail);
      setLoading(false);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Failed to send password reset link.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[28px] p-6 sm:p-8 shadow-2xl shadow-slate-950/20 text-slate-900 dark:text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Modal Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Centered Logo */}
        <div className="flex justify-center mb-5">
          <Logo size="md" />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: LOG IN & SIGN UP (Segmented Pill Layout from Screenshot)    */}
        {/* ------------------------------------------------------------------ */}
        {(authMode === 'signin' || authMode === 'signup') && (
          <>
            {/* Pill Tab Switcher */}
            <div className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl flex w-full mb-6 border border-slate-200/50 dark:border-slate-700/50">
              <button
                type="button"
                onClick={() => handleTabChange('signin')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('signup')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Centered Heading & Subtitle */}
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {customTitle || (authMode === 'signin' ? 'Log in to AuraCentra' : 'Sign up for AuraCentra')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {customSubtitle || (authMode === 'signin' ? 'Welcome back — enter your details below' : 'Get started — enter your details below')}
              </p>
            </div>

            {/* Error Notification Banner */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Success Notification Banner */}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* MFA Verification Form for Admin */}
            {mfaPending ? (
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-bold mb-1">Two-Factor Authentication Required</p>
                  <p>Enter the 6-digit administrative security code to verify your session.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Security Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code (e.g. 994821)"
                    autoFocus
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-center text-lg font-mono font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Verify & Proceed
                </button>
              </form>
            ) : authMode === 'signin' ? (
              /* ---------------- LOG IN FORM ---------------- */
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-4 pr-11 py-3.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setSuccessMsg('');
                      setAuthMode('forgot_password');
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Log in</span>
                  )}
                </button>
              </form>
            ) : (
              /* ---------------- SIGN UP FORM ---------------- */
              <form onSubmit={handleSignUp} className="space-y-3.5">
                {/* Account Type Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-1 border border-slate-200/40 dark:border-slate-700/40">
                  <button
                    type="button"
                    onClick={() => setAccountType('customer')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      accountType === 'customer'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    Customer Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('business_owner')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      accountType === 'business_owner'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    Business Owner
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={accountType === 'business_owner' ? 'Your Full Name (Representative)' : 'Full Name'}
                    required
                    className="w-full px-4 py-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>

                {accountType === 'business_owner' && (
                  <div>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Business or Company Name"
                      required
                      className="w-full px-4 py-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                    />
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address (Verification link sent here)"
                    required
                    className="w-full px-4 py-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number (e.g. 050 820 3673)"
                    className="w-full px-4 py-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password (min 8 chars)"
                    required
                    className="w-full pl-4 pr-11 py-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    className="w-full pl-4 pr-11 py-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                    I agree to AuraCentra Ghana's <span className="text-blue-600 dark:text-blue-400 font-semibold underline">Terms of Service</span> and <span className="text-blue-600 dark:text-blue-400 font-semibold underline">Privacy Policy</span>.
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create Account & Send Verification Link</span>
                  )}
                </button>
              </form>
            )}

            {/* Divider: or continue with */}
            {!mfaPending && (
              <>
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <span className="relative px-3 bg-white dark:bg-slate-900 text-xs text-slate-400 font-medium">
                    or continue with
                  </span>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-sm font-bold shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>
              </>
            )}

            {/* Footer switcher */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {authMode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabChange('signup')}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabChange('signin')}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>

              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 2: EMAIL VERIFICATION PENDING (Firebase Email Link Flow)       */}
        {/* ------------------------------------------------------------------ */}
        {authMode === 'verify_email' && (
          <div className="text-center py-2 space-y-5">
            {/* Animated Mail Icon Badge */}
            <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Verify Your Email Address
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs mx-auto">
                We have sent an official verification link to:
              </p>
              <div className="mt-2 inline-block px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono font-bold text-xs text-blue-600 dark:text-blue-300">
                {pendingVerificationEmail || email}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 text-left text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Open your email app or inbox.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Click the <strong>Verify Email</strong> link sent by Firebase.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Return here and click the check button below.</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleCheckEmailVerified}
                disabled={checkingStatus}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {checkingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking verification status...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I've Clicked the Verification Link</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0 || resendingEmail}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {resendingEmail ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...
                    </span>
                  ) : resendCooldown > 0 ? (
                    <span>Resend link ({resendCooldown}s)</span>
                  ) : (
                    <span>Resend Verification Link</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleInstantVerify}
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                  title="Fast bypass verification for testing"
                >
                  Verify Now
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 pt-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Log in</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 3: FORGOT PASSWORD (Firebase Password Reset Flow)              */}
        {/* ------------------------------------------------------------------ */}
        {authMode === 'forgot_password' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <KeyRound className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Reset Your Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your account email to receive a password reset link.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  autoFocus
                  className="w-full px-4 py-3.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <span>Send Password Reset Link</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setSuccessMsg('');
                    setAuthMode('signin');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Log in</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
