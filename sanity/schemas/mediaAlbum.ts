import { defineField, defineType } from "sanity";

export default defineType({
  name: "mediaAlbum",
  title: "Albums médiathèque",
  type: "document",
  fields: [
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
      name: "slug",
      title: "Identifiant URL",
      type: "slug",
      options: {
        source: "title.fr",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        defineField({ name: "fr", title: "Français", type: "text", rows: 3 }),
        defineField({ name: "en", title: "English", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Image de couverture",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
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
      media: "coverImage",
      date: "date",
    },
    prepare({ title, media, date }) {
      return {
        title: title || "Album sans titre",
        subtitle: date ? new Date(date).toLocaleDateString("fr-FR") : "",
        media,
      };
    },
  },
});
