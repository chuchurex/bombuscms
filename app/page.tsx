import Hero from "@/components/Hero";
import Card from "@/components/Card";
import Link from "next/link";
import { getHomePage, getFeaturedPosts, getUpcomingEvents } from "@/lib/sanity";
import { siteConfig } from "@/lib/config";

export default async function HomePage() {
  const [homePage, posts, events] = await Promise.all([
    getHomePage(),
    getFeaturedPosts(),
    getUpcomingEvents(),
  ]);

  return (
    <>
      <Hero
        title={homePage?.heroTitle || "Welcome"}
        subtitle={homePage?.heroSubtitle || "Your site description goes here."}
        ctaText={homePage?.heroCta}
        ctaLink={homePage?.heroCtaLink}
      />

      {posts && posts.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-black">Posts</h2>
                <p className="mt-2 text-neutral">Latest updates</p>
              </div>
              <Link
                href="/posts"
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {posts.map((post: any) => (
                <Card
                  key={post._id}
                  title={post.title}
                  href={`/posts/${post.slug?.current}`}
                  description={post.excerpt}
                  image={post.mainImage}
                  date={post.publishedAt}
                  category={post.category?.title}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {events && events.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-8">
                  <h2 className="text-2xl font-bold text-black">Upcoming Events</h2>
                  <Link
                    href="/events"
                    className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    View all &rarr;
                  </Link>
                </div>
                <div className="space-y-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {events.map((event: any) => (
                    <Link
                      key={event._id}
                      href={`/events/${event.slug?.current}`}
                      className="block p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-primary-light rounded-lg flex flex-col items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {new Date(event.startDate).toLocaleDateString(siteConfig.locale, { month: "short" }).toUpperCase()}
                          </span>
                          <span className="text-xl font-bold text-primary-dark">
                            {new Date(event.startDate).getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-black truncate">{event.title}</h3>
                          {event.location && (
                            <p className="text-sm text-neutral">{event.location}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">
                {homePage?.ctaSectionTitle || "About"}
              </h2>
              <p className="text-black/80 leading-relaxed mb-8">
                {homePage?.ctaSectionDescription || "Learn more about our work and team."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/publications"
                  className="inline-flex items-center px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Publications
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center px-5 py-2.5 border border-primary-dark text-primary-dark text-sm font-medium rounded-lg hover:bg-primary-dark-light transition-colors"
                >
                  About us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
