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
    "slug": slug.current,
    mainImage{
      asset->{
        url
      },
      alt
    }
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

export const projectsPaginatedQuery = groq`
  {
    "items": *[
      _type == "project" &&
      (!defined($province) || province->slug.current == $province) &&
      (!defined($status) || status == $status) &&
      (!defined($sector) || sector == $sector)
    ] | order(featured desc, _createdAt desc) [$start...$end] {
      ${projectFields}
    },
    "total": count(*[
      _type == "project" &&
      (!defined($province) || province->slug.current == $province) &&
      (!defined($status) || status == $status) &&
      (!defined($sector) || sector == $sector)
    ])
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

export const moreProjectsQuery = groq`
  *[_type == "project" && slug.current != $slug] | order(featured desc, _createdAt desc) [0...3] {
    ${projectFields}
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

export const newsPaginatedQuery = groq`
  {
    "items": *[
      _type == "news" &&
      (!defined($category) || category->slug.current == $category)
    ] | order(publishedAt desc, _createdAt desc) [$start...$end] {
      ${newsFields}
    },
    "total": count(*[
      _type == "news" &&
      (!defined($category) || category->slug.current == $category)
    ])
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

export const moreNewsQuery = groq`
  *[_type == "news" && slug.current != $slug] | order(publishedAt desc, _createdAt desc) [0...3] {
    _id,
    titleFr,
    titleEn,
    excerptFr,
    excerptEn,
    "slug": slug.current,
    publishedAt,
    featured,
    category->{ nameFr, nameEn, "slug": slug.current },
    mainImage{ asset->{ url }, alt }
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

export const procurementPaginatedQuery = groq`
  {
    "items": *[
      _type == "procurement" &&
      (($tab == "open" && closingDate > now()) || ($tab == "closed" && closingDate <= now()))
    ] | order(select($tab == "open" => closingDate, openingDate) asc) [$start...$end] {
      ${procurementFields}
    },
    "total": count(*[
      _type == "procurement" &&
      (($tab == "open" && closingDate > now()) || ($tab == "closed" && closingDate <= now()))
    ]),
    "openTotal": count(*[_type == "procurement" && closingDate > now()]),
    "closedTotal": count(*[_type == "procurement" && closingDate <= now()])
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

export const moreProcurementQuery = groq`
  *[_type == "procurement" && slug.current != $slug] | order(closingDate desc, openingDate desc) [0...3] {
    _id,
    reference,
    titleFr,
    titleEn,
    descriptionFr,
    descriptionEn,
    category,
    "slug": slug.current,
    openingDate,
    closingDate,
    attachments[]{ file{ asset->{ url } } }
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

export const publicationsPaginatedQuery = groq`
  {
    "items": *[
      _type == "publication" &&
      (!defined($type) || publicationType == $type)
    ] | order(publishedAt desc, _createdAt desc) [$start...$end] {
      ${publicationFields}
    },
    "total": count(*[
      _type == "publication" &&
      (!defined($type) || publicationType == $type)
    ])
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

export const morePublicationsQuery = groq`
  *[_type == "publication" && slug.current != $slug] | order(publishedAt desc, _createdAt desc) [0...3] {
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

export const homePageQuery = groq`
  {
    "settings": *[_type == "homeSettings"][0] {
      title,
      heroSlides[]{
        eyebrowFr,
        eyebrowEn,
        titleFr,
        titleEn,
        descriptionFr,
        descriptionEn,
        image{ asset->{ _id, url, metadata{ lqip, dimensions } }, alt },
        primaryCtaFr,
        primaryCtaEn,
        primaryHref,
        secondaryCtaFr,
        secondaryCtaEn,
        secondaryHref
      },
      partners[]{
        name,
        url,
        logo{ asset->{ _id, url, metadata{ lqip, dimensions } }, alt }
      },
      partnersEyebrowFr,
      partnersEyebrowEn,
      partnersTitleFr,
      partnersTitleEn,
      partnersDescriptionFr,
      partnersDescriptionEn,
      mediaTitleFr,
      mediaTitleEn,
      mediaDescriptionFr,
      mediaDescriptionEn
    },
    "cmsPartners": *[_type == "partner" && coalesce(featured, true) == true] | order(order asc, name asc) {
      _id,
      name,
      url,
      category,
      order,
      featured,
      logo{ asset->{ _id, url, metadata{ lqip, dimensions } }, alt }
    },
    "stats": {
      "totalProjects": count(*[_type == "project"]),
      "ongoingProjects": count(*[_type == "project" && status == "ongoing"]),
      "completedProjects": count(*[_type == "project" && status == "completed"]),
      "provinces": count(*[_type == "province"]),
      "publications": count(*[_type == "publication"]),
      "activeProcurement": count(*[_type == "procurement" && closingDate > now()])
    },
    "heroProjects": *[_type == "project"] | order(_createdAt desc) [0...2] {
      ${projectFields}
    },
    "heroNews": *[_type == "news"] | order(publishedAt desc, _createdAt desc) [0...2] {
      ${newsFields}
    },
    "heroProcurement": *[_type == "procurement"] | order(openingDate desc, _createdAt desc) [0...2] {
      ${procurementFields}
    },
    "heroPublications": *[_type == "publication"] | order(publishedAt desc, _createdAt desc) [0...2] {
      ${publicationFields}
    },
    "projects": *[_type == "project"] | order(featured desc, _createdAt desc) [0...4] {
      ${projectFields}
    },
    "news": *[_type == "news"] | order(publishedAt desc, _createdAt desc) [0...8] {
      ${newsFields}
    },
    "procurement": *[_type == "procurement" && closingDate > now()] | order(closingDate asc) [0...5] {
      ${procurementFields}
    },
    "procurementBackfill": *[_type == "procurement" && closingDate <= now()] | order(closingDate desc) [0...6] {
      ${procurementFields}
    },
    "publications": *[_type == "publication"] | order(publishedAt desc, _createdAt desc) [0...4] {
      ${publicationFields}
    },
    "media": *[_type == "media"] | order(date desc, _createdAt desc) [0...8] {
      _id,
      type,
      title,
      caption,
      image{ asset->{ _id, url, metadata{ lqip, dimensions } }, alt },
      thumbnail{ asset->{ _id, url, metadata{ lqip, dimensions } }, alt },
      videoUrl,
      date,
      featured
    },
    "mediaAlbums": *[_type == "mediaAlbum"] | order(date desc, _createdAt desc) [0...4] {
      _id,
      title,
      description,
      "slug": slug.current,
      coverImage{ asset->{ _id, url, metadata{ lqip, dimensions } }, alt },
      date,
      "itemCount": count(*[_type == "media" && references(^._id)])
    }
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    email,
    phone,
    addressFr,
    addressEn,
    socialLinks[]{
      platform,
      url,
      label
    },
    facebookUrl,
    xUrl,
    youtubeUrl,
    linkedinUrl,
    footerDescriptionFr,
    footerDescriptionEn
  }
`;

export const aboutPageQuery = groq`
  {
    "about": *[_type == "aboutPage"][0] {
      title,
      pageTitleFr,
      pageTitleEn,
      subtitleFr,
      subtitleEn,
      heroImage{
        asset->{ url },
        alt
      },
      missionEyebrowFr,
      missionEyebrowEn,
      missionTitleFr,
      missionTitleEn,
      missions[]{
        icon,
        "slug": slug.current,
        titleFr,
        titleEn,
        descriptionFr,
        descriptionEn,
        highlightsFr,
        highlightsEn,
        contentFr,
        contentEn,
        image{
          asset->{ url },
          alt
        }
      },
      organizationEyebrowFr,
      organizationEyebrowEn,
      organizationTitleFr,
      organizationTitleEn,
      organizationBodyFr,
      organizationBodyEn,
      organizationImage{
        asset->{ url },
        alt
      },
      figuresEyebrowFr,
      figuresEyebrowEn,
      figuresTitleFr,
      figuresTitleEn,
      figures[]{
        value,
        labelFr,
        labelEn
      }
    },
    "missionFallbackImages": *[_type == "project" && defined(mainImage.asset)] | order(featured desc, _updatedAt desc) [0...4] {
      "url": mainImage.asset->url,
      "alt": mainImage.alt
    },
    "heroFallbackImage": *[_type == "project" && defined(mainImage.asset)] | order(featured desc, _updatedAt desc) [0] {
      "url": mainImage.asset->url,
      "alt": mainImage.alt
    }
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
    featured,
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
      date,
      featured
    }
  }
`;

// ============================================================================
// SEO ENDPOINT QUERIES
// ============================================================================

export const seoSitemapQuery = groq`
  {
    "projects": *[_type == "project" && defined(slug.current)] | order(_updatedAt desc) {
      _id,
      _updatedAt,
      "slug": slug.current
    },
    "news": *[_type == "news" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc) {
      _id,
      _updatedAt,
      publishedAt,
      "slug": slug.current
    },
    "publications": *[_type == "publication" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc) {
      _id,
      _updatedAt,
      publishedAt,
      "slug": slug.current
    },
    "procurement": *[_type == "procurement" && defined(slug.current)] | order(coalesce(closingDate, _updatedAt) desc) {
      _id,
      _updatedAt,
      closingDate,
      "slug": slug.current
    },
    "mediaAlbums": *[_type == "mediaAlbum" && defined(slug.current)] | order(coalesce(date, _updatedAt) desc) {
      _id,
      _updatedAt,
      date,
      "slug": slug.current
    },
    "missionSlugs": *[_type == "aboutPage"][0].missions[].slug.current
  }
`;

export const seoFeedQuery = groq`
  {
    "news": *[_type == "news" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) [0...20] {
      _id,
      titleFr,
      titleEn,
      excerptFr,
      excerptEn,
      publishedAt,
      _updatedAt,
      "slug": slug.current,
      mainImage{ asset->{ url } }
    },
    "publications": *[_type == "publication" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) [0...10] {
      _id,
      titleFr,
      titleEn,
      descriptionFr,
      descriptionEn,
      publishedAt,
      _updatedAt,
      "slug": slug.current
    },
    "procurement": *[_type == "procurement" && defined(slug.current) && closingDate > now()] | order(closingDate asc) [0...12] {
      _id,
      titleFr,
      titleEn,
      descriptionFr,
      descriptionEn,
      openingDate,
      closingDate,
      _updatedAt,
      "slug": slug.current
    },
    "missions": *[_type == "aboutPage"][0].missions[]{
      "slug": slug.current,
      titleFr,
      titleEn,
      descriptionFr,
      descriptionEn
    }
  }
`;
