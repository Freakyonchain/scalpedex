// /src/features/collection/utils/collection-formatters.ts

/**
 * Formate un prix en EUR
 */
export function formatPrice(price: number, locale = 'fr-FR', currency = 'EUR'): string {
    return price.toLocaleString(locale, {
      style: 'currency',
      currency
    });
  }
  
  /**
   * Formate une date
   */
  export function formatDate(dateString: string, locale = 'fr-FR'): string {
    return new Date(dateString).toLocaleDateString(locale);
  }
  
  /**
   * Calcule le ROI (Return on Investment) en pourcentage
   */
  export function calculateRoi(purchasePrice: number, soldPrice: number): number {
    if (!purchasePrice || purchasePrice === 0) return 0;
    return ((soldPrice - purchasePrice) / purchasePrice) * 100;
  }
  
  /**
   * Tronque un texte long avec des points de suspension
   */
  export function truncateText(text: string, maxLength = 30): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }