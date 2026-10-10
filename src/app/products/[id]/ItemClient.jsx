"use client";
import React, { useState, useEffect, useMemo } from "react";
import { MdCheckCircle, MdSupportAgent, MdLocalShipping, MdShield, MdShoppingCart } from "react-icons/md";
import AddToCartButton from "@/app/Components/AddToCartBtn";
import Quantity from "@/app/Components/Quantity";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/app/Components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchItemById, fetchRelatedProducts } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { useCart } from "@/app/context/CartContext";
import { calculateSalePrice, isSaleActive } from "@/utils/saleUtils";
import { useSale } from "@/app/context/SaleContext";
import { FaTag } from "react-icons/fa";
import { generateProductSchema, generateBreadcrumbSchema, renderJSONLD } from "@/utils/seo";
import { itemImageUrl, mediaUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";
import { availableVariants, basePrice, isOutOfStock, variantsOf } from "@/utils/product";
import StockBadge from "@/app/Components/StockBadge";

export default function ItemClient({ params }) {
  const sale = useSale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const { cart } = useCart();

  // Check if cart has items
  const hasItemsInCart = cart.length > 0;

  // Fetch item data
  const {
    data: item,
    isLoading,
    error
  } = useQuery({
    queryKey: QueryKeys.item(params.id),
    queryFn: () => fetchItemById(params.id),
    enabled: !!params.id
  });

  // For items with variants: the one the shopper picked (by label), defaulting to
  // the first one in stock.
  const [variantLabel, setVariantLabel] = useState(null);
  const variants = variantsOf(item);
  const variant =
    variants.find((v) => v.label === variantLabel) ?? availableVariants(item)[0] ?? variants[0];
  const outOfStock = item ? isOutOfStock(item, variant) : false;
  const price = item ? basePrice(item, variant) : 0;

  // Derived data using useMemo to prevent recreation on each render
  const itemImgs = useMemo(() => item?.item_images || [], [item]);
  const categoryId = entryKey(item?.category);

  // Fetch related products
  const {
    data: relatedProducts = []
  } = useQuery({
    queryKey: QueryKeys.relatedProducts(categoryId, entryKey(item)),
    queryFn: () => fetchRelatedProducts(categoryId, entryKey(item)),
    enabled: !!categoryId && !!item
  });

  // Generate structured data for SEO
  const productSchema = item ? generateProductSchema(item, sale) : null;
  const breadcrumbSchema = item ? generateBreadcrumbSchema([
    { name: 'الرئيسية', url: 'https://exohaven-iq.com/' },
    { name: 'المنتجات', url: 'https://exohaven-iq.com/products' },
    { name: item.name, url: `https://exohaven-iq.com/products/${entryKey(item)}` }
  ]) : null;

  // Handle image selection and rotation
  useEffect(() => {
    if (itemImgs && itemImgs.length > 0) {
      setSelectedImage(itemImgs[activeIndex].url);

      const interval = setInterval(() => {
        setActiveIndex((current) =>
          current === itemImgs.length - 1 ? 0 : current + 1
        );
      }, 10000); // Change slide every 10 seconds

      return () => clearInterval(interval); // Clean up on component unmount
    }
  }, [itemImgs, activeIndex]);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    setSelectedImage(itemImgs[index].url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] px-4 text-center">
        <div className="text-red-500 text-xl font-medium mb-4">
          {error ? 'Unable to load product information. Please try again later.' : 'المنتج غير موجود'}
        </div>
        <Link href="/products" className="bg-green4 text-white px-6 py-2 rounded-md hover:bg-green3 transition-colors">
          العودة إلى المنتجات
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJSONLD(productSchema)}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJSONLD(breadcrumbSchema)}
        />
      )}

      <div className="max-w-7xl mx-auto mt-8 mb-14 px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium" dir="rtl">
          <ol className="flex items-center space-x-1 space-x-reverse">
            <li>
              <Link href="/" className="text-gray-600 hover:text-green4">
                الرئيسية
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link href="/products" className="text-gray-600 hover:text-green4">
                المنتجات
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-green5 font-bold">{item.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Images Section - Thumbnails and Main Image */}
            <div className="w-full lg:w-1/2">
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Thumbnails on side */}
                  <div className="hidden md:flex md:col-span-1 flex-col space-y-3 order-first">
                    {itemImgs && itemImgs.length > 0 && itemImgs.map((img, index) => (
                      <div
                        key={img.id || index}
                        className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${
                          index === activeIndex ? 'border-green4' : 'border-transparent'
                        } hover:border-green3 transition-all duration-200`}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <div className="pb-[100%] relative">
                          <Image
                            src={img.url}
                            fill
                            sizes="(max-width: 768px) 20vw, 10vw"
                            className="object-cover absolute inset-0"
                            alt={`Thumbnail ${index + 1}`}
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Main image display */}
                  <div className="md:col-span-4 relative">
                    <div className="bg-white rounded-lg overflow-hidden">
                      <div className="relative pt-[100%]">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={selectedImage || mediaUrl(item?.item_images) || itemImageUrl(item)}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-contain p-4"
                              alt={item.name}
                              priority
                              fetchPriority="high"
                            />
                          </motion.div>
                        </AnimatePresence>

                        {/* Out of stock overlay */}
                        {outOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-green5/60 z-10">
                            <div className="bg-red-500 text-white py-2 px-6 rounded-full text-lg font-bold transform -rotate-12">
                              نفذت الكمية
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile thumbnails */}
                <div className="flex justify-center space-x-2 mt-4 md:hidden overflow-x-auto py-2">
                  {itemImgs && itemImgs.map((img, index) => (
                    <div
                      key={img.id || index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                        index === activeIndex ? 'border-green4' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={img.url}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Information Section */}
            <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-r border-gray-100">
              <div className="p-4 md:p-6" dir="rtl">


                {/* Product name */}
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                  {item.name}
                </h1>

                {/* Availability tag */}
                <div className="mb-4">
                  {outOfStock ? (
                    <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                      غير متوفر
                    </span>
                  ) : (
                    <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      متوفر
                    </span>
                  )}

                  {/* New arrival tag */}
                  {item.new_arrival && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-2">
                      وصل حديثاً
                    </span>
                  )}

                  {/* Sale tag */}
                  <StockBadge item={item} variant={variant} className="mr-2" />

                  {isSaleActive(sale) && !outOfStock && (
                    <span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mr-2">
                      <FaTag className="inline-block ml-1" size={12} />
                      خصم {sale.percent}%
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="my-5">
                  {isSaleActive(sale) && !outOfStock ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-lg line-through text-gray-500 mb-1">
                          {price.toLocaleString()}
                          <span className="text-sm font-medium mr-1">د.ع</span>
                        </span>
                        <span className="text-3xl font-bold text-amber-600">
                          {calculateSalePrice(price, sale).toLocaleString()}
                          <span className="text-lg font-medium mr-1">د.ع</span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-green5">
                      {price.toLocaleString()}
                      <span className="text-lg font-medium mr-1">د.ع</span>
                    </span>
                  )}
                </div>

                {/* Variant picker */}
                {variants.length > 0 && (
                  <div className="my-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">اختر النوع</h3>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="اختر النوع">
                      {variants.map((v) => {
                        const selected = v.label === variant?.label;
                        return (
                          <button
                            key={v.label}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setVariantLabel(v.label)}
                            className={`relative min-w-[4.5rem] rounded-xl border-2 px-4 py-2 text-sm font-medium transition-colors ${
                              selected
                                ? "border-green4 bg-green1 text-green5"
                                : "border-gray-200 bg-white text-gray-700 hover:border-green3"
                            } ${v.out_of_stock ? "opacity-50 line-through" : ""}`}
                          >
                            {v.label}
                            <span className="block text-xs font-normal text-gray-500 no-underline">
                              {Number(v.price).toLocaleString()} د.ع
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="my-6">
                  <h3 className="text-lg font-medium mb-2">وصف المنتج</h3>
                  <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                    {item.description || "لا يوجد وصف متاح لهذا المنتج."}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <MdCheckCircle size={24} className="shrink-0 ml-2 text-green-500" />
                    <span className="text-gray-700">منتج ذو جودة عالية</span>
                  </div>

                  <div className="flex items-center">
                    <MdLocalShipping size={24} className="shrink-0 ml-2 text-blue-500" />
                    <span className="text-gray-700">توصيل سريع وآمن</span>
                  </div>
                  <div className="flex items-center">
                    <MdSupportAgent size={24} className="shrink-0 ml-2 text-red-500" />
                    <span className="text-gray-700">خدمة عملاء متميزة</span>
                  </div>
                </div>

                {/* Cart Actions */}
                <div className="flex flex-col gap-4 mt-6">
                  {/* Add to Cart & Quantity Control - Responsive Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-4">
                    {/* Add to Cart Button - Full width on mobile, partial on larger screens */}
                    <div className="w-full sm:col-span-2 md:flex-1 order-1">
                      <AddToCartButton item={item} variant={variant} />
                    </div>

                    {/* Quantity Control - Full width on mobile, auto on larger screens */}
                    <div className="w-full sm:col-span-1 md:w-auto order-2 flex justify-center sm:justify-start">
                      <Quantity item={item} variant={variant} />
                    </div>

                    {/* Go to Cart Button - Only shown when cart has items */}
                    {hasItemsInCart && (
                      <div className="w-full sm:col-span-1 md:w-auto order-3">
                        <Link href="/cart" className="block w-full">
                          <motion.div
                            className="bg-gray-50 border border-green4 text-green5 font-medium py-2.5 px-4 rounded-full
                                    flex items-center justify-center gap-2 hover:bg-green1 transition-all duration-300"
                            whileHover={{
                              scale: 1.02,
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <MdShoppingCart size={20} className="shrink-0" />
                            <span>عرض السلة</span>
                          </motion.div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Extra Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mt-2">
                    <div className="flex items-start">
                      <MdShield className="shrink-0 text-gray-500 ml-3 mt-1" size={20} />
                      <div className="text-sm text-gray-700">
                        <p className="font-medium mb-1">معلومات إضافية</p>
                        <p>الدفع عند الاستلام متاح في بغداد والمحافظات</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-right text-gray-800">منتجات ذات صلة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product, index) => (
                <Link href={`/products/${entryKey(product)}`} key={product.id} className="group h-full">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    <div className="relative pt-[100%]">
                      <Image
                        src={itemImageUrl(product)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={index < 2}
                      />
                      {isOutOfStock(product) && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          نفذت الكمية
                        </div>
                      )}
                      {/* Sale tag - Display only if sale is active */}
                      {isSaleActive(sale) && !isOutOfStock(product) && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                          -{sale.percent}%
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex-grow flex flex-col">
                      <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-green4 transition-colors text-right min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      <div className="text-right mt-auto">
                        {isOutOfStock(product) ? (
                          <span className="font-bold text-gray-400">غير متوفر</span>
                        ) : isSaleActive(sale) ? (
                          <div>
                            <span className="text-gray-500 line-through text-sm block">
                              {basePrice(product).toLocaleString()} د.ع
                            </span>
                            <span className="font-bold text-amber-600">
                              {calculateSalePrice(basePrice(product), sale).toLocaleString()} د.ع
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-green5">
                            {basePrice(product).toLocaleString()} د.ع
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
