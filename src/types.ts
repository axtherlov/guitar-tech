export type Language = 'es' | 'en';

export interface ServiceItem {
  id: string;
  order: number;
  name: Record<Language, string>;
  shortDesc: Record<Language, string>;
  problems: Record<Language, string[]>;
  workIncluded: Record<Language, string[]>;
  image?: string;
  imageAlt?: Record<Language, string>;
  category: 'setup' | 'electronics' | 'modifications' | 'frets' | 'repairs' | 'maintenance' | 'onsite' | 'b2b';
}

export interface AboutSectionData {
  experience: Record<Language, string[]>;
  passion: Record<Language, string[]>;
  philosophy: Record<Language, string[]>;
  equipment: Record<Language, string[]>;
  ownerNotice: Record<Language, string>;
}

export interface SiteContent {
  brandName: string;
  whatsappNumber: string;
  isWhatsappConfigured: boolean;
  defaultIntroMessage: Record<Language, string>;
  serviceArea: Record<Language, string>;
  hero: {
    badge: Record<Language, string>;
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    ctaQuote: Record<Language, string>;
    ctaWhatsapp: Record<Language, string>;
  };
  approach: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    pillars: Array<{
      title: Record<Language, string>;
      description: Record<Language, string>;
    }>;
  };
  about: AboutSectionData;
  services: ServiceItem[];
  coverage: {
    title: Record<Language, string>;
    workshopDescription: Record<Language, string>;
    onsiteDescription: Record<Language, string>;
    areasList: Record<Language, string[]>;
  };
  seo: Record<Language, {
    title: string;
    description: string;
    keywords: string;
  }>;
  lastUpdated: string;
  version: number;
}

export interface BackupItem {
  filename: string;
  timestamp: string;
  sizeBytes: number;
  version: number;
}
