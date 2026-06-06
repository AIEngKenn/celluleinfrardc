import { defineField, defineType } from "sanity";

export default defineType({
  name: "homeSettings",
  title: "Accueil - Contenu éditable",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom interne",
      type: "string",
      initialValue: "Page d'accueil",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSlides",
      title: "Slides du hero",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "eyebrowFr", title: "Surtitre (Français)", type: "string" }),
            defineField({ name: "eyebrowEn", title: "Eyebrow (English)", type: "string" }),
            defineField({
              name: "titleFr",
              title: "Titre (Français)",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "titleEn", title: "Title (English)", type: "string" }),
            defineField({ name: "descriptionFr", title: "Description (Français)", type: "text" }),
            defineField({ name: "descriptionEn", title: "Description (English)", type: "text" }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "primaryCtaFr", title: "CTA principal (Français)", type: "string" }),
            defineField({ name: "primaryCtaEn", title: "Primary CTA (English)", type: "string" }),
            defineField({ name: "primaryHref", title: "Lien CTA principal", type: "string" }),
            defineField({ name: "secondaryCtaFr", title: "CTA secondaire (Français)", type: "string" }),
            defineField({ name: "secondaryCtaEn", title: "Secondary CTA (English)", type: "string" }),
            defineField({ name: "secondaryHref", title: "Lien CTA secondaire", type: "string" }),
          ],
          preview: {
            select: { title: "titleFr", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "partners",
      title: "Partenaires",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Nom", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "url", title: "Site web", type: "url" }),
            defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
          ],
          preview: {
            select: { title: "name", media: "logo" },
          },
        },
      ],
    }),
    defineField({
      name: "mediaTitleFr",
      title: "Titre médiathèque accueil (Français)",
      type: "string",
    }),
    defineField({
      name: "mediaTitleEn",
      title: "Media homepage title (English)",
      type: "string",
    }),
    defineField({
      name: "mediaDescriptionFr",
      title: "Description médiathèque accueil (Français)",
      type: "text",
    }),
    defineField({
      name: "mediaDescriptionEn",
      title: "Media homepage description (English)",
      type: "text",
    }),
  ],
});
