"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Spinner from "../Components/Spinner";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaShoppingCart, FaEye, FaPlus, FaMinus, FaCheck } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { fetchCategories } from "@/services/api";
import api from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { cancelAllRequests } from "@/services/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent unnecessary refetches when navigating back
      staleTime: 1000 * 60 * 10, // 10 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

const fetchCategoryItems = async ({ pageParam = 1, categoryId, searchQuery }) => {
  const params = {
    pagination: {
      page: pageParam,
      pageSize: 12
    },
    // Only select specific fields we need, excluding buffer data
    fields: ['name', 'description', 'state', 'new_arrival', 'out_of_stock', 'Item_ID'],
    // Use specific fields to populate instead of '*' to reduce response size
    populate: {
      item_thumbnail: {
        fields: ['name', 'url', 'width', 'height', 'formats']
      },
      category: {
        fields: ['name']
      },
      sub_category: {
        fields: ['name']
      }
    }
  };

  if (categoryId) {
    params.filters = {
      ...params.filters,
      category: { id: { $eq: categoryId } }
    };
  }
  
  if (searchQuery) {
    params.filters = {
      ...params.filters,
      name: { $containsi: searchQuery }
    };
  }

  try {
    const data = await api.get('/api/items', { params });
    return {
      items: data.data.data,
      nextPage: pageParam + 1,
      hasMore: pageParam < data.data.meta.pagination.pageCount,
      total: data.data.meta.pagination.total,
    };
  } catch (error) {
    // Don't log cancelled requests as errors since they are expected during navigation
    if (error.cancelled) {
      return {
        items: [],
        nextPage: pageParam,
        hasMore: false,
        total: 0,
      };
    }
    console.error("Error fetching items:", error);
    throw error;
  }
};

const Category = ({ params }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewStyle, setViewStyle] = useState("grid"); // grid or list
  const [scrolled, setScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const { cart, dispatch } = useCart();

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
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
    refetch
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = 1 }) =>
      fetchCategoryItems({ 
        pageParam, 
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
      items = items.filter(item => !item.attributes.out_of_stock);
    }
    
    return items;
  }, [data, hideOutOfStock]);

  const totalFilteredItems = useMemo(() => {
    return filteredItems.length;
  }, [filteredItems]);

  const allItems = data ? data.pages.flatMap((page) => page.items) : [];
  const totalItems = data?.pages[0]?.total || 0;

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

  const handleSelectChange = (e) => {
    const selectedCategoryId = e.target.value === "all" ? null : e.target.value;
    setSelectedCategoryId(selectedCategoryId);
  };

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

  // Helper function to get quantity of an item in cart
  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };
  
  // Cart action functions
  const addToCart = (item) => {
    if (item.attributes.out_of_stock) return;
    dispatch({ type: "ADD_ITEM", payload: item });
  };
  
  const removeFromCart = (itemId) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id: itemId } });
  };
  
  const decreaseQuantity = (itemId) => {
    const itemInCart = cart.find(item => item.id === itemId);
    if (itemInCart && itemInCart.quantity === 1) {
      // If quantity is 1, remove the item completely
      dispatch({ type: "REMOVE_ITEM", payload: { id: itemId } });
    } else {
      // Otherwise just decrease the quantity
      dispatch({ type: "DECREASE_QUANTITY", payload: { id: itemId } });
    }
  };

  // Cancel all pending requests when unmounting the component
  useEffect(() => {
    return () => {
      // Cancel all pending API requests when leaving the page
      cancelAllRequests();
    };
  }, []);

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
        {/* Enhanced Sticky Filters Bar */}
        <motion.div 
          className={`sticky top-0 z-30 py-4 bg-white shadow-md rounded-xl mb-6 transition-all duration-300 ${scrolled ? 'shadow-lg rounded-none' : ''}`}
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
                className={`flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all ${isFilterOpen ? 'bg-green4 text-white' : 'bg-gray-100 text-green4 hover:bg-gray-200'}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <FaFilter className={isFilterOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                <span className="font-medium">فلترة</span>
                <span className="flex items-center justify-center w-6 h-6 ml-1 bg-white bg-opacity-20 rounded-full text-xs">
                  {activeFiltersCount}
                </span>
              </motion.button>

              {/* Enhanced View Toggle */}
              <div className="flex items-center rounded-lg p-1 bg-gray-100 shadow-inner">
                <motion.button 
                  onClick={() => setViewStyle("grid")}
                  className={`p-2.5 rounded-md transition-all ${viewStyle === 'grid' ? 'bg-white text-green4 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                </motion.button>
                <motion.button 
                  onClick={() => setViewStyle("list")}
                  className={`p-2.5 rounded-md transition-all ${viewStyle === 'list' ? 'bg-white text-green4 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <form onSubmit={handleSearchSubmit} className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-green3 focus-within:border-green3 transition-colors">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={isSearching}
                  className={`flex items-center justify-center px-5 bg-green4 hover:bg-green3 text-white transition-colors focus:outline-none ${isSearching ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                    <FaSearch className="rounded-full"/>
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
              y: isFilterOpen ? 0 : -10 
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
                      <div className={`border ${selectedCategoryId ? 'border-green3' : 'border-gray-300'} rounded-lg overflow-hidden shadow-sm`}>
                        <select
                          onChange={handleSelectChange}
                          dir="rtl"
                          value={selectedCategoryId || "all"}
                          className="block w-full bg-white text-gray-700 py-2.5 px-3 border-0 focus:ring-0 focus:outline-none"
                        >
                          <option value="all">كل المنتجات</option>
                          {categories &&
                            categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.attributes.name}
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
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setSearchQuery("");
                      setSearchInputValue("");
                      setHideOutOfStock(false);
                    }}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 px-4 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <span>إعادة ضبط جميع الفلاتر</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <button 
                      onClick={handleClearSearch} 
                      className="mr-1 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedCategoryId && categories.length > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green1 text-green4 text-xs">
                    فئة: {categories.find(c => c.id === selectedCategoryId)?.attributes.name || selectedCategoryId}
                    <button 
                      onClick={() => setSelectedCategoryId(null)} 
                      className="mr-1 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {hideOutOfStock && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green1 text-green4 text-xs">
                    منتجات متوفرة فقط
                    <button 
                      onClick={() => setHideOutOfStock(false)} 
                      className="mr-1 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedCategoryId(null);
                setSearchInputValue("");
                setSearchQuery("");
                setHideOutOfStock(false);
              }}
              className="text-xs text-gray-500 hover:text-red-500 mt-2 sm:mt-0"
            >
              مسح الكل
            </button>
          </motion.div>
        )}

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
              onClick={() => {
                setSelectedCategoryId(null);
                setSearchInputValue("");
                setSearchQuery("");
                setHideOutOfStock(false);
              }}
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
            {filteredItems.map((item, index) => {
              const quantityInCart = getItemQuantityInCart(item.id);
              
              return (
                <motion.div key={item.id} variants={itemVariants}>
                  {viewStyle === "grid" ? (
                    <div className="h-full">
                      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                        <Link href={`/item/${item.id}`} className="block relative pt-[100%]">
                          <Image
                            src={item.attributes.item_thumbnail.data.attributes.url}
                            alt={item.attributes.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            priority={index < 4}
                          />
                          
                          {/* Quick action buttons */}
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                            <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-green4 hover:bg-green4 hover:text-white transition-colors">
                              <FaEye size={14} />
                            </button>
                          </div>
                          
                          {/* Out of stock badge */}
                          {item.attributes.out_of_stock && (
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 m-2 rounded">
                              نفذت الكمية
                            </div>
                          )}
                        </Link>
                        
                        <div className="p-3 flex-grow flex flex-col">
                          <Link href={`/item/${item.id}`}>
                            <h3 className="font-medium text-gray-800 mb-1 line-clamp-1 hover:text-green4 transition-colors">
                              {item.attributes.name}
                            </h3>
                          </Link>
                          
                          <div className="mt-auto pt-2 flex justify-between items-center">
                            <span className={`font-bold ${item.attributes.out_of_stock ? 'text-gray-400' : 'text-green4'}`}>
                              {item.attributes.out_of_stock
                                ? "غير متوفر"
                                : `${Number(item.attributes.state).toLocaleString()} IQD`}
                            </span>
                            
                            {/* Cart interaction button */}
                            {item.attributes.out_of_stock ? (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 cursor-not-allowed">
                                <FaShoppingCart size={14} />
                              </div>
                            ) : quantityInCart > 0 ? (
                              <div className="flex items-center">
                                <motion.button 
                                  onClick={() => decreaseQuantity(item.id)}
                                  className="w-7 h-7 rounded-full bg-green1 flex items-center justify-center text-green4 hover:bg-green2 transition-colors"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <FaMinus size={10} />
                                </motion.button>
                                
                                <span className="mx-2 font-medium text-green4">{quantityInCart}</span>
                                
                                <motion.button 
                                  onClick={() => addToCart(item)}
                                  className="w-7 h-7 rounded-full bg-green4 flex items-center justify-center text-white hover:bg-green3 transition-colors"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <FaPlus size={10} />
                                </motion.button>
                              </div>
                            ) : (
                              <motion.button 
                                onClick={() => addToCart(item)}
                                className="w-8 h-8 rounded-full bg-green1 flex items-center justify-center text-green4 hover:bg-green4 hover:text-white transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaShoppingCart size={14} />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List view
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <div className="flex flex-row h-full">
                        <Link href={`/item/${item.id}`} className="relative w-1/3 sm:w-1/4">
                          <Image
                            src={item.attributes.item_thumbnail.data.attributes.url}
                            alt={item.attributes.name}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full aspect-square"
                            priority
                          />
                          {item.attributes.out_of_stock && (
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 m-1 rounded">
                              نفذت الكمية
                            </div>
                          )}
                        </Link>
                        
                        <div className="flex-grow p-4 flex flex-col">
                          <Link href={`/item/${item.id}`}>
                            <h3 className="font-medium text-gray-800 mb-1 hover:text-green4 transition-colors">
                              {item.attributes.name}
                            </h3>
                          </Link>
                          
                          <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                            {item.attributes.description || "وصف المنتج غير متوفر"}
                          </p>
                          
                          <div className="mt-auto flex justify-between items-center">
                            <span className={`font-bold ${item.attributes.out_of_stock ? 'text-gray-400' : 'text-green4'}`}>
                              {item.attributes.out_of_stock
                                ? "غير متوفر"
                                : `${Number(item.attributes.state).toLocaleString()} IQD`}
                            </span>
                            
                            {/* Cart interaction for list view */}
                            {item.attributes.out_of_stock ? (
                              <button 
                                disabled
                                className="px-3 py-1.5 bg-gray-200 text-gray-400 rounded-lg text-sm cursor-not-allowed"
                              >
                                غير متوفر
                              </button>
                            ) : quantityInCart > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center border border-green2 rounded-full">
                                  <motion.button 
                                    onClick={() => decreaseQuantity(item.id)}
                                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-green4 hover:bg-green1 transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FaMinus size={10} />
                                  </motion.button>
                                  
                                  <span className="mx-2 font-medium text-green4">{quantityInCart}</span>
                                  
                                  <motion.button 
                                    onClick={() => addToCart(item)}
                                    className="w-7 h-7 rounded-full bg-green4 flex items-center justify-center text-white hover:bg-green3 transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FaPlus size={10} />
                                  </motion.button>
                                </div>
                                
                                <span className="text-sm text-green4">في السلة</span>
                              </div>
                            ) : (
                              <motion.button 
                                onClick={() => addToCart(item)}
                                className="px-3 py-1.5 bg-green1 text-green4 rounded-lg text-sm hover:bg-green4 hover:text-white transition-colors flex items-center gap-1"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <FaShoppingCart size={12} />
                                <span>إضافة للسلة</span>
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
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

export default function CategoryPage({ params }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Category params={params} />
    </QueryClientProvider>
  );
}
