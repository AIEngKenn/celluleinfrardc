import { NextRequest, NextResponse } from 'next/server';
import { sanityFetch } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const locale = searchParams.get('locale') || 'fr';

  if (!query || query.length < 2) {
    return NextResponse.json({
      projects: [],
      news: [],
      publications: [],
      procurement: [],
    });
  }

  try {
    // Build search term for GROQ (wildcards for partial matching)
    const searchTerm = `*${query}*`;

    const searchQuery = groq`
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
        )] | order(publishedAt desc) [0...5] {
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
        )] | order(publishedAt desc) [0...5] {
          _id,
          _type,
          titleFr,
          titleEn,
          "slug": slug.current
        },
        "procurement": *[_type == "procurement" && (
          titleFr match $searchTerm ||
          titleEn match $searchTerm ||
          descriptionFr match $searchTerm ||
          descriptionEn match $searchTerm ||
          reference match $searchTerm
        )] | order(closingDate desc) [0...5] {
          _id,
          _type,
          titleFr,
          titleEn,
          "slug": slug.current
        }
      }
    `;

    const results = await sanityFetch({
      query: searchQuery,
      params: { searchTerm },
      revalidate: 60, // Cache for 1 minute
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
