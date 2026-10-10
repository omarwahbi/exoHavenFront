"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Spinner from "../Components/Spinner";
import { fetchCategories, fetchProductsPage } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import ProductFilters from "./components/ProductFilters";
import ProductGridCard from "@/app/Components/ProductGridCard";
import ProductListCard from "./components/ProductListCard";
import Breadcrumbs from "@/app/Components/Breadcrumbs";
import { isOutOfStock } from "@/utils/product";

const Category = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewStyle, setViewStyle] = useState("grid"); // grid or list
  const [scrolled, setScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: [QueryKeys.categoriesList],
    queryFn: fetchCategories
  });

  // Memoize the query key to prevent unnecessary refetches
  const queryKey = useMemo(() => 
    QueryKeys.categoryItems(selectedCategoryId, searchQuery),
    [selectedCategoryId, searchQuery]
  );

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = 1, signal }) =>
      fetchProductsPage({ 
        pageParam, 
        signal,
        categoryId: selectedCategoryId,
        searchQuery
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
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

  // Apply local filters to the fetched data
  const filteredItems = useMemo(() => {
    if (!data) return [];
    
    let items = data.pages.flatMap((page) => page.items);
    
    // Apply out of stock filter if enabled
    if (hideOutOfStock) {
      items = items.filter((item) => !isOutOfStock(item));
    }
    
    return items;
  }, [data, hideOutOfStock]);

  const totalFilteredItems = useMemo(() => {
    return filteredItems.length;
  }, [filteredItems]);


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
    setSearchQuery(searchInputValue);
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    setSearchQuery("");
  };

  const resetFilters = () => {
    setSelectedCategoryId(null);
    setSearchInputValue("");
    setSearchQuery("");
    setHideOutOfStock(false);
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

  // Update the active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategoryId) count++;
    if (searchQuery) count++;
    if (hideOutOfStock) count++;
    return count;
  }, [selectedCategoryId, searchQuery, hideOutOfStock]);

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
        <Breadcrumbs className="mb-4" items={[{ label: "المنتجات" }]} />
        <ProductFilters
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
          searchQuery={searchQuery}
          hideOutOfStock={hideOutOfStock}
          setHideOutOfStock={setHideOutOfStock}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          viewStyle={viewStyle}
          setViewStyle={setViewStyle}
          scrolled={scrolled}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          activeFiltersCount={activeFiltersCount}
          onSearchSubmit={handleSearchSubmit}
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
              <motion.div key={item.id} variants={itemVariants}>
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
  return <Category />;
}
