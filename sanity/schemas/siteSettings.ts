import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom interne",
      type: "string",
      initialValue: "Paramètres globaux",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "email", title: "Email de contact", type: "string" }),
    defineField({ name: "phone", title: "Téléphone", type: "string" }),
    defineField({ name: "addressFr", title: "Adresse (Français)", type: "text" }),
    defineField({ name: "addressEn", title: "Address (English)", type: "text" }),
    defineField({ name: "facebookUrl", title: "Facebook", type: "url" }),
    defineField({ name: "xUrl", title: "X / Twitter", type: "url" }),
    defineField({ name: "youtubeUrl", title: "YouTube", type: "url" }),
    defineField({ name: "linkedinUrl", title: "LinkedIn", type: "url" }),
    defineField({
      name: "footerDescriptionFr",
      title: "Description footer (Français)",
      type: "text",
    }),
    defineField({
      name: "footerDescriptionEn",
      title: "Footer description (English)",
      type: "text",
    }),
  ],
});
