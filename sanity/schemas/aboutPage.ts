import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "Page À propos",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom interne",
      type: "string",
      initialValue: "Page À propos",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "pageTitleFr", title: "Titre de page (Français)", type: "string" }),
    defineField({ name: "pageTitleEn", title: "Page title (English)", type: "string" }),
    defineField({ name: "subtitleFr", title: "Sous-titre (Français)", type: "text" }),
    defineField({ name: "subtitleEn", title: "Subtitle (English)", type: "text" }),
    defineField({
      name: "heroImage",
      title: "Image bannière",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Texte alternatif" }],
    }),
    defineField({ name: "missionEyebrowFr", title: "Surtitre missions (Français)", type: "string" }),
    defineField({ name: "missionEyebrowEn", title: "Mission eyebrow (English)", type: "string" }),
    defineField({ name: "missionTitleFr", title: "Titre missions (Français)", type: "string" }),
    defineField({ name: "missionTitleEn", title: "Mission title (English)", type: "string" }),
    defineField({
      name: "missions",
      title: "Cartes missions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icône",
              type: "string",
              options: {
                list: [
                  { title: "Bâtiment", value: "building" },
                  { title: "Documents", value: "file" },
                  { title: "Globe", value: "globe" },
                  { title: "Utilisateurs", value: "users" },
                ],
              },
            }),
            defineField({ name: "titleFr", title: "Titre (Français)", type: "string" }),
            defineField({ name: "titleEn", title: "Title (English)", type: "string" }),
            defineField({ name: "descriptionFr", title: "Description (Français)", type: "text" }),
            defineField({ name: "descriptionEn", title: "Description (English)", type: "text" }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", type: "string", title: "Texte alternatif" }],
            }),
          ],
          preview: {
            select: { title: "titleFr", subtitle: "descriptionFr" },
          },
        },
      ],
    }),
    defineField({ name: "organizationEyebrowFr", title: "Surtitre organisation (Français)", type: "string" }),
    defineField({ name: "organizationEyebrowEn", title: "Organization eyebrow (English)", type: "string" }),
    defineField({ name: "organizationTitleFr", title: "Titre organisation (Français)", type: "string" }),
    defineField({ name: "organizationTitleEn", title: "Organization title (English)", type: "string" }),
    defineField({ name: "organizationBodyFr", title: "Texte organisation (Français)", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "organizationBodyEn", title: "Organization body (English)", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "organizationImage",
      title: "Image organisation",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Texte alternatif" }],
    }),
    defineField({ name: "figuresEyebrowFr", title: "Surtitre chiffres (Français)", type: "string" }),
    defineField({ name: "figuresEyebrowEn", title: "Figures eyebrow (English)", type: "string" }),
    defineField({ name: "figuresTitleFr", title: "Titre chiffres (Français)", type: "string" }),
    defineField({ name: "figuresTitleEn", title: "Figures title (English)", type: "string" }),
    defineField({
      name: "figures",
      title: "Chiffres clés",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Valeur", type: "string" }),
            defineField({ name: "labelFr", title: "Libellé (Français)", type: "string" }),
            defineField({ name: "labelEn", title: "Label (English)", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "labelFr" },
          },
        },
      ],
    }),
  ],
});
