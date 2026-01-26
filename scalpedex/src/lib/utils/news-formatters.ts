// /src/features/news/utils/news-formatters.ts

/**
 * Calcule et formate le temps écoulé depuis une date donnée
 */
export function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
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
  
  /**
   * Formate une date relative au futur
   */
  export function formatDaysUntil(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return 'Aujourd\'hui !';
    } else if (diffDays === 1) {
      return 'Demain';
    } else if (diffDays < 7) {
      return `Dans ${diffDays} jours`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Dans ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `Dans ${months} mois`;
    }
  }
  
  /**
   * Formate une durée de lecture
   */
  export function formatReadTime(minutes: number): string {
    if (minutes < 1) {
      return 'Moins d\'une minute';
    } else if (minutes === 1) {
      return '1 minute de lecture';
    } else {
      return `${minutes} minutes de lecture`;
    }
  }
  
  /**
   * Tronque un texte long avec des points de suspension
   */
  export function truncateText(text: string, maxLength = 100): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }
  
  /**
   * Calcule la couleur de "heat" basée sur le score
   */
  export function getHeatColor(score: number): string {
    if (score >= 90) return 'text-red-400'; // Ultra hot
    if (score >= 75) return 'text-orange-400'; // Very hot
    if (score >= 60) return 'text-amber-400'; // Hot
    if (score >= 40) return 'text-yellow-400'; // Warm
    return 'text-violet-400'; // Cool
  }
  
  /**
   * Obtient l'étiquette de catégorie
   */
  export function getCategoryLabel(category: string): string {
    switch (category.toUpperCase()) {
      case 'BREAKING': return 'Breaking';
      case 'RETAIL': return 'Retail';
      case 'SUCCESS': return 'Success Story';
      case 'MARKET': return 'Market';
      case 'GUIDE': return 'Guide';
      case 'PREORDER': return 'Précommande';
      default: return category;
    }
  }