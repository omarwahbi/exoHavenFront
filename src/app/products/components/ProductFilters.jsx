"use client";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import { entryKey } from "@/utils/ids";

// The sticky search / filter / view bar of /products and the active-filters row
// under it. All state lives in the page; this only renders it.
export default function ProductFilters({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  searchInputValue,
  setSearchInputValue,
  searchQuery,
  hideOutOfStock,
  setHideOutOfStock,
  isFilterOpen,
  setIsFilterOpen,
  viewStyle,
  setViewStyle,
  scrolled,
  isSearching,
  setIsSearching,
  activeFiltersCount,
  onSearchSubmit,
  onClearSearch,
  onResetFilters,
}) {
  return (
    <>
      {/* Enhanced Sticky Filters Bar */}
      <motion.div
        className={`sticky top-0 z-30 py-4 bg-white shadow-md rounded-xl mb-6 transition-all duration-300 ${scrolled ? "shadow-lg rounded-none" : ""}`}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div className="flex items-center gap-3 w-full justify-start">
                <label className="flex flex-col items-start gap-2 text-green4 font-medium w-full">
                  <span className="text-sm">اختر الفئة:</span>
                  <div className="relative">
                    {/* Border container that always maintains its border */}
                    <div
                      className={`border ${selectedCategoryId ? "border-green3" : "border-gray-300"} rounded-lg overflow-hidden shadow-sm`}
                    >
                      <select
                        onChange={(e) => setSelectedCategoryId(e.target.value === "all" ? null : e.target.value)}
                        dir="rtl"
                        value={selectedCategoryId || "all"}
                        className="block w-full bg-white text-gray-700 py-2.5 px-3 border-0 focus:ring-0 focus:outline-none"
                      >
                        <option value="all">كل المنتجات</option>
                        {categories &&
                          categories.map((cat) => (
                            <option key={cat.id} value={entryKey(cat)}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </label>
              </div>

              {/* Out of Stock Filter */}
              <div className="flex items-center justify-start gap-2">
                <label className="flex flex-col items-start gap-2 cursor-pointer">
                  <span className="text-sm text-green4 font-medium">إخفاء المنتجات غير المتوفرة:</span>
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={hideOutOfStock}
                        onChange={() => setHideOutOfStock(!hideOutOfStock)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green3 rounded-full peer peer-checked:after:translate-x-[-100%] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green4"></div>
                    </div>
                    <span className="mr-3 text-sm font-medium text-gray-700">
                      {hideOutOfStock ? "مفعّل" : "غير مفعّل"}
                    </span>
                  </div>
                </label>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green1 text-green4 text-xs">
                  بحث: {searchQuery}
                  <button onClick={onClearSearch} className="mr-1 hover:text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedCategoryId && categories.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green1 text-green4 text-xs">
                  فئة: {categories.find((c) => entryKey(c) === selectedCategoryId)?.name || selectedCategoryId}
                  <button onClick={() => setSelectedCategoryId(null)} className="mr-1 hover:text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {hideOutOfStock && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green1 text-green4 text-xs">
                  منتجات متوفرة فقط
                  <button onClick={() => setHideOutOfStock(false)} className="mr-1 hover:text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
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
