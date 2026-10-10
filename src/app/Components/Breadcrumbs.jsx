import Link from "next/link";
import { generateBreadcrumbSchema, renderJSONLD } from "@/utils/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://exohaven-iq.com";

// "الرئيسية › القسم › ..." trail for catalogue pages, with the matching
// BreadcrumbList structured data for search engines.
//
// `items` are { label, href } from the top down, without the home page (added
// here); the last one is the current page and is not a link. Items with no label
// yet (still loading) are skipped.
export default function Breadcrumbs({ items, className = "" }) {
  const trail = [{ label: "الرئيسية", href: "/" }, ...items.filter((item) => item?.label)];
  const schema = generateBreadcrumbSchema(
    trail.map((item) => ({ name: item.label, url: item.href ? `${siteUrl}${item.href}` : undefined })),
  );

  return (
    <nav aria-label="مسار التصفح" dir="rtl" className={`text-sm ${className}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={renderJSONLD(schema)} />
      {/* One line that scrolls sideways on narrow phones instead of wrapping. */}
      <ol className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none]">
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${index}-${item.label}`} className="flex items-center gap-1.5">
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className="font-semibold text-green5">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="text-gray-500 transition-colors hover:text-green4">
                  {item.label}
                </Link>
              )}
              {!last && (
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {/* Points left: the trail reads right to left. */}
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
