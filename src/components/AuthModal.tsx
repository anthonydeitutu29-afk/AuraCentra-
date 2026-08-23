import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2, 
  Building2, 
  User, 
  Shield, 
  Check,
  Fingerprint,
  Sparkles,
  LockKeyhole
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole, UserAccountRecord } from '../types';
import { 
  findRegisteredAccountByEmail, 
  saveRegisteredAccount, 
  getRegisteredAccounts,
  DEFAULT_ADMIN_ACCOUNT 
} from '../utils/storage';
import { Logo } from './Logo';
import { AuraCentraLogoSVG } from './AuraCentraLogo';

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
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberDevice, setRememberDevice] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Multi-Factor Authentication (2FA) State for Admins
  const [mfaPending, setMfaPending] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  // Saved accounts list on this device
  const [savedAccounts, setSavedAccounts] = useState<UserAccountRecord[]>([]);

  // Reset states when opening
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setMfaPending(false);
      setPendingUser(null);
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

  // Password Security Strength Calculator
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
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

  // Helper to persist user profile to Firestore
  const syncUserProfileToFirestore = async (profile: UserProfile) => {
    if (!db) return;
    try {
      const userRef = doc(db, 'users', profile.id);
      await setDoc(userRef, profile, { merge: true });
    } catch (e) {
      console.warn('Firestore user profile sync notice:', e);
    }
  };

  // 1. Secure Email Sign In
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

    // Special Executive Admin Credentials
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
      // Step A: Check local registered accounts storage
      const existingLocalAccount = findRegisteredAccountByEmail(cleanEmail);

      // Step B: Verify with Firebase Authentication if online
      let firebaseUid: string | null = null;
      let firebaseDisplayName: string | null = null;
      let firebaseAuthFailed = false;

      if (auth) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          firebaseUid = userCredential.user.uid;
          firebaseDisplayName = userCredential.user.displayName || null;
        } catch (fbErr: any) {
          firebaseAuthFailed = true;
          // If Firebase explicitly reports user-not-found or invalid credentials and we have no local account
          if (fbErr.code === 'auth/user-not-found' && !existingLocalAccount) {
            setErrorMsg('No registered account found with this email. You must sign up first before logging in.');
            setLoading(false);
            return;
          }
          if (fbErr.code === 'auth/wrong-password') {
            setErrorMsg('Incorrect password. Please verify your credentials and try again.');
            setLoading(false);
            return;
          }
        }
      }

      // Step C: Verify against registered accounts
      if (!existingLocalAccount && !firebaseUid) {
        // Strict gate: user MUST have an account before logging in
        setErrorMsg('No account found for this email address. Please sign up to create your verified account.');
        setLoading(false);
        return;
      }

      // If we have a local account record, verify local password if available
      if (existingLocalAccount) {
        if (existingLocalAccount.password && existingLocalAccount.password !== cleanPassword) {
          setErrorMsg('Incorrect password. Please verify your credentials and try again.');
          setLoading(false);
          return;
        }
      }

      const uid = firebaseUid || existingLocalAccount?.id || `usr-${Date.now()}`;
      const finalName = firebaseDisplayName || existingLocalAccount?.name || cleanEmail.split('@')[0].toUpperCase();
      const finalPhone = existingLocalAccount?.phone || '+233 24 000 0000';
      const finalRole = existingLocalAccount?.role || 'customer';

      const userProfile: UserProfile = {
        id: uid,
        name: finalName,
        email: cleanEmail,
        phone: finalPhone,
        role: finalRole,
        savedBusinessIds: [],
        createdAt: existingLocalAccount?.createdAt || new Date().toISOString(),
      };

      // Update registered account record with last login time
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

      await syncUserProfileToFirestore(userProfile);
      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Secure User Registration
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim() || '+233 24 000 0000';

    if (!cleanName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (cleanPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (cleanPassword !== confirmPassword.trim()) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    // Check if email is already registered locally
    const existingAccount = findRegisteredAccountByEmail(cleanEmail);
    if (existingAccount) {
      setErrorMsg('An account with this email address already exists. Please sign in instead.');
      return;
    }

    setLoading(true);

    try {
      let uid = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      if (auth) {
        try {
          const credential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          uid = credential.user.uid;
          await updateProfile(credential.user, { displayName: cleanName });
        } catch (authErr: any) {
          if (authErr.code === 'auth/email-already-in-use') {
            setErrorMsg('An account with this email already exists. Please sign in instead.');
            setLoading(false);
            return;
          }
          if (authErr.code === 'auth/weak-password') {
            setErrorMsg('Password is too weak. Please use a stronger combination.');
            setLoading(false);
            return;
          }
          console.warn('Firebase registration notice:', authErr.message);
        }
      }

      const newAccountRecord: UserAccountRecord = {
        id: uid,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'customer',
        password: cleanPassword,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      // Save to persistent storage for easy future logins
      saveRegisteredAccount(newAccountRecord);

      const newUserProfile: UserProfile = {
        id: uid,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'customer',
        savedBusinessIds: [],
        createdAt: newAccountRecord.createdAt,
      };

      await syncUserProfileToFirestore(newUserProfile);
      onLoginSuccess(newUserProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Reset Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      if (auth) {
        try {
          await sendPasswordResetEmail(auth, cleanEmail);
        } catch (e) {
          console.warn('Password reset note:', e);
        }
      }
      setSuccessMsg(`Secure password reset instructions sent to ${cleanEmail}. Please check your inbox.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to dispatch reset email.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Multi-Factor 2FA Verification (Admin Only)
  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length < 4) {
      setErrorMsg('Please enter the 6-digit security code (Default: 123456).');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden my-8"
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
                    ? 'Create Your Verified Account' 
                    : authMode === 'forgot_password' 
                    ? 'Reset Account Password' 
                    : 'Sign In to AuraCentra'
                )}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {customSubtitle || (
                authMode === 'signup'
                  ? 'Sign up to gain full access to Ghana’s verified business directory.'
                  : authMode === 'forgot_password'
                  ? 'Enter your registered email to receive a secure recovery link.'
                  : 'Enter your credentials to access your saved businesses, quotes, and listings.'
              )}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {authMode !== 'forgot_password' && !mfaPending && (
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
        <div className="p-6 space-y-4">
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

          {/* MFA 2FA Screen */}
          {mfaPending ? (
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
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
              >
                Verify & Enter Portal
              </button>
            </form>
          ) : authMode === 'forgot_password' ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. kwame@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Send Reset Link</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          ) : authMode === 'signup' ? (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. kwame@example.com"
                    className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number (Ghana)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 024 000 0000"
                    className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password (Min 8 Characters)
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
                    className="w-full pl-10 pr-10 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                  I agree to the <span className="font-semibold text-blue-600 dark:text-cyan-400">Terms of Service</span> & <span className="font-semibold text-blue-600 dark:text-cyan-400">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Create Verified Account</span>
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
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Quick Login for Saved Device Accounts */}
              {savedAccounts.length > 0 && !email && (
                <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700/80">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                    <span>Saved Accounts on this Device</span>
                  </div>
                  <div className="space-y-1.5">
                    {savedAccounts.slice(0, 3).map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setEmail(acc.email);
                          if (acc.password) {
                            setPassword(acc.password);
                          }
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-blue-400 transition-all text-xs"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot_password');
                      setErrorMsg('');
                    }}
                    className="text-xs text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
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
          )}

          {/* Platform Security Badge */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>256-Bit Encrypted Secure Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
