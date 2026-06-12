import { defineField, defineType } from "sanity";

const socialPlatformOptions = [
  { title: "Facebook", value: "facebook" },
  { title: "X (Twitter)", value: "x" },
  { title: "YouTube", value: "youtube" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "Instagram", value: "instagram" },
  { title: "TikTok", value: "tiktok" },
  { title: "Autre", value: "other" },
];

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
    defineField({
      name: "socialLinks",
      title: "Réseaux sociaux (footer)",
      description: "Ajoutez les liens affichés dans le pied de page. Ordre = ordre d'affichage.",
      type: "array",
      group: "social",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Plateforme",
              type: "string",
              options: { list: socialPlatformOptions, layout: "dropdown" },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Libellé (accessibilité, optionnel)",
              type: "string",
            }),
          ],
          preview: {
            select: { platform: "platform", url: "url" },
            prepare({ platform, url }) {
              const match = socialPlatformOptions.find((item) => item.value === platform);
              return {
                title: match?.title ?? platform ?? "Réseau social",
                subtitle: url,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook (legacy)",
      description: "Utilisez plutôt « Réseaux sociaux » ci-dessus. Conservé pour compatibilité.",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "xUrl",
      title: "X / Twitter (legacy)",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube (legacy)",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn (legacy)",
      type: "url",
      group: "social",
    }),
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
