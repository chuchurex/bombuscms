import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { getEvents } from "@/lib/sanity";
import { siteConfig } from "@/lib/config";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past events.",
};

export default async function EventsPage() {
  const allEvents = await getEvents();

  const now = new Date();
  const upcomingEvents = allEvents?.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => new Date(event.startDate) >= now
  ) || [];
  const pastEvents = allEvents?.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => new Date(event.startDate) < now
  ) || [];

  return (
    <>
      <Hero
        title="Events"
        subtitle="Seminars, workshops, and conferences."
      />

      {upcomingEvents.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-8">
              Upcoming Events
            </h2>
            <div className="space-y-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {upcomingEvents.map((event: any) => (
                <Link
                  key={event._id}
                  href={`/events/${event.slug?.current}`}
                  className="block p-6 bg-gradient-to-br from-primary-light to-primary-dark-light rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0 w-24 h-24 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm">
                      <span className="text-sm font-medium text-primary">
                        {new Date(event.startDate).toLocaleDateString(siteConfig.locale, { month: "short" }).toUpperCase()}
                      </span>
                      <span className="text-3xl font-bold text-primary-dark">
                        {new Date(event.startDate).getDate()}
                      </span>
                      <span className="text-xs text-neutral">
                        {new Date(event.startDate).getFullYear()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-black mb-2 hover:text-primary-dark transition-colors">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="text-sm text-black/70 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-black/80 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {pastEvents.length > 0 && (
        <section className={`py-16 sm:py-20 ${upcomingEvents.length > 0 ? 'bg-gray-50' : ''}`}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-8">
              Past Events
            </h2>
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {pastEvents.map((event: any) => (
                <Link
                  key={event._id}
                  href={`/events/${event.slug?.current}`}
                  className="block p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs font-medium text-neutral">
                        {new Date(event.startDate).toLocaleDateString(siteConfig.locale, { month: "short" }).toUpperCase()}
                      </span>
                      <span className="text-xl font-bold text-black">
                        {new Date(event.startDate).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-black mb-1 hover:text-primary-dark transition-colors">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="text-sm text-neutral">
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!upcomingEvents.length && !pastEvents.length && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Coming soon
              </h2>
              <p className="text-neutral max-w-md mx-auto">
                We&apos;re planning events. Check back soon for upcoming seminars and workshops.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
