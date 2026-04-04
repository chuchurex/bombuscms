import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const hasConfig = Boolean(projectId);

export const client = hasConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true,
    })
  : null;

const builder = hasConfig && client ? createImageUrlBuilder(client) : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!builder)
    return { width: () => ({ height: () => ({ url: () => "" }), url: () => "" }) };
  return builder.image(source);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchOne(query: string, params?: Record<string, any>): Promise<any> {
  if (!client) return null;
  try {
    return await client.fetch(query, params);
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchMany(query: string, params?: Record<string, any>): Promise<any[]> {
  if (!client) return [];
  try {
    return await client.fetch(query, params);
  } catch {
    return [];
  }
}

// --- Site Settings ---

export async function getSiteSettings() {
  return fetchOne(
    `*[_type == "siteSettings"][0]{
      title, tagline, description, logo, contactEmail, socialLinks
    }`
  );
}

// --- Home Page ---

export async function getHomePage() {
  return fetchOne(
    `*[_type == "homePage"][0]{
      heroTitle, heroSubtitle, heroCta, heroCtaLink,
      featuredNewsCount, ctaSectionTitle, ctaSectionDescription
    }`
  );
}

// --- About Page ---

export async function getAboutPage() {
  return fetchOne(
    `*[_type == "aboutPage"][0]{
      title, introduction, body, institutions
    }`
  );
}

// --- Posts ---

export async function getPosts() {
  return fetchMany(
    `*[_type == "post"] | order(publishedAt desc){
      _id, title, slug, publishedAt, excerpt, mainImage,
      category->{ title, slug }
    }`
  );
}

export async function getPostBySlug(slug: string) {
  return fetchOne(
    `*[_type == "post" && slug.current == $slug][0]{
      _id, title, slug, publishedAt, excerpt, mainImage,
      category->{ title, slug }, body
    }`,
    { slug }
  );
}

export async function getPostSlugs() {
  return fetchMany(
    `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
  );
}

// --- Publications ---

export async function getPublications() {
  return fetchMany(
    `*[_type == "publication"] | order(year desc){
      _id, title, slug, authors, year, abstract, doi, pdfUrl,
      category->{ title, slug }
    }`
  );
}

export async function getPublicationBySlug(slug: string) {
  return fetchOne(
    `*[_type == "publication" && slug.current == $slug][0]{
      _id, title, slug, authors, year, abstract, doi, pdfUrl,
      category->{ title, slug }
    }`,
    { slug }
  );
}

export async function getPublicationSlugs() {
  return fetchMany(
    `*[_type == "publication" && defined(slug.current)]{ "slug": slug.current }`
  );
}

// --- Events ---

export async function getEvents() {
  return fetchMany(
    `*[_type == "event"] | order(startDate desc){
      _id, title, slug, description, startDate, endDate, location,
      registrationUrl, image
    }`
  );
}

export async function getEventBySlug(slug: string) {
  return fetchOne(
    `*[_type == "event" && slug.current == $slug][0]{
      _id, title, slug, description, body, startDate, endDate, location,
      registrationUrl, image
    }`,
    { slug }
  );
}

export async function getEventSlugs() {
  return fetchMany(
    `*[_type == "event" && defined(slug.current)]{ "slug": slug.current }`
  );
}

// --- Team Members ---

export async function getTeamMembers() {
  return fetchMany(
    `*[_type == "teamMember"] | order(order asc){
      _id, name, role, institution, photo, bio, profileUrl
    }`
  );
}

// --- Featured content for homepage ---

export async function getFeaturedPosts(count: number = 3) {
  return fetchMany(
    `*[_type == "post"] | order(publishedAt desc)[0...$count]{
      _id, title, slug, publishedAt, excerpt, mainImage,
      category->{ title, slug }
    }`,
    { count }
  );
}

export async function getUpcomingEvents() {
  return fetchMany(
    `*[_type == "event" && startDate >= now()] | order(startDate asc)[0...3]{
      _id, title, slug, description, startDate, location
    }`
  );
}
