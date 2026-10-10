"use client";
import { sortOptions } from "@/utils/search";

// Sort dropdown of product listings (see utils/search.js).
export default function SortSelect({ value, onChange, hasQuery = false, className = "" }) {
  return (
    <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 ${className}`}>
      ترتيب
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 focus:border-green3 focus:outline-none focus:ring-2 focus:ring-green2"
      >
        {sortOptions(hasQuery).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
