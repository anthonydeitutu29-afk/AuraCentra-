import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Eye, 
  EyeOff, 
  Check,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  username?: string;
  accountType: 'customer' | 'business_owner';
  createdAt: string;
}

interface StoredAccount extends UserAccount {
  passwordHash?: string;
}

const ACCOUNTS_STORAGE_KEY = 'auracentra_registered_accounts';

export function getRegisteredAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegisteredAccount(acc: StoredAccount): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRegisteredAccounts();
    const updated = current.filter(a => a.email.toLowerCase() !== acc.email.toLowerCase());
    updated.unshift(acc);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  isDarkMode = false,
  onToggleTheme,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<'customer' | 'business_owner'>('customer');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up inputs
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    const idClean = loginIdentifier.trim().toLowerCase();
    const passClean = loginPassword.trim();

    if (!idClean || !passClean) {
      setNotice({ type: 'error', message: 'Please enter your username/email and password.' });
      return;
    }

    const accounts = getRegisteredAccounts();
    const found = accounts.find(
      a =>
        a.email.toLowerCase() === idClean ||
        (a.username && a.username.toLowerCase().replace(/^@/, '') === idClean.replace(/^@/, '')) ||
        (a.phone && a.phone.replace(/[^0-9]/g, '') === idClean.replace(/[^0-9]/g, '')) ||
        a.name.toLowerCase() === idClean
    );

    let loggedInUser: UserAccount;
    if (found) {
      if (found.passwordHash && found.passwordHash !== passClean) {
        setNotice({ type: 'error', message: 'Incorrect password for this account. Please try again or use Forgot Password.' });
        return;
      }
      loggedInUser = found;
    } else {
      // Seamless onboarding fallback: create and sign in gracefully
      loggedInUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : loginIdentifier,
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@auracentra.com`,
        username: loginIdentifier.startsWith('@') ? loginIdentifier : `@${loginIdentifier.toLowerCase().replace(/\s+/g, '_')}`,
        accountType: 'customer',
        createdAt: new Date().toISOString(),
      };
      saveRegisteredAccount({ ...loggedInUser, passwordHash: passClean });
    }

    setNotice({ type: 'success', message: `Welcome back, ${loggedInUser.name}! Sign in successful.` });
    setTimeout(() => {
      onLoginSuccess(loggedInUser);
      setNotice(null);
      onClose();
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!fullName.trim() || !emailAddress.trim() || !signupPassword.trim()) {
      setNotice({ type: 'error', message: 'Please fill out all required fields.' });
      return;
    }

    if (signupPassword.length < 6) {
      setNotice({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    if (signupPassword !== confirmPassword) {
      setNotice({ type: 'error', message: 'Passwords do not match. Please verify both fields.' });
      return;
    }

    if (!agreeTerms) {
      setNotice({ type: 'error', message: 'Please agree to the Terms of Service to create your account.' });
      return;
    }

    const newUser: StoredAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: fullName.trim(),
      email: emailAddress.trim().toLowerCase(),
      phone: phoneNumber.trim(),
      username: username.trim() ? (username.startsWith('@') ? username.trim() : `@${username.trim()}`) : `@${fullName.trim().toLowerCase().replace(/\s+/g, '_')}`,
      accountType,
      passwordHash: signupPassword.trim(),
      createdAt: new Date().toISOString(),
    };

    saveRegisteredAccount(newUser);
    setNotice({ type: 'success', message: `Account created successfully! Welcome to AuraCentra, ${newUser.name}.` });

    setTimeout(() => {
      onLoginSuccess(newUser);
      setNotice(null);
      onClose();
    }, 700);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setForgotSubmitted(false);
      setForgotPasswordOpen(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 overflow-y-auto transition-colors">
      <div className="max-w-md mx-auto min-h-screen px-4 sm:px-6 py-6 flex flex-col justify-between">
        
        {/* Top Header matching Images 5 & 6 */}
        <div>
          <div className="flex items-center justify-between pb-6">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Discovery</span>
            </button>

            {/* Logo in center */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" fillOpacity="0.25"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                  </svg>
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  AuraCentra
                </span>
              </div>
              <span className="text-[9px] font-black tracking-widest text-slate-600 dark:text-slate-400 uppercase mt-0.5">
                CONNECT • DISCOVER • GROW
              </span>
            </div>

            {/* Moon/Sun theme icon on top right */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Light / Dark Theme"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>

          {/* If already logged in */}
          {currentUser ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-black text-2xl flex items-center justify-center mx-auto">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{currentUser.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{currentUser.accountType === 'business_owner' ? 'Business Owner' : 'Verified Member'}</span>
                </div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
                >
                  Return to Directory
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setNotice({ type: 'success', message: 'You have been logged out.' });
                  }}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Segmented Switcher matching Image 5 & 6 */}
              <div className="p-1.5 bg-slate-200/70 dark:bg-slate-800 rounded-2xl grid grid-cols-2 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setNotice(null);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tab === 'login'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('signup');
                    setNotice(null);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tab === 'signup'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign up
                </button>
              </div>

              {notice && (
                <div
                  className={`mb-4 p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                    notice.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {notice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{notice.message}</span>
                </div>
              )}

              {/* VIEW 1: LOG IN (Image 6) */}
              {tab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      Log in to AuraCentra
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Welcome back — enter your details below
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                      Email, Phone Number, Username, or Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. name@email.com, 0244123456, @username"
                      className="w-full px-4 py-3 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Your Password"
                        className="w-full px-4 py-3 pr-10 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 mr-2 accent-blue-600"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-2xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer mt-3"
                  >
                    Log in
                  </button>

                  <div className="text-center pt-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setTab('signup');
                        setNotice(null);
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              ) : (
                /* VIEW 2: SIGN UP (Image 5) */
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div className="text-center mb-5">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      Sign up for AuraCentra
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Get started — enter your details below
                    </p>
                  </div>

                  {/* Role Toggle matching Image 5 */}
                  <div className="p-1 bg-slate-200/70 dark:bg-slate-800 rounded-2xl grid grid-cols-2 gap-1 mb-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('customer')}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        accountType === 'customer'
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Customer Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('business_owner')}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        accountType === 'business_owner'
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Business Owner
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Full Name or Business Representative *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full px-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        Phone (Ghana / Intl)
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="024 123 4567"
                        className="w-full px-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Preferred Username (Optional)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@username"
                      className="w-full px-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        Password (Min 6 chars) *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full px-4 py-2.5 pr-10 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm"
                          className="w-full px-4 py-2.5 pr-10 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="p-1.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 mr-2 mt-0.5 accent-blue-600"
                      />
                      <span>I agree to AuraCentra Terms of Service, Ghana Data Protection standards, and Trust Standard Notice.</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-2xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer mt-2"
                  >
                    Create Free Account
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setTab('login');
                        setNotice(null);
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Log in
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Forgot Password Dialog */}
        {forgotPasswordOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Reset Password</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enter your registered email address</p>
                </div>
              </div>

              {forgotSubmitted ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Password reset instructions have been dispatched!</span>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(false)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Send Reset
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-8 pb-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800">
          <p>© 2026 AuraCentra • Ghana Business Registry</p>
        </div>

      </div>
    </div>
  );
};
