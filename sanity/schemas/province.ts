import { defineField, defineType } from "sanity";

export default defineType({
  name: "province",
  title: "Provinces",
  type: "document",
  fields: [
    defineField({
      name: "nameFr",
      title: "Nom (Français)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nameEn",
      title: "Nom (English)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Identifiant URL",
      type: "slug",
      options: {
        source: "nameFr",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "string",
    }),
    defineField({
      name: "center",
      title: "Centre géographique",
      type: "geopoint",
    }),
  ],
  preview: {
    select: {
      title: "nameFr",
      subtitle: "code",
    },
  },
});
