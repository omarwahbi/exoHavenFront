"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Spinner from "./Spinner";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";

const Categories = () => {
  // Fetch categories using React Query
  const { 
    data: categories = [],
    isLoading,
    error 
  } = useQuery({
    queryKey: [QueryKeys.categories],
    queryFn: fetchCategories
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner size="lg" text="جاري تحميل الفئات" />
      </div>
    );
  }

  if (error) {
    console.error("Error loading categories:", error);
    return null;
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="py-12 sm:py-16 px-4 bg-gradient-to-br from-green1/40 via-green1/20 to-transparent rounded-3xl sm:rounded-4xl my-8 sm:my-12 max-w-screen-xl mx-auto border border-green2/30">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col items-center md:items-start mb-3 md:mb-0">
          <div className="flex items-center">
            <div className="h-10 w-1.5 bg-gradient-to-b from-green3 to-green4 rounded-full mr-3 hidden md:block"></div>
            <h2 className="text-2xl mx-1 sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green4 to-green3 bg-clip-text text-transparent text-center md:text-right">
              تصفح حسب الفئة
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center md:text-right md:mr-6">
            اختر من مجموعة متنوعة من الفئات المميزة
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6 max-w-screen-xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories && categories.map((category, index) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            className="w-[calc(50%-8px)] sm:w-[calc(50%-10px)] md:w-[calc(25%-18px)] lg:w-[calc(20%-19.2px)]"
          >
            <Link href={`/subCategory/${category.id}`} className="block h-full">
              <motion.div
                className="flex flex-col items-center p-5 sm:p-6 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-400 relative overflow-hidden group h-full border border-gray-100"
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Top gradient bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green3 via-green4 to-green3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 rounded-t-2xl"></div>

                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-green1/0 via-green1/30 to-green2/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"></div>

                <div className="relative mb-4 sm:mb-5 overflow-hidden rounded-full border-4 border-green1 p-1 sm:p-1.5 group-hover:border-green3 transition-all duration-400 shadow-sm group-hover:shadow-green z-10 bg-white">
                  <div className="relative rounded-full overflow-hidden">
                    <Image
                      src={category.attributes.category_thumbnail.data.attributes.url}
                      alt={category.attributes.name}
                      width={120}
                      height={120}
                      className="rounded-full h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      priority={index < 4}
                    />
                    {/* Image overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-green4/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full"></div>
                  </div>
                </div>

                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 group-hover:text-green4 text-center transition-colors duration-400 line-clamp-2 z-10 relative">
                  {category.attributes.name}
                </h2>

                <span className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 group-hover:text-green4 transition-colors duration-400 font-medium z-10 relative">
                  <span>استكشف المزيد</span>
                  <svg className="w-3 h-3 transform group-hover:translate-x-[-2px] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l-5 5 5 5" />
                  </svg>
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Categories;
