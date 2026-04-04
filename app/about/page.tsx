import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { getAboutPage, getTeamMembers } from "@/lib/sanity";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about our team and mission.",
};

export default async function AboutPage() {
  const [aboutPage, teamMembers] = await Promise.all([
    getAboutPage(),
    getTeamMembers(),
  ]);

  return (
    <>
      <Hero
        title={aboutPage?.title || "About"}
        subtitle={aboutPage?.introduction || "Meet our team"}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {aboutPage?.body && (
            <div className="prose prose-lg max-w-none">
              <PortableTextRenderer value={aboutPage.body} />
            </div>
          )}
        </div>
      </section>

      {teamMembers && teamMembers.length > 0 && (
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">
              Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {teamMembers.map((member: any) => (
                <div
                  key={member._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {member.photo && (
                    <div className="relative h-64 w-full bg-gray-100">
                      <Image
                        src={urlFor(member.photo).width(400).height(400).url()}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-1">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-sm font-medium text-primary mb-3">
                        {member.role}
                      </p>
                    )}
                    {member.bio && (
                      <p className="text-sm text-neutral leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                    {member.profileUrl && (
                      <a
                        href={member.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-sm font-medium text-primary-dark hover:text-primary transition-colors"
                      >
                        View profile
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
