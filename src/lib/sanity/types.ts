/**
 * TypeScript types for Sanity content
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
  caption?: string;
}

export interface SanityFile {
  asset?: {
    _id: string;
    url: string;
    size?: number;
    originalFilename?: string;
  };
}

export interface SanityDocument {
  titleFr: string;
  titleEn: string;
  file: SanityFile;
}

export interface GeoPoint {
  _type: 'geopoint';
  lat: number;
  lng: number;
  alt?: number;
}

// ============================================================================
// PROVINCE & CATEGORY
// ============================================================================

export interface Province {
  _id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  projectCount?: number;
}

export interface NewsCategory {
  _id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  newsCount?: number;
}

// ============================================================================
// PROJECT
// ============================================================================

export type ProjectStatus = 'preparation' | 'ongoing' | 'completed' | 'suspended';

export type ProjectSector =
  | 'roads'
  | 'bridges'
  | 'water'
  | 'electricity'
  | 'schools'
  | 'hospitals'
  | 'ports'
  | 'airports'
  | 'railways'
  | 'telecommunications'
  | 'other';

export interface Project {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  province: Province;
  status: ProjectStatus;
  sector: ProjectSector;
  budget: number;
  startDate?: string;
  endDate?: string;
  progress: number;
  location?: GeoPoint;
  featured: boolean;
  mainImage?: SanityImage;
  gallery?: SanityImage[];
  documents?: SanityDocument[];
  relatedNews?: NewsPreview[];
  relatedProcurement?: ProcurementPreview[];
}

export interface ProjectPreview {
  _id: string;
  publishedAt: string;
  titleFr: string;
  titleEn: string;
  slug: string;
  mainImage?: SanityImage;
}

// ============================================================================
// NEWS
// ============================================================================

export interface News {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  contentFr: { _type: string; [key: string]: unknown }[]; // Portable Text
  contentEn: { _type: string; [key: string]: unknown }[]; // Portable Text
  publishedAt: string;
  category: NewsCategory;
  featured: boolean;
  mainImage?: SanityImage;
  gallery?: SanityImage[];
  relatedProjects?: ProjectPreview[];
}

export interface NewsPreview {
  _id: string;
  titleFr: string;
  titleEn: string;
  slug: string;
  publishedAt: string;
  mainImage?: SanityImage;
}

// ============================================================================
// PROCUREMENT
// ============================================================================

export type ProcurementCategory = 'works' | 'supplies' | 'services' | 'consultancy' | 'recruitment';

export type ProcurementStatus = 'open' | 'closed' | 'awarded' | 'cancelled';

export interface Procurement {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  slug: string;
  reference: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  category: ProcurementCategory;
  openingDate: string;
  closingDate: string;
  budget?: number;
  status: ProcurementStatus;
  attachments?: SanityDocument[];
  relatedProjects?: ProjectPreview[];
}

export interface ProcurementPreview {
  _id: string;
  titleFr: string;
  titleEn: string;
  slug: string;
  reference: string;
  closingDate: string;
}

// ============================================================================
// PUBLICATION
// ============================================================================

export type PublicationType =
  | 'annual-report'
  | 'technical-report'
  | 'feasibility-study'
  | 'environmental-study'
  | 'law-decree'
  | 'guide'
  | 'newsletter'
  | 'brochure'
  | 'other';

export interface Publication {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  publicationType: PublicationType;
  publishedAt: string;
  coverImage?: SanityImage;
  pdfFile?: SanityFile;
}

// ============================================================================
// SEARCH RESULTS
// ============================================================================

export interface SearchResult {
  _id: string;
  _type: 'project' | 'news' | 'publication';
  titleFr: string;
  titleEn: string;
  slug: string;
}

export interface GlobalSearchResults {
  projects: SearchResult[];
  news: SearchResult[];
  publications: SearchResult[];
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface SiteStatistics {
  totalProjects: number;
  ongoingProjects: number;
  completedProjects: number;
  totalBudget?: number;
  provinces: number;
  publications: number;
  activeProcurement: number;
}

// ============================================================================
// HOME / SITE SETTINGS
// ============================================================================

export interface HomeHeroSlide {
  eyebrowFr?: string;
  eyebrowEn?: string;
  titleFr: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  image?: SanityImage;
  primaryCtaFr?: string;
  primaryCtaEn?: string;
  primaryHref?: string;
  secondaryCtaFr?: string;
  secondaryCtaEn?: string;
  secondaryHref?: string;
}

export interface HomePartner {
  name: string;
  url?: string;
  logo?: SanityImage;
}

export interface HomeSettings {
  title?: string;
  heroSlides?: HomeHeroSlide[];
  partners?: HomePartner[];
  mediaTitleFr?: string;
  mediaTitleEn?: string;
  mediaDescriptionFr?: string;
  mediaDescriptionEn?: string;
}

export interface HomePageData {
  settings?: HomeSettings;
  stats: SiteStatistics;
  heroProjects: Project[];
  heroNews: News[];
  heroProcurement: Procurement[];
  heroPublications: Publication[];
  projects: Project[];
  news: News[];
  procurement: Procurement[];
  publications: Publication[];
  media: MediaItem[];
}

export interface SiteSettings {
  title?: string;
  email?: string;
  phone?: string;
  addressFr?: string;
  addressEn?: string;
  facebookUrl?: string;
  xUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  footerDescriptionFr?: string;
  footerDescriptionEn?: string;
}

export interface AboutMission {
  icon?: 'building' | 'file' | 'globe' | 'users';
  titleFr?: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  image?: SanityImage;
}

export interface AboutPageData {
  about: AboutPageContent | null;
  missionFallbackImages: Array<{ url: string; alt?: string }>;
  heroFallbackImage?: { url: string; alt?: string };
}

export interface AboutFigure {
  value?: string;
  labelFr?: string;
  labelEn?: string;
}

export interface AboutPageContent {
  title?: string;
  pageTitleFr?: string;
  pageTitleEn?: string;
  subtitleFr?: string;
  subtitleEn?: string;
  missionEyebrowFr?: string;
  missionEyebrowEn?: string;
  missionTitleFr?: string;
  missionTitleEn?: string;
  missions?: AboutMission[];
  organizationEyebrowFr?: string;
  organizationEyebrowEn?: string;
  organizationTitleFr?: string;
  organizationTitleEn?: string;
  organizationBodyFr?: { _type: string; [key: string]: unknown }[];
  organizationBodyEn?: { _type: string; [key: string]: unknown }[];
  figuresEyebrowFr?: string;
  figuresEyebrowEn?: string;
  figuresTitleFr?: string;
  figuresTitleEn?: string;
  figures?: AboutFigure[];
  heroImage?: SanityImage;
  organizationImage?: SanityImage;
}

// ============================================================================
// MAP DATA
// ============================================================================

export interface ProjectMapData {
  _id: string;
  titleFr: string;
  titleEn: string;
  slug: string;
  location: GeoPoint;
  status: ProjectStatus;
  sector: ProjectSector;
  province: {
    nameFr: string;
    nameEn: string;
  };
  mainImage?: {
    asset: {
      url: string;
    };
  };
}

// ============================================================================
// MEDIA
// ============================================================================

export type MediaType = 'image' | 'video';

export interface MediaItem {
  _id: string;
  _createdAt: string;
  type: MediaType;
  title: {
    fr: string;
    en: string;
  };
  caption?: {
    fr: string;
    en: string;
  };
  image?: SanityImage;
  thumbnail?: SanityImage;
  videoUrl?: string;
  date?: string;
  project?: ProjectPreview;
  album?: {
    _id: string;
    titleFr: string;
    titleEn: string;
  };
}

export interface MediaAlbum {
  _id: string;
  _createdAt: string;
  title: {
    fr: string;
    en: string;
  };
  description?: {
    fr: string;
    en: string;
  };
  slug: string;
  coverImage?: SanityImage;
  date?: string;
  itemCount?: number;
  items?: MediaItem[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Locale = 'fr' | 'en';

export interface LocalizedContent {
  titleFr: string;
  titleEn: string;
  descriptionFr?: string;
  descriptionEn?: string;
}

// Helper function to get localized text
export function getLocalizedText<T extends LocalizedContent>(
  content: T,
  locale: Locale,
  field: keyof T
): string {
  const localizedField = `${String(field)}${locale === 'fr' ? 'Fr' : 'En'}` as keyof T;
  return (content[localizedField] as string) || '';
}

// Format currency for RDC
export function formatCurrency(amount: number, locale: Locale = 'fr'): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-CD' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date: string, locale: Locale = 'fr'): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}
