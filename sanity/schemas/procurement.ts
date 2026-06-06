import { defineField, defineType } from "sanity";

export default defineType({
  name: "procurement",
  title: "Appels d'offres",
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
      name: "reference",
      title: "Référence",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (Français)",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Travaux", value: "works" },
          { title: "Fournitures", value: "supplies" },
          { title: "Services", value: "services" },
          { title: "Consultance", value: "consultancy" },
          { title: "Recrutement", value: "recruitment" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "openingDate",
      title: "Date d'ouverture",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "closingDate",
      title: "Date de clôture",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "budget",
      title: "Budget estimé (USD)",
      type: "number",
    }),
    defineField({
      name: "attachments",
      title: "Pièces jointes",
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
      name: "howToApplyFr",
      title: "Instructions pour postuler (Français)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "howToApplyEn",
      title: "Instructions pour postuler (English)",
      type: "array",
      of: [{ type: "block" }],
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
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "titleFr",
      subtitle: "reference",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: `Réf: ${subtitle}`,
      };
    },
  },
  orderings: [
    {
      title: "Date de clôture, plus proche",
      name: "closingDateAsc",
      by: [{ field: "closingDate", direction: "asc" }],
    },
  ],
});
