import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Card from "@/components/Card";
import { getPosts } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Posts",
  description: "Latest posts and updates.",
};

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <>
      <Hero
        title="Posts"
        subtitle="Stay up to date with our latest news and updates."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">All posts</h2>
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Coming soon
              </h2>
              <p className="text-neutral max-w-md mx-auto">
                We&apos;re preparing content. Check back soon for the latest updates.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
