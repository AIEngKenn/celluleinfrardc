import { defineField, defineType } from "sanity";

export default defineType({
  name: "publication",
  title: "Publications",
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
      rows: 4,
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "type",
      title: "Type de document",
      type: "string",
      options: {
        list: [
          { title: "Rapport", value: "report" },
          { title: "Étude", value: "study" },
          { title: "Document environnemental", value: "environmental" },
          { title: "Document social", value: "social" },
          { title: "Rapport technique", value: "technical" },
          { title: "Rapport institutionnel", value: "institutional" },
          { title: "Guide", value: "guide" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pdfFile",
      title: "Fichier PDF",
      type: "file",
      options: {
        accept: ".pdf",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Image de couverture",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "pages",
      title: "Nombre de pages",
      type: "number",
    }),
    defineField({
      name: "fileSize",
      title: "Taille du fichier (MB)",
      type: "number",
    }),
    defineField({
      name: "relatedProjects",
      title: "Projets liés",
      type: "array",
      of: [{ type: "reference", to: { type: "project" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "titleFr",
      media: "coverImage",
      subtitle: "type",
    },
  },
  orderings: [
    {
      title: "Date de publication, plus récent",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
