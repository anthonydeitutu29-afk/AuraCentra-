import { DirectMessage, DirectMessageThread } from '../types';
import { TelemetryService } from './telemetryService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const MESSAGES_STORAGE_KEY = 'auracentra_direct_messages_v2';
export const EVENT_NEW_CUSTOMER_MESSAGE = 'auracentra_new_customer_message';
export const EVENT_NEW_BUSINESS_REPLY = 'auracentra_new_business_reply';
export const EVENT_MESSAGES_UPDATED = 'auracentra_messages_updated';

// Helper to play a crisp, pleasant notification sound via Web Audio API
export function playNotificationChime(type: 'customer_ping' | 'business_ping' = 'customer_ping') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'customer_ping') {
      // Pleasant double harmonic chime for incoming customer message
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // Crisp celebratory chime for business reply
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18); // G5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch {
    // Audio context not allowed without prior user interaction or not supported
  }
}

function getStoredMessages(): DirectMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredMessages(messages: DirectMessage[]) {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch (err) {
    console.warn('[DirectMessagingService] Error saving messages:', err);
  }
}

// Generate consistent thread ID for a business and customer
export function generateThreadId(businessId: string, customerEmail: string): string {
  const cleanEmail = customerEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `th_${businessId}_${cleanEmail}`;
}

export const DirectMessagingService = {
  // Send a message (either customer -> business or business -> customer)
  async sendMessage(params: {
    businessId: string;
    businessName: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    sender: 'customer' | 'business';
    senderName: string;
    message: string;
  }): Promise<DirectMessage> {
    const cleanCustomerEmail = params.customerEmail.trim().toLowerCase();
    const threadId = generateThreadId(params.businessId, cleanCustomerEmail);
    
    const newMessage: DirectMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      threadId,
      businessId: params.businessId,
      businessName: params.businessName,
      customerId: params.customerId,
      customerName: params.customerName || 'Valued Customer',
      customerEmail: cleanCustomerEmail,
      customerPhone: params.customerPhone,
      sender: params.sender,
      senderName: params.senderName,
      message: params.message.trim(),
      createdAt: new Date().toISOString(),
      readByBusiness: params.sender === 'business',
      readByCustomer: params.sender === 'customer',
    };

    const messages = getStoredMessages();
    messages.push(newMessage);
    saveStoredMessages(messages);

    // Notify listeners
    window.dispatchEvent(new CustomEvent(EVENT_MESSAGES_UPDATED, { detail: newMessage }));

    if (params.sender === 'customer') {
      // 1. Log real telemetry for business dashboard
      TelemetryService.logEvent({
        businessId: params.businessId,
        businessName: params.businessName,
        type: 'direct_message',
        actorName: params.customerName,
        actorEmail: cleanCustomerEmail,
        actorPhone: params.customerPhone,
        metadata: {
          threadId,
          messagePreview: params.message.substring(0, 80),
        },
      });

      // 2. Play audio & notify business owner
      playNotificationChime('customer_ping');
      window.dispatchEvent(new CustomEvent(EVENT_NEW_CUSTOMER_MESSAGE, { detail: newMessage }));
    } else {
      // Business replying to customer
      playNotificationChime('business_ping');
      window.dispatchEvent(new CustomEvent(EVENT_NEW_BUSINESS_REPLY, { detail: newMessage }));
    }

    // Sync to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('direct_messages')
        .insert([{
          id: newMessage.id,
          thread_id: newMessage.threadId,
          business_id: newMessage.businessId,
          business_name: newMessage.businessName,
          customer_id: newMessage.customerId,
          customer_name: newMessage.customerName,
          customer_email: newMessage.customerEmail,
          customer_phone: newMessage.customerPhone,
          sender: newMessage.sender,
          sender_name: newMessage.senderName,
          message: newMessage.message,
          created_at: newMessage.createdAt,
          read_by_business: newMessage.readByBusiness,
          read_by_customer: newMessage.readByCustomer,
        }])
        .then(({ error }) => {
          if (error) console.debug('[DirectMessaging Supabase Sync]', error.message);
        })
        .catch(() => {});
    }

    return newMessage;
  },

  // Get messages for a specific thread
  getMessagesForThread(threadId: string): DirectMessage[] {
    const all = getStoredMessages();
    return all.filter((m) => m.threadId === threadId).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },

  // Get all conversation threads for a business owner
  getThreadsForBusiness(businessId: string): DirectMessageThread[] {
    const all = getStoredMessages().filter((m) => m.businessId === businessId);
    const map = new Map<string, DirectMessage[]>();

    all.forEach((msg) => {
      if (!map.has(msg.threadId)) {
        map.set(msg.threadId, []);
      }
      map.get(msg.threadId)!.push(msg);
    });

    const threads: DirectMessageThread[] = [];
    map.forEach((threadMessages, threadId) => {
      const sorted = threadMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const lastMsg = sorted[sorted.length - 1];
      const firstCustomerMsg = sorted.find((m) => m.sender === 'customer') || lastMsg;

      const unreadCountForBusiness = sorted.filter((m) => m.sender === 'customer' && !m.readByBusiness).length;
      const unreadCountForCustomer = sorted.filter((m) => m.sender === 'business' && !m.readByCustomer).length;

      threads.push({
        threadId,
        businessId: lastMsg.businessId,
        businessName: lastMsg.businessName,
        customerId: firstCustomerMsg.customerId,
        customerName: firstCustomerMsg.customerName,
        customerEmail: firstCustomerMsg.customerEmail,
        customerPhone: firstCustomerMsg.customerPhone,
        lastMessage: lastMsg.message,
        lastMessageAt: lastMsg.createdAt,
        lastSender: lastMsg.sender,
        unreadCountForBusiness,
        unreadCountForCustomer,
        messages: sorted,
      });
    });

    return threads.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  },

  // Get all conversation threads for a customer by their email
  getThreadsForCustomer(customerEmail: string): DirectMessageThread[] {
    const clean = customerEmail.trim().toLowerCase();
    const all = getStoredMessages().filter((m) => m.customerEmail.toLowerCase() === clean);
    const map = new Map<string, DirectMessage[]>();

    all.forEach((msg) => {
      if (!map.has(msg.threadId)) {
        map.set(msg.threadId, []);
      }
      map.get(msg.threadId)!.push(msg);
    });

    const threads: DirectMessageThread[] = [];
    map.forEach((threadMessages, threadId) => {
      const sorted = threadMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const lastMsg = sorted[sorted.length - 1];

      const unreadCountForBusiness = sorted.filter((m) => m.sender === 'customer' && !m.readByBusiness).length;
      const unreadCountForCustomer = sorted.filter((m) => m.sender === 'business' && !m.readByCustomer).length;

      threads.push({
        threadId,
        businessId: lastMsg.businessId,
        businessName: lastMsg.businessName,
        customerId: lastMsg.customerId,
        customerName: lastMsg.customerName,
        customerEmail: lastMsg.customerEmail,
        customerPhone: lastMsg.customerPhone,
        lastMessage: lastMsg.message,
        lastMessageAt: lastMsg.createdAt,
        lastSender: lastMsg.sender,
        unreadCountForBusiness,
        unreadCountForCustomer,
        messages: sorted,
      });
    });

    return threads.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  },

  // Mark all messages in a thread as read by role
  markThreadAsRead(threadId: string, role: 'business' | 'customer') {
    const all = getStoredMessages();
    let updated = false;

    const next = all.map((m) => {
      if (m.threadId === threadId) {
        if (role === 'business' && !m.readByBusiness) {
          updated = true;
          return { ...m, readByBusiness: true };
        }
        if (role === 'customer' && !m.readByCustomer) {
          updated = true;
          return { ...m, readByCustomer: true };
        }
      }
      return m;
    });

    if (updated) {
      saveStoredMessages(next);
      window.dispatchEvent(new CustomEvent(EVENT_MESSAGES_UPDATED));
    }
  },

  // Get total unread count for a business owner
  getUnreadCountForBusiness(businessId: string): number {
    const all = getStoredMessages();
    return all.filter((m) => m.businessId === businessId && m.sender === 'customer' && !m.readByBusiness).length;
  },

  // Get total unread count for a customer
  getUnreadCountForCustomer(customerEmail: string): number {
    const clean = customerEmail.trim().toLowerCase();
    const all = getStoredMessages();
    return all.filter((m) => m.customerEmail.toLowerCase() === clean && m.sender === 'business' && !m.readByCustomer).length;
  },

  // Subscribe to real-time message changes
  subscribeToMessages(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(EVENT_MESSAGES_UPDATED, handler);
    window.addEventListener(EVENT_NEW_CUSTOMER_MESSAGE, handler);
    window.addEventListener(EVENT_NEW_BUSINESS_REPLY, handler);

    return () => {
      window.removeEventListener(EVENT_MESSAGES_UPDATED, handler);
      window.removeEventListener(EVENT_NEW_CUSTOMER_MESSAGE, handler);
      window.removeEventListener(EVENT_NEW_BUSINESS_REPLY, handler);
    };
  },
};
