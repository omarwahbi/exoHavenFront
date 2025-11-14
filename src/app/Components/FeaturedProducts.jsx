"use client";
import React from "react";
import Link from "next/link";
import Spinner from "./Spinner";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProducts } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { ProductCard, ProductCardGrid } from "@/components/ui/product-card";

const FeaturedProducts = () => {
  // Fetch featured products using React Query
  const { 
    data: products = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: [QueryKeys.featuredProducts],
    queryFn: () => fetchFeaturedProducts(4),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" text="جاري تحميل المنتجات" />
      </div>
    );
  }

  if (error) {
    console.error("Error fetching products:", error);
    return null;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 sm:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-12 w-2 bg-gradient-to-b from-brand-orange-600 to-brand-green-700 rounded-full mr-3 hidden md:block"></div>
            <h2 className="text-3xl mx-1 sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-center md:text-right">
              منتجات مميزة
            </h2>
          </div>
          <Link
            href="/category"
            className="text-base font-semibold text-brand-orange-600 dark:text-brand-orange-500 hover:text-brand-orange-700 dark:hover:text-brand-orange-400 transition-colors flex items-center group"
          >
            عرض المزيد
            <FaArrowLeft className="mr-2 text-sm group-hover:translate-x-[-4px] transition-transform duration-300" />
          </Link>
        </motion.div>

        <ProductCardGrid>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              showFeaturedBadge={true}
            />
          ))}
        </ProductCardGrid>
      </div>
    </section>
  );
};

export default FeaturedProducts; 