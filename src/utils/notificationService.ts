import { Business, UserNotification } from '../types';
import { saveUserNotification } from './storage';

export interface RejectionPreset {
  id: string;
  label: string;
  defaultReason: string;
  resolutionGuide: string;
}

export const REJECTION_PRESETS: RejectionPreset[] = [
  {
    id: 'ghana_card_unclear',
    label: 'Unclear or Missing Ghana Card Photo',
    defaultReason: 'The uploaded Ghana Card / National ID image is blurry, expired, or illegible.',
    resolutionGuide: 'Please log in to your account and re-upload a clear, high-resolution photo of the front and back of your valid Ghana Card.',
  },
  {
    id: 'gps_unverifiable',
    label: 'GhanaPost GPS & Address Mismatch',
    defaultReason: 'The physical address provided does not align with the submitted GhanaPost digital address or geocoding coordinates.',
    resolutionGuide: 'Please provide a valid GhanaPost GPS digital address code (e.g., GA-183-9024) corresponding to your physical storefront or office in Ghana.',
  },
  {
    id: 'contact_unreachable',
    label: 'Unresponsive Contact / Invalid Phone',
    defaultReason: 'Our administrative verification desk was unable to reach your business phone number or WhatsApp contact.',
    resolutionGuide: 'Please update your primary contact number with an active Ghanaian phone line (e.g., MTN, Telecel, AT) available during normal business hours.',
  },
  {
    id: 'duplicate_listing',
    label: 'Duplicate Listing Detected',
    defaultReason: 'A verified listing for this business name or exact address already exists in the AuraCentra Ghana Directory.',
    resolutionGuide: 'If you are the rightful owner seeking to claim an existing listing, please contact support at 0508203673 with your business registration certificate.',
  },
  {
    id: 'category_mismatch',
    label: 'Category Mismatch or Incomplete Info',
    defaultReason: 'The selected business category or services list does not accurately reflect your operations.',
    resolutionGuide: 'Please edit your business listing to select the appropriate primary category and add at least 3 specific services/products offered.',
  },
  {
    id: 'regulatory_compliance',
    label: 'Requires Registrar General (RGD) Certificate',
    defaultReason: 'For this category, an official Business Registration / TIN document from the Registrar General\'s Department is required.',
    resolutionGuide: 'Please submit your official RGD business certificate or GRA Tax Clearance certificate for enterprise verification.',
  },
];

/**
 * Dispatch automated business approval notification
 */
export function dispatchApprovalNotification(
  business: Business,
  badgeType: string = 'Gold Enterprise'
): { notification: UserNotification; whatsappUrl: string; whatsappMessage: string } {
  const notificationId = `notif-appr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://auracentra.com';
  const listingUrl = `${origin}/#biz-${business.slug || business.id}`;

  const whatsappMessage = [
    `🇬🇭 *AURACENTRA GHANA — ENLISTMENT APPROVED & LIVE* 🎉`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Hello *${business.name}*,`,
    ``,
    `Congratulations! Your business enlistment on *AuraCentra Ghana Directory* has been officially verified and published live to our nationwide directory.`,
    ``,
    `📋 *Listing Summary:*`,
    `• *Business Name:* ${business.name}`,
    `• *Category:* ${business.category}`,
    `• *Location:* ${business.city}, ${business.region}`,
    `• *GhanaPost Digital Address:* ${business.digitalAddress || 'Verified'}`,
    `• *Verification Badge:* ${badgeType}`,
    `• *Status:* Officially Verified & Active ✅`,
    ``,
    `🔗 *View Your Live Listing:*`,
    `${listingUrl}`,
    ``,
    `🌟 *Next Steps:*`,
    `Share your official AuraCentra verified listing with your customers to build trust and receive direct quote inquiries.`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `_AuraCentra Ghana — Connecting Trust Across Ghana_`,
    `_Support Desk: 0508203673 | tonysdigitalmarketing@gmail.com_`
  ].join('\n');

  const cleanPhone = (business.whatsapp || business.phone || '233508203673').replace(/\D/g, '');
  const internationalPhone = cleanPhone.startsWith('0') ? `233${cleanPhone.slice(1)}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const notification: UserNotification = {
    id: notificationId,
    userEmail: business.email,
    businessId: business.id,
    businessName: business.name,
    type: 'approval',
    title: `Listing Approved: ${business.name}`,
    message: `Your business has been officially verified with the ${badgeType} badge and is now live on the AuraCentra Ghana Directory.`,
    badgeType,
    createdAt: new Date().toISOString(),
    read: false,
    actionUrl: `/#biz-${business.slug || business.id}`,
    whatsappNoticeText: whatsappMessage,
  };

  saveUserNotification(notification);

  return { notification, whatsappUrl, whatsappMessage };
}

/**
 * Dispatch automated business rejection notification
 */
export function dispatchRejectionNotification(
  business: Business,
  reason: string,
  resolutionGuide?: string,
  adminNotes?: string
): { notification: UserNotification; whatsappUrl: string; whatsappMessage: string } {
  const notificationId = `notif-rej-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  const finalResolution = resolutionGuide || 'Please review your business details and re-upload your Ghana Card or verified digital address.';

  const whatsappMessage = [
    `🇬🇭 *AURACENTRA GHANA — ENLISTMENT STATUS UPDATE* ⚠️`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Hello *${business.name}*,`,
    ``,
    `Thank you for submitting your business enlistment to *AuraCentra Ghana Directory*.`,
    ``,
    `Our administrative verification team reviewed your submission and identified items that require your revision before publication:`,
    ``,
    `❌ *Reason for Revision:*`,
    `${reason}`,
    ``,
    `📋 *How to Resolve & Get Approved:*`,
    `${finalResolution}`,
    adminNotes ? `\n📝 *Admin Note:* ${adminNotes}` : '',
    ``,
    `💬 *Need Assistance?*`,
    `Our support desk is ready to help you complete your verification. Reply directly to this WhatsApp message or call *0508203673*.`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `_AuraCentra Ghana Administrative Review Desk_`
  ].filter(Boolean).join('\n');

  const cleanPhone = (business.whatsapp || business.phone || '233508203673').replace(/\D/g, '');
  const internationalPhone = cleanPhone.startsWith('0') ? `233${cleanPhone.slice(1)}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const notification: UserNotification = {
    id: notificationId,
    userEmail: business.email,
    businessId: business.id,
    businessName: business.name,
    type: 'rejection',
    title: `Action Required for Listing: ${business.name}`,
    message: reason,
    reason,
    createdAt: new Date().toISOString(),
    read: false,
    whatsappNoticeText: whatsappMessage,
  };

  saveUserNotification(notification);

  return { notification, whatsappUrl, whatsappMessage };
}
