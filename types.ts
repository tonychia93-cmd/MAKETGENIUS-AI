
export enum MarketingGoal {
  NEW_PRODUCT = 'New Product Launch',
  STOCK_CLEARANCE = 'Stock Clearance',
  FESTIVAL_PROMO = 'Festival Promotion',
}

export enum TargetAudience {
  OFFICE_WORKER = 'Office Workers',
  HOUSEWIFE = 'Home Makers',
  STUDENT = 'Students',
  ENTREPRENEUR = 'Entrepreneurs',
}

export enum VisualStyle {
  MINIMALIST = 'Minimalist',
  VIBRANT = 'Energetic/Vibrant',
  LUXURY = 'Luxury/Premium',
  URGENT = 'Urgent/Bold',
  RETRO = 'Retro/Vintage',
  CYBERPUNK = 'Cyberpunk/Neon',
  CORPORATE = 'Professional/Corporate'
}

export interface MarketingStrategy {
  goal: MarketingGoal;
  audience: TargetAudience;
  keywords: string[];
  promoMechanism: string;
  style: VisualStyle;
  productImage?: string; // Base64 encoded image
  scenePreference?: string; // 使用者指定的背景場景
}

export interface MarketingContent {
  socialPost: {
    title: string;
    description: string;
    solution: string;
    cta: string;
    hashtags: string[];
  };
  slogan: string;
  promoTagline: string;
  dataVizValue?: string;
}

export interface SavedCampaign {
  id: string;
  timestamp: number;
  strategy: MarketingStrategy;
  result: MarketingContent;
  posters: string[];
}
