"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaGift, FaTimes, FaClock, FaCalendarAlt } from "react-icons/fa";

const SaleBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [days, setDays] = useState(0);
  
  useEffect(() => {
    // Check if sale is still active
    const endDate = new Date(2025, 5, 1, 23, 59, 59); // June 1, 2025
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
      className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-2 sm:py-2.5 px-3 sm:px-6 text-center relative overflow-hidden shadow-md"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div 
          className="absolute -left-8 -top-8 w-16 h-16 bg-white rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute right-1/4 -bottom-8 w-16 h-16 bg-white rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 relative z-10">
        <motion.div
          animate={{ 
            rotate: [0, -5, 5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="inline-flex items-center bg-white text-red-600 font-bold rounded-full px-2 py-0.5 text-xs sm:text-sm"
        >
          <FaGift className="mx-1 text-xs sm:text-sm" />
          <span>خصم خاص</span>
        </motion.div>
        
        <span className="font-bold text-sm sm:text-base inline-flex items-center">
          <span className="bg-red-500 bg-opacity-40 rounded-lg px-2 py-0.5 mx-1">15%</span> 
          على جميع المنتجات
        </span>
        
        {/* Countdown timer */}
        <div className="flex items-center gap-1 text-xs sm:text-sm bg-red-800 bg-opacity-30 rounded-full px-2 py-1">
          <FaCalendarAlt className="text-yellow-200 text-xs" />
          <span className="whitespace-nowrap">ينتهي في 1/6/2025</span>
          <motion.div 
            className="flex items-center gap-1 ml-1 bg-red-800 rounded-full px-2 py-0.5"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaClock className="text-yellow-200 text-xs animate-pulse" />
            <motion.span
              className="font-mono font-bold text-yellow-200"
              key={days} // Reset animation when days change
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {timeLeft}
            </motion.span>
          </motion.div>
        </div>
      </div>
      
      <motion.button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-red-800 bg-opacity-40 rounded-full hover:bg-red-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
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