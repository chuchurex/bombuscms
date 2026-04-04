# BombusCMS

A content-driven website template built with Next.js 15, Sanity CMS, and Tailwind CSS 4. Static export ready.

## Quick Start

```bash
# 1. Clone or use as template
gh repo create my-site --template bombuscms/bombuscms
cd my-site

# 2. Run the setup script
node setup.js

# 3. Install dependencies
npm install --legacy-peer-deps

# 4. Start development
npm run dev
```

## Stack

- **Next.js 15** - App Router with `output: "export"` for static sites
- **Sanity CMS** - Headless CMS with embedded Studio
- **Tailwind CSS 4** - Utility-first styling with `@theme inline` tokens
- **Formspree** - Contact form handling (no backend needed)

## Project Structure

```
app/
  page.tsx              # Homepage (hero + posts + events + CTA)
  about/page.tsx        # About page (from Sanity singleton)
  posts/                # Blog posts listing and detail
  publications/         # Academic publications listing and detail
  events/               # Events listing and detail (upcoming/past)
  contact/page.tsx      # Contact form + info
  layout.tsx            # Root layout with Header/Footer
  globals.css           # Tailwind theme tokens (colors, fonts)

components/
  Header.tsx            # Navigation bar (desktop + mobile)
  Footer.tsx            # Site footer with link sections
  Hero.tsx              # Full-width hero banner
  Card.tsx              # Content card (posts, etc.)
  ContactForm.tsx       # Formspree-powered contact form
  MobileNav.tsx         # Mobile navigation drawer
  PortableTextRenderer.tsx  # Sanity rich text renderer

lib/
  config.ts             # Site configuration (name, nav, footer, contact)
  sanity.ts             # Sanity client + data fetching functions

sanity/schemas/         # Sanity document schemas
  siteSettings.ts       # Site-wide settings (singleton)
  homePage.ts           # Homepage content (singleton)
  aboutPage.ts          # About page content (singleton)
  post.ts               # Blog posts
  publication.ts        # Academic publications
  event.ts              # Events
  teamMember.ts         # Team members
  category.ts           # Categories
  blockContent.ts       # Portable Text config
```

## Configuration

### Site Config (`lib/config.ts`)

Central configuration for navigation, footer links, contact info, and site metadata. Edit this file to customize your site without touching components.

### Design Tokens (`app/globals.css`)

Colors are defined as CSS custom properties via Tailwind's `@theme inline`:

```css
@theme inline {
  --color-primary: #00adef;
  --color-primary-dark: #0c0edf;
  --color-primary-light: #e6f7fe;
  --color-primary-dark-light: #e8e8fd;
  --color-neutral: #969696;
}
```

Change these values to match your brand. The setup script does this automatically.

### Environment Variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=     # Your Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FORMSPREE_ID=          # Your Formspree form ID
```

## Sanity CMS

### Deploy schemas

```bash
npx sanity deploy
```

### Access Studio

The Sanity Studio is embedded at the project level. After deploying, access it at your configured Studio URL.

### Content Types

- **Singletons**: Site Settings, Home Page, About Page (one document each)
- **Collections**: Posts, Publications, Events, Team Members, Categories

## Localization

The template defaults to English routes. Run `node setup.js` with locale `es` to:

- Rename routes: `/about` -> `/quienes-somos`, `/posts` -> `/noticias`, etc.
- Translate navigation labels and UI strings
- Update all internal links automatically

## Deployment

This site uses `output: "export"` for static HTML generation.

```bash
npm run build    # Generates static files in /out
```

Deploy the `/out` directory to any static hosting: Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.

## License

MIT
