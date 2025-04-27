"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Spinner from "./Spinner";
import { motion } from "framer-motion";
import { FaStar, FaArrowLeft, FaEye } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProducts } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";

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
    <div className="py-10 px-4 sm:py-16">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-3 md:mb-0">
            <div className="h-8 w-1.5 bg-green4 rounded-full mr-3 hidden md:block"></div>
            <h2 className="text-xl mx-1 sm:text-2xl md:text-3xl font-bold text-green4 text-center md:text-right">
              منتجات مميزة
            </h2>
          </div>
          <Link
            href="/category"
            className="text-sm font-medium text-green3 hover:text-green4 transition-colors flex items-center group"
          >
            عرض المزيد
            <FaArrowLeft className="mr-2 text-xs group-hover:translate-x-[-4px] transition-transform duration-300" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/item/${product.id}`}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl h-full flex flex-col">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={product.attributes.item_thumbnail.data.attributes.url}
                        alt={product.attributes.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={index < 2}
                      />
                    </div>
                    <div className="absolute top-2 right-2 bg-green3 text-[10px] sm:text-xs font-medium text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm flex items-center">
                      <FaStar className="mr-0.5 text-[8px] sm:text-xs" />
                      <span className="mt-px">مميز</span>
                    </div>

                    {/* Quick view button - visible on touch/hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/50 backdrop-blur-sm p-2 sm:p-3 rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <FaEye className="text-white text-sm sm:text-base" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 mb-1 sm:mb-2 line-clamp-1 group-hover:text-green4 transition-colors">
                        {product.attributes.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                        {product.attributes.description}
                      </p>
                    </div>

                    <div className="mt-auto">
                      {product.attributes.state && (
                        <p className="text-green4 font-bold text-sm sm:text-base md:text-lg">
                          {product.attributes.state.toLocaleString()} IQD
                        </p>
                      )}
                      <div className="mt-2 sm:mt-3 bg-green1 rounded-lg p-1.5 sm:p-2 text-center text-xs sm:text-sm font-medium text-green4 group-hover:bg-green4 group-hover:text-white transition-all duration-300">
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