
/**
 * Format a phone number with Brazilian mask
 */
export function formatPhoneBR(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
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
