import { defineField } from "sanity";

export const socialPlatformOptions = [
  { title: "Facebook", value: "facebook" },
  { title: "X (Twitter)", value: "x" },
  { title: "YouTube", value: "youtube" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "Instagram", value: "instagram" },
  { title: "TikTok", value: "tiktok" },
  { title: "Autre", value: "other" },
];

/** Reusable social links array field for singleton settings documents. */
export function socialLinksField(options?: { group?: string; title?: string; description?: string }) {
  return defineField({
    name: "socialLinks",
    title: options?.title ?? "Réseaux sociaux (footer)",
    description:
      options?.description ??
      "Ajoutez les liens affichés dans le pied de page. Ordre = ordre d'affichage.",
    type: "array",
    group: options?.group,
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
  });
}

export const legacySocialUrlFields = [
  defineField({
    name: "facebookUrl",
    title: "Facebook (legacy)",
    description: "Utilisez plutôt « Réseaux sociaux ». Conservé pour compatibilité.",
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
] as const;
