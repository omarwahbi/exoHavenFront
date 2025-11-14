"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaArrowLeft, FaTag } from "react-icons/fa";
import Spinner from "../Components/Spinner";
import { fetchNewArrivals } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { isSaleActive, calculateSalePrice } from "@/utils/saleUtils";

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  
  const { 
    data: items = [],
    isLoading,
    error 
  } = useQuery({
    queryKey: [QueryKeys.items, filter],
    queryFn: () => {
      if (filter === 'new_arrival') {
        return fetchNewArrivals(20); // Fetch more items for dedicated page
      } else {
        return fetchNewArrivals(20); // Default to new arrivals for now
      }
    }
  });
  
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

  // Get page title based on filter
  const getPageTitle = () => {
    if (filter === 'new_arrival') {
      return 'وصل حديثاً';
    }
    return 'جميع المنتجات';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header Banner */}
      <div className="bg-gradient-to-r from-green3 to-green4 text-white py-12 px-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{getPageTitle()}</h1>
          <p className="text-lg text-center text-white/80 max-w-2xl mx-auto">
            اكتشف أحدث المنتجات التي وصلت لدينا
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header with return link */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-8 w-1.5 bg-green4 rounded-full mr-2 hidden md:block"></div>
            <h2 className="text-xl font-bold text-green4">{getPageTitle()}</h2>
          </div>
          <Link href="/" className="text-green3 hover:text-green4 transition-all duration-300 flex items-center group">
            <span className="mr-1">العودة للرئيسية</span>
            <FaArrowLeft className="text-xs group-hover:translate-x-[-4px] transition-transform duration-300" />
          </Link>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6" dir="rtl">
          <p className="text-gray-600">
            عرض <span className="font-medium text-green4">{items?.length || 0}</span> منتج
          </p>
        </div>

        {/* Items grid */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[60vh]">
            <Spinner size="lg" />
            <p className="mt-4 text-green4 font-medium">جاري تحميل المنتجات...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">
            <p>حدث خطأ أثناء تحميل المنتجات</p>
          </div>
        ) : items && items.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible" 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {items.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants}>
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
                      
                      {/* New arrival badge */}
                      {item.attributes.new_arrival && (
                        <div className="absolute top-0 right-0 bg-green4 text-white text-xs font-bold px-3 py-1 m-2 rounded">
                          جديد
                        </div>
                      )}
                      
                      {/* Sale badge */}
                      {isSaleActive() && !item.attributes.out_of_stock && (
                        <div className="absolute top-2 left-2 bg-green4/20 border border-green4/40 text-green4 text-xs font-semibold px-2.5 py-1 m-0 rounded-full flex items-center gap-1">
                          <FaTag className="text-[10px]" />
                          <span>-15%</span>
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
                        {isSaleActive() && !item.attributes.out_of_stock ? (
                          <div>
                            <span className="text-gray-500 line-through text-xs block">
                              {Number(item.attributes.state).toLocaleString()} IQD
                            </span>
                            <span className="font-bold text-red-600">
                              {calculateSalePrice(item.attributes.state).toLocaleString()} IQD
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-green4">
                            {Number(item.attributes.state).toLocaleString()} IQD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">لم يتم العثور على منتجات</h3>
            <p className="text-gray-500 mb-4">لا توجد منتجات جديدة متاحة حالياً</p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green4 hover:bg-green3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green3"
            >
              العودة للرئيسية
            </Link>
          </div>
        )}

        {/* End of results message */}
        {items && items.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            لقد وصلت إلى نهاية النتائج
          </div>
        )}
      </div>
    </div>
  );
} 