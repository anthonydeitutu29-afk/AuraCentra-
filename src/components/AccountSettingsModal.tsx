import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  LogOut,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { UserProfile, Business } from '../types';
import { SupabaseService } from '../lib/supabase';
import { FirebaseAuthService } from '../services/firebaseAuthService';

interface AccountSettingsModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  businesses: Business[];
  onClose: () => void;
  onAccountDeleted: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onOpenBusiness?: (business: Business) => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  currentUser,
  businesses,
  onClose,
  onAccountDeleted,
  onShowToast,
  onOpenBusiness,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'danger'>('profile');
  const [confirmText, setConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deleteAssociatedBusinesses, setDeleteAssociatedBusinesses] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !currentUser) return null;

  // Find businesses owned by this user
  const userOwnedBusinesses = businesses.filter((b) => {
    const isOwned =
      (currentUser.ownedBusinessIds && currentUser.ownedBusinessIds.includes(b.id)) ||
      b.ownerId === currentUser.id ||
      (b.ownerEmail && b.ownerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      (b.email && b.email.toLowerCase() === currentUser.email.toLowerCase());
    return isOwned;
  });

  const isBusinessOwner = currentUser.role === 'business_owner' || currentUser.role === 'verified_owner' || userOwnedBusinesses.length > 0;
  const isMatch = confirmText.trim().toLowerCase() === currentUser.email.toLowerCase() || confirmText.trim() === 'DELETE';

  const handlePermanentDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isMatch) {
      setErrorMessage(`Please type "${currentUser.email}" or "DELETE" to confirm permanent deletion.`);
      return;
    }

    setIsDeleting(true);

    try {
      // If user provided a password, optionally verify it first
      if (deletePassword.trim()) {
        const isPwValid = await SupabaseService.verifyPassword(currentUser.email, deletePassword.trim());
        if (!isPwValid) {
          setErrorMessage('The password entered is incorrect. Please verify your password or leave blank if using OAuth.');
          setIsDeleting(false);
          return;
        }
      }

      // Execute permanent deletion via auth service
      const result = await FirebaseAuthService.deleteAccountPermanently({
        userId: currentUser.id,
        email: currentUser.email,
        deleteBusinesses: deleteAssociatedBusinesses,
      });

      if (!result.success) {
        throw new Error(result.message || 'Failed to complete permanent account deletion.');
      }

      onShowToast(
        'Account Permanently Deleted',
        `Your AuraCentra Ghana account (${currentUser.email}) and all personal records have been permanently wiped.`,
        'info'
      );

      setIsDeleting(false);
      onAccountDeleted();
      onClose();
    } catch (err: any) {
      console.error('[Account Deletion Error]', err);
      setErrorMessage(err?.message || 'An error occurred during account deletion. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/40 text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-xl">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Account & Security Settings
              </h2>
              {currentUser.emailVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your personal credentials, registered enterprise listings, and privacy controls.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Overview</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('danger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'danger'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account (Danger Zone)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin">
          
          {/* TAB 1: PROFILE OVERVIEW */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>{currentUser.name || 'AuraCentra Member'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">{currentUser.email}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    <span>{currentUser.phone || '+233 24 000 0000'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Role</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <span>{currentUser.role.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Registered Businesses Section for Owners */}
              {userOwnedBusinesses.length > 0 && (
                <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>Your Registered Listings ({userOwnedBusinesses.length})</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {userOwnedBusinesses.map((b) => (
                      <div 
                        key={b.id}
                        className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">{b.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{b.category} &bull; {b.city}, Ghana</div>
                        </div>
                        {onOpenBusiness && (
                          <button
                            type="button"
                            onClick={() => {
                              onOpenBusiness(b);
                              onClose();
                            }}
                            className="p-1.5 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>View</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Status Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-emerald-900 dark:text-emerald-200">
                  <strong>Account Active & Protected:</strong> Your email and phone records are protected with SHA-256 cryptographic session tokens and verification checks.
                </div>
              </div>

              {/* Quick switch to delete button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('danger')}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Looking to permanently close and delete this account?</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DANGER ZONE - PERMANENT ACCOUNT DELETION */}
          {activeTab === 'danger' && (
            <form onSubmit={handlePermanentDelete} className="space-y-6 animate-in fade-in duration-150">
              {/* Warning Alert Banner */}
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-200 dark:border-rose-800/80 space-y-3">
                <div className="flex items-center gap-3 text-rose-800 dark:text-rose-300">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/80 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight">Warning: Permanent & Irreversible Action</h3>
                    <p className="text-xs text-rose-700 dark:text-rose-300">
                      Deleting your account will permanently remove all your records from AuraCentra Ghana.
                    </p>
                  </div>
                </div>

                <div className="text-xs text-rose-800 dark:text-rose-200 space-y-1.5 pl-1">
                  <p className="font-bold">What will be permanently deleted:</p>
                  <ul className="list-disc list-inside space-y-1 text-rose-700 dark:text-rose-300">
                    <li>Your account profile, credentials, and contact records.</li>
                    <li>All saved businesses, quotes, inquiry logs, and bookmarks.</li>
                    <li>Customer reviews and ratings submitted under this identity.</li>
                    {userOwnedBusinesses.length > 0 && (
                      <li className="font-semibold text-rose-900 dark:text-rose-100">
                        {userOwnedBusinesses.length} enterprise listing(s) ({userOwnedBusinesses.map(b => b.name).join(', ')}) will be permanently removed from the public registry.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Option to also delete businesses if owner */}
              {userOwnedBusinesses.length > 0 && (
                <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteAssociatedBusinesses}
                    onChange={(e) => setDeleteAssociatedBusinesses(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 mt-0.5"
                  />
                  <div className="text-xs">
                    <span className="font-black text-slate-900 dark:text-white block">
                      Also permanently remove my {userOwnedBusinesses.length} business listing(s) from AuraCentra
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      All photos, digital address coordinates, reviews, and client inquiries will be completely purged.
                    </span>
                  </div>
                </label>
              )}

              {/* Confirmation Input Field */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                  To confirm deletion, please type <span className="text-rose-600 select-all font-mono font-bold">{currentUser.email}</span> or <span className="text-rose-600 font-mono font-bold">DELETE</span>:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => {
                    setConfirmText(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder={`Type "${currentUser.email}" or "DELETE"`}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Optional Password Verification */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                  Account Password <span className="text-slate-400 font-normal">(Optional for OAuth users)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter account password if created with email/password"
                    className="w-full px-4 py-3 pr-11 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  disabled={isDeleting}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isMatch || isDeleting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Permanently Deleting Account...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Permanently Delete Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
