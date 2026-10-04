/**
 * Input Validation Module
 * 
 * SECURITY NOTES:
 * - All validation is performed on both client AND server
 * - Client validation is for UX only (immediate feedback)
 * - Server validation (via Edge Functions) is the source of truth
 * - Never trust client-side validation alone
 */

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// Regex patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
const ZIP_REGEX = /^[0-9]{5}(-[0-9]{4})?$/;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,100}$/;

// Allowed file types for roof photos
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

export function validateName(name: string): string | null {
  if (!name || name.trim().length === 0) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 100) return 'Name must be under 100 characters';
  if (!NAME_REGEX.test(name.trim())) return 'Name contains invalid characters';
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) return 'Email is required';
  if (email.length > 254) return 'Email is too long';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone || phone.trim().length === 0) return 'Phone number is required';
  const cleaned = phone.replace(/[-.\s()]/g, '');
  if (cleaned.length < 10 || cleaned.length > 15) return 'Please enter a valid phone number';
  if (!PHONE_REGEX.test(phone.trim())) return 'Please enter a valid US phone number';
  return null;
}

export function validateZipCode(zip: string): string | null {
  if (!zip || zip.trim().length === 0) return 'ZIP code is required';
  if (!ZIP_REGEX.test(zip.trim())) return 'Please enter a valid 5-digit ZIP code';
  return null;
}

export function validateDescription(description: string): string | null {
  if (!description || description.trim().length === 0) return 'Please describe your roofing issue';
  if (description.trim().length < 10) return 'Please provide more detail (at least 10 characters)';
  if (description.trim().length > 2000) return 'Description must be under 2000 characters';
  return null;
}

export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, WebP, and HEIC images are allowed';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be under 10MB';
  }
  return null;
}

export function validatePhotoCount(count: number): string | null {
  if (count > MAX_FILES) {
    return `Maximum ${MAX_FILES} photos allowed`;
  }
  return null;
}

export function validateLeadForm(data: {
  name: string;
  email: string;
  phone: string;
  zip_code: string;
  description: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  
  const nameErr = validateName(data.name);
  if (nameErr) errors.name = nameErr;
  
  const emailErr = validateEmail(data.email);
  if (emailErr) errors.email = emailErr;
  
  const phoneErr = validatePhone(data.phone);
  if (phoneErr) errors.phone = phoneErr;
  
  const zipErr = validateZipCode(data.zip_code);
  if (zipErr) errors.zip_code = zipErr;
  
  const descErr = validateDescription(data.description);
  if (descErr) errors.description = descErr;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitize text input to prevent XSS.
 * Strips HTML tags and trims whitespace.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}

/**
 * Sanitize phone number - keep only digits and + sign
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Sanitize ZIP code - keep only digits and hyphens
 */
export function sanitizeZipCode(zip: string): string {
  return zip.replace(/[^\d-]/g, '');
}
