import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Projets",
  type: "document",
  fields: [
    defineField({
      name: "titleFr",
      title: "Titre (Français)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Titre (English)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Identifiant URL",
      type: "slug",
      options: {
        source: "titleFr",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (Français)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mainImage",
      title: "Image principale",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "province",
      title: "Province",
      type: "reference",
      to: { type: "province" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "En préparation", value: "preparation" },
          { title: "En cours", value: "ongoing" },
          { title: "Terminé", value: "completed" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sector",
      title: "Secteur",
      type: "string",
      options: {
        list: [
          { title: "Routes", value: "roads" },
          { title: "Énergie", value: "energy" },
          { title: "Eau et assainissement", value: "water" },
          { title: "Transport", value: "transport" },
          { title: "Bâtiments publics", value: "buildings" },
          { title: "Télécommunications", value: "telecom" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "budget",
      title: "Budget (USD)",
      type: "number",
    }),
    defineField({
      name: "fundingSource",
      title: "Source de financement",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Date de début",
      type: "date",
    }),
    defineField({
      name: "endDate",
      title: "Date de fin prévue",
      type: "date",
    }),
    defineField({
      name: "completionDate",
      title: "Date d'achèvement",
      type: "date",
    }),
    defineField({
      name: "progress",
      title: "Avancement (%)",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "objectivesFr",
      title: "Objectifs (Français)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "objectivesEn",
      title: "Objectifs (English)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "location",
      title: "Localisation",
      type: "geopoint",
    }),
    defineField({
      name: "gallery",
      title: "Galerie photos",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "documents",
      title: "Documents",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "titleFr", title: "Titre (Français)", type: "string" },
            { name: "titleEn", title: "Titre (English)", type: "string" },
            { name: "file", title: "Fichier", type: "file" },
          ],
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Mettre en avant",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "titleFr",
      media: "mainImage",
      subtitle: "province.nameFr",
    },
  },
});
