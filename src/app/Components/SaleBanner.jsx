"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const SaleBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [days, setDays] = useState(0);

  useEffect(() => {
    // Check if sale is still active
    const endDate = new Date(2025, 10, 14, 23, 59, 59); // November 14, 2025
    const now = new Date();

    if (now > endDate) {
      setIsVisible(false);
      return;
    }

    // Update countdown timer
    const updateTimer = () => {
      const now = new Date();
      const difference = endDate - now;

      if (difference <= 0) {
        setIsVisible(false);
        return;
      }

      const daysRemaining = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(daysRemaining);
      setTimeLeft(`${daysRemaining} ${daysRemaining === 1 ? 'يوم' : 'أيام'}`);
    };

    // Initial update
    updateTimer();

    // Schedule updates
    const timer = setInterval(updateTimer, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="bg-gradient-to-r from-green1/30 to-green2/20 border-b border-green3/30 py-2.5 sm:py-3 px-4 sm:px-6 relative overflow-hidden"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 relative z-10 max-w-7xl mx-auto">
        {/* Discount badge */}
        <div className="inline-flex items-center gap-2 bg-green4/10 border border-green4/30 px-3 py-1 rounded-full">
          <span className="text-xs sm:text-sm font-semibold text-green4">خصم 15%</span>
        </div>

        {/* Main message */}
        <span className="text-xs sm:text-sm text-gray-700 font-medium">
          على جميع المنتجات
        </span>

        {/* Countdown timer - subtle */}
        <motion.div
          className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 bg-white bg-opacity-50 border border-green3/20 rounded-full px-2.5 py-1"
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="whitespace-nowrap">ينتهي في:</span>
          <span className="font-mono font-bold text-green4">{timeLeft}</span>
        </motion.div>
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