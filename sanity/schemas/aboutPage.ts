import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "blockContent",
    }),
    defineField({
      name: "institutions",
      title: "Partner Institutions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
            defineField({ name: "url", title: "Website", type: "url" }),
          ],
        },
      ],
    }),
  ],
});
