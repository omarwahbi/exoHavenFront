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
    <div className="py-8 sm:py-12 px-4 bg-green1/30 rounded-2xl sm:rounded-3xl my-6 sm:my-8 max-w-screen-xl mx-auto">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-2 md:mb-0">
          <div className="h-8 w-1.5 bg-green4 rounded-full mr-3 hidden md:block"></div>
          <h2 className="text-xl mx-1 sm:text-2xl md:text-3xl font-bold text-green4 text-center md:text-right">
            تصفح حسب الفئة
          </h2>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 md:mt-0">
          اختر من مجموعة متنوعة من الفئات المميزة
        </p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 max-w-screen-xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories && categories.map((category, index) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            className="w-[calc(50%-6px)] sm:w-[calc(50%-8px)] md:w-[calc(25%-18px)] lg:w-[calc(20%-19.2px)]"
          >
            <Link href={`/subCategory/${category.id}`} className="block h-full">
              <motion.div
                className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group h-full"
                whileHover={{ y: -6, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green2 to-green4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="relative mb-3 sm:mb-4 overflow-hidden rounded-full border-3 sm:border-4 border-green1 p-0.5 sm:p-1 group-hover:border-green3 transition-colors duration-300">
                  <Image
                    src={category.attributes.category_thumbnail.data.attributes.url}
                    alt={category.attributes.name}
                    width={120}
                    height={120}
                    className="rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={index < 4}
                  />
                </div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-green4 group-hover:text-green3 text-center transition-colors duration-300 line-clamp-1">
                  {category.attributes.name}
                </h2>
                <span className="mt-1 sm:mt-2 inline-block text-[10px] sm:text-xs text-gray-500 group-hover:text-green4 transition-colors duration-300">استكشف المزيد</span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Categories;
