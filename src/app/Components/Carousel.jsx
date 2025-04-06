"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { FaArrowLeft, FaEye } from "react-icons/fa";
import Spinner from "./Spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchNewArrivals } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";

export default function SimpleCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Fetch new arrivals using React Query
  const { 
    data: images = [],
    isLoading,
    error 
  } = useQuery({
    queryKey: [QueryKeys.newArrivals],
    queryFn: () => fetchNewArrivals(6)
  });

  // Settings for the carousel
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0",
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    beforeChange: (current, next) => setActiveSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Custom dot indicator component
  const CustomDot = ({ active }) => {
    return (
      <span
        className={`inline-block h-2 w-2 rounded-full mx-1 transition-all duration-300 ${
          active ? "bg-green4 w-6" : "bg-gray-300"
        }`}
      />
    );
  };

  const CustomPagination = ({ totalSlides }) => {
    return (
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center items-center">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <CustomDot key={i} active={i === activeSlide % totalSlides} />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {isLoading ? (
        <div className="justify-center h-full mb-20 items-center flex py-20 bg-green1/30">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 bg-green1/30">
          <p>Failed to load new arrivals</p>
        </div>
      ) : images && images.length > 0 ? (
        <div className="w-full max-w-screen-xl mx-auto my-10 relative mb-20 px-4 lg:px-0">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-10 w-2 bg-green4 rounded-full mr-3 hidden md:block"></div>
              <h2 className="text-2xl mx-1 md:text-3xl font-bold text-green4 md:text-right">
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
                className="text-sm md:text-base font-medium text-green3 hover:text-green4 transition-colors duration-300 flex items-center group"
              >
                عرض الكل
                <FaArrowLeft className="mr-2 text-xs group-hover:translate-x-[-4px] transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="carousel-container overflow-hidden rounded-xl shadow-xl relative"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Slider {...settings}>
              {images.map((img, idx) => {
                const isActive = idx === activeSlide % images.length;
                return (
                <div key={img.id} className="px-2 py-3">
                  <motion.div 
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`h-full transform transition-all duration-500 ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-80'}`}
                  >
                    <Link
                      className="relative block h-full"
                      href={`/item/${img.id}`}
                    >
                      <div className={`relative overflow-hidden rounded-xl shadow-md transition-all duration-300 group h-full bg-white ${isActive ? 'ring-4 ring-green4/50' : ''}`}>
                        <div className="relative aspect-[4/5] overflow-hidden">
                          <Image
                            src={img.attributes.item_thumbnail.data.attributes.url}
                            width={400}
                            height={400}
                            alt={`${img.attributes.name}`}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out`}
                            priority
                          />
                          <div className="absolute top-4 left-4 bg-green4 text-white text-sm md:text-base font-medium px-3 py-1 rounded-full shadow-md">
                            وصل حديثاً
                          </div>
                          
                          {/* Quick view button - appears on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-green4/50 backdrop-blur-sm p-3 rounded-full">
                              <FaEye className="text-white text-xl" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green5/80 to-transparent p-4 md:p-5 transform translate-y-0 opacity-100 group-hover:opacity-100 transition-all duration-300">
                          <h3 className="text-white font-bold text-base md:text-lg truncate">
                            {img.attributes.name}
                          </h3>
                          {img.attributes.state && (
                            <p className="text-white/90 mt-1 font-medium flex items-center justify-between">
                              <span>{img.attributes.state.toLocaleString()} IQD</span>
                              <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                عرض المنتج
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              )})}
            </Slider>
            
            {/* Custom pagination dots */}
            <CustomPagination totalSlides={images.length} />
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p>لا توجد منتجات جديدة حالياً</p>
        </div>
      )}
    </motion.div>
  );
}
