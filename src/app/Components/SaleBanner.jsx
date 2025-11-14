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
      className="bg-gradient-to-r from-green1/40 to-green2/30 border-b border-green3/40 py-2 sm:py-2.5 px-4 sm:px-6 relative overflow-hidden"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10 max-w-7xl mx-auto flex-wrap">
        {/* Discount badge */}
        <div className="inline-flex items-center gap-1.5 bg-green4/15 border border-green4/40 px-3 py-1 rounded-full">
          <span className="text-xs sm:text-sm font-bold text-green4">خصم 10%</span>
        </div>

        {/* Main message */}
        <span className="text-xs sm:text-sm text-gray-700 font-medium">
          على جميع المنتجات
        </span>
      </div>

      {/* Close button */}
      <motion.button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full transition-colors duration-200 focus:outline-none"
        aria-label="إغلاق"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaTimes className="text-sm" />
      </motion.button>
    </motion.div>
  );
};

export default SaleBanner; 