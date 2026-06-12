import { defineField, defineType } from "sanity";

export default defineType({
  name: "partner",
  title: "Partenaire",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Site web",
      type: "url",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Texte alternatif" }],
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Partenaire financier", value: "financial" },
          { title: "Partenaire technique", value: "technical" },
          { title: "Institution internationale", value: "international" },
          { title: "Institution nationale", value: "national" },
        ],
        layout: "radio",
      },
      initialValue: "international",
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Mettre en avant sur l'accueil",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "logo",
    },
    prepare({ title, subtitle, media }) {
      const labels: Record<string, string> = {
        financial: "Financier",
        technical: "Technique",
        international: "International",
        national: "National",
      };
      return {
        title,
        subtitle: subtitle ? labels[subtitle] ?? subtitle : undefined,
        media,
      };
    },
  },
});
