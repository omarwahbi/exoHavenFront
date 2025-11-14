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
    <section className="py-12 px-4 sm:py-16 bg-texture">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-10 w-1.5 bg-brand-teal rounded-full mr-3 hidden md:block"></div>
            <h2 className="text-2xl mx-1 sm:text-3xl md:text-4xl font-bold text-neutral-900 text-center md:text-right">
              منتجات مميزة
            </h2>
          </div>
          <Link
            href="/category"
            className="text-base font-medium text-brand-teal hover:text-brand-teal-700 transition-colors flex items-center group"
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