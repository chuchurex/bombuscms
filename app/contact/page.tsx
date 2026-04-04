import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with us.",
};

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <>
      <Hero
        title="Contact"
        subtitle="Have a question? We'd love to hear from you."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-primary-light to-primary-dark-light rounded-xl">
                <h3 className="text-lg font-bold text-black mb-4">
                  {contact.institution}
                </h3>
                {contact.organization && (
                  <p className="text-sm text-black/80 mb-2">
                    {contact.organization}
                  </p>
                )}
                <div className="space-y-3 text-sm text-black/70">
                  <p className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="whitespace-pre-line">{contact.address}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${contact.email}`} className="text-primary hover:text-primary-dark transition-colors">
                      {contact.email}
                    </a>
                  </p>
                  {contact.website && (
                    <p className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors">
                        {contact.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {contact.hours && (
                <div className="p-6 bg-gradient-to-br from-primary-light to-primary-dark-light rounded-xl">
                  <h3 className="text-lg font-bold text-black mb-2">Hours</h3>
                  <p className="text-sm text-black/70">{contact.hours}</p>
                </div>
              )}

              {contact.extras.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-primary-light to-primary-dark-light rounded-xl">
                  {contact.extras.map((extra, i) => (
                    <p key={i} className="flex items-center gap-2 text-sm text-black/70">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {extra.label}: {extra.value}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
