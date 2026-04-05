import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import { siteConfig } from "@/lib/config";

interface CardProps {
  title: string;
  href: string;
  description?: string;
  image?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  date?: string;
  category?: string;
  badge?: string;
}

export default function Card({ title, href, description, image, date, category, badge }: CardProps) {
  return (
    <Link href={href} className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      {image?.asset && (
        <div className="aspect-video overflow-hidden bg-gray-50">
          <Image
            src={urlFor(image).width(600).height(340).url()}
            alt={image.alt || title}
            width={600}
            height={340}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          {category && (
            <span className="text-xs font-medium text-primary bg-primary-light px-2 py-0.5 rounded-full">
              {category}
            </span>
          )}
          {badge && (
            <span className="text-xs font-medium text-primary-dark bg-primary-dark-light px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
          {date && (
            <time className="text-xs text-neutral">
              {new Date(date).toLocaleDateString(siteConfig.locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          )}
        </div>
        <h3 className="text-lg font-semibold text-black group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-neutral line-clamp-3">{description}</p>
        )}
      </div>
    </Link>
  );
}
