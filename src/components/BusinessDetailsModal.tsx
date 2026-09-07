import React from 'react';
import { Business, BusinessReview, UserProfile, BusinessReport } from '../types';
import { BusinessPage } from './BusinessPage';

export interface BusinessDetailsModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (businessId: string) => void;
  onToggleCompare: (business: Business) => void;
  onOpenMap: (business: Business) => void;
  onOpenQuote?: (business: Business) => void;
  onOpenQR?: (business: Business) => void;
  onOpenCertificate?: (business: Business) => void;
  onReportBusiness?: (reportData: {
    businessId: string;
    businessName: string;
    reporterName?: string;
    reporterEmail?: string;
    reporterPhone?: string;
    reason: BusinessReport['reason'];
    reasonLabel: string;
    details: string;
  }) => void;
  currentUser: UserProfile | null;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  reviews?: BusinessReview[];
  onAddReview?: (review: BusinessReview) => void;
  onHelpfulVote?: (reviewId: string) => void;
}

/**
 * BusinessDetailsModal displays the business information in its own full-page view
 * directly on the background canvas, removing any card-box constraints or modal overlays.
 */
export const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
  business,
  isOpen,
  onClose,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onOpenMap,
  onOpenQuote,
  onOpenQR,
  onOpenCertificate,
  onReportBusiness,
  currentUser,
  onShowToast,
  reviews = [],
  onAddReview,
  onHelpfulVote,
}) => {
  if (!isOpen || !business) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-150">
      <BusinessPage
        business={business}
        onBack={onClose}
        isSaved={isSaved}
        isCompared={isCompared}
        onToggleSave={onToggleSave}
        onToggleCompare={onToggleCompare}
        onOpenMap={onOpenMap}
        onOpenQuote={onOpenQuote}
        onOpenQR={onOpenQR}
        onOpenCertificate={onOpenCertificate}
        onReportBusiness={onReportBusiness}
        currentUser={currentUser}
        onShowToast={onShowToast}
        reviews={reviews}
        onAddReview={onAddReview}
        onHelpfulVote={onHelpfulVote}
      />
    </div>
  );
};
