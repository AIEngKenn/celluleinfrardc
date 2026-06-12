import { defineField, defineType } from "sanity";

export default defineType({
  name: "media",
  title: "Médiathèque",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Photo", value: "image" },
          { title: "Vidéo", value: "video" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "object",
      fields: [
        defineField({
          name: "fr",
          title: "Français",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "en",
          title: "English",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "caption",
      title: "Légende",
      type: "object",
      fields: [
        defineField({ name: "fr", title: "Français", type: "text", rows: 2 }),
        defineField({ name: "en", title: "English", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.type !== "image",
    }),
    defineField({
      name: "thumbnail",
      title: "Miniature vidéo",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.type !== "video",
    }),
    defineField({
      name: "videoUrl",
      title: "URL YouTube",
      type: "url",
      hidden: ({ document }) => document?.type !== "video",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
    }),
    defineField({
      name: "project",
      title: "Projet lié",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "album",
      title: "Album",
      type: "reference",
      to: [{ type: "mediaAlbum" }],
    }),
    defineField({
      name: "featured",
      title: "Mettre en avant",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title.fr",
      type: "type",
      media: "image",
      thumb: "thumbnail",
      date: "date",
    },
    prepare({ title, type, media, thumb, date }) {
      return {
        title: title || "Média sans titre",
        subtitle: [type === "video" ? "Vidéo" : "Photo", date ? new Date(date).toLocaleDateString("fr-FR") : ""]
          .filter(Boolean)
          .join(" · "),
        media: type === "video" ? thumb : media,
      };
    },
  },
});
