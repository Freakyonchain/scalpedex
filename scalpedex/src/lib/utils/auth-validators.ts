// /src/features/auth/utils/auth-validators.ts

/**
 * Valide un email selon un format standard
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Valide la complexité d'un mot de passe
   * - Au moins 8 caractères
   * - Au moins 1 lettre
   * - Au moins 1 chiffre
   */
  export const isValidPassword = (password: string): boolean => {
    if (password.length < 8) return false;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
  };
  
  /**
   * Vérifie que les deux mots de passe sont identiques
   */
  export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  };
  
  /**
   * Valide l'ensemble des données d'inscription
   */
  export const validateSignUpData = (data: { 
    email: string; 
    password: string; 
    confirmPassword: string;
  }): { valid: boolean; error?: string } => {
    if (!isValidEmail(data.email)) {
      return { valid: false, error: "Format d'email invalide" };
    }
    
    if (!isValidPassword(data.password)) {
      return { valid: false, error: "Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre" };
    }
    
    if (!passwordsMatch(data.password, data.confirmPassword)) {
      return { valid: false, error: "Les mots de passe ne correspondent pas" };
    }
    
    return { valid: true };
  };