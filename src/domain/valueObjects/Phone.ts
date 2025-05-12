
/**
 * Value Object representing a phone number
 * Encapsulates validation logic and formatting for phone numbers
 */
export class Phone {
  private readonly value: string;

  constructor(phone: string | null) {
    if (phone === null || phone === '') {
      this.value = '';
      return;
    }
    
    // Standardize the input by removing all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Validate
    if (digits.length < 10 || digits.length > 11) {
      throw new Error('Phone number must have 10 or 11 digits');
    }
    
    this.value = digits;
  }

  /**
   * Format the phone number as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
   */
  format(): string {
    if (!this.value) return '';
    
    const digits = this.value;
    
    if (digits.length === 11) {
      return `(${digits.substr(0, 2)}) ${digits.substr(2, 5)}-${digits.substr(7)}`;
    } else if (digits.length === 10) {
      return `(${digits.substr(0, 2)}) ${digits.substr(2, 4)}-${digits.substr(6)}`;
    }
    
    return digits;
  }

  /**
   * Get the raw phone number (digits only)
   */
  getRawValue(): string {
    return this.value;
  }

  /**
   * Check if the phone number is empty
   */
  isEmpty(): boolean {
    return this.value === '';
  }

  /**
   * Convert to string (formatted)
   */
  toString(): string {
    return this.format();
  }

  /**
   * Static method to create a Phone object from a string
   */
  static fromString(value: string | null): Phone {
    return new Phone(value);
  }
}
