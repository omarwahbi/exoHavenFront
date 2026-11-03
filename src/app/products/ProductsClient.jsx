"use client";
import React, { Suspense, useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Spinner from "../Components/Spinner";
import { fetchCategories, fetchProductsPage, fetchSubCategories, searchProducts, withDescriptions } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import ProductFilters from "./components/ProductFilters";
import ProductGridCard from "@/app/Components/ProductGridCard";
import ProductListCard from "./components/ProductListCard";
import { useSale } from "@/app/context/SaleContext";
import {
  activeFilterCount,
  defaultSort,
  filtersToQuery,
  isPlainListing,
  priceBoundsBeforeSale,
  readFilters,
} from "@/utils/productFilters";
import { entryKey } from "@/utils/ids";

const Category = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sale = useSale();

  // Every filter lives in the address (see utils/productFilters.js): the top bar's
  // search, shared links and back/forward all land here with them.
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const setFilters = (changes) => {
    // Start from the address as it is now, not as of this render: two quick changes
    // (or a price applied a moment after typing) must not undo each other.
    const current = readFilters(new URLSearchParams(window.location.search));
    const next = { ...current, ...changes };
    // Another category: its sub-categories are different.
    if ("category" in changes && changes.category !== current.category && !("sub" in changes)) next.sub = null;
    // A new search (or none) goes back to that case's default order, unless the
    // shopper had picked one.
    if ("q" in changes && current.sort === defaultSort(Boolean(current.q))) next.sort = defaultSort(Boolean(next.q));
    const query = filtersToQuery(next);
    // A history step per change, so the back button undoes the last filter.
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // The search box's text, until it is submitted.
  const [searchInputValue, setSearchInputValue] = useState(filters.q);
  useEffect(() => {
    setSearchInputValue(filters.q);
  }, [filters.q]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewStyle, setViewStyle] = useState("grid"); // grid or list
  const [scrolled, setScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: [QueryKeys.categoriesList],
    queryFn: fetchCategories
  });

  const { data: subCategories = [] } = useQuery({
    queryKey: ["subcategories", filters.category],
    queryFn: () => fetchSubCategories(filters.category),
    enabled: !!filters.category
  });

  // The plain listing loads exactly as it always has; any other filter goes
  // through the search API, which filters and sorts on the server.
  const plain = isPlainListing(filters);
  const { minPrice, maxPrice } = priceBoundsBeforeSale(filters.min, filters.max, sale);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["products-page", filters, minPrice, maxPrice],
    queryFn: ({ pageParam = 1, signal }) =>
      plain
        ? fetchProductsPage({ pageParam, signal, categoryId: filters.category })
        : searchProducts({
            q: filters.q,
            category: filters.category,
            subCategory: filters.sub,
            inStock: filters.inStock,
            newOnly: filters.newOnly,
            minPrice,
            maxPrice,
            sort: filters.sort,
            page: pageParam,
            signal,
          }).then(withDescriptions),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    // Changing a filter keeps the current products on screen until the new ones
    // arrive, instead of replacing the page with a spinner.
    placeholderData: keepPreviousData,
  });

  // Update isSearching state based on isFetching state, with better cleanup
  useEffect(() => {
    // Reset isSearching immediately when component mounts
    setIsSearching(false);
    
    // Use a timeout to debounce the state update for search operations
    let timer;
    if (isFetching && !isFetchingNextPage) {
      // Set to searching when explicitly fetching (not infinite scrolling)
      timer = setTimeout(() => {
        setIsSearching(true);
      }, 100);
    } else {
      // Clear the searching state with a small delay
      timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
    }
    
    // Clean up on unmount or when dependencies change
    return () => {
      clearTimeout(timer);
      // Ensure we reset the searching state when unmounting
      setIsSearching(false);
    };
  }, [isFetching, isFetchingNextPage]);

  const filteredItems = useMemo(() => (data ? data.pages.flatMap((page) => page.items) : []), [data]);
  // How many products match (all pages, not just those loaded so far).
  const totalFilteredItems = data?.pages[0]?.total ?? filteredItems.length;


  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.scrollHeight - 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // Add scroll detection for the sticky header
  useEffect(() => {
    const handleScrollPosition = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScrollPosition);
    return () => window.removeEventListener("scroll", handleScrollPosition);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Reset search loading state before starting a new search
    setIsSearching(false);
    setFilters({ q: searchInputValue.trim() });
  };

  // "See all results" in the search suggestions.
  const handleSearchAll = (query) => {
    setSearchInputValue(query);
    setFilters({ q: query.trim() });
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    setFilters({ q: "" });
  };

  const resetFilters = () => {
    setSearchInputValue("");
    router.push(pathname, { scroll: false });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const activeFiltersCount = activeFilterCount(filters);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-green4 font-medium">جاري تحميل المنتجات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header Banner */}
      <div className="bg-gradient-to-r from-green3 to-green4 text-white py-12 px-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">تسوق منتجاتنا</h1>
          <p className="text-lg text-center text-white/80 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من المنتجات عالية الجودة بأسعار تنافسية
          </p>
        </div>
      </div>
      


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductFilters
          categories={categories}
          subCategories={subCategories}
          filters={filters}
          setFilters={setFilters}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          viewStyle={viewStyle}
          setViewStyle={setViewStyle}
          scrolled={scrolled}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          activeFiltersCount={activeFiltersCount}
          onSearchSubmit={handleSearchSubmit}
          onSearchAll={handleSearchAll}
          onClearSearch={handleClearSearch}
          onResetFilters={resetFilters}
        />

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6" dir="rtl">
          <p className="text-gray-600">
            عرض <span className="font-medium text-green4">{totalFilteredItems}</span> منتج
          </p>
          
          {totalFilteredItems > 0 && data && (
            <div className="text-sm text-gray-500">
              صفحة <span className="font-medium">{data?.pageParams?.length || 1}</span>
            </div>
          )}
        </div>

        {/* Products Grid or List */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">لم يتم العثور على منتجات</h3>
            <p className="text-gray-500 mb-4">جرب تعديل معايير البحث أو تصفح كافة الفئات</p>
            <button 
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green4 hover:bg-green3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green3"
            >
              عرض كافة المنتجات
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible" 
            className={viewStyle === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" : "flex flex-col space-y-4"}
          >
            {filteredItems.map((item, index) => (
              <motion.div key={entryKey(item)} variants={itemVariants}>
                {viewStyle === "grid" ? (
                  <ProductGridCard item={item} index={index} />
                ) : (
                  <ProductListCard item={item} />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Loading indicator for infinite scroll */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {/* End of results message */}
        {!hasNextPage && filteredItems.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            لقد وصلت إلى نهاية النتائج
          </div>
        )}
      </div>
    </div>
  );
};

export default function CategoryPage() {
  return (
    <Suspense fallback={null}>
      <Category />
    </Suspense>
  );
}
