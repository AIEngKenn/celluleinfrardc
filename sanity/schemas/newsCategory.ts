import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsCategory",
  title: "Catégories d'actualités",
  type: "document",
  fields: [
    defineField({
      name: "nameFr",
      title: "Nom (Français)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nameEn",
      title: "Nom (English)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Identifiant URL",
      type: "slug",
      options: {
        source: "nameFr",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (Français)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "nameFr",
    },
  },
});
