import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getEventSlugs, hasConfig } from "@/lib/sanity";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!hasConfig) return [{ slug: "_" }];
  const slugs = await getEventSlugs();
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!hasConfig) return { title: "Event" };
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Event not found" };

  return {
    title: event.title,
    description: event.description || event.title,
    openGraph: event.image
      ? { images: [urlFor(event.image).width(1200).height(630).url()] }
      : undefined,
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const isPastEvent = new Date(event.startDate) < new Date();

  return (
    <>
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/events"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to events
            </Link>

            {isPastEvent && (
              <span className="inline-block px-3 py-1 text-xs font-medium text-neutral bg-gray-100 rounded-full mb-4">
                Past event
              </span>
            )}

            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 mb-6 text-black/80">
              {event.startDate && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(event.startDate).toLocaleDateString("en", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {event.endDate && event.endDate !== event.startDate && (
                      <p className="text-xs text-neutral">
                        Until{" "}
                        {new Date(event.endDate).toLocaleDateString("en", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm font-medium">{event.location}</p>
                </div>
              )}
            </div>

            {event.registrationUrl && !isPastEvent && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary-dark text-white text-sm font-medium rounded-lg hover:bg-primary-dark/90 transition-colors"
              >
                Register
              </a>
            )}
          </div>

          {event.image && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 bg-gray-100">
              <Image
                src={urlFor(event.image).width(1200).height(675).url()}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {event.description && (
            <div className="mb-12 p-6 bg-gradient-to-br from-primary-light to-primary-dark-light rounded-xl">
              <p className="text-lg text-black/90 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {event.body && (
            <div className="prose prose-lg max-w-none">
              <PortableTextRenderer value={event.body} />
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/events"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              View all events
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
