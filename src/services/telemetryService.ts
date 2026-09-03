import { InteractionEvent, InteractionEventType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TELEMETRY_STORAGE_KEY = 'auracentra_telemetry_events_v2';
const TELEMETRY_CHANGE_EVENT = 'auracentra_telemetry_updated';

// Helper to get stored events
function getStoredEvents(): InteractionEvent[] {
  try {
    const raw = localStorage.getItem(TELEMETRY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Helper to save events
function saveStoredEvents(events: InteractionEvent[]) {
  try {
    // Keep the most recent 2000 events to prevent unbounded storage
    const trimmed = events.slice(-2000);
    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('[TelemetryService] Error saving events:', err);
  }
}

export const TelemetryService = {
  // Log a verified real interaction event
  logEvent(data: {
    businessId: string;
    businessName?: string;
    type: InteractionEventType;
    actorName?: string;
    actorEmail?: string;
    actorPhone?: string;
    actorRole?: string;
    actorLocation?: string;
    metadata?: Record<string, any>;
  }): InteractionEvent {
    const newEvent: InteractionEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      businessId: data.businessId,
      businessName: data.businessName,
      type: data.type,
      timestamp: new Date().toISOString(),
      actorName: data.actorName || 'Anonymous Visitor',
      actorEmail: data.actorEmail,
      actorPhone: data.actorPhone,
      actorRole: data.actorRole,
      actorLocation: data.actorLocation || 'Accra, Ghana',
      metadata: data.metadata,
    };

    const currentEvents = getStoredEvents();
    currentEvents.push(newEvent);
    saveStoredEvents(currentEvents);

    // Notify all active listeners in the browser
    window.dispatchEvent(new CustomEvent(TELEMETRY_CHANGE_EVENT, { detail: newEvent }));

    // Asynchronously sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      Promise.resolve(
        supabase
          .from('analytics_events')
          .insert([{
            id: newEvent.id,
            business_id: newEvent.businessId,
            event_type: newEvent.type,
            actor_name: newEvent.actorName,
            actor_email: newEvent.actorEmail,
            actor_phone: newEvent.actorPhone,
            actor_location: newEvent.actorLocation,
            metadata: newEvent.metadata || {},
            created_at: newEvent.timestamp,
          }])
      )
        .then((res: any) => {
          if (res?.error) {
            console.debug('[TelemetryService Supabase Sync]', res.error.message);
          }
        })
        .catch(() => {});
    }

    return newEvent;
  },

  // Get all real events for a specific business
  getEventsForBusiness(businessId: string): InteractionEvent[] {
    const all = getStoredEvents();
    return all.filter((e) => e.businessId === businessId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  // Compute 100% real metrics for a business based on actual logged actions
  getRealMetricsForBusiness(businessId: string, timeframe: '7d' | '30d' | '90d' | 'all' = 'all') {
    const events = this.getEventsForBusiness(businessId);
    
    // Timeframe cutoff
    let cutoffMs = 0;
    const now = Date.now();
    if (timeframe === '7d') cutoffMs = now - 7 * 86400000;
    else if (timeframe === '30d') cutoffMs = now - 30 * 86400000;
    else if (timeframe === '90d') cutoffMs = now - 90 * 86400000;

    const filtered = cutoffMs > 0 
      ? events.filter((e) => new Date(e.timestamp).getTime() >= cutoffMs)
      : events;

    const views = filtered.filter((e) => e.type === 'view').length;
    const phoneCalls = filtered.filter((e) => e.type === 'phone_call').length;
    const whatsappClicks = filtered.filter((e) => e.type === 'whatsapp_click').length;
    const directMessages = filtered.filter((e) => e.type === 'direct_message').length;
    const inquiries = filtered.filter((e) => e.type === 'inquiry').length;
    const websiteClicks = filtered.filter((e) => e.type === 'website_click').length;
    const directionsClicks = filtered.filter((e) => e.type === 'directions_click').length;
    const saves = filtered.filter((e) => e.type === 'save').length;
    const shares = filtered.filter((e) => e.type === 'share').length;

    // Total high-intent leads = calls + whatsapp + direct messages + inquiries
    const totalLeads = phoneCalls + whatsappClicks + directMessages + inquiries;

    return {
      views,
      phoneCalls,
      whatsappClicks,
      directMessages,
      inquiries,
      websiteClicks,
      directionsClicks,
      saves,
      shares,
      totalLeads,
      recentEvents: filtered.slice(0, 50),
      allEventsCount: filtered.length,
      lastActiveAt: filtered[0]?.timestamp || null,
    };
  },

  // Real-time live subscription with 1-second auto tick and event-driven updates
  subscribeToTelemetry(businessId: string, onUpdate: () => void): () => void {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<InteractionEvent>;
      if (!customEvent.detail || customEvent.detail.businessId === businessId) {
        onUpdate();
      }
    };

    window.addEventListener(TELEMETRY_CHANGE_EVENT, handleEvent);

    // Also poll every second to ensure live tick and second-by-second updates
    const intervalId = window.setInterval(() => {
      onUpdate();
    }, 1000);

    return () => {
      window.removeEventListener(TELEMETRY_CHANGE_EVENT, handleEvent);
      window.clearInterval(intervalId);
    };
  },
};
