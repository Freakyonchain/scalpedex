// /src/shared/utils/validators.ts

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
    // Une regex simple pour la validation d'email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  /**
   * Valide un mot de passe (au moins 8 caractères, une lettre et un chiffre)
   */
  export function isValidPassword(password: string): boolean {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  }
  
  /**
   * Valide un code-barres (8 à 13 chiffres)
   */
  export function isValidBarcode(barcode: string): boolean {
    return /^\d{8,13}$/.test(barcode);
  }
  
  /**
   * Valide un prix (nombre positif avec 2 décimales maximum)
   */
  export function isValidPrice(price: string | number): boolean {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(priceNum) && priceNum >= 0 && /^\d+(\.\d{1,2})?$/.test(priceNum.toString());
  }
  
  /**
   * Valide une URL
   */
  export function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Valide si une valeur est non vide
   */
  export function isNotEmpty(value: any): boolean {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined;
  }