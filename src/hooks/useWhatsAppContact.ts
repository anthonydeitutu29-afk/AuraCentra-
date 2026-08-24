import { useCallback } from 'react';
import { Business } from '../types';

export interface WhatsAppInquiryOptions {
  /** Type of inquiry to format the pre-filled text */
  inquiryType?: 'general' | 'quote' | 'availability' | 'booking' | 'custom';
  /** Optional customer/sender name */
  senderName?: string;
  /** Specific service or product inquired about */
  serviceName?: string;
  /** Custom text to append or use */
  customMessage?: string;
}

/**
 * Standardizes any phone number into an international WhatsApp-ready digit string.
 * Automatically resolves Ghanaian numbers (05X, 02X, 03X -> 233XXXXXXXXX).
 */
export function formatWhatsAppPhoneNumber(phoneStr?: string): string {
  if (!phoneStr) return '233508203673'; // AuraCentra Desk default fallback

  // Strip all non-numeric characters
  const digits = phoneStr.replace(/\D/g, '');

  if (!digits) return '233508203673';

  // If starts with 0 (standard Ghanaian local number, e.g. 0508203673 -> 233508203673)
  if (digits.startsWith('0')) {
    return `233${digits.slice(1)}`;
  }

  // If already starts with 233 or any international code with 10-15 digits
  if (digits.startsWith('233') || digits.length >= 11) {
    return digits;
  }

  // If 9 digits (local without leading 0, e.g. 508203673)
  if (digits.length === 9) {
    return `233${digits}`;
  }

  return digits;
}

/**
 * Generates an inquiry message template for a business.
 */
export function buildWhatsAppInquiryMessage(
  business: {
    name: string;
    category?: string;
    city?: string;
    region?: string;
  },
  options: WhatsAppInquiryOptions = {}
): string {
  const {
    inquiryType = 'general',
    senderName,
    serviceName,
    customMessage,
  } = options;

  const senderGreeting = senderName ? `My name is *${senderName}*. ` : '';
  const locationTag = business.city ? ` in ${business.city}` : '';

  switch (inquiryType) {
    case 'quote':
      return [
        `Hello *${business.name}*! 👋`,
        ``,
        `I found your business profile on *AuraCentra Ghana*${locationTag} and I would like to request a price quotation${serviceName ? ` for *${serviceName}*` : ''}.`,
        ``,
        senderGreeting ? `${senderGreeting}` : ``,
        customMessage ? `Details: ${customMessage}\n` : `Could you kindly share your price list, catalog, or estimated rates?`,
        ``,
        `Looking forward to hearing from you. Thank you!`,
        ``,
        `— Sent via AuraCentra Ghana Directory (https://auracentra.com)`,
      ]
        .filter((line) => line !== null && line !== undefined)
        .join('\n');

    case 'availability':
      return [
        `Hello *${business.name}*! 👋`,
        ``,
        `I found your business profile on *AuraCentra Ghana*${locationTag}.`,
        ``,
        `${senderGreeting}I would like to check your availability${serviceName ? ` for *${serviceName}*` : ' for services today/this week'}.`,
        ``,
        customMessage ? `Inquiry Note: ${customMessage}\n` : `What are your current operating hours and earliest booking openings?`,
        ``,
        `Thank you!`,
        ``,
        `— Sent via AuraCentra Ghana Directory (https://auracentra.com)`,
      ]
        .filter((line) => line !== null && line !== undefined)
        .join('\n');

    case 'booking':
      return [
        `Hello *${business.name}*! 👋`,
        ``,
        `I came across *${business.name}* on the *AuraCentra Ghana* platform${locationTag}.`,
        ``,
        `${senderGreeting}I would like to schedule an appointment or book a service${serviceName ? ` (*${serviceName}*)` : ''}.`,
        ``,
        customMessage ? `Booking Details: ${customMessage}\n` : `Could you please confirm the next steps to confirm a booking?`,
        ``,
        `Thank you!`,
        ``,
        `— Sent via AuraCentra Ghana Directory (https://auracentra.com)`,
      ]
        .filter((line) => line !== null && line !== undefined)
        .join('\n');

    case 'custom':
      return [
        `Hello *${business.name}*! 👋`,
        ``,
        customMessage || `I am reaching out regarding your business profile on *AuraCentra Ghana*.`,
        ``,
        senderGreeting ? `${senderGreeting}\n` : ``,
        `— Sent via AuraCentra Ghana Directory (https://auracentra.com)`,
      ]
        .filter((line) => line !== null && line !== undefined)
        .join('\n');

    case 'general':
    default:
      return [
        `Hello *${business.name}*! 👋`,
        ``,
        `I found your verified business profile on *AuraCentra Ghana* (${business.category || 'Business'}${locationTag}).`,
        ``,
        `${senderGreeting}I am interested in your services and would like to make an inquiry${serviceName ? ` regarding *${serviceName}*` : ''}.`,
        ``,
        customMessage ? `Message: ${customMessage}\n` : `Could you please share more details about your offerings and how I can get started?`,
        ``,
        `Thank you!`,
        ``,
        `— Sent via AuraCentra Ghana Directory (https://auracentra.com)`,
      ]
        .filter((line) => line !== null && line !== undefined)
        .join('\n');
  }
}

/**
 * Custom React Hook: useWhatsAppContact
 * Generates pre-filled WhatsApp message templates when a user clicks 'Contact' on any business profile.
 */
export function useWhatsAppContact() {
  /**
   * Builds the formatted message string for the given business.
   */
  const getPreFilledMessage = useCallback(
    (
      business: Pick<Business, 'name'> & Partial<Pick<Business, 'category' | 'city' | 'region'>>,
      options?: WhatsAppInquiryOptions
    ): string => {
      return buildWhatsAppInquiryMessage(business, options);
    },
    []
  );

  /**
   * Generates the direct WhatsApp `wa.me` URL with pre-filled message parameters.
   */
  const getWhatsAppUrl = useCallback(
    (
      business: Pick<Business, 'name'> & Partial<Pick<Business, 'phone' | 'whatsapp' | 'category' | 'city' | 'region'>>,
      options?: WhatsAppInquiryOptions
    ): string => {
      const targetPhone = formatWhatsAppPhoneNumber(business.whatsapp || business.phone);
      const text = buildWhatsAppInquiryMessage(business, options);
      return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
    },
    []
  );

  /**
   * Opens the pre-filled WhatsApp message in a new window/tab for the user.
   */
  const contactBusinessOnWhatsApp = useCallback(
    (
      business: Pick<Business, 'name'> & Partial<Pick<Business, 'phone' | 'whatsapp' | 'category' | 'city' | 'region'>>,
      options?: WhatsAppInquiryOptions
    ): void => {
      const url = getWhatsAppUrl(business, options);
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    [getWhatsAppUrl]
  );

  /**
   * Copies the generated message template to the user's clipboard.
   */
  const copyPreFilledMessage = useCallback(
    async (
      business: Pick<Business, 'name'> & Partial<Pick<Business, 'category' | 'city' | 'region'>>,
      options?: WhatsAppInquiryOptions
    ): Promise<boolean> => {
      try {
        const text = buildWhatsAppInquiryMessage(business, options);
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy WhatsApp message template:', err);
        return false;
      }
    },
    []
  );

  return {
    getPreFilledMessage,
    getWhatsAppUrl,
    contactBusinessOnWhatsApp,
    copyPreFilledMessage,
    formatPhoneNumber: formatWhatsAppPhoneNumber,
  };
}
