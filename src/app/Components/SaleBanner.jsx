"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { isSaleActive } from "@/utils/saleUtils";

const SaleBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isSaleActive() || !isVisible) return null;

  return (
    <motion.div
      className="relative bg-gradient-to-r from-green4 via-green3 to-green4 py-3 sm:py-3.5 px-4 sm:px-6 overflow-hidden"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10 max-w-7xl mx-auto flex-wrap">
        {/* Discount badge with pulse animation */}
        <motion.div
          className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
          <span className="text-sm sm:text-base font-bold text-red-600">خصم 10%</span>
        </motion.div>

        {/* Main message with icon */}
        <div className="flex items-center gap-2 text-white">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs sm:text-sm md:text-base font-bold text-center">
            على جميع المنتجات عند الطلب من الموقع
          </span>
        </div>
      </div>

      {/* Close button with better styling */}
      <motion.button
        onClick={() => setIsVisible(false)}
        className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all duration-300 focus:outline-none shadow-sm hover:shadow-md"
        aria-label="إغلاق"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaTimes className="text-xs sm:text-sm" />
      </motion.button>
    </motion.div>
  );
};

export default SaleBanner; 