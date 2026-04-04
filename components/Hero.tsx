import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
          {ctaText && ctaLink && (
            <div className="mt-8">
              <Link
                href={ctaLink}
                className="inline-flex items-center px-6 py-3 bg-white text-primary-dark font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                {ctaText}
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
    </section>
  );
}
