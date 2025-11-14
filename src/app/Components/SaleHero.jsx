"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaTag, FaShoppingCart } from "react-icons/fa";
import { isSaleActive } from "@/utils/saleUtils";

const SaleHero = () => {
  // If sale is not active, don't render
  if (!isSaleActive()) return null;

  return (
    <div className="bg-gradient-to-r from-white via-green1/40 to-white py-10 px-4 sm:py-12 relative overflow-hidden border-b border-green3/20">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-32 h-32 bg-green2/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-accent2/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-screen-xl mx-auto relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        >
          {/* Offer announcement */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-2"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 bg-green2/30 border border-green3/40 px-4 py-1.5 rounded-full">
              <FaTag className="text-sm text-green4" />
              <span className="text-xs sm:text-sm font-medium text-green5">عرض مميز</span>
            </div>
          </motion.div>

          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gray-800">خصم </span>
            <span className="text-green4 font-extrabold">15%</span>
            <span className="text-gray-800"> على كل شيء</span>
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            استمتع بخصم 15% على جميع منتجاتنا حتى نوفمبر 14, 2025. عرض محدود الوقت على ملحقات الحيوانات الغريبة.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/category"
              className="group inline-flex items-center gap-2 bg-green4 hover:bg-green5 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <FaShoppingCart className="text-sm transition-transform group-hover:translate-x-1" />
              <span>تسوق الآن</span>
            </Link>

            <span className="text-gray-500 text-xs sm:text-sm">
              توصيل مجاني للطلبات فوق 50,000 د.ع
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SaleHero; 