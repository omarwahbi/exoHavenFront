"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Spinner from "./Spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestProducts } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";

const HeroSection = () => {
  // Use React Query for fetching latest products
  const { 
    data: products = [], 
    isLoading 
  } = useQuery({
    queryKey: [QueryKeys.latestProducts],
    queryFn: () => fetchLatestProducts(3)
  });

  return (
    <section className="bg-gradient-to-br from-green3 to-green4 text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 rounded-b-xl sm:rounded-b-3xl shadow-lg">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
        <motion.div 
          className="md:w-1/2 text-center md:text-right"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm px-3 py-1 rounded-full inline-block mb-3">متجر عصري</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">أحدث المنتجات المضافة</h1>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 text-white/90">تصفح أحدث المنتجات التي تمت إضافتها حديثاً إلى متجرنا</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/category" className="inline-block bg-white text-green4 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              تسوق الآن
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 bg-white/20 backdrop-blur-sm p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg mt-6 md:mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="h-56 sm:h-72 flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="relative h-56 sm:h-72 overflow-hidden rounded-lg sm:rounded-xl">
              {/* Product Showcase Grid */}
              <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2">
                <div className="flex flex-col gap-2">
                  {/* First product image */}
                  {products.length > 0 && products[0]?.attributes?.item_thumbnail?.data?.attributes?.url ? (
                    <Link 
                      href={`/item/${products[0]?.id}`} 
                      className="relative h-full rounded-lg overflow-hidden border-2 border-white/20 group z-20"
                    >
                      <div className="relative w-full h-full">
                        <Image 
                          src={products[0].attributes.item_thumbnail.data.attributes.url}
                          alt={products[0].attributes.name || "Featured Product 1"}
                          fill
                          sizes="(max-width: 768px) 40vw, (max-width: 1024px) 30vw, 20vw"
                          className="object-contain"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-green2/10 to-green2/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <span className="text-white text-xs sm:text-sm font-semibold bg-green4/70 px-2 py-1 rounded-full">
                            {products[0]?.attributes?.name || "منتج #1"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative h-full rounded-lg overflow-hidden border-2 border-white/20 bg-green2/80 flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-semibold">منتج #1</span>
                    </div>
                  )}
                  
                  {/* Second product image */}
                  {products.length > 1 && products[1]?.attributes?.item_thumbnail?.data?.attributes?.url ? (
                    <Link 
                      href={`/item/${products[1]?.id}`} 
                      className="relative h-full rounded-lg overflow-hidden border-2 border-white/20 group z-20"
                    >
                      <div className="relative w-full h-full">
                        <Image 
                          src={products[1].attributes.item_thumbnail.data.attributes.url}
                          alt={products[1].attributes.name || "Featured Product 2"}
                          fill
                          sizes="(max-width: 768px) 40vw, (max-width: 1024px) 30vw, 20vw"
                          className="object-contain"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-green3/10 to-green3/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <span className="text-white text-xs sm:text-sm font-semibold bg-green4/70 px-2 py-1 rounded-full">
                            {products[1]?.attributes?.name || "منتج #2"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative h-full rounded-lg overflow-hidden border-2 border-white/20 bg-green3/80 flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-semibold">منتج #2</span>
                    </div>
                  )}
                </div>
                
                {/* Third product image - larger */}
                {products.length > 2 && products[2]?.attributes?.item_thumbnail?.data?.attributes?.url ? (
                  <Link 
                    href={`/item/${products[2]?.id}`} 
                    className="relative h-full rounded-lg overflow-hidden border-2 border-white/20 group z-20"
                  >
                    <div className="relative w-full h-full">
                      <Image 
                        src={products[2].attributes.item_thumbnail.data.attributes.url}
                        alt={products[2].attributes.name || "Featured Product 3"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 40vw, 25vw"
                        className="object-contain"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-green4/10 to-green4/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="text-white text-xs sm:text-sm font-semibold bg-green4/70 px-2 py-1 rounded-full">
                          {products[2]?.attributes?.name || "منتج #3"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative h-full rounded-lg overflow-hidden border-2 border-white/20 bg-green4/80 flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-semibold">منتج #3</span>
                  </div>
                )}
              </div>
              
              {/* Overlay with dots pattern - make sure they don't block clicks */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green1/30 to-transparent mix-blend-overlay pointer-events-none z-10"></div>
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIvPjxjaXJjbGUgY3g9IjQ4IiBjeT0iMTIiIHI9IjYiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjQ4IiByPSI2Ii8+PGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjYiLz48L2c+PC9zdmc+')]
              pointer-events-none z-10"></div>
              
              {/* Floating badges */}
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full z-30 pointer-events-none">جديد</div>
              <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full z-30 pointer-events-none">حصري</div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 