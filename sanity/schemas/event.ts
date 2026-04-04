import { defineType, defineField } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "body",
      title: "Detailed Content",
      type: "blockContent",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "registrationUrl",
      title: "Registration Link",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", title: "Alt Text", type: "string" },
      ],
    }),
  ],
  orderings: [
    {
      title: "Date (upcoming)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "startDate", location: "location" },
    prepare({ title, date, location }) {
      return {
        title,
        subtitle: `${date ? new Date(date).toLocaleDateString("en") : "No date"} - ${location || "No location"}`,
      };
    },
  },
});
