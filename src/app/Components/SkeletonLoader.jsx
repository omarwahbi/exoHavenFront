import React from "react";
import { motion } from "framer-motion";

// Base Skeleton component
export const Skeleton = ({ className = "", animate = true }) => {
  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded ${
        animate ? "animate-shimmer" : ""
      } ${className}`}
      style={
        animate
          ? {
              backgroundSize: "200% 100%",
              backgroundPosition: "-100% 0",
            }
          : {}
      }
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-card overflow-hidden h-full flex flex-col border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image skeleton */}
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white p-4">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          {/* Title skeleton */}
          <Skeleton className="h-5 sm:h-6 w-3/4 rounded-lg" />

          {/* Description skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-3 sm:h-4 w-full rounded" />
            <Skeleton className="h-3 sm:h-4 w-5/6 rounded" />
          </div>
        </div>

        {/* Price and button skeleton */}
        <div className="mt-4 space-y-3">
          <Skeleton className="h-6 sm:h-7 w-2/5 rounded-lg" />
          <Skeleton className="h-10 sm:h-12 w-full rounded-xl" />
        </div>
      </div>
    </motion.div>
  );
};

// Category Card Skeleton
export const CategoryCardSkeleton = () => {
  return (
    <motion.div
      className="flex flex-col items-center p-5 sm:p-6 bg-white rounded-2xl shadow-card h-full border border-gray-100"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image skeleton */}
      <div className="mb-4 sm:mb-5 rounded-full border-4 border-green1 p-1 sm:p-1.5 shadow-sm bg-white">
        <Skeleton className="rounded-full h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32" />
      </div>

      {/* Title skeleton */}
      <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 rounded-lg mb-2" />

      {/* Subtitle skeleton */}
      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 rounded" />
    </motion.div>
  );
};

// Grid of Product Skeletons
export const ProductGridSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-7">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Grid of Category Skeletons
export const CategoryGridSkeleton = ({ count = 5 }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-[calc(50%-8px)] sm:w-[calc(50%-10px)] md:w-[calc(25%-18px)] lg:w-[calc(20%-19.2px)]"
        >
          <CategoryCardSkeleton />
        </div>
      ))}
    </div>
  );
};

// Hero Product Skeleton
export const HeroProductSkeleton = () => {
  return (
    <div className="relative h-64 sm:h-80 overflow-hidden rounded-xl sm:rounded-2xl">
      <div className="absolute inset-0 grid grid-cols-2 gap-3 p-3">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-full rounded-xl" />
          <Skeleton className="h-full rounded-xl" />
        </div>
        <Skeleton className="h-full rounded-xl" />
      </div>
    </div>
  );
};

// List Item Skeleton (for cart items, etc.)
export const ListItemSkeleton = () => {
  return (
    <motion.div
      className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex-shrink-0" />
      <div className="flex-grow space-y-3">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-6 w-1/3 rounded-lg" />
      </div>
    </motion.div>
  );
};

export default {
  Skeleton,
  ProductCardSkeleton,
  CategoryCardSkeleton,
  ProductGridSkeleton,
  CategoryGridSkeleton,
  HeroProductSkeleton,
  ListItemSkeleton,
};
