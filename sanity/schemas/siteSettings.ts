import { defineField, defineType } from "sanity";
import { legacySocialUrlFields, socialLinksField } from "./fields/socialLinks";

export default defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "social", title: "Réseaux sociaux" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nom interne",
      type: "string",
      group: "contact",
      initialValue: "Paramètres globaux",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email de contact",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "addressFr",
      title: "Adresse (Français)",
      type: "text",
      group: "contact",
    }),
    defineField({
      name: "addressEn",
      title: "Address (English)",
      type: "text",
      group: "contact",
    }),
    socialLinksField({ group: "social" }),
    ...legacySocialUrlFields,
    defineField({
      name: "footerDescriptionFr",
      title: "Description footer (Français)",
      type: "text",
      group: "footer",
    }),
    defineField({
      name: "footerDescriptionEn",
      title: "Footer description (English)",
      type: "text",
      group: "footer",
    }),
  ],
});
