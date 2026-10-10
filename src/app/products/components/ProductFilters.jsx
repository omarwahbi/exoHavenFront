"use client";
import { FiX } from "react-icons/fi";
import { entryKey } from "@/utils/ids";
import SortSelect from "@/app/Components/SortSelect";

// Filter row of /products: category, "in stock only", sort, and chips for what is
// active (including the search from the header), each removable.
export default function ProductFilters({
  categories,
  categoryId,
  onCategory,
  inStockOnly,
  onInStockOnly,
  sort,
  onSort,
  query,
  onClearQuery,
  onReset,
}) {
  const categoryName = categories.find((c) => entryKey(c) === categoryId)?.name;
  const active = Boolean(query || categoryId || inStockOnly);

  return (
    <div className="mb-6 space-y-3" dir="rtl">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-card">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          القسم
          <select
            value={categoryId || ""}
            onChange={(event) => onCategory(event.target.value || null)}
            className="h-10 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 focus:border-green3 focus:outline-none focus:ring-2 focus:ring-green2"
          >
            <option value="">كل الأقسام</option>
            {categories.map((category) => (
              <option key={category.id} value={entryKey(category)}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => onInStockOnly(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-green4"
          />
          المتوفر فقط
        </label>

        <SortSelect value={sort} onChange={onSort} hasQuery={Boolean(query)} className="sm:mr-auto" />
      </div>

      {active && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {query && (
            <Chip onRemove={onClearQuery}>
              بحث: «{query}»
            </Chip>
          )}
          {categoryId && <Chip onRemove={() => onCategory(null)}>{categoryName || "قسم"}</Chip>}
          {inStockOnly && <Chip onRemove={() => onInStockOnly(false)}>المتوفر فقط</Chip>}
          <button type="button" onClick={onReset} className="text-xs font-semibold text-gray-500 underline-offset-2 hover:text-red-600 hover:underline">
            مسح الكل
          </button>
        </div>
      )}
    </div>
  );
}

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green1 py-1 pr-3 pl-1 text-xs font-semibold text-green5">
      {children}
      <button type="button" onClick={onRemove} aria-label="إزالة" className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-green2">
        <FiX size={12} />
      </button>
    </span>
  );
}
