import { defineType, defineField } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",

  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroCta",
      title: "CTA Button Text",
      type: "string",
    }),
    defineField({
      name: "heroCtaLink",
      title: "CTA Button Link",
      type: "string",
    }),
    defineField({
      name: "featuredNewsCount",
      title: "Featured posts to show",
      type: "number",
      initialValue: 3,
    }),
    defineField({
      name: "ctaSectionTitle",
      title: "CTA Section Title",
      type: "string",
    }),
    defineField({
      name: "ctaSectionDescription",
      title: "CTA Section Description",
      type: "text",
      rows: 4,
    }),
  ],
});
