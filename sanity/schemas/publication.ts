import { defineType, defineField } from "sanity";

export const publication = defineType({
  name: "publication",
  title: "Publication",
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
      name: "authors",
      title: "Authors",
      type: "string",
      description: "Author names separated by commas",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Publication Year",
      type: "number",
      validation: (rule) => rule.required().min(1990).max(2100),
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "url",
    }),
    defineField({
      name: "pdfUrl",
      title: "PDF Link",
      type: "url",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
  ],
  orderings: [
    {
      title: "Year (newest)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", authors: "authors", year: "year" },
    prepare({ title, authors, year }) {
      return {
        title,
        subtitle: `${authors || "No author"} (${year || "n/d"})`,
      };
    },
  },
});
