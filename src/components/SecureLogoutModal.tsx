import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  X, 
  Loader2, 
  LogOut,
  KeyRound,
  ShieldCheck,
  User
} from 'lucide-react';
import { UserProfile } from '../types';
import { SupabaseService } from '../lib/supabase';
import { AuraCentraLogoSVG } from './AuraCentraLogo';

interface SecureLogoutModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const SecureLogoutModal: React.FC<SecureLogoutModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onConfirmLogout,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !currentUser) return null;

  const authProvider = currentUser.authProvider || 'email';
  const isOAuth = authProvider === 'google' || authProvider === 'apple';

  const handleVerifyAndLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim()) {
      setErrorMsg('Please enter your account password to verify and authorize logout.');
      return;
    }

    setLoading(true);

    try {
      // Verify password against Supabase Auth or registered account store
      const isValid = await SupabaseService.verifyPassword(currentUser.email, password.trim());

      if (!isValid) {
        setErrorMsg('Incorrect password. Please enter the correct password used for this account.');
        setLoading(false);
        return;
      }

      // Password verified successfully -> proceed with full sign out
      setLoading(false);
      onConfirmLogout();
    } catch (err: any) {
      console.error('[Secure Logout] Verification error:', err);
      setErrorMsg(err?.message || 'Password verification failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/40 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Security Authentication
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Confirm account password to authorize logout
            </p>
          </div>
        </div>

        {/* User Badge Info */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {currentUser.email}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                <ShieldCheck className="w-3 h-3" />
                {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'business_owner' ? 'Business Owner' : 'Customer Account'}
              </span>
              {isOAuth && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  • {authProvider === 'google' ? 'Google' : 'Apple/iCloud'} Auth
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Security Requirement Notice */}
        <div className="mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            {isOAuth
              ? 'To securely sign out of this account, please enter your verification password to confirm authorized access.'
              : 'For your security, please verify your account password before ending this session.'}
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleVerifyAndLogout} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Account Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                disabled={loading}
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Verify & Log Out</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
