// /src/shared/utils/formatters.ts

/**
 * Formate un prix dans la devise spécifiée
 */
export function formatPrice(
    price: number,
    currency = 'EUR',
    locale = 'fr-FR'
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(price);
  }
  
  /**
   * Tronque un texte à la longueur spécifiée
   */
  export function truncateText(text: string, maxLength = 100): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }
  
  /**
   * Formatte une date selon le format spécifié
   */
  export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions, locale = 'fr-FR'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(d);
  }
  
  /**
   * Formate un pourcentage
   */
  export function formatPercentage(value: number, decimalPlaces = 1): string {
    return `${value.toFixed(decimalPlaces)}%`;
  }
  
  /**
   * Calcule et formate le temps écoulé depuis une date donnée
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export function formatTimeAgo(date: Date | string, locale = 'fr-FR'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (seconds < 60) {
      return `Il y a ${seconds} sec`;
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `Il y a ${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `Il y a ${hours}h`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `Il y a ${days}j`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `Il y a ${months} mois`;
    }
    
    const years = Math.floor(months / 12);
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
  }