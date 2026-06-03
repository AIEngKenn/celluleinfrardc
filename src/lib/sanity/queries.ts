/**
 * Sanity GROQ Queries
 * Centralized query definitions for all content types
 */

import { groq } from 'next-sanity';

// ============================================================================
// FRAGMENT DEFINITIONS (Reusable parts)
// ============================================================================

const projectFields = groq`
  _id,
  _createdAt,
  _updatedAt,
  "slug": slug.current,
  titleFr,
  titleEn,
  descriptionFr,
  descriptionEn,
  province->{
    _id,
    nameFr,
    nameEn,
    "slug": slug.current
  },
  status,
  sector,
  budget,
  startDate,
  endDate,
  progress,
  location,
  featured,
  mainImage{
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions
      }
    },
    alt
  },
  gallery[]{
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions
      }
    },
    caption
  },
  documents[]{
    titleFr,
    titleEn,
    file{
      asset->{
        _id,
        url,
        size,
        originalFilename
      }
    }
  }
`;

const newsFields = groq`
  _id,
  _createdAt,
  _updatedAt,
  "slug": slug.current,
  titleFr,
  titleEn,
  excerptFr,
  excerptEn,
  contentFr,
  contentEn,
  publishedAt,
  category->{
    _id,
    nameFr,
    nameEn,
    "slug": slug.current
  },
  featured,
  mainImage{
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions
      }
    },
    alt
  },
  gallery[]{
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions
      }
    },
    caption
  },
  relatedProjects[]->{
    _id,
    titleFr,
    titleEn,
    "slug": slug.current,
    mainImage{
      asset->{
        _id,
        url
      }
    }
  }
`;

const procurementFields = groq`
  _id,
  _createdAt,
  _updatedAt,
  "slug": slug.current,
  reference,
  titleFr,
  titleEn,
  descriptionFr,
  descriptionEn,
  category,
  openingDate,
  closingDate,
  budget,
  status,
  attachments[]{
    titleFr,
    titleEn,
    file{
      asset->{
        _id,
        url,
        size,
        originalFilename
      }
    }
  },
  relatedProjects[]->{
    _id,
    titleFr,
    titleEn,
    "slug": slug.current
  }
`;

const publicationFields = groq`
  _id,
  _createdAt,
  _updatedAt,
  "slug": slug.current,
  titleFr,
  titleEn,
  descriptionFr,
  descriptionEn,
  publicationType,
  publishedAt,
  coverImage{
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions
      }
    }
  },
  pdfFile{
    asset->{
      _id,
      url,
      size,
      originalFilename
    }
  }
`;

// ============================================================================
// PROJECTS QUERIES
// ============================================================================

export const projectsListQuery = groq`
  *[_type == "project"] | order(featured desc, _createdAt desc) {
    ${projectFields}
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(_createdAt desc) [0...6] {
    ${projectFields}
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    ${projectFields},
    "relatedNews": *[_type == "news" && references(^._id)] | order(publishedAt desc) [0...3] {
      _id,
      titleFr,
      titleEn,
      "slug": slug.current,
      publishedAt,
      mainImage{
        asset->{
          url
        }
      }
    },
    "relatedProcurement": *[_type == "procurement" && references(^._id)] | order(openingDate desc) [0...3] {
      _id,
      titleFr,
      titleEn,
      "slug": slug.current,
      reference,
      closingDate
    }
  }
`;

export const projectsByProvinceQuery = groq`
  *[_type == "project" && province._ref == $provinceId] | order(_createdAt desc) {
    ${projectFields}
  }
`;

export const projectsByStatusQuery = groq`
  *[_type == "project" && status == $status] | order(_createdAt desc) {
    ${projectFields}
  }
`;

// ============================================================================
// NEWS QUERIES
// ============================================================================

export const newsListQuery = groq`
  *[_type == "news"] | order(publishedAt desc, _createdAt desc) {
    ${newsFields}
  }
`;

export const latestNewsQuery = groq`
  *[_type == "news"] | order(publishedAt desc) [0...6] {
    ${newsFields}
  }
`;

export const featuredNewsQuery = groq`
  *[_type == "news" && featured == true] | order(publishedAt desc) [0...3] {
    ${newsFields}
  }
`;

export const newsBySlugQuery = groq`
  *[_type == "news" && slug.current == $slug][0] {
    ${newsFields}
  }
`;

export const newsByCategoryQuery = groq`
  *[_type == "news" && category._ref == $categoryId] | order(publishedAt desc) {
    ${newsFields}
  }
`;

// ============================================================================
// PROCUREMENT QUERIES
// ============================================================================

export const procurementListQuery = groq`
  *[_type == "procurement"] | order(openingDate desc) {
    ${procurementFields}
  }
`;

export const activeProcurementQuery = groq`
  *[_type == "procurement" && closingDate > now()] | order(closingDate asc) {
    ${procurementFields}
  }
`;

export const closedProcurementQuery = groq`
  *[_type == "procurement" && closingDate <= now()] | order(closingDate desc) {
    ${procurementFields}
  }
`;

export const procurementBySlugQuery = groq`
  *[_type == "procurement" && slug.current == $slug][0] {
    ${procurementFields}
  }
`;

// ============================================================================
// PUBLICATIONS QUERIES
// ============================================================================

export const publicationsListQuery = groq`
  *[_type == "publication"] | order(publishedAt desc, _createdAt desc) {
    ${publicationFields}
  }
`;

export const recentPublicationsQuery = groq`
  *[_type == "publication"] | order(publishedAt desc) [0...6] {
    ${publicationFields}
  }
`;

export const publicationBySlugQuery = groq`
  *[_type == "publication" && slug.current == $slug][0] {
    ${publicationFields}
  }
`;

export const publicationsByTypeQuery = groq`
  *[_type == "publication" && publicationType == $type] | order(publishedAt desc) {
    ${publicationFields}
  }
`;

// ============================================================================
// PROVINCES & CATEGORIES
// ============================================================================

export const provincesListQuery = groq`
  *[_type == "province"] | order(nameFr asc) {
    _id,
    nameFr,
    nameEn,
    "slug": slug.current,
    "projectCount": count(*[_type == "project" && province._ref == ^._id])
  }
`;

export const newsCategoriesListQuery = groq`
  *[_type == "newsCategory"] | order(nameFr asc) {
    _id,
    nameFr,
    nameEn,
    "slug": slug.current,
    "newsCount": count(*[_type == "news" && category._ref == ^._id])
  }
`;

// ============================================================================
// SEARCH QUERIES
// ============================================================================

export const globalSearchQuery = groq`
  {
    "projects": *[_type == "project" && (
      titleFr match $searchTerm ||
      titleEn match $searchTerm ||
      descriptionFr match $searchTerm ||
      descriptionEn match $searchTerm
    )] | order(_score desc) [0...5] {
      _id,
      _type,
      titleFr,
      titleEn,
      "slug": slug.current
    },
    "news": *[_type == "news" && (
      titleFr match $searchTerm ||
      titleEn match $searchTerm ||
      excerptFr match $searchTerm ||
      excerptEn match $searchTerm
    )] | order(_score desc) [0...5] {
      _id,
      _type,
      titleFr,
      titleEn,
      "slug": slug.current
    },
    "publications": *[_type == "publication" && (
      titleFr match $searchTerm ||
      titleEn match $searchTerm ||
      descriptionFr match $searchTerm ||
      descriptionEn match $searchTerm
    )] | order(_score desc) [0...5] {
      _id,
      _type,
      titleFr,
      titleEn,
      "slug": slug.current
    }
  }
`;

export const fullSearchQuery = groq`
  {
    "projects": *[_type == "project" && (
      titleFr match $searchTerm ||
      titleEn match $searchTerm ||
      descriptionFr match $searchTerm ||
      descriptionEn match $searchTerm
    )] | order(_score desc) [0...12] {
      _id,
      _type,
      titleFr,
      titleEn,
      descriptionFr,
      descriptionEn,
      "slug": slug.current,
      status,
      sector,
      province->{ nameFr, nameEn },
      mainImage{ asset->{ url }, alt }
    },
    "news": *[_type == "news" && (
      titleFr match $searchTerm ||
      titleEn match $searchTerm ||
      excerptFr match $searchTerm ||
      excerptEn match $searchTerm
    )] | order(_score desc) [0...12] {
      _id,
      _type,
      titleFr,
      titleEn,
      excerptFr,
      excerptEn,
      "slug": slug.current,
      publishedAt,
      mainImage{ asset->{ url }, alt }
    },
    "procurement": *[_type == "procurement" && (
      titleFr match $searchTerm ||
      titleEn match $searchTerm ||
      descriptionFr match $searchTerm ||
      descriptionEn match $searchTerm ||
      reference match $searchTerm
    )] | order(_score desc) [0...12] {
      _id,
      _type,
      titleFr,
      titleEn,
      "slug": slug.current,
      reference,
      status,
      closingDate,
      category
    },
    "publications": *[_type == "publication" && (
      titleFr match $searchTerm ||
      titleEn match $searchTerm ||
      descriptionFr match $searchTerm ||
      descriptionEn match $searchTerm
    )] | order(_score desc) [0...12] {
      _id,
      _type,
      titleFr,
      titleEn,
      "slug": slug.current,
      publicationType,
      publishedAt,
      coverImage{ asset->{ url } }
    }
  }
`;

// ============================================================================
// STATISTICS QUERIES
// ============================================================================

export const statsQuery = groq`
  {
    "totalProjects": count(*[_type == "project"]),
    "ongoingProjects": count(*[_type == "project" && status == "ongoing"]),
    "completedProjects": count(*[_type == "project" && status == "completed"]),
    "totalBudget": math::sum(*[_type == "project"].budget),
    "provinces": count(*[_type == "province"]),
    "publications": count(*[_type == "publication"]),
    "activeProcurement": count(*[_type == "procurement" && closingDate > now()])
  }
`;

// ============================================================================
// MAP DATA QUERY (for Geomatics page)
// ============================================================================

export const projectsMapDataQuery = groq`
  *[_type == "project" && defined(location)] {
    _id,
    titleFr,
    titleEn,
    "slug": slug.current,
    location,
    status,
    sector,
    province->{
      nameFr,
      nameEn
    },
    mainImage{
      asset->{
        url
      }
    }
  }
`;

// ============================================================================
// MEDIA QUERIES (for Media Center)
// ============================================================================

export const mediaGalleryQuery = groq`
  *[_type == "media"] | order(date desc) {
    _id,
    _createdAt,
    type,
    title,
    caption,
    image{
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt
    },
    thumbnail{
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt
    },
    videoUrl,
    date,
    project->{
      _id,
      titleFr,
      titleEn,
      "slug": slug.current
    },
    album->{
      _id,
      titleFr,
      titleEn
    }
  }
`;

export const mediaAlbumsQuery = groq`
  *[_type == "mediaAlbum"] | order(date desc) {
    _id,
    _createdAt,
    title,
    description,
    "slug": slug.current,
    coverImage{
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt
    },
    date,
    "itemCount": count(*[_type == "media" && references(^._id)])
  }
`;

export const albumBySlugQuery = groq`
  *[_type == "mediaAlbum" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    description,
    "slug": slug.current,
    coverImage{
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt
    },
    date,
    "items": *[_type == "media" && references(^._id)] | order(date desc) {
      _id,
      _createdAt,
      type,
      title,
      caption,
      image{
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        },
        alt
      },
      thumbnail{
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        },
        alt
      },
      videoUrl,
      date
    }
  }
`;
