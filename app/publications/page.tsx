import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { getPublications } from "@/lib/sanity";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publications",
  description: "Academic publications and research papers.",
};

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <>
      <Hero
        title="Publications"
        subtitle="Academic publications and research results."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {publications && publications.length > 0 ? (
            <div className="space-y-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {publications.map((pub: any) => (
                <Link
                  key={pub._id}
                  href={`/publications/${pub.slug?.current}`}
                  className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pub.doi && (
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-primary bg-primary-light rounded-full">
                        DOI
                      </span>
                    )}
                    {pub.pdfUrl && (
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-neutral bg-gray-100 rounded-full">
                        PDF available
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-black mb-2 hover:text-primary-dark transition-colors">
                    {pub.title}
                  </h2>

                  {pub.authors && (
                    <p className="text-sm text-neutral mb-3">
                      {pub.authors}
                    </p>
                  )}

                  {pub.abstract && (
                    <p className="text-sm text-black/80 line-clamp-2 mb-3">
                      {pub.abstract}
                    </p>
                  )}

                  {pub.year && (
                    <p className="text-sm text-neutral">
                      {pub.year}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Coming soon
              </h2>
              <p className="text-neutral max-w-md mx-auto">
                We&apos;re working on publishing our research. Check back soon for our academic papers.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
