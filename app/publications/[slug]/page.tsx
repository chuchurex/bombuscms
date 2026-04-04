import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicationBySlug, getPublicationSlugs, hasConfig } from "@/lib/sanity";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!hasConfig) return [{ slug: "_" }];
  const slugs = await getPublicationSlugs();
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!hasConfig) return { title: "Publication" };
  const { slug } = await params;
  const pub = await getPublicationBySlug(slug);

  if (!pub) return { title: "Publication not found" };

  return {
    title: pub.title,
    description: pub.abstract || pub.title,
  };
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const pub = await getPublicationBySlug(slug);

  if (!pub) {
    notFound();
  }

  return (
    <>
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/publications"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to publications
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {pub.year && (
                <span className="inline-block px-3 py-1 text-xs font-medium text-neutral bg-gray-100 rounded-full">
                  {pub.year}
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              {pub.title}
            </h1>

            {pub.authors && (
              <p className="text-lg text-neutral mb-4">
                {pub.authors}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-8">
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View DOI
                </a>
              )}
              {pub.pdfUrl && (
                <a
                  href={pub.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-primary-dark text-primary-dark text-sm font-medium rounded-lg hover:bg-primary-dark-light transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              )}
            </div>
          </div>

          {pub.abstract && (
            <div className="mb-12 p-6 bg-gradient-to-br from-primary-light to-primary-dark-light rounded-xl">
              <h2 className="text-sm font-semibold text-primary-dark uppercase tracking-wide mb-3">
                Abstract
              </h2>
              <p className="text-black/90 leading-relaxed">
                {pub.abstract}
              </p>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/publications"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              View all publications
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
