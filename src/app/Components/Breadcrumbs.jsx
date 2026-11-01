import { Fragment } from "react";
import Link from "next/link";
import { generateBreadcrumbSchema, renderJSONLD } from "@/utils/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://exohaven-iq.com";

// "الرئيسية / … / current page", in the style the sub-category page has always
// used, plus the trail as structured data for Google. `items` are
// { label, href } after the home link; the last one is the current page, and
// items without a label (not loaded yet) are skipped.
export default function Breadcrumbs({ items }) {
  const trail = items.filter((item) => item.label);
  const schema = generateBreadcrumbSchema([
    { name: "الرئيسية", url: `${siteUrl}/` },
    ...trail.map((item) => ({ name: item.label, url: item.href ? `${siteUrl}${item.href}` : undefined })),
  ]);

  return (
    <>
      <nav aria-label="مسار التصفح" className="flex flex-wrap gap-y-1 mb-6 text-sm md:text-base">
        <Link href="/" className="text-gray-500 hover:text-green4">
          الرئيسية
        </Link>
        {trail.map((item, index) => (
          <Fragment key={`${index}-${item.label}`}>
            <span className="mx-2 text-gray-400">/</span>
            {index < trail.length - 1 && item.href ? (
              <Link href={item.href} className="text-gray-500 hover:text-green4">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-green5">{item.label}</span>
            )}
          </Fragment>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={renderJSONLD(schema)} />
    </>
  );
}
