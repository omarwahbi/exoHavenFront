"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductGridSkeleton } from "./SkeletonLoader";
import { motion } from "framer-motion";
import { FaStar, FaArrowLeft, FaEye, FaTag } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProducts } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { calculateSalePrice, isSaleActive } from "@/utils/saleUtils";

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
      <div className="py-12 px-4 sm:py-20">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="h-10 w-1.5 bg-gradient-to-b from-green3 to-green4 rounded-full mr-3 hidden md:block"></div>
                <h2 className="text-2xl mx-1 sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green4 to-green3 bg-clip-text text-transparent text-center md:text-right">
                  منتجات مميزة
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center md:text-right md:mr-6">اكتشف أفضل المنتجات المختارة بعناية</p>
            </div>
          </motion.div>

          <ProductGridSkeleton count={4} />
        </div>
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
    <div className="py-12 px-4 sm:py-20">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="h-10 w-1.5 bg-gradient-to-b from-green3 to-green4 rounded-full mr-3 hidden md:block"></div>
              <h2 className="text-2xl mx-1 sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green4 to-green3 bg-clip-text text-transparent text-center md:text-right">
                منتجات مميزة
              </h2>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center md:text-right md:mr-6">اكتشف أفضل المنتجات المختارة بعناية</p>
          </div>
          <Link
            href="/category"
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green4 to-green3 text-white font-bold rounded-2xl shadow-green hover:shadow-green-lg transition-all duration-400 hover:-translate-y-0.5"
          >
            <span>عرض المزيد</span>
            <FaArrowLeft className="text-sm group-hover:translate-x-[-4px] transition-transform duration-300" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-7">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <Link href={`/item/${product.id}`}>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden transition-all duration-400 group-hover:shadow-card-hover group-hover:-translate-y-1 h-full flex flex-col border border-gray-100">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                      <Image
                        src={product.attributes.item_thumbnail.data.attributes.url}
                        alt={product.attributes.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 p-4"
                        priority={index < 2}
                      />
                    </div>

                    {/* Sale tag - Display only if sale is active */}
                    {isSaleActive() && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-[10px] sm:text-xs font-semibold text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg shadow-sm flex items-center gap-1">
                        <FaTag className="text-[9px] sm:text-xs" />
                        <span>-10%</span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 glass-green text-green5 text-[10px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-sm flex items-center gap-1">
                      <FaStar className="text-[9px] sm:text-xs" />
                      <span>مميز</span>
                    </div>

                    {/* Quick view button - visible on touch/hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <div className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-2xl transform scale-90 group-hover:scale-100 transition-transform duration-400 shadow-lg">
                        <FaEye className="text-green4 text-base sm:text-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-green4 transition-colors duration-300">
                        {product.attributes.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                        {product.attributes.description}
                      </p>
                    </div>

                    <div className="mt-auto space-y-3">
                      {product.attributes.state && (
                        <div>
                          {isSaleActive() ? (
                            <>
                              <p className="text-gray-400 line-through text-xs sm:text-sm font-medium">
                                {product.attributes.state.toLocaleString()} IQD
                              </p>
                              <p className="text-amber-600 font-bold text-base sm:text-lg md:text-xl">
                                {calculateSalePrice(product.attributes.state).toLocaleString()} IQD
                              </p>
                            </>
                          ) : (
                            <p className="text-green4 font-bold text-base sm:text-lg md:text-xl">
                              {product.attributes.state.toLocaleString()} IQD
                            </p>
                          )}
                        </div>
                      )}
                      <div className="bg-gradient-to-r from-green1 to-green2/50 rounded-xl p-2.5 sm:p-3 text-center text-xs sm:text-sm font-bold text-green5 group-hover:from-green4 group-hover:to-green3 group-hover:text-white transition-all duration-400 shadow-sm">
                        عرض المنتج
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts; 