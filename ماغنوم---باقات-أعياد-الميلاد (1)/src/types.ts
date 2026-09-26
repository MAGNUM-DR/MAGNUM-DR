export interface BirthdayPackage {
  id: 'package-vip-hall' | 'package-1' | 'package-2' | 'package-3';
  badge: string;
  badgeEmoji: string;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  guestCount?: number | string;
  vipTable: boolean;
  hasColorChoice: boolean;
  description: string;
  features: string[];
  colorOptions?: string[];
  tagline: string;
  accentColor: string;
  imageUrl?: string;
  galleryUrls?: string[];
  isHall?: boolean;
}

export interface DesignerBranding {
  name: string;
  title: string;
  phone: string;
}
