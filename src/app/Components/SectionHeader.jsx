import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";

// Title row of a home-page section, with an optional "see all" link.
export default function SectionHeader({ title, subtitle, href, linkLabel = "عرض الكل" }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4" dir="rtl">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-green5 hover:text-green4">
          {linkLabel}
          <FiChevronLeft size={16} />
        </Link>
      )}
    </div>
  );
}
