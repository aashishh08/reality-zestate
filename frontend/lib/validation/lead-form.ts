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
 * Validate lead form data
 */
export function validateLeadForm(data: LeadFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || !data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < LEAD_FORM_VALIDATION.NAME_MIN_LENGTH) {
    errors.name = `Name must be at least ${LEAD_FORM_VALIDATION.NAME_MIN_LENGTH} characters`;
  } else if (data.name.length > LEAD_FORM_VALIDATION.NAME_MAX_LENGTH) {
    errors.name = `Name must not exceed ${LEAD_FORM_VALIDATION.NAME_MAX_LENGTH} characters`;
  }

  // Validate email
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!LEAD_FORM_VALIDATION.EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone
  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!LEAD_FORM_VALIDATION.PHONE_REGEX.test(data.phone)) {
    errors.phone = 'Phone number must be 10 digits';
  }

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
  switch (field) {
    case 'name': {
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
    }

    case 'email': {
      if (!value || !value.trim()) {
        return 'Email is required';
      }
      if (!LEAD_FORM_VALIDATION.EMAIL_REGEX.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }

    case 'phone': {
      if (!value || !value.trim()) {
        return 'Phone number is required';
      }
      if (!LEAD_FORM_VALIDATION.PHONE_REGEX.test(value)) {
        return 'Phone number must be 10 digits';
      }
      return null;
    }

    default:
      return null;
  }
}
