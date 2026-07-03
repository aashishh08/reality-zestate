/**
 * Application Constants
 * Centralized configuration for magic numbers, timeouts, and other constants
 */

// API Configuration
export const API_CONFIG = {
  ISR_REVALIDATION_TIME: 3600, // 1 hour
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // milliseconds
} as const;

// Form Configuration
export const FORM_CONFIG = {
  SUBMIT_DELAY: 500, // Artificial delay to show loading state
  SUCCESS_DISPLAY_TIME: 3000, // How long to show success message
  LEAD_POPUP_DELAY: 30_000, // Auto popup interval (every 30 seconds)
} as const;

// Lead Form Validation
export const LEAD_FORM_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_DIGIT_COUNT: 10, // exactly 10 digits (after stripping non-digits)
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet and try again.',
  TIMEOUT_ERROR: 'Request took too long. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  BACKEND_ERROR: 'Backend server is not responding. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LEAD_SUBMITTED: 'Thank you! We will contact you shortly with exclusive details.',
} as const;

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 0.4, // seconds
  SPRING_CONFIG: {
    type: 'spring' as const,
    duration: 0.5,
  },
  /** Site overlays: use literal Tailwind classes e.g. z-[100] — dynamic z-[${n}] is stripped by JIT. */
  Z_INDEX: {
    POPUP: 100,
    FLOATING_ACTIONS: 40,
    HEADER: 50,
    MODAL_BACKDROP: 50,
  },
  MODAL_IMAGE_WIDTH_PERCENTAGE: 40,
} as const;

// UI Scroll Thresholds
export const SCROLL_THRESHOLDS = {
  HEADER: 50,
  SCROLL_TO_TOP_BUTTON: 400,
} as const;

/**
 * Homepage “Curated Collections” — order matches DB category slugs (see seed).
 * Each links to `/category/[slug]` and lists properties tagged with that category.
 */
export const CURATED_COLLECTION_SLUGS = [
  'golf-residences',
  'branded-residences',
  'himalayan-living',
  'senior-living',
  'ultra-villas',
  'off-market',
] as const;

export type CuratedCollectionSlug = (typeof CURATED_COLLECTION_SLUGS)[number];

/** Categories picker in admin: curated homepage collections first, then A–Z by slug. */
export function orderCategoriesWithCuratedFirst<T extends { slug: string }>(items: T[]): T[] {
  const rank = new Map<string, number>(CURATED_COLLECTION_SLUGS.map((s, i) => [s, i]));
  return [...items].sort((a, b) => {
    const ra = rank.get(a.slug) ?? 1000;
    const rb = rank.get(b.slug) ?? 1000;
    if (ra !== rb) return ra - rb;
    return a.slug.localeCompare(b.slug);
  });
}

// Contact Information
export const CONTACT_INFO = {
  WHATSAPP_NUMBER: '+919873336686',
  PHONE_NUMBER: '+919873336686',
  EMAIL: 'aspire@superluxere.com',
  ADDRESS: '1701A, Max Towers, Sector 16B, Noida Expressway',
  HOURS: 'Mon - Sun: 10:00 AM – 7:00 PM',
} as const;
