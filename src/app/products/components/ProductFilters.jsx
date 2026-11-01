"use client";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { entryKey } from "@/utils/ids";
import { PRICE_PRESETS, sortOptions } from "@/utils/productFilters";
import useSearchSuggestions from "@/app/Components/useSearchSuggestions";

// The sticky search / filter / view bar of /products, its filter panel, and the
// active-filters row under it. The filters live in the page's address
// (utils/productFilters.js); this only renders them and changes them.
export default function ProductFilters({
  categories,
  subCategories,
  filters,
  setFilters,
  searchInputValue,
  setSearchInputValue,
  isFilterOpen,
  setIsFilterOpen,
  viewStyle,
  setViewStyle,
  scrolled,
  isSearching,
  setIsSearching,
  activeFiltersCount,
  onSearchSubmit,
  onSearchAll,
  onClearSearch,
  onResetFilters,
}) {
  const { inputProps, list: suggestions } = useSearchSuggestions({ value: searchInputValue, onSearchAll });
  const categoryName = (id) => categories.find((c) => entryKey(c) === id)?.name;
  const subCategoryName = (id) => subCategories.find((c) => entryKey(c) === id)?.name;
  const hasPrice = filters.min !== null || filters.max !== null;

  return (
    <>
      {/* Enhanced Sticky Filters Bar */}
      <motion.div
        // Sticks under the top bar (h-20) while scrolling; not while the filter panel
        // is open, which can be taller than a phone screen.
        className={`${isFilterOpen ? "relative" : "sticky top-20"} z-30 py-4 bg-white shadow-md rounded-xl mb-6 transition-all duration-300 ${scrolled && !isFilterOpen ? "shadow-lg rounded-none" : ""}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-4" dir="rtl">
          {/* Enhanced Filter Toggle Button and View Toggle */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Enhanced Filter Toggle Button */}
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all ${isFilterOpen ? "bg-green4 text-white" : "bg-gray-100 text-green4 hover:bg-gray-200"}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaFilter className={isFilterOpen ? "rotate-180 transition-transform" : "transition-transform"} />
              <span className="font-medium">فلترة</span>
              <span className="flex items-center justify-center w-6 h-6 ml-1 bg-white bg-opacity-20 rounded-full text-xs">
                {activeFiltersCount}
              </span>
            </motion.button>

            {/* Enhanced View Toggle */}
            <div className="flex items-center rounded-lg p-1 bg-gray-100 shadow-inner">
              <motion.button
                onClick={() => setViewStyle("grid")}
                className={`p-2.5 rounded-md transition-all ${viewStyle === "grid" ? "bg-white text-green4 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Grid view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </motion.button>
              <motion.button
                onClick={() => setViewStyle("list")}
                className={`p-2.5 rounded-md transition-all ${viewStyle === "list" ? "bg-white text-green4 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="List view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Enhanced Search Bar with explicit search button */}
          <div className="relative flex-grow max-w-md">
            <form
              onSubmit={onSearchSubmit}
              className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-green3 focus-within:border-green3 transition-colors"
            >
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                {...inputProps}
                className="w-full py-3 px-4 text-right outline-none border-0 focus:ring-0 bg-white text-gray-800 placeholder-gray-400"
              />
              {searchInputValue && (
                <button
                  type="button"
                  onClick={() => setSearchInputValue("")}
                  className="px-2 text-gray-400 rounded-lg mx-1 hover:text-gray-600 focus:outline-none focus:ring-0"
                  aria-label="Clear search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={isSearching}
                className={`flex items-center justify-center px-5 bg-green4 hover:bg-green3 text-white transition-colors focus:outline-none ${isSearching ? "opacity-70 cursor-not-allowed" : ""}`}
                aria-label="Search"
                onClick={() => {
                  if (isSearching) {
                    // If already searching, reset the state
                    setIsSearching(false);
                  }
                }}
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaSearch className="rounded-full" />
                )}
              </button>
            </form>
            {suggestions}
          </div>
        </div>

        {/* Improved Expanded Filter Panel */}
        <motion.div
          initial={{ height: 0, opacity: 0, y: -10 }}
          animate={{
            height: isFilterOpen ? "auto" : 0,
            opacity: isFilterOpen ? 1 : 0,
            y: isFilterOpen ? 0 : -10,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 mt-4 border-t border-gray-100 px-4" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category */}
              <FilterSelect
                label="اختر الفئة:"
                value={filters.category || "all"}
                active={Boolean(filters.category)}
                onChange={(value) => setFilters({ category: value === "all" ? null : value })}
                options={[
                  { value: "all", label: "كل المنتجات" },
                  ...categories.map((cat) => ({ value: entryKey(cat), label: cat.name })),
                ]}
              />

              {/* Sub-category, once a category is chosen */}
              <FilterSelect
                label="القسم الفرعي:"
                value={filters.sub || "all"}
                active={Boolean(filters.sub)}
                disabled={!filters.category}
                onChange={(value) => setFilters({ sub: value === "all" ? null : value })}
                options={[
                  { value: "all", label: filters.category ? "كل الأقسام الفرعية" : "اختر الفئة أولاً" },
                  ...subCategories.map((sub) => ({ value: entryKey(sub), label: sub.name })),
                ]}
              />

              {/* Sort */}
              <FilterSelect
                label="ترتيب حسب:"
                value={filters.sort}
                active={false}
                onChange={(value) => setFilters({ sort: value })}
                options={sortOptions(Boolean(filters.q))}
              />

              {/* Price */}
              <PriceFilter min={filters.min} max={filters.max} onChange={(min, max) => setFilters({ min, max })} />

              {/* Switches */}
              <div className="flex flex-col gap-4">
                <Switch
                  label="إخفاء المنتجات غير المتوفرة:"
                  checked={filters.inStock}
                  onChange={(checked) => setFilters({ inStock: checked })}
                />
                <Switch
                  label="وصل حديثاً فقط:"
                  checked={filters.newOnly}
                  onChange={(checked) => setFilters({ newOnly: checked })}
                />
              </div>
            </div>

            {/* Reset filters button */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-center mt-4">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={onResetFilters}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 px-4 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <span>إعادة ضبط جميع الفلاتر</span>
                  <CloseIcon className="h-4 w-4" />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Active Filters Bar */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-3 shadow-sm mb-6 flex flex-wrap items-center justify-between"
          dir="rtl"
        >
          <div className="flex items-center text-sm text-gray-500">
            <span>الفلاتر النشطة:</span>
            <div className="flex flex-wrap gap-2 mr-2">
              {filters.q && <Chip onRemove={onClearSearch}>بحث: {filters.q}</Chip>}
              {filters.category && (
                <Chip onRemove={() => setFilters({ category: null })}>فئة: {categoryName(filters.category) || "…"}</Chip>
              )}
              {filters.sub && (
                <Chip onRemove={() => setFilters({ sub: null })}>قسم: {subCategoryName(filters.sub) || "…"}</Chip>
              )}
              {hasPrice && (
                <Chip onRemove={() => setFilters({ min: null, max: null })}>
                  السعر: {priceLabel(filters.min, filters.max)}
                </Chip>
              )}
              {filters.newOnly && <Chip onRemove={() => setFilters({ newOnly: false })}>وصل حديثاً</Chip>}
              {filters.inStock && <Chip onRemove={() => setFilters({ inStock: false })}>منتجات متوفرة فقط</Chip>}
            </div>
          </div>
          <button onClick={onResetFilters} className="text-xs text-gray-500 hover:text-red-500 mt-2 sm:mt-0">
            مسح الكل
          </button>
        </motion.div>
      )}
    </>
  );
}

const formatPrice = (value) => Number(value).toLocaleString("en-US");

// A range of numbers reads left to right ("10,000 - 25,000"), even in Arabic text.
const priceLabel = (min, max) => {
  if (min !== null && max !== null) return <span dir="ltr">{`${formatPrice(min)} - ${formatPrice(max)} IQD`}</span>;
  if (min !== null) return `من ${formatPrice(min)} IQD`;
  return `حتى ${formatPrice(max)} IQD`;
};

function CloseIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green1 text-green4 text-xs">
      {children}
      <button onClick={onRemove} className="mr-1 hover:text-red-500" aria-label="إزالة هذا الفلتر">
        <CloseIcon className="h-3 w-3" />
      </button>
    </span>
  );
}

// A labelled dropdown, in the style of the original category filter.
function FilterSelect({ label, value, options, onChange, active, disabled = false }) {
  return (
    <div className="flex items-center gap-3 w-full justify-start">
      <label className={`flex flex-col items-start gap-2 font-medium w-full ${disabled ? "text-gray-400" : "text-green4"}`}>
        <span className="text-sm">{label}</span>
        <div className="relative w-full">
          <div className={`border ${active ? "border-green3" : "border-gray-300"} rounded-lg overflow-hidden shadow-sm`}>
            <select
              onChange={(e) => onChange(e.target.value)}
              dir="rtl"
              value={value}
              disabled={disabled}
              className="block w-full bg-white text-gray-700 py-2.5 px-3 border-0 focus:ring-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </label>
    </div>
  );
}

// The original "hide out of stock" switch, reusable.
function Switch({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-start gap-2">
      <label className="flex flex-col items-start gap-2 cursor-pointer">
        <span className="text-sm text-green4 font-medium">{label}</span>
        <div className="flex items-center">
          <div className="relative">
            <input type="checkbox" className="sr-only peer" checked={checked} onChange={() => onChange(!checked)} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green3 rounded-full peer peer-checked:after:translate-x-[-100%] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green4"></div>
          </div>
          <span className="mr-3 text-sm font-medium text-gray-700">{checked ? "مفعّل" : "غير مفعّل"}</span>
        </div>
      </label>
    </div>
  );
}

// Price range: two boxes (applied when the shopper stops typing, presses Enter or
// leaves the box) and quick ranges. Prices are as the cards show them, after any sale.
function PriceFilter({ min, max, onChange }) {
  const [from, setFrom] = useState(min ?? "");
  const [to, setTo] = useState(max ?? "");
  useEffect(() => {
    setFrom(min ?? "");
    setTo(max ?? "");
  }, [min, max]);

  const toNumber = (value) => {
    const n = Number(String(value).replace(/[,٬\s]/g, ""));
    return String(value).trim() === "" || !Number.isFinite(n) || n < 0 ? null : Math.floor(n);
  };
  // apply() always reads the latest boxes and filters (it also runs from a timer),
  // and cancels a pending timer so the same value isn't applied twice.
  const timer = useRef(null);
  const latest = useRef(null);
  latest.current = { from, to, min, max, onChange };
  const apply = () => {
    clearTimeout(timer.current);
    const now = latest.current;
    let lo = toNumber(now.from);
    let hi = toNumber(now.to);
    if (lo !== null && hi !== null && lo > hi) [lo, hi] = [hi, lo];
    if (lo !== now.min || hi !== now.max) now.onChange(lo, hi);
  };
  // Applied a moment after typing stops.
  useEffect(() => {
    timer.current = setTimeout(apply, 800);
    return () => clearTimeout(timer.current);
  }, [from, to]); // eslint-disable-line react-hooks/exhaustive-deps

  const box = (value, setValue, placeholder, label) => (
    <div className={`border ${value !== "" ? "border-green3" : "border-gray-300"} rounded-lg overflow-hidden shadow-sm flex-1`}>
      <input
        type="text"
        inputMode="numeric"
        dir="ltr"
        placeholder={placeholder}
        aria-label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={apply}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        className="block w-full bg-white text-gray-700 py-2.5 px-3 border-0 focus:ring-0 focus:outline-none text-right placeholder-gray-400"
      />
    </div>
  );

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <span className="text-sm text-green4 font-medium">السعر (IQD):</span>
      <div className="flex items-center gap-2 w-full">
        {box(from, setFrom, "من", "أقل سعر")}
        <span className="text-gray-400">-</span>
        {box(to, setTo, "إلى", "أعلى سعر")}
      </div>
      <div className="flex flex-wrap gap-2">
        {PRICE_PRESETS.map((preset) => {
          const selected = preset.min === min && preset.max === max;
          return (
            <button
              key={preset.label}
              type="button"
              aria-pressed={selected}
              onClick={() => (selected ? onChange(null, null) : onChange(preset.min, preset.max))}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                selected ? "bg-green4 text-white" : "bg-green1 text-green4 hover:bg-green2"
              }`}
            >
              {/^[\d,\s-]+$/.test(preset.label) ? <span dir="ltr">{preset.label}</span> : preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
