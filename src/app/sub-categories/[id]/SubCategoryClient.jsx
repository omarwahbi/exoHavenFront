"use client";
import Spinner from "@/app/Components/Spinner";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { fetchSubCategoryById, searchProducts } from "@/services/api";
import SortSelect from "@/app/Components/SortSelect";
import { QueryKeys } from "@/utils/queryKeys";
import { entryKey } from "@/utils/ids";
import ProductCard from "@/app/Components/ProductCard";
import Breadcrumbs from "@/app/Components/Breadcrumbs";

// initialSubCategory: the sub-category as the server read it (with its category),
// so its name and breadcrumbs are in the first HTML.
const Items = ({ initialSubCategory }) => {
  const { id } = useParams();
  const observerRef = useRef(null);
  const [sortBy, setSortBy] = useState("featured");

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

  // Fetch subcategory info for breadcrumbs
  const { data: subcategoryData, isLoading: isSubcategoryLoading } = useQuery({
    queryKey: QueryKeys.subcategory(id),
    queryFn: () => fetchSubCategoryById(id),
    enabled: !!id,
    initialData: initialSubCategory ? { data: initialSubCategory } : undefined,
  });

  const subcategoryName = subcategoryData?.data?.name || "";
  const categoryName = subcategoryData?.data?.category?.name || "";

  const categoryId = entryKey(subcategoryData?.data?.category);

  // Sorting goes through the search API, which sorts by the real price (variants
  // included) and keeps items in stock first.
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: QueryKeys.subcategoryItems(id, sortBy),
    queryFn: ({ pageParam, signal }) => searchProducts({ subCategory: id, sort: sortBy, page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
  });

  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const items = data?.pages?.flatMap((page) => page.items) || [];
  const isPageLoading = isLoading || isSubcategoryLoading;

  // Skeleton loading component
  const ItemSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 md:h-56 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  );

  // Render skeletons during loading
  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <ItemSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <div className="container-page py-6 sm:py-8" dir="rtl">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: categoryName, href: categoryId ? `/categories/${categoryId}` : null },
          { label: subcategoryName },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          {/* Which category this sub-category belongs to. */}
          {categoryName && (
            <Link
              href={categoryId ? `/categories/${categoryId}` : "/products"}
              className="mb-1 inline-block text-sm font-semibold text-green5 hover:text-green4"
            >
              {categoryName}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {subcategoryName || "المنتجات المتاحة"}
          </h1>
        </div>
        
        <SortSelect value={sortBy} onChange={setSortBy} />
      </div>

      {items.length === 0 && !isPageLoading ? (
        <div className="text-center text-gray-500 py-20 text-lg">لا توجد منتجات في هذا القسم حالياً.</div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible" 
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          {isPageLoading ? (
            renderSkeletons()
          ) : (
            items.map((item, index) => (
              <motion.div
                key={entryKey(item)}
                variants={itemVariants}
                ref={index === items.length - 1 ? lastItemRef : null}
              >
                <ProductCard item={item} priority={index < 4} />
              </motion.div>
            ))
          )}
        </motion.div>
      )}
      
      {isFetchingNextPage && (
        <div className="justify-center items-center flex mt-6">
          <Spinner />
        </div>
      )}
      
      {!isPageLoading && !hasNextPage && items.length > 0 && (
        <div className="text-center text-gray-500 mt-8 pb-4">
          لقد وصلت إلى نهاية القائمة
        </div>
      )}
    </div>
  );
};

export default Items;

