import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs, hasConfig } from "@/lib/sanity";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { urlFor } from "@/lib/sanity";
import { siteConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!hasConfig) return [{ slug: "_" }];
  const slugs = await getPostSlugs();
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!hasConfig) return { title: "Post" };
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: post.mainImage
      ? { images: [urlFor(post.mainImage).width(1200).height(630).url()] }
      : undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/posts"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to posts
            </Link>

            {post.category && (
              <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary-light rounded-full mb-4">
                {post.category.title}
              </span>
            )}

            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              {post.title}
            </h1>

            {post.publishedAt && (
              <time className="text-sm text-neutral" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(siteConfig.locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>

          {post.mainImage && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 bg-gray-100">
              <Image
                src={urlFor(post.mainImage).width(1200).height(675).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {post.excerpt && (
            <div className="mb-12 p-6 bg-gradient-to-br from-primary-light to-primary-dark-light rounded-xl">
              <p className="text-lg text-black/90 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}

          {post.body && (
            <div className="prose prose-lg max-w-none">
              <PortableTextRenderer value={post.body} />
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/posts"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              View all posts
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
