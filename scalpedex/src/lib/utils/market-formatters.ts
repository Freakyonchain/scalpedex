// /src/features/market/utils/market-formatters.ts

/**
 * Calcule et formate le temps écoulé depuis une date donnée
 */
export function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) {
      return `il y a ${seconds} sec`;
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `il y a ${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `il y a ${hours}h`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `il y a ${days}j`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `il y a ${months} mois`;
    }
    
    const years = Math.floor(months / 12);
    return `il y a ${years} an${years > 1 ? 's' : ''}`;
  }
  
  /**
   * Calcule le pourcentage de changement entre deux valeurs
   */
  export function calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }
  
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
   * Calcule le score de "heat" basé sur divers facteurs
   * - volumeChange: changement du volume (0-100)
   * - priceChange: changement de prix (0-100)
   * - timeOnMarket: temps sur le marché (0-100, inversé)
   */
  export function calculateHeatScore(
    volumeChange: number, 
    priceChange: number, 
    timeOnMarket: number = 50
  ): number {
    // Normaliser les valeurs
    const normalizedVolume = Math.min(100, Math.max(0, volumeChange));
    const normalizedPrice = Math.min(100, Math.max(0, priceChange * 2)); // *2 pour donner plus de poids
    const normalizedTime = 100 - Math.min(100, Math.max(0, timeOnMarket)); // Inverser: plus récent = meilleur
    
    // Pondération
    const volumeWeight = 0.5;
    const priceWeight = 0.3;
    const timeWeight = 0.2;
    
    // Calcul du score
    return (
      normalizedVolume * volumeWeight +
      normalizedPrice * priceWeight +
      normalizedTime * timeWeight
    );
  }