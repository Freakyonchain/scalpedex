// /src/features/profile/types/profile-types.ts

export interface UserProfile {
    id: string;
    email: string;
    username?: string;
    avatarUrl?: string;
    createdAt: string;
    isEmailVerified: boolean;
  }
  
  export interface ProfileStats {
    totalItems: number;
    totalValue: number;
    memberSince: string;
    avgPurchasePrice?: number;
    numSoldItems?: number;
    bestRoi?: number;
  }
  
  export interface NotificationPreference {
    type: 'EMAIL' | 'PUSH' | 'INAPP';
    enabled: boolean;
    categories: {
      newDrop: boolean;
      priceAlert: boolean;
      marketTrend: boolean;
      news: boolean;
    }
  }
  
  export interface ProfileSettings {
    currency: string;
    language: string;
    theme: 'DARK' | 'LIGHT' | 'SYSTEM';
    notifications: NotificationPreference[];
  }
  
  export interface UpdateProfileData {
    username?: string;
    avatarUrl?: string;
  }
  
  export interface UpdateSettingsData {
    currency?: string;
    language?: string;
    theme?: 'DARK' | 'LIGHT' | 'SYSTEM';
    notifications?: Partial<NotificationPreference>[];
  }
  
  export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface ProfileResponse {
    profile: UserProfile;
    stats: ProfileStats;
    settings: ProfileSettings;
  }