/**
 * Format a phone number with Brazilian mask
 */
export function formatPhoneBR(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Remove all non-digit characters and strip the international code if present
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) {
    digits = digits.substring(2);
  }
  
  // Format according to Brazilian patterns
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else if (digits.length <= 10) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
  } else {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
  }
}

/**
 * Format input as a Brazilian phone number while typing
 */
export function maskPhoneBR(value: string): string {
  const digits = value.replace(/\D/g, '');
  return formatPhoneBR(digits);
}

/**
 * Format phone for database storage with international code
 */
export function formatPhoneForStorage(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Return null if no digits
  if (!digits) return null;
  
  // Add international code if not present
  return digits.startsWith('55') ? `+${digits}` : `+55${digits}`;
}

/**
 * Extract phone digits without formatting
 */
export function extractPhoneDigits(phone: string | null | undefined): string | null {
  if (!phone) return null;
  return phone.replace(/\D/g, '');
}

/**
 * Format CEP (Brazilian postal code)
 */
export function formatCEP(cep: string | null | undefined): string {
  if (!cep) return '';
  
  const digits = cep.replace(/\D/g, '');
  
  if (digits.length <= 5) {
    return digits;
  } else {
    return `${digits.substring(0, 5)}-${digits.substring(5, 8)}`;
  }
}

/**
 * Format input as a Brazilian CEP while typing
 */
export function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, '');
  return formatCEP(digits);
}
