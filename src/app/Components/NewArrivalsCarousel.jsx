"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaEye, FaTag } from "react-icons/fa";
import Spinner from "./Spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchNewArrivals } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { isSaleActive, calculateSalePrice } from "@/utils/saleUtils";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
// Import required modules
import { Autoplay, EffectCoverflow } from 'swiper/modules';

export default function NewArrivalsCarousel() {
  // Fetch new arrivals using React Query
  const { 
    data: images = [],
    isLoading,
    error 
  } = useQuery({
    queryKey: [QueryKeys.newArrivals],
    queryFn: () => fetchNewArrivals(6)
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative py-4 mb-4"
    >
      {isLoading ? (
        <div className="justify-center h-[200px] items-center flex">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">
          <p>Failed to load new arrivals</p>
        </div>
      ) : images && images.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-4">
            <motion.div
              className="flex items-center mb-2 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-8 w-1.5 bg-green4 rounded-full mr-2 hidden md:block"></div>
              <h2 className="text-lg mx-1 md:text-xl font-bold text-green4 md:text-right">
                وصل حديثاً
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link 
                href="/items?filter=new_arrival" 
                className="text-xs md:text-sm font-medium text-green3 hover:text-green4 transition-colors duration-300 flex items-center group"
              >
                عرض الكل
                <FaArrowLeft className="mr-1 text-xs group-hover:translate-x-[-4px] transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="new-arrivals-3d-carousel relative"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={2}
              spaceBetween={10}
              coverflowEffect={{
                rotate: 10,
                stretch: 0,
                depth: 120,
                modifier: 1.5,
                slideShadows: true,
              }}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={false}
              modules={[EffectCoverflow, Autoplay]}
              className="pb-2"
              preventClicks={false}
              preventClicksPropagation={false}
              slideToClickedSlide={true}
              threshold={50}
              touchRatio={0.5}
              shortSwipes={false}
              longSwipes={true}
              longSwipesRatio={0.3}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: -30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: -50,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: -60,
                },
              }}
            >
              {images.map((img) => (
                <SwiperSlide key={img.id} className="w-[260px] md:w-[240px] h-auto">
                  <Link
                    className="group block h-full"
                    href={`/item/${img.id}`}
                  >
                    <div className="overflow-hidden rounded-lg bg-white shadow-md h-full transform transition-all duration-300 border border-gray-100 flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={img.attributes.item_thumbnail.data.attributes.url}
                          fill
                          sizes="(max-width: 640px) 80vw, 240px"
                          alt={img.attributes.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                          priority
                        />

                        <div className="absolute top-1 left-1 bg-green4 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm z-10">
                          جديد
                        </div>

                        {/* Sale badge - Only shown if sale is active */}
                        {isSaleActive() && !img.attributes.out_of_stock && (
                          <div className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-lg z-10 flex items-center gap-0.5">
                            <FaTag className="text-[8px]" />
                            <span>-10%</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-green5/60 via-green5/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <div className="bg-white/80 p-1.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <FaEye className="text-green4 text-sm" />
                          </div>
                        </div>
                      </div>

                      <div className="p-2 flex-grow flex flex-col">
                        <h3 className="font-bold text-gray-800 text-xs line-clamp-2 group-hover:text-green4 transition-colors min-h-[2rem] mb-1">
                          {img.attributes.name}
                        </h3>
                        {img.attributes.state && (
                          <div className="flex items-center justify-between mt-auto">
                            {isSaleActive() && !img.attributes.out_of_stock ? (
                              <div>
                                <span className="text-gray-500 line-through text-[10px] block">
                                  {img.attributes.state.toLocaleString()} IQD
                                </span>
                                <span className="font-bold text-amber-600 text-xs">
                                  {calculateSalePrice(img.attributes.state).toLocaleString()} IQD
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-green4 text-xs">
                                {img.attributes.state.toLocaleString()} IQD
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p>لا توجد منتجات جديدة حالياً</p>
        </div>
      )}
    </motion.div>
  );
} 