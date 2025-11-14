import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaEye } from 'react-icons/fa';
import { SaleBadge, FeaturedBadge } from './product-badges';
import { calculateSalePrice, isSaleActive } from '@/utils/saleUtils';

export function ProductCard({ product, index = 0, showFeaturedBadge = false }) {
  const hasDiscount = isSaleActive();
  const regularPrice = product.attributes.state;
  const salePrice = hasDiscount ? calculateSalePrice(regularPrice) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/item/${product.id}`}>
        <div className="bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 group-hover:shadow-card-hover h-full flex flex-col">
          <ProductCardImage
            product={product}
            index={index}
            hasDiscount={hasDiscount}
            showFeaturedBadge={showFeaturedBadge}
          />
          <ProductCardContent
            product={product}
            regularPrice={regularPrice}
            salePrice={salePrice}
            hasDiscount={hasDiscount}
          />
        </div>
      </Link>
    </motion.div>
  );
}

function ProductCardImage({ product, index, hasDiscount, showFeaturedBadge }) {
  return (
    <div className="relative">
      <div className="aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.attributes.item_thumbnail.data.attributes.url}
          alt={product.attributes.name}
          width={400}
          height={400}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          priority={index < 2}
        />
      </div>

      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {hasDiscount && <SaleBadge discount={10} size="sm" />}
      </div>

      {showFeaturedBadge && (
        <div className="absolute top-2 right-2">
          <FeaturedBadge size="sm" />
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-neutral-900/60 backdrop-blur-sm p-3 rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-300">
          <FaEye className="text-white text-base" />
        </div>
      </div>
    </div>
  );
}

function ProductCardContent({ product, regularPrice, salePrice, hasDiscount }) {
  return (
    <div className="p-4 flex-grow flex flex-col">
      <div className="flex-grow">
        <h3 className="font-semibold text-base md:text-lg text-neutral-900 mb-2 line-clamp-1 group-hover:text-brand-teal transition-colors">
          {product.attributes.name}
        </h3>
        <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
          {product.attributes.description}
        </p>
      </div>

      <div className="mt-auto pt-3 border-t border-neutral-200">
        <ProductCardPrice
          regularPrice={regularPrice}
          salePrice={salePrice}
          hasDiscount={hasDiscount}
        />
        <div className="mt-3 bg-neutral-100 rounded-lg px-4 py-2.5 text-center text-sm font-medium text-neutral-700 group-hover:bg-brand-teal group-hover:text-white transition-all duration-300">
          عرض المنتج
        </div>
      </div>
    </div>
  );
}

function ProductCardPrice({ regularPrice, salePrice, hasDiscount }) {
  if (!regularPrice) return null;

  if (hasDiscount && salePrice) {
    return (
      <div className="flex items-baseline gap-2">
        <p className="text-brand-clay font-bold text-lg">
          {salePrice.toLocaleString()} IQD
        </p>
        <p className="text-neutral-500 line-through text-sm">
          {regularPrice.toLocaleString()} IQD
        </p>
      </div>
    );
  }

  return (
    <p className="text-brand-teal font-bold text-lg">
      {regularPrice.toLocaleString()} IQD
    </p>
  );
}

export function ProductCardGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 ${className}`}>
      {children}
    </div>
  );
}
