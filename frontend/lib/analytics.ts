/**
 * Google Analytics 4 helpers.
 * No-ops when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset — safe for local dev without GA.
 * Never send PII (name, email, phone) to GA.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '';

export function isAnalyticsEnabled(): boolean {
  return typeof window !== 'undefined' && Boolean(GA_MEASUREMENT_ID) && typeof window.gtag === 'function';
}

function sendEvent(eventName: string, params?: Record<string, string | number | boolean | undefined>) {
  if (!isAnalyticsEnabled()) return;

  const cleaned = Object.fromEntries(
    Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== ''),
  );

  window.gtag('event', eventName, cleaned);
}

export function trackGenerateLead(params: {
  source?: string;
  property_id?: string;
  layout_download?: boolean;
}) {
  sendEvent('generate_lead', {
    source: params.source ?? 'unknown',
    property_id: params.property_id,
    layout_download: params.layout_download,
  });
}

export function trackViewProject(params: {
  project_slug: string;
  location_slug?: string;
  developer_slug?: string;
}) {
  sendEvent('view_project', params);
}

export function trackViewLocation(params: {
  location_slug: string;
  location_type?: string;
}) {
  sendEvent('view_location', params);
}

export function trackWhatsAppClick(params: { placement: string; context?: string }) {
  sendEvent('click_whatsapp', params);
}

export function trackPhoneClick(params: { placement: string }) {
  sendEvent('click_call', params);
}
