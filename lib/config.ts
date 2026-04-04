export const siteConfig = {
  name: "My Site",
  shortName: "",
  description: "A site powered by BombusCMS",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "en",

  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/posts", label: "Posts" },
    { href: "/publications", label: "Publications" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
  ],

  footer: {
    description: "Your site description here.",
    sections: {
      site: {
        title: "SITE",
        links: [
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ],
      },
      content: {
        title: "CONTENT",
        links: [
          { href: "/posts", label: "Posts" },
          { href: "/publications", label: "Publications" },
          { href: "/events", label: "Events" },
        ],
      },
      external: {
        title: "LINKS",
        links: [] as { href: string; label: string }[],
      },
    },
    legal: "Your Organization",
    sublegal: "",
  },

  contact: {
    institution: "Your Institution",
    organization: "Your Organization",
    address: "123 Main St\nCity, Country",
    email: "hello@example.com",
    website: "",
    hours: "Mon-Fri 9:00 - 18:00",
    extras: [] as { label: string; value: string }[],
  },
};
