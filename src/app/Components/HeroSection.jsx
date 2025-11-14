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
    <section className="relative overflow-hidden bg-gradient-to-br from-green2 via-green3 to-green4 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 rounded-b-2xl sm:rounded-b-4xl shadow-xl">
      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
      <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>

      <div className="relative max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-12">
        <motion.div
          className="md:w-1/2 text-center md:text-right z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="glass text-white text-xs sm:text-sm px-4 py-1.5 rounded-full inline-block mb-4 font-medium shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            متجر عصري
          </motion.span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-5 tracking-tight leading-tight">
            أحدث المنتجات المضافة
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/95 leading-relaxed">
            تصفح أحدث المنتجات التي تمت إضافتها حديثاً إلى متجرنا
          </p>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/category" className="inline-flex items-center gap-2 bg-white text-green4 font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-0.5 group">
              <span>تسوق الآن</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l-5 5 5 5" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 frosted p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl mt-6 md:mt-0 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {isLoading ? (
            <div className="h-64 sm:h-80 flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="relative h-64 sm:h-80 overflow-hidden rounded-xl sm:rounded-2xl">
              {/* Product Showcase Grid */}
              <div className="absolute inset-0 grid grid-cols-2 gap-3 p-3">
                <div className="flex flex-col gap-3">
                  {/* First product image */}
                  {products.length > 0 && products[0]?.attributes?.item_thumbnail?.data?.attributes?.url ? (
                    <Link
                      href={`/item/${products[0]?.id}`}
                      className="relative h-full rounded-xl overflow-hidden border-2 border-white/40 bg-white shadow-sm group z-20 transition-all duration-400 hover:shadow-card-hover hover:scale-[1.02]"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={products[0].attributes.item_thumbnail.data.attributes.url}
                          alt={products[0].attributes.name || "Featured Product 1"}
                          fill
                          sizes="(max-width: 768px) 40vw, (max-width: 1024px) 30vw, 20vw"
                          className="object-contain p-2"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green4/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"></div>
                        <div className="absolute inset-x-0 bottom-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-400 pointer-events-none">
                          <span className="text-white text-[10px] sm:text-xs font-bold bg-green4/90 px-2 py-1 rounded-lg inline-block shadow-sm backdrop-blur-sm line-clamp-1">
                            {products[0]?.attributes?.name || "منتج #1"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative h-full rounded-xl overflow-hidden border-2 border-white/40 bg-gradient-to-br from-green1 to-green2 flex items-center justify-center shadow-sm">
                      <span className="text-green5 text-xs sm:text-sm font-semibold">منتج #1</span>
                    </div>
                  )}

                  {/* Second product image */}
                  {products.length > 1 && products[1]?.attributes?.item_thumbnail?.data?.attributes?.url ? (
                    <Link
                      href={`/item/${products[1]?.id}`}
                      className="relative h-full rounded-xl overflow-hidden border-2 border-white/40 bg-white shadow-sm group z-20 transition-all duration-400 hover:shadow-card-hover hover:scale-[1.02]"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={products[1].attributes.item_thumbnail.data.attributes.url}
                          alt={products[1].attributes.name || "Featured Product 2"}
                          fill
                          sizes="(max-width: 768px) 40vw, (max-width: 1024px) 30vw, 20vw"
                          className="object-contain p-2"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green4/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"></div>
                        <div className="absolute inset-x-0 bottom-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-400 pointer-events-none">
                          <span className="text-white text-[10px] sm:text-xs font-bold bg-green4/90 px-2 py-1 rounded-lg inline-block shadow-sm backdrop-blur-sm line-clamp-1">
                            {products[1]?.attributes?.name || "منتج #2"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative h-full rounded-xl overflow-hidden border-2 border-white/40 bg-gradient-to-br from-green2 to-green3 flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs sm:text-sm font-semibold">منتج #2</span>
                    </div>
                  )}
                </div>

                {/* Third product image - larger */}
                {products.length > 2 && products[2]?.attributes?.item_thumbnail?.data?.attributes?.url ? (
                  <Link
                    href={`/item/${products[2]?.id}`}
                    className="relative h-full rounded-xl overflow-hidden border-2 border-white/40 bg-white shadow-sm group z-20 transition-all duration-400 hover:shadow-card-hover hover:scale-[1.02]"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={products[2].attributes.item_thumbnail.data.attributes.url}
                        alt={products[2].attributes.name || "Featured Product 3"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 40vw, 25vw"
                        className="object-contain p-3"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green4/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"></div>
                      <div className="absolute inset-x-0 bottom-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-400 pointer-events-none">
                        <span className="text-white text-[10px] sm:text-xs font-bold bg-green4/90 px-3 py-1.5 rounded-lg inline-block shadow-sm backdrop-blur-sm line-clamp-1">
                          {products[2]?.attributes?.name || "منتج #3"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative h-full rounded-xl overflow-hidden border-2 border-white/40 bg-gradient-to-br from-green3 to-green4 flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs sm:text-sm font-semibold">منتج #3</span>
                  </div>
                )}
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute top-3 right-3 glass-green text-green5 text-[10px] sm:text-xs px-3 py-1.5 rounded-full z-30 pointer-events-none font-bold shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                جديد
              </motion.div>
              <motion.div
                className="absolute bottom-3 left-3 glass-green text-green5 text-[10px] sm:text-xs px-3 py-1.5 rounded-full z-30 pointer-events-none font-bold shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                حصري
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 