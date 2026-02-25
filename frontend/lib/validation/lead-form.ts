/**
 * Lead Form Validation
 * Validates lead form input according to business rules
 */

import { LEAD_FORM_VALIDATION } from '../constants';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
}

/**
 * Shared validation functions - eliminates duplication
 */
const validationFunctions = {
  name: (value: string): string | null => {
    if (!value || !value.trim()) {
      return 'Name is required';
    }
    if (value.trim().length < LEAD_FORM_VALIDATION.NAME_MIN_LENGTH) {
      return `Name must be at least ${LEAD_FORM_VALIDATION.NAME_MIN_LENGTH} characters`;
    }
    if (value.length > LEAD_FORM_VALIDATION.NAME_MAX_LENGTH) {
      return `Name must not exceed ${LEAD_FORM_VALIDATION.NAME_MAX_LENGTH} characters`;
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value || !value.trim()) {
      return 'Email is required';
    }
    if (!LEAD_FORM_VALIDATION.EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (!value || !value.trim()) {
      return 'Phone number is required';
    }
    // Strip all non-digit characters (+, spaces, dashes, parens) then count
    const digits = value.replace(/\D/g, '');
    if (digits.length !== LEAD_FORM_VALIDATION.PHONE_DIGIT_COUNT) {
      return 'Phone number must be 10 digits';
    }
    return null;
  },
} as const;

/**
 * Validate lead form data
 */
export function validateLeadForm(data: LeadFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validationFunctions.name(data.name);
  if (nameError) errors.name = nameError;

  const emailError = validationFunctions.email(data.email);
  if (emailError) errors.email = emailError;

  const phoneError = validationFunctions.phone(data.phone);
  if (phoneError) errors.phone = phoneError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate individual field
 */
export function validateField(
  field: keyof LeadFormData,
  value: string
): string | null {
  const validator = validationFunctions[field];
  return validator ? validator(value) : null;
}
