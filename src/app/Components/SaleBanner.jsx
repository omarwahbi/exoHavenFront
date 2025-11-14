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
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>

      <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10 max-w-7xl mx-auto flex-wrap">
        {/* Discount badge - simple and elegant */}
        <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          <span className="text-sm sm:text-base font-semibold text-gray-800">خصم 10%</span>
        </div>

        {/* Main message with icon */}
        <div className="flex items-center gap-2 text-white">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs sm:text-sm md:text-base font-medium text-center">
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