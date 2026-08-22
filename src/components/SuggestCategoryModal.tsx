import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Tag, 
  Building, 
  Mail, 
  User, 
  Phone, 
  CheckCircle2, 
  HelpCircle,
  FolderPlus
} from 'lucide-react';
import { CategorySuggestion } from '../types';

interface SuggestCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuggestion: (suggestion: Omit<CategorySuggestion, 'id' | 'createdAt' | 'status'>) => void;
  initialCategoryName?: string;
}

export const SuggestCategoryModal: React.FC<SuggestCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuggestion,
  initialCategoryName = '',
}) => {
  const [categoryName, setCategoryName] = useState(initialCategoryName);
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [exampleBusinesses, setExampleBusinesses] = useState('');
  const [suggestedBy, setSuggestedBy] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync initial category name when opened
  React.useEffect(() => {
    if (isOpen) {
      setCategoryName(initialCategoryName);
      setIsSuccess(false);
    }
  }, [isOpen, initialCategoryName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim() || !description.trim() || !suggestedBy.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitSuggestion({
        categoryName: categoryName.trim(),
        industry: industry.trim() || 'General Business',
        description: description.trim(),
        exampleBusinesses: exampleBusinesses.trim(),
        suggestedBy: suggestedBy.trim(),
        userEmail: userEmail.trim() || undefined,
        userPhone: userPhone.trim() || undefined,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form
        setCategoryName('');
        setIndustry('');
        setDescription('');
        setExampleBusinesses('');
      }, 2000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/60 shadow-xs">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Suggest a Category
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help expand the AuraCentra Ghana business index
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-5 sm:p-7 overflow-y-auto">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Suggestion Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you for contributing to Ghana's premier enterprise index. Our admin team will review and publish this category soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Proposed Category Name <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Solar & Renewable Energy, Cold Chain Logistics"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>

              {/* Industry / Sector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Industry / Sector</span>
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Green Energy, Agriculture, Creative Arts"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>

              {/* Why is this category needed? */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Description & Value for Ghanaian Customers <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the services/products included and why Ghanaian consumers need this category..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Example Businesses */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Example Businesses or Providers in Ghana (Optional)
                </label>
                <input
                  type="text"
                  value={exampleBusinesses}
                  onChange={(e) => setExampleBusinesses(e.target.value)}
                  placeholder="e.g., SunPower Ghana, Volta Clean Tech Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>

              {/* Submitter Details */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Your Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Your Name <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      value={suggestedBy}
                      onChange={(e) => setSuggestedBy(e.target.value)}
                      placeholder="e.g., Kwame Mensah"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>Email or WhatsApp</span>
                    </label>
                    <input
                      type="text"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="e.g., name@gmail.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Suggestion'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
