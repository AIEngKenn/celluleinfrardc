import { defineField, defineType } from "sanity";

export default defineType({
  name: "news",
  title: "Actualités",
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
      name: "excerptFr",
      title: "Résumé (Français)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "excerptEn",
      title: "Résumé (English)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "mainImage",
      title: "Image principale",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bodyFr",
      title: "Contenu (Français)",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bodyEn",
      title: "Contenu (English)",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: { type: "newsCategory" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Étiquettes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "author",
      title: "Auteur",
      type: "string",
    }),
    defineField({
      name: "relatedProjects",
      title: "Projets liés",
      type: "array",
      of: [{ type: "reference", to: { type: "project" } }],
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
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "titleFr",
      media: "mainImage",
      subtitle: "category.nameFr",
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
