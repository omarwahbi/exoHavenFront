"use client";
import React, { useState, useEffect, useMemo } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShieldIcon from '@mui/icons-material/Shield';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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

export default function Page({ params }) {
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

  // Derived data using useMemo to prevent recreation on each render
  const itemImgs = useMemo(() => item?.attributes?.item_images?.data || [], [item]);
  const categoryId = item?.attributes?.category?.data?.id;

  // Fetch related products
  const { 
    data: relatedProducts = [] 
  } = useQuery({
    queryKey: QueryKeys.relatedProducts(categoryId, params.id),
    queryFn: () => fetchRelatedProducts(categoryId, params.id),
    enabled: !!categoryId && !!params.id
  });

  // Handle image selection and rotation
  useEffect(() => {
    if (itemImgs && itemImgs.length > 0) {
      setSelectedImage(itemImgs[activeIndex].attributes.url);
      
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
    setSelectedImage(itemImgs[index].attributes.url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] px-4 text-center">
        <div className="text-red-500 text-xl font-medium mb-4">
          Unable to load product information. Please try again later.
        </div>
        <Link href="/category" className="bg-green4 text-white px-6 py-2 rounded-md hover:bg-green3 transition-colors">
          العودة إلى المنتجات
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] px-4 text-center">
        <div className="text-yellow-500 text-xl font-medium mb-4">
          المنتج غير موجود
        </div>
        <Link href="/category" className="bg-green4 text-white px-6 py-2 rounded-md hover:bg-green3 transition-colors">
          العودة إلى المنتجات
        </Link>
      </div>
    );
  }

  return (
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
            <Link href="/category" className="text-gray-600 hover:text-green4">
              المنتجات
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-green5 font-bold">{item.attributes.name}</li>
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
                          src={img.attributes.url}
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
                            src={selectedImage || (itemImgs && itemImgs[0]?.attributes.url)}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain p-4"
                            alt={item.attributes.name}
                            priority
                            fetchPriority="high"
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Out of stock overlay */}
                      {item.attributes.out_of_stock && (
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
                      src={img.attributes.url} 
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
              {/* Product Item ID */}
              {item.attributes.Item_ID && (
                <div className="text-sm text-gray-600 mb-2">
                  رمز المنتج: {item.attributes.Item_ID}
                </div>
              )}

              {/* Product name */}
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                {item.attributes.name}
              </h1>

              {/* Availability tag */}
              <div className="mb-4">
                {item.attributes.out_of_stock ? (
                  <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                    غير متوفر
                  </span>
                ) : (
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    متوفر
                  </span>
                )}
                
                {/* New arrival tag */}
                {item.attributes.new_arrival && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-2">
                    وصل حديثاً
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="my-5">
                <span className="text-3xl font-bold text-green5">
                  {Number(item.attributes.state).toLocaleString()} 
                  <span className="text-lg font-medium mr-1">د.ع</span>
                </span>
              </div>

              {/* Description */}
              <div className="my-6">
                <h3 className="text-lg font-medium mb-2">وصف المنتج</h3>
                <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                  {item.attributes.description || "لا يوجد وصف متاح لهذا المنتج."}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <CheckCircleIcon className="ml-2 text-green-500" />
                  <span className="text-gray-700">منتج ذو جودة عالية</span>
                </div>

                <div className="flex items-center">
                  <LocalShippingIcon className="ml-2 text-blue-500" />
                  <span className="text-gray-700">توصيل سريع وآمن</span>
                </div>
                <div className="flex items-center">
                  <SupportAgentIcon className="ml-2 text-red-500" />
                  <span className="text-gray-700">خدمة عملاء متميزة</span>
                </div>
              </div>

              {/* Cart Actions */}
              <div className="flex flex-col gap-4 mt-6">
                {/* Add to Cart & Quantity Control - Responsive Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-4">
                  {/* Add to Cart Button - Full width on mobile, partial on larger screens */}
                  <div className="w-full sm:col-span-2 md:flex-1 order-1">
                    <AddToCartButton item={item} />
                  </div>
                  
                  {/* Quantity Control - Full width on mobile, auto on larger screens */}
                  <div className="w-full sm:col-span-1 md:w-auto order-2 flex justify-center sm:justify-start">
                    <Quantity item={item} removeOnZero={true} />
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
                          <ShoppingCartIcon fontSize="small" />
                          <span>عرض السلة</span>
                        </motion.div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Extra Info */}
                <div className="bg-gray-50 rounded-lg p-4 mt-2">
                  <div className="flex items-start">
                    <ShieldIcon className="text-gray-500 ml-3 mt-1" fontSize="small" />
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
              <Link href={`/item/${product.id}`} key={product.id} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="relative pt-[100%]">
                    <Image
                      src={product.attributes.item_thumbnail.data.attributes.url}
                      alt={product.attributes.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={index < 2}
                    />
                    {product.attributes.out_of_stock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        نفذت الكمية
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-1 group-hover:text-green4 transition-colors text-right">
                      {product.attributes.name}
                    </h3>
                    <div className="text-right">
                      <span className={`font-bold ${product.attributes.out_of_stock ? 'text-gray-400' : 'text-green5'}`}>
                        {product.attributes.out_of_stock
                          ? "غير متوفر"
                          : `${Number(product.attributes.state).toLocaleString()} د.ع`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
