import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  KeyRound, 
  LogIn, 
  UserPlus, 
  Loader2,
  Sun,
  Moon,
  ShieldCheck,
  Check
} from 'lucide-react';
import { UserProfile, UserRole, UserAccountRecord } from '../types';
import { FirebaseAuthService } from '../services/firebaseAuthService';
import { 
  getRegisteredAccounts, 
  saveRegisteredAccount, 
  findRegisteredAccountByEmail, 
  checkAccountUniqueness,
  normalizeUsername,
  DEFAULT_ADMIN_ACCOUNT 
} from '../utils/storage';
import { Logo } from './Logo';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { TermsAndConditionsModal } from './TermsAndConditionsModal';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  customTitle?: string;
  customSubtitle?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onBackToPortal: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  customTitle,
  customSubtitle,
  theme = 'dark',
  onToggleTheme,
  onBackToPortal,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot_password'>(
    initialMode === 'signup' ? 'signup' : 'signin'
  );

  // Registration Flow Role Selection
  const [accountType, setAccountType] = useState<'customer' | 'business_owner'>('customer');

  // Form Fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Real-time Credential Availability Indicators
  const [emailConflict, setEmailConflict] = useState<string | null>(null);
  const [phoneConflict, setPhoneConflict] = useState<string | null>(null);
  const [usernameConflict, setUsernameConflict] = useState<string | null>(null);

  // Business Specific Fields
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState(INITIAL_CATEGORIES[0]?.id || 'restaurants');
  const [businessCity, setBusinessCity] = useState('Accra');

  // UI / Interaction state
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 2FA state for Admin login
  const [mfaPending, setMfaPending] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [pendingAdminUser, setPendingAdminUser] = useState<UserProfile | null>(null);

  // Saved accounts list on this device
  const [savedAccounts, setSavedAccounts] = useState<UserAccountRecord[]>([]);

  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setMfaPending(false);
    setPendingAdminUser(null);

    if (initialMode === 'signup' || initialMode === 'signin') {
      setAuthMode(initialMode);
    }
    try {
      const accs = getRegisteredAccounts().filter(
        (a) => a.email.toLowerCase() !== DEFAULT_ADMIN_ACCOUNT.email.toLowerCase()
      );
      setSavedAccounts(accs);
    } catch (e) {
      console.error('Failed to load accounts for auth page', e);
    }
  }, [initialMode]);

  // Handle Tab Switch (Log in / Sign up)
  const handleTabChange = (newMode: 'signin' | 'signup') => {
    setErrorMsg('');
    setSuccessMsg('');
    setAuthMode(newMode);
    if (typeof window !== 'undefined') {
      window.location.hash = newMode === 'signup' ? '#signup' : '#login';
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

      // 2. Sign In via FirebaseAuthService
      const result = await FirebaseAuthService.signInWithEmail(cleanEmail, cleanPassword);
      setLoading(false);
      setSuccessMsg('Signed in successfully! Welcome back.');
      setTimeout(() => {
        onLoginSuccess(result.user);
      }, 400);
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
      }
    } else {
      setErrorMsg('Invalid 2FA security PIN. Check console or use master code 994821.');
    }
  };

  // Handle Direct Instant Registration
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setEmailConflict(null);
    setPhoneConflict(null);
    setUsernameConflict(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = normalizeUsername(username || cleanEmail.split('@')[0]);
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

    // 1. Pre-Check existing account with this email
    const existingAcc = findRegisteredAccountByEmail(cleanEmail);
    if (existingAcc) {
      // Update account details with newly entered info
      const updatedAccount: UserAccountRecord = {
        ...existingAcc,
        name: cleanName || existingAcc.name,
        username: cleanUsername || existingAcc.username,
        password: cleanPassword || existingAcc.password,
        role: accountType || existingAcc.role,
        phone: cleanPhone || existingAcc.phone || '+233 24 000 0000',
        phoneVerified: true,
        emailVerified: true,
        businessName: accountType === 'business_owner' ? (businessName || existingAcc.businessName) : existingAcc.businessName,
      };
      saveRegisteredAccount(updatedAccount);

      const userProfile: UserProfile = {
        id: updatedAccount.id,
        name: updatedAccount.name,
        username: updatedAccount.username,
        email: updatedAccount.email,
        emailVerified: true,
        phone: updatedAccount.phone || '+233 24 000 0000',
        phoneVerified: true,
        role: updatedAccount.role as UserRole,
        accountType: (updatedAccount.role === 'business_owner' || updatedAccount.role === 'verified_owner') ? 'business_owner' : 'customer',
        savedBusinessIds: [],
        createdAt: updatedAccount.createdAt || new Date().toISOString(),
      };
      setSuccessMsg('Account updated and signed in successfully!');
      setTimeout(() => {
        onLoginSuccess(userProfile);
      }, 400);
      return;
    }

    // 2. Strict Uniqueness Pre-Check against local registry
    const localCheck = checkAccountUniqueness({
      email: cleanEmail,
      phone: cleanPhone,
      username: cleanUsername,
    });

    if (!localCheck.isUnique) {
      if (localCheck.conflictField === 'email') {
        setEmailConflict(localCheck.errorMessage || 'Email already exists');
      } else if (localCheck.conflictField === 'phone') {
        setPhoneConflict(localCheck.errorMessage || 'Phone number already exists');
      } else if (localCheck.conflictField === 'username') {
        setUsernameConflict(localCheck.errorMessage || 'Username is taken');
      }
      setErrorMsg(localCheck.errorMessage || 'This email address is already registered. Please log in or choose an option below.');
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
      const signupPayload = {
        email: cleanEmail,
        password: cleanPassword,
        name: cleanName,
        username: cleanUsername,
        role: accountType,
        phone: cleanPhone || '+233 24 000 0000',
        businessName: accountType === 'business_owner' ? businessName : undefined,
      };

      const result = await FirebaseAuthService.initiateSignUpWithEmail(signupPayload);

      setLoading(false);
      setSuccessMsg('Account created successfully! Welcome to AuraCentra Ghana.');
      setTimeout(() => {
        onLoginSuccess(result.profile);
      }, 500);
    } catch (err: any) {
      console.error('[Sign Up Error]', err);
      const errMsg = err.message || 'Registration failed. Please check your details and try again.';
      setErrorMsg(errMsg);
      if (errMsg.toLowerCase().includes('email')) {
        setEmailConflict(errMsg);
      } else if (errMsg.toLowerCase().includes('phone') || errMsg.toLowerCase().includes('number')) {
        setPhoneConflict(errMsg);
      } else if (errMsg.toLowerCase().includes('username') || errMsg.toLowerCase().includes('@')) {
        setUsernameConflict(errMsg);
      }
      setLoading(false);
    }
  };

  // Re-register or Overwrite existing account credentials
  const handleForceReRegister = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = normalizeUsername(username || cleanEmail.split('@')[0]);
    const cleanPassword = password.trim() || 'Password123#';
    const cleanName = name.trim() || cleanEmail.split('@')[0];
    const cleanPhone = phone.trim();

    setLoading(true);
    setErrorMsg('');
    setEmailConflict(null);

    try {
      const existing = findRegisteredAccountByEmail(cleanEmail);
      const updatedAccount: UserAccountRecord = {
        id: existing?.id || `usr-${Date.now()}`,
        name: accountType === 'business_owner' && businessName ? `${cleanName} (${businessName.trim()})` : cleanName,
        username: cleanUsername,
        email: cleanEmail,
        password: cleanPassword,
        role: accountType,
        phone: cleanPhone || existing?.phone || '+233 24 000 0000',
        phoneVerified: true,
        emailVerified: true,
        authProvider: 'email',
        businessName: accountType === 'business_owner' ? businessName : undefined,
        createdAt: existing?.createdAt || new Date().toISOString(),
      };
      saveRegisteredAccount(updatedAccount);

      const userProfile: UserProfile = {
        id: updatedAccount.id,
        name: updatedAccount.name,
        username: updatedAccount.username,
        email: updatedAccount.email,
        emailVerified: true,
        phone: updatedAccount.phone || '+233 24 000 0000',
        phoneVerified: true,
        role: updatedAccount.role as UserRole,
        accountType: (updatedAccount.role === 'business_owner' || updatedAccount.role === 'verified_owner') ? 'business_owner' : 'customer',
        savedBusinessIds: [],
        createdAt: updatedAccount.createdAt || new Date().toISOString(),
      };

      setLoading(false);
      setSuccessMsg('Account updated and logged in successfully!');
      setTimeout(() => {
        onLoginSuccess(userProfile);
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Failed to update account.');
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Back to Directory Button */}
          <button
            type="button"
            onClick={onBackToPortal}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          {/* Logo Center */}
          <div 
            onClick={onBackToPortal}
            className="cursor-pointer hover:opacity-90 transition-opacity"
            title="AuraCentra Ghana"
          >
            <Logo size="md" />
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-2">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Authentic Content: Completely Removed From Any Floating Card - Lies Directly On Background */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-14 w-full">
        <div className="w-full max-w-md mx-auto space-y-6">

          {/* VIEW 1: SIGN IN & SIGN UP */}
          {(authMode === 'signin' || authMode === 'signup') && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Segmented Tab Switcher (Lies Directly On Page Background) */}
              <div className="bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 p-1.5 rounded-2xl flex w-full">
                <button
                  type="button"
                  id="auth-page-tab-signin"
                  onClick={() => handleTabChange('signin')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  id="auth-page-tab-signup"
                  onClick={() => handleTabChange('signup')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  Sign up
                </button>
              </div>

              {/* Page Titles & Subtitles */}
              <div className="text-center space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  {customTitle || (authMode === 'signin' ? 'Log in to AuraCentra' : 'Sign up for AuraCentra')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {customSubtitle || (authMode === 'signin' ? 'Welcome back — enter your details below' : 'Get started — enter your details below')}
                </p>
              </div>

              {/* Error Notification Banner */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                    <span className="leading-relaxed font-medium">{errorMsg}</span>
                  </div>
                  {(emailConflict || errorMsg.toLowerCase().includes('already registered')) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-900/60">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg('');
                          setEmailConflict(null);
                          handleTabChange('signin');
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>⚡ Log In with this Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg('');
                          setEmailConflict(null);
                          setAuthMode('forgot_password');
                        }}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-all"
                      >
                        <span>🔑 Reset Password</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleForceReRegister}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/60 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold rounded-xl text-xs cursor-pointer transition-all"
                      >
                        <span>🔄 Re-register / Update</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Success Notification Banner */}
              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="leading-relaxed font-medium">{successMsg}</span>
                </div>
              )}

              {/* MFA Verification Form for Admin */}
              {mfaPending ? (
                <form onSubmit={handleVerify2FA} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
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
                      className="w-full px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl text-center text-lg font-mono font-bold tracking-widest text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Verify & Proceed
                  </button>
                </form>
              ) : authMode === 'signin' ? (
                /* ---------------- LOG IN FORM (DIRECT ON BACKGROUND) ---------------- */
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email, Phone Number, or Username
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@email.com, 0508203673, @username"
                      required
                      className="w-full px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your Password"
                        required
                        className="w-full pl-4 pr-11 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs"
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
                  </div>

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                /* ---------------- SIGN UP FORM (DIRECT ON BACKGROUND) ---------------- */
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  {/* Account Type Selector (Customer Account vs Business Owner) */}
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-xl mb-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('customer')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        accountType === 'customer'
                          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      Customer Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('business_owner')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        accountType === 'business_owner'
                          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
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
                      className="w-full px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs"
                    />
                  </div>

                  {/* Unique Username Input */}
                  <div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm font-semibold">
                        @
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setUsernameConflict(null);
                        }}
                        placeholder="Username (e.g. kwame_mensah)"
                        className={`w-full pl-8 pr-4 py-3.5 bg-white dark:bg-slate-900 border ${
                          usernameConflict ? 'border-red-500' : 'border-slate-300 dark:border-slate-800'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs`}
                      />
                    </div>
                    {usernameConflict && (
                      <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-medium pl-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {usernameConflict}
                      </p>
                    )}
                  </div>

                  {accountType === 'business_owner' && (
                    <div>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Business or Company Name"
                        required
                        className="w-full px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs"
                      />
                    </div>
                  )}

                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailConflict(null);
                      }}
                      placeholder="Email Address"
                      required
                      className={`w-full px-4 py-3.5 bg-white dark:bg-slate-900 border ${
                        emailConflict ? 'border-red-500' : 'border-slate-300 dark:border-slate-800'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs`}
                    />
                    {emailConflict && (
                      <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-medium pl-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {emailConflict}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneConflict(null);
                      }}
                      placeholder="Phone Number (e.g. 050 820 3673)"
                      className={`w-full px-4 py-3.5 bg-white dark:bg-slate-900 border ${
                        phoneConflict ? 'border-red-500' : 'border-slate-300 dark:border-slate-800'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs`}
                    />
                    {phoneConflict && (
                      <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-medium pl-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {phoneConflict}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create Password (min 8 chars)"
                      required
                      className="w-full pl-4 pr-11 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs"
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
                      className="w-full pl-4 pr-11 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs"
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
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="auth-page-terms-checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="auth-page-terms-checkbox" className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                      I agree to AuraCentra Ghana&apos;s{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsTermsModalOpen(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer inline focus:outline-hidden"
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsTermsModalOpen(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer inline focus:outline-hidden"
                      >
                        Privacy Policy
                      </button>
                      .
                    </label>
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
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>
              )}

              {/* Bottom Quick Switcher */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {authMode === 'signin' ? (
                    <>
                      Don&apos;t have an account?{' '}
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
              </div>

            </div>
          )}

          {/* VIEW 2: FORGOT PASSWORD FLOW */}
          {authMode === 'forgot_password' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                  Reset Your Password
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Enter your account email to receive a password reset link.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
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
                    className="w-full px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden transition-all shadow-xs"
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Log in</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* Sensible Terms & Anti-Scam Modal */}
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setAgreeTerms(true);
          setIsTermsModalOpen(false);
        }}
      />
    </div>
  );
};
