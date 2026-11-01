import { isLowStock } from "@/utils/product";

// "Last piece" urgency badge, for items (or a chosen variant) marked low stock in
// the admin. Renders nothing otherwise.
export default function StockBadge({ item, variant, className = "" }) {
  if (!isLowStock(item, variant)) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
      آخر قطعة – اطلبها الآن
    </span>
  );
}
