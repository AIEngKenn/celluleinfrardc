import type { AboutMission } from '@/lib/sanity/types';

export interface FallbackMission extends Omit<AboutMission, 'contentFr' | 'contentEn' | 'slug'> {
  slug: string;
  highlightsFr: string[];
  highlightsEn: string[];
  contentFr: string[];
  contentEn: string[];
}

export const FALLBACK_MISSIONS: FallbackMission[] = [
  {
    slug: 'maitrise-ouvrage-delegue',
    icon: 'building',
    titleFr: "Maîtrise d'ouvrage délégué",
    titleEn: 'Delegated project management',
    descriptionFr:
      "Pilotage des projets d'infrastructure pour le compte de l'État, de la conception à la réception des ouvrages.",
    descriptionEn:
      'Managing infrastructure projects on behalf of the State, from design through to completion.',
    highlightsFr: [
      'Planification et suivi technique des grands projets routiers, hydrauliques et urbains',
      "Coordination des maîtres d'œuvre, bureaux d'études et entreprises",
      'Respect des délais, des coûts et des normes de qualité',
    ],
    highlightsEn: [
      'Planning and technical oversight of major road, hydraulic and urban projects',
      'Coordination of contractors, design firms and implementing companies',
      'Compliance with deadlines, costs and quality standards',
    ],
    contentFr: [
      "La Cellule Infrastructures exerce la maîtrise d'ouvrage déléguée pour le Gouvernement de la République Démocratique du Congo. Elle traduit les orientations stratégiques du Ministère des Infrastructures et Travaux Publics en programmes concrets sur le terrain.",
      "Sur chaque projet, la CI structure le cycle de vie : études, passation des marchés, exécution, contrôle et réception. Elle veille à la conformité des ouvrages livrés aux standards nationaux et aux exigences des bailleurs de fonds.",
      "Cette fonction garantit une continuité de gouvernance entre les décisions politiques, la mise en œuvre opérationnelle et la reddition de comptes auprès des citoyens et des partenaires.",
    ],
    contentEn: [
      'The Infrastructure Unit acts as delegated project owner for the Government of the Democratic Republic of Congo. It turns the strategic priorities of the Ministry of Infrastructure and Public Works into concrete programmes on the ground.',
      'On each project, CI structures the full lifecycle: studies, procurement, execution, supervision and handover. It ensures that delivered works meet national standards and donor requirements.',
      'This role ensures continuity between policy decisions, operational delivery and accountability to citizens and partners.',
    ],
  },
  {
    slug: 'passation-marches',
    icon: 'file',
    titleFr: 'Passation des marchés',
    titleEn: 'Public procurement',
    descriptionFr:
      'Publication, évaluation et attribution des marchés publics dans un cadre transparent et compétitif.',
    descriptionEn:
      'Publishing, evaluating and awarding public contracts within a transparent and competitive framework.',
    highlightsFr: [
      "Appels d'offres ouverts conformes au cadre juridique congolais",
      "Traçabilité des dossiers et des décisions d'attribution",
      'Accès équitable pour les entreprises nationales et internationales',
    ],
    highlightsEn: [
      'Open tenders aligned with the Congolese legal framework',
      'Traceability of dossiers and award decisions',
      'Fair access for national and international firms',
    ],
    contentFr: [
      "La passation des marchés est au cœur de la crédibilité de la Cellule Infrastructures. Toutes les procédures sont conduites selon les principes de transparence, de concurrence et d'égalité de traitement des soumissionnaires.",
      "Les avis d'appel d'offres, les cahiers des charges et les résultats sont publiés sur la plateforme afin de permettre un contrôle citoyen et la participation effective du secteur privé.",
      "La CI accompagne les autorités contractantes dans l'analyse des offres, la négociation et la signature des marchés, en limitant les risques de contentieux et de retards.",
    ],
    contentEn: [
      'Procurement is central to the credibility of the Infrastructure Unit. All procedures follow the principles of transparency, competition and equal treatment of bidders.',
      'Tender notices, specifications and results are published on the platform to enable public scrutiny and effective private-sector participation.',
      'CI supports contracting authorities in bid analysis, negotiation and contract signature, reducing the risk of disputes and delays.',
    ],
  },
  {
    slug: 'partenariats-internationaux',
    icon: 'globe',
    titleFr: 'Partenariats internationaux',
    titleEn: 'International partnerships',
    descriptionFr:
      "Interface avec la Banque mondiale, la BAD, l'UE et les autres partenaires au financement des infrastructures.",
    descriptionEn:
      'Interface with the World Bank, AfDB, the EU and other infrastructure financing partners.',
    highlightsFr: [
      'Mobilisation des financements extérieurs pour les projets structurants',
      'Respect des clauses de sauvegarde environnementale et sociale',
      'Coordination des missions de supervision des bailleurs',
    ],
    highlightsEn: [
      'Mobilisation of external funding for structural projects',
      'Compliance with environmental and social safeguard clauses',
      'Coordination of donor supervision missions',
    ],
    contentFr: [
      "La RDC mobilise des ressources importantes auprès de partenaires techniques et financiers. La Cellule Infrastructures en est l'interlocuteur opérationnel : elle prépare les dossiers, suit les décaissements et rend compte de l'avancement physique et financier.",
      "Les projets cofinancés imposent des standards rigoureux en matière d'environnement, de réinstallation des populations et de gouvernance. La CI veille à leur application sur l'ensemble du portefeuille.",
      "Cette mission renforce la confiance des partenaires internationaux et sécurise la pérennité des investissements dans les infrastructures congolaises.",
    ],
    contentEn: [
      'The DRC mobilises significant resources from technical and financial partners. The Infrastructure Unit is the operational counterpart: it prepares dossiers, tracks disbursements and reports on physical and financial progress.',
      'Co-financed projects require rigorous environmental, resettlement and governance standards. CI ensures they are applied across the portfolio.',
      "This mission strengthens international partners' confidence and secures the sustainability of investments in Congolese infrastructure.",
    ],
  },
  {
    slug: 'renforcement-capacites',
    icon: 'users',
    titleFr: 'Renforcement des capacités',
    titleEn: 'Capacity building',
    descriptionFr:
      'Formation des agents publics et transfert de compétences pour une gestion durable des projets.',
    descriptionEn:
      'Training public officials and transferring skills for sustainable project management.',
    highlightsFr: [
      'Programmes de formation pour les équipes techniques provinciales',
      'Appui aux cellules infrastructure des ministères sectoriels',
      "Capitalisation des retours d'expérience des projets achevés",
    ],
    highlightsEn: [
      'Training programmes for provincial technical teams',
      'Support to infrastructure units in sector ministries',
      'Capitalisation of lessons learned from completed projects',
    ],
    contentFr: [
      "Au-delà de la livraison d'ouvrages, la Cellule Infrastructures investit dans le capital humain. Des sessions de formation, des ateliers et des missions de coaching sont organisés pour les agents impliqués dans la chaîne de valeur des projets.",
      "L'objectif est de réduire la dépendance aux expertise externes et de construire, progressivement, une administration publique capable de piloter seule des programmes d'envergure.",
      "Les bonnes pratiques identifiées sur les chantiers sont documentées et partagées afin d'améliorer continuellement la performance institutionnelle.",
    ],
    contentEn: [
      'Beyond delivering assets, the Infrastructure Unit invests in human capital. Training sessions, workshops and coaching missions are organised for officials involved in the project value chain.',
      'The goal is to reduce reliance on external expertise and gradually build a public administration capable of managing large programmes independently.',
      'Good practices identified on sites are documented and shared to continuously improve institutional performance.',
    ],
  },
];

export function getFallbackMissionBySlug(slug: string): FallbackMission | undefined {
  return FALLBACK_MISSIONS.find((mission) => mission.slug === slug);
}

export function getFallbackMissionSlug(mission: AboutMission, index: number): string {
  const fallback = FALLBACK_MISSIONS[index];
  if (fallback) return fallback.slug;
  const title = mission.titleFr || mission.titleEn || `mission-${index + 1}`;
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
