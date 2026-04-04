import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  const { footer } = siteConfig;

  return (
    <footer className="bg-primary-dark text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{siteConfig.name}</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              {footer.sections.site.title}
            </h4>
            <ul className="space-y-2">
              {footer.sections.site.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              {footer.sections.content.title}
            </h4>
            <ul className="space-y-2">
              {footer.sections.content.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {footer.sections.external.links.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
                {footer.sections.external.title}
              </h4>
              <ul className="space-y-2">
                {footer.sections.external.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/70 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/50">
            {footer.legal}
          </p>
          {footer.sublegal && (
            <p className="text-xs text-white/40 mt-1">
              {footer.sublegal}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
