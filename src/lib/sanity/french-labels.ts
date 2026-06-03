// French schema labels and descriptions for Sanity Studio

export const frenchLabels = {
  // Project schema
  project: {
    name: "Projet",
    title: "Projets",
    titleField: "Titre",
    description: "Description",
    slug: "Identifiant URL",
    province: "Province",
    status: "Statut",
    sector: "Secteur",
    budget: "Budget",
    fundingSource: "Source de financement",
    startDate: "Date de début",
    endDate: "Date de fin",
    completionDate: "Date d'achèvement",
    progress: "Avancement (%)",
    objectives: "Objectifs",
    location: "Localisation",
    coordinates: "Coordonnées GPS",
    featured: "Mettre en avant",
    gallery: "Galerie photos",
    documents: "Documents",
    relatedNews: "Actualités liées",
    relatedProcurement: "Appels d'offres liés",
  },

  // News schema
  news: {
    name: "Actualité",
    title: "Actualités",
    titleField: "Titre",
    slug: "Identifiant URL",
    excerpt: "Résumé",
    body: "Contenu",
    publishedAt: "Date de publication",
    author: "Auteur",
    category: "Catégorie",
    tags: "Étiquettes",
    featured: "Mettre en avant",
    mainImage: "Image principale",
    relatedProjects: "Projets liés",
  },

  // Procurement schema
  procurement: {
    name: "Appel d'offres",
    title: "Appels d'offres",
    titleField: "Titre",
    slug: "Identifiant URL",
    reference: "Référence",
    description: "Description",
    category: "Catégorie",
    openingDate: "Date d'ouverture",
    closingDate: "Date de clôture",
    status: "Statut",
    budget: "Budget estimé",
    attachments: "Pièces jointes",
    howToApply: "Instructions pour postuler",
    relatedProjects: "Projets liés",
  },

  // Publication schema
  publication: {
    name: "Publication",
    title: "Publications",
    titleField: "Titre",
    slug: "Identifiant URL",
    description: "Description",
    type: "Type de document",
    publishedAt: "Date de publication",
    pdfFile: "Fichier PDF",
    coverImage: "Image de couverture",
    pages: "Nombre de pages",
    fileSize: "Taille du fichier",
    relatedProjects: "Projets liés",
  },

  // Media schema
  media: {
    name: "Média",
    title: "Médiathèque",
    titleField: "Titre",
    description: "Description",
    type: "Type",
    image: "Image",
    videoUrl: "URL YouTube",
    category: "Catégorie",
    tags: "Étiquettes",
    featured: "Mettre en avant",
    relatedProjects: "Projets liés",
  },

  // Common fields
  common: {
    title: "Titre",
    slug: "Identifiant URL",
    description: "Description",
    image: "Image",
    publishedAt: "Date de publication",
    createdAt: "Date de création",
    updatedAt: "Date de mise à jour",
    featured: "Mettre en avant",
    active: "Actif",
    category: "Catégorie",
    tags: "Étiquettes",
  },

  // Status options
  status: {
    draft: "Brouillon",
    published: "Publié",
    archived: "Archivé",
    preparation: "En préparation",
    ongoing: "En cours",
    completed: "Terminé",
    open: "Ouvert",
    closed: "Fermé",
    awarded: "Attribué",
  },
};
