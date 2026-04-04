import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

const singletonTypes = new Set(["siteSettings", "homePage", "aboutPage"]);

export default defineConfig({
  name: "default",
  title: "BombusCMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "PLACEHOLDER",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singletons
            S.listItem()
              .title("Site Settings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("Home Page")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.listItem()
              .title("About Page")
              .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
            S.divider(),
            // Collections (filter singletons from generic listing)
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.has(item.getId() as string)
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
});
