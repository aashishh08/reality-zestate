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
  LEAD_POPUP_DELAY: 5000, // When to show popup (5 seconds)
} as const;

// Lead Form Validation
export const LEAD_FORM_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/, // 10-digit phone number
  PHONE_LENGTH: 10,
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
  Z_INDEX: {
    POPUP: 60,
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

// Contact Information
export const CONTACT_INFO = {
  WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919999999999',
  PHONE_NUMBER: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+919999999999',
} as const;
