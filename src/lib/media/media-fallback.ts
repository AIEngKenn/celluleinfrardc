import type { ResolvedMediaAlbum, ResolvedMediaItem } from "@/lib/media/types";
import { extractYoutubeId, youtubeThumbnailUrl } from "@/lib/media/youtube";

const PLACEHOLDER = "/images/placeholders/RDC-Drapeau-CUA.jpg";

/** Curated Unsplash infrastructure imagery for demo content only. */
const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1545558014-869207ae7255?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1590856029826-cad2de712b0d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1513828583688-c52646db42f0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
] as const;

const DEMO_VIDEOS = [
  {
    id: "668nUCeBHyY",
    titleFr: "Combler le déficit d'infrastructures en Afrique",
    titleEn: "Closing the infrastructure gap in Africa",
    captionFr: "Panorama des enjeux de financement et de mise en œuvre des grands projets.",
    captionEn: "Overview of financing and delivery challenges for major projects.",
  },
  {
    id: "RcGyCZ7OzUk",
    titleFr: "Chronique d'un chantier routier",
    titleEn: "Road construction timelapse",
    captionFr: "De la préparation du terrain à la couche de roulement.",
    captionEn: "From ground preparation to the final pavement layer.",
  },
  {
    id: "5MuIMZSentY",
    titleFr: "Ingénierie des ouvrages d'art",
    titleEn: "Bridge engineering explained",
    captionFr: "Les étapes clés de conception et de contrôle d'un pont.",
    captionEn: "Key design and supervision stages for bridge works.",
  },
  {
    id: "86YLBDZ2L98",
    titleFr: "Modernisation des réseaux urbains",
    titleEn: "Urban network modernisation",
    captionFr: "Réhabilitation des voiries et des réseaux en milieu urbain.",
    captionEn: "Rehabilitation of urban roads and utility networks.",
  },
] as const;

function demoImage(index: number): string {
  return DEMO_IMAGES[index % DEMO_IMAGES.length] ?? PLACEHOLDER;
}

function buildPhoto(
  id: string,
  index: number,
  titleFr: string,
  titleEn: string,
  captionFr: string,
  captionEn: string,
  options: Partial<ResolvedMediaItem> = {}
): ResolvedMediaItem {
  return {
    id,
    type: "image",
    titleFr,
    titleEn,
    captionFr,
    captionEn,
    imageUrl: demoImage(index),
    imageAlt: titleFr,
    date: options.date ?? "2025-09-15T10:00:00.000Z",
    featured: options.featured,
    projectSlug: options.projectSlug,
    projectTitleFr: options.projectTitleFr,
    projectTitleEn: options.projectTitleEn,
    albumSlug: options.albumSlug,
    albumTitleFr: options.albumTitleFr,
    albumTitleEn: options.albumTitleEn,
  };
}

function buildVideo(
  youtubeId: string,
  index: number,
  titleFr: string,
  titleEn: string,
  captionFr: string,
  captionEn: string,
  options: Partial<ResolvedMediaItem> = {}
): ResolvedMediaItem {
  const thumb = youtubeThumbnailUrl(youtubeId);
  return {
    id: `demo-video-${youtubeId}`,
    type: "video",
    titleFr,
    titleEn,
    captionFr,
    captionEn,
    imageUrl: thumb,
    imageAlt: titleFr,
    thumbnailUrl: thumb,
    videoUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    youtubeId,
    date: options.date ?? "2025-08-20T14:00:00.000Z",
    featured: options.featured,
    projectSlug: options.projectSlug,
    projectTitleFr: options.projectTitleFr,
    projectTitleEn: options.projectTitleEn,
  };
}

export const FALLBACK_ALBUM_SLUGS = {
  inaugurationRoute: "inauguration-route-n1",
  chantiers2025: "chantiers-2025",
  missionsTerrain: "missions-terrain",
  partenariats: "partenariats-bailleurs",
} as const;

const albumInaugurationPhotos: ResolvedMediaItem[] = [
  buildPhoto("demo-alb1-1", 0, "Coupe du ruban — Route Nationale 1", "Ribbon cutting — National Route 1", "Cérémonie officielle en présence des autorités.", "Official ceremony with national authorities.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.inaugurationRoute,
    albumTitleFr: "Inauguration Route Nationale 1",
    albumTitleEn: "National Route 1 inauguration",
    featured: true,
  }),
  buildPhoto("demo-alb1-2", 1, "Premier convoi sur la voie réhabilitée", "First convoy on the rehabilitated lane", "Mise en service progressive du tronçon.", "Progressive opening of the section.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.inaugurationRoute,
    albumTitleFr: "Inauguration Route Nationale 1",
    albumTitleEn: "National Route 1 inauguration",
  }),
  buildPhoto("demo-alb1-3", 2, "Contrôle qualité final", "Final quality inspection", "Vérification des layers et signalisation.", "Verification of layers and signage.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.inaugurationRoute,
    albumTitleFr: "Inauguration Route Nationale 1",
    albumTitleEn: "National Route 1 inauguration",
  }),
  buildPhoto("demo-alb1-4", 3, "Vue aérienne du tronçon", "Aerial view of the section", "Alignement et drainage visibles sur l'ensemble du linéaire.", "Alignment and drainage visible along the corridor.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.inaugurationRoute,
    albumTitleFr: "Inauguration Route Nationale 1",
    albumTitleEn: "National Route 1 inauguration",
  }),
  buildPhoto("demo-alb1-5", 4, "Équipes sur le terrain", "Teams on site", "Remise des équipements de sécurité aux agents.", "Handover of safety equipment to field staff.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.inaugurationRoute,
    albumTitleFr: "Inauguration Route Nationale 1",
    albumTitleEn: "National Route 1 inauguration",
  }),
  buildPhoto("demo-alb1-6", 5, "Signalisation installée", "Installed road signage", "Marquage et panneaux conformes aux normes.", "Markings and panels compliant with standards.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.inaugurationRoute,
    albumTitleFr: "Inauguration Route Nationale 1",
    albumTitleEn: "National Route 1 inauguration",
  }),
];

const albumChantiersPhotos: ResolvedMediaItem[] = [
  buildPhoto("demo-alb2-1", 6, "Fondations du pont", "Bridge foundations", "Coffrage et ferraillage en cours.", "Formwork and rebar in progress.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.chantiers2025,
    albumTitleFr: "Chantiers 2025",
    albumTitleEn: "2025 construction sites",
  }),
  buildPhoto("demo-alb2-2", 7, "Centrale d'enrobage", "Asphalt plant", "Production du bitume pour la prochaine campagne.", "Bitumen production for the next campaign.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.chantiers2025,
    albumTitleFr: "Chantiers 2025",
    albumTitleEn: "2025 construction sites",
  }),
  buildPhoto("demo-alb2-3", 8, "Travaux nocturnes", "Night works", "Optimisation des fenêtres de travail en zone urbaine.", "Optimising work windows in urban areas.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.chantiers2025,
    albumTitleFr: "Chantiers 2025",
    albumTitleEn: "2025 construction sites",
  }),
  buildPhoto("demo-alb2-4", 9, "Réunion de chantier", "Site coordination meeting", "Point hebdomadaire maîtrise d'œuvre / entreprise.", "Weekly contractor and supervision meeting.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.chantiers2025,
    albumTitleFr: "Chantiers 2025",
    albumTitleEn: "2025 construction sites",
  }),
  buildPhoto("demo-alb2-5", 10, "Pose des buses", "Culvert installation", "Drainage transversal sur section montagneuse.", "Cross drainage on a mountainous section.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.chantiers2025,
    albumTitleFr: "Chantiers 2025",
    albumTitleEn: "2025 construction sites",
  }),
];

const albumMissionsPhotos: ResolvedMediaItem[] = [
  buildPhoto("demo-alb3-1", 1, "Mission de contrôle — Kasai", "Inspection mission — Kasai", "Vérification des travaux de voirie.", "Road works inspection.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.missionsTerrain,
    albumTitleFr: "Missions terrain",
    albumTitleEn: "Field missions",
  }),
  buildPhoto("demo-alb3-2", 2, "Rencontre avec les communautés", "Community engagement", "Consultation sur les impacts et emplois locaux.", "Consultation on impacts and local jobs.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.missionsTerrain,
    albumTitleFr: "Missions terrain",
    albumTitleEn: "Field missions",
  }),
  buildPhoto("demo-alb3-3", 3, "Levé topographique", "Topographic survey", "Relevés GPS pour le suivi d'avancement.", "GPS surveys for progress monitoring.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.missionsTerrain,
    albumTitleFr: "Missions terrain",
    albumTitleEn: "Field missions",
  }),
  buildPhoto("demo-alb3-4", 4, "Audit environnemental", "Environmental audit", "Contrôle des mesures de mitigation.", "Verification of mitigation measures.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.missionsTerrain,
    albumTitleFr: "Missions terrain",
    albumTitleEn: "Field missions",
  }),
];

const albumPartenariatsPhotos: ResolvedMediaItem[] = [
  buildPhoto("demo-alb4-1", 5, "Signature d'accord de financement", "Financing agreement signing", "Partenariat avec un bailleur multilatéral.", "Partnership with a multilateral donor.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.partenariats,
    albumTitleFr: "Partenariats bailleurs",
    albumTitleEn: "Donor partnerships",
  }),
  buildPhoto("demo-alb4-2", 6, "Atelier de lancement", "Project launch workshop", "Alignement des parties prenantes sur le calendrier.", "Stakeholder alignment on the schedule.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.partenariats,
    albumTitleFr: "Partenariats bailleurs",
    albumTitleEn: "Donor partnerships",
  }),
  buildPhoto("demo-alb4-3", 7, "Visite de délégation internationale", "International delegation visit", "Inspection des premiers résultats.", "Inspection of early results.", {
    albumSlug: FALLBACK_ALBUM_SLUGS.partenariats,
    albumTitleFr: "Partenariats bailleurs",
    albumTitleEn: "Donor partnerships",
  }),
];

export const FALLBACK_ALBUMS: ResolvedMediaAlbum[] = [
  {
    id: "demo-album-1",
    slug: FALLBACK_ALBUM_SLUGS.inaugurationRoute,
    titleFr: "Inauguration Route Nationale 1",
    titleEn: "National Route 1 inauguration",
    descriptionFr: "Retour en images sur la mise en service d'un tronçon stratégique pour la connectivité nationale.",
    descriptionEn: "Photo story of a strategic section opening for national connectivity.",
    coverUrl: albumInaugurationPhotos[0]?.imageUrl ?? PLACEHOLDER,
    coverAlt: "Inauguration Route Nationale 1",
    date: "2025-10-02T09:00:00.000Z",
    itemCount: albumInaugurationPhotos.length,
    featured: true,
    items: albumInaugurationPhotos,
  },
  {
    id: "demo-album-2",
    slug: FALLBACK_ALBUM_SLUGS.chantiers2025,
    titleFr: "Chantiers 2025",
    titleEn: "2025 construction sites",
    descriptionFr: "Immersion au cœur des grands chantiers routiers et d'ouvrages d'art en cours.",
    descriptionEn: "Inside major road and bridge construction sites underway.",
    coverUrl: albumChantiersPhotos[0]?.imageUrl ?? PLACEHOLDER,
    coverAlt: "Chantiers 2025",
    date: "2025-07-18T11:00:00.000Z",
    itemCount: albumChantiersPhotos.length,
    items: albumChantiersPhotos,
  },
  {
    id: "demo-album-3",
    slug: FALLBACK_ALBUM_SLUGS.missionsTerrain,
    titleFr: "Missions terrain",
    titleEn: "Field missions",
    descriptionFr: "Le suivi de proximité qui garantit la qualité et la transparence des projets.",
    descriptionEn: "On-the-ground supervision ensuring quality and transparency.",
    coverUrl: albumMissionsPhotos[0]?.imageUrl ?? PLACEHOLDER,
    coverAlt: "Missions terrain",
    date: "2025-06-05T08:30:00.000Z",
    itemCount: albumMissionsPhotos.length,
    items: albumMissionsPhotos,
  },
  {
    id: "demo-album-4",
    slug: FALLBACK_ALBUM_SLUGS.partenariats,
    titleFr: "Partenariats bailleurs",
    titleEn: "Donor partnerships",
    descriptionFr: "Coopération internationale au service du développement des infrastructures.",
    descriptionEn: "International cooperation for infrastructure development.",
    coverUrl: albumPartenariatsPhotos[0]?.imageUrl ?? PLACEHOLDER,
    coverAlt: "Partenariats bailleurs",
    date: "2025-05-12T15:00:00.000Z",
    itemCount: albumPartenariatsPhotos.length,
    items: albumPartenariatsPhotos,
  },
];

const standalonePhotos: ResolvedMediaItem[] = [
  buildPhoto("demo-photo-1", 8, "Réhabilitation urbaine — Kinshasa", "Urban rehabilitation — Kinshasa", "Modernisation des artères principales.", "Modernisation of main arteries.", { featured: true }),
  buildPhoto("demo-photo-2", 9, "Adduction d'eau — Kongo Central", "Water supply — Kongo Central", "Pose de conduites sur 42 km.", "42 km pipeline installation.", {}),
  buildPhoto("demo-photo-3", 10, "Électrification rurale", "Rural electrification", "Extension du réseau moyenne tension.", "Medium-voltage network extension.", {}),
  buildPhoto("demo-photo-4", 11, "École communautaire rénovée", "Renovated community school", "Livraison d'un bloc pédagogique neuf.", "Handover of a new classroom block.", {}),
  buildPhoto("demo-photo-5", 0, "Centre de santé — Équateur", "Health centre — Équateur", "Inauguration des nouveaux blocs.", "Opening of new facility blocks.", {}),
  buildPhoto("demo-photo-6", 1, "Entretien pont suspendu", "Suspension bridge maintenance", "Renforcement des câbles porteurs.", "Main cable reinforcement.", {}),
];

const standaloneVideos: ResolvedMediaItem[] = DEMO_VIDEOS.map((video, index) =>
  buildVideo(video.id, index, video.titleFr, video.titleEn, video.captionFr, video.captionEn, {
    featured: index === 0,
  })
);

/** Flat list of all demo media (photos + videos not already in albums). */
export const FALLBACK_MEDIA: ResolvedMediaItem[] = [
  ...standalonePhotos,
  ...standaloneVideos,
  ...albumInaugurationPhotos,
  ...albumChantiersPhotos,
  ...albumMissionsPhotos,
  ...albumPartenariatsPhotos,
];

export function getFallbackAlbumBySlug(slug: string): ResolvedMediaAlbum | undefined {
  return FALLBACK_ALBUMS.find((album) => album.slug === slug);
}

export function getFallbackAlbumSlugs(): string[] {
  return FALLBACK_ALBUMS.map((album) => album.slug);
}

export function getFallbackYoutubeThumbnail(videoId: string): string {
  return youtubeThumbnailUrl(videoId);
}

export function getFallbackYoutubeIdFromUrl(url: string): string | null {
  return extractYoutubeId(url);
}
