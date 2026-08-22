import React, { useState } from 'react';
import {
  X,
  Star,
  MessageSquare,
  Building2,
  User,
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  Heart,
  ThumbsUp
} from 'lucide-react';
import { Business, PlatformFeedback, BusinessReview } from '../types';

interface CustomerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: Business[];
  preSelectedBusiness?: Business | null;
  onSubmitFeedback: (feedback: Omit<PlatformFeedback, 'id' | 'createdAt' | 'status'>) => void;
  onAddReview?: (review: Omit<BusinessReview, 'id' | 'date' | 'helpfulCount'>) => void;
}

export const CustomerFeedbackModal: React.FC<CustomerFeedbackModalProps> = ({
  isOpen,
  onClose,
  businesses,
  preSelectedBusiness,
  onSubmitFeedback,
  onAddReview,
}) => {
  const [feedbackType, setFeedbackType] = useState<'business_review' | 'general' | 'feature_request'>('business_review');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(preSelectedBusiness?.id || (businesses[0]?.id || ''));
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (preSelectedBusiness) {
      setSelectedBusinessId(preSelectedBusiness.id);
      setFeedbackType('business_review');
      setSubject(`Review for ${preSelectedBusiness.name}`);
    }
  }, [preSelectedBusiness]);

  if (!isOpen) return null;

  const targetBiz = businesses.find((b) => b.id === selectedBusinessId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Submit Platform Feedback record
      onSubmitFeedback({
        type: feedbackType,
        name: name.trim(),
        email: email.trim() || 'customer@auracentra.com',
        rating: feedbackType === 'business_review' ? rating : undefined,
        subject: subject.trim() || (feedbackType === 'business_review' ? `Rating for ${targetBiz?.name || 'Business'}` : 'Platform Feedback'),
        message: message.trim(),
        targetBusinessId: feedbackType === 'business_review' ? selectedBusinessId : undefined,
        targetBusinessName: feedbackType === 'business_review' ? targetBiz?.name : undefined,
      });

      // 2. If it is a business review and onAddReview is available, also register into business reviews
      if (feedbackType === 'business_review' && selectedBusinessId && onAddReview) {
        onAddReview({
          businessId: selectedBusinessId,
          userName: name.trim(),
          userEmail: email.trim(),
          rating,
          comment: message.trim(),
        });
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setMessage('');
        setSubject('');
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
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/60 shadow-xs">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Customer Feedback & Ratings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rate Ghanaian businesses & share your experience
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

        {/* Form Body */}
        <div className="p-5 sm:p-7 overflow-y-auto">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Feedback Recorded!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you for your rating! Genuine customer feedback helps maintain trust and transparency across Ghana's commercial network.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFeedbackType('business_review')}
                  className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                    feedbackType === 'business_review'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Rate a Business
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('general')}
                  className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                    feedbackType === 'general'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Site Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('feature_request')}
                  className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                    feedbackType === 'feature_request'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Feature Idea
                </button>
              </div>

              {/* Select Business if reviewing business */}
              {feedbackType === 'business_review' && businesses.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Select Business to Rate <span className="text-rose-500">*</span></span>
                  </label>
                  <select
                    value={selectedBusinessId}
                    onChange={(e) => setSelectedBusinessId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city}, {b.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Star Rating selector */}
              {feedbackType === 'business_review' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 text-center">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-1.5">
                    Your Overall Rating
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 ${
                            (hoverRating || rating) >= star
                              ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1 block">
                    {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional Service' :
                     rating === 4 ? '⭐⭐⭐⭐ Great Experience' :
                     rating === 3 ? '⭐⭐⭐ Average / Okay' :
                     rating === 2 ? '⭐⭐ Needs Improvement' : '⭐ Unsatisfactory'}
                  </span>
                </div>
              )}

              {/* Subject Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject / Summary Headline
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={feedbackType === 'business_review' ? 'e.g. Prompt delivery and high quality work' : 'e.g. Directory suggestions, search enhancement'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {/* Detailed Review Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Your Feedback / Review Details <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about customer service, pricing, turnaround time, or your user experience..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                />
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Your Full Name <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Kwame Mensah"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., name@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2.5">
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
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
