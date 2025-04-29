"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaTag, FaClock, FaShoppingCart } from "react-icons/fa";
import { isSaleActive } from "@/utils/saleUtils";

const SaleHero = () => {
  // If sale is not active, don't render
  if (!isSaleActive()) return null;

  return (
    <div className="bg-gradient-to-br from-red-600 via-red-500 to-red-700 py-8 px-4 sm:py-8 relative overflow-hidden shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute right-10 top-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute left-1/4 bottom-5 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute right-1/3 -bottom-10 w-48 h-48 bg-white rounded-full"></div>
      </div>
      
      <div className="max-w-screen-xl mx-auto relative z-10">
        <motion.div 
          className="text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7,
            ease: "easeOut"
          }}
        >
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-3"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Sale tag icon with animation */}
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -5, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="bg-white text-red-600 p-2 rounded-full shadow-lg"
            >
              <FaTag className="text-2xl" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-shadow relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-red-100">
                عرض خاص! خصم 15% على جميع المنتجات
              </span>
              {/* Yellow accent badge */}
              <span className="absolute -top-3 -right-3 bg-yellow-400 text-red-600 text-xs font-bold py-1 px-2 rounded-full transform rotate-12 shadow-md">
                حصرياً
              </span>
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-lg mb-8 inline-flex items-center justify-center px-4 py-2 bg-red-700 bg-opacity-30 rounded-full shadow-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FaClock className="mr-2" />
            <span className="border-b border-white border-dashed">استمتع بخصم 15% على جميع منتجاتنا حتى 1/6/2025</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/category" 
              className="group flex items-center gap-2 bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-red-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaShoppingCart className="transition-transform group-hover:rotate-12" />
              <span>تسوق الآن</span>
            </Link>
            
            <span className="text-white/80 text-sm sm:text-base">
              واستمتع بالتوصيل المجاني لطلبات أكثر من 50,000 د.ع
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SaleHero; 