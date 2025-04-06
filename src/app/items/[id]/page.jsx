"use client";
import Spinner from "@/app/Components/Spinner";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useRef, useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEye, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { fetchSubCategoryById, fetchSubCategoryItems } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";

const Items = () => {
  const { id } = useParams();
  const router = useRouter();
  const observerRef = useRef(null);
  const [sortBy, setSortBy] = useState("newest");
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const { cart, dispatch } = useCart();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Fetch subcategory info for breadcrumbs
  const { data: subcategoryData, isLoading: isSubcategoryLoading } = useQuery({
    queryKey: QueryKeys.subcategory(id),
    queryFn: () => fetchSubCategoryById(id),
    enabled: !!id
  });

  useEffect(() => {
    if (subcategoryData?.data) {
      setSubcategoryName(subcategoryData.data.attributes.name || "");
      setCategoryName(subcategoryData.data.attributes.category?.data?.attributes?.name || "");
    }
  }, [subcategoryData]);

  const fetchItems = async ({ pageParam = 1 }) => {
    let sortQuery = "";
    
    switch (sortBy) {
      case "priceAsc":
        sortQuery = "state:asc";
        break;
      case "priceDesc":
        sortQuery = "state:desc";
        break;
      case "newest":
        sortQuery = "createdAt:desc";
        break;
      case "nameAsc":
        sortQuery = "name:asc";
        break;
      default:
        sortQuery = "createdAt:desc";
    }
    
    return fetchSubCategoryItems(id, pageParam, 12, sortQuery);
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: QueryKeys.subcategoryItems(id, sortBy),
      queryFn: fetchItems,
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage?.meta?.pagination?.page + 1;
        return nextPage <= lastPage?.meta?.pagination?.pageCount
          ? nextPage
          : undefined;
      },
    });

  useEffect(() => {
    if (sortBy) {
      refetch();
    }
  }, [sortBy, refetch]);

  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const items = data?.pages?.flatMap((page) => page.data) || [];
  const isPageLoading = isLoading || isSubcategoryLoading;

  // Helper functions for cart
  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };
  
  const addToCart = (item) => {
    if (item.attributes.out_of_stock) return;
    dispatch({ type: "ADD_ITEM", payload: item });
  };
  
  const decreaseQuantity = (itemId) => {
    const itemInCart = cart.find(item => item.id === itemId);
    if (itemInCart && itemInCart.quantity === 1) {
      // If quantity is 1, remove the item completely
      dispatch({ type: "REMOVE_ITEM", payload: { id: itemId } });
    } else {
      // Otherwise just decrease the quantity
      dispatch({ type: "DECREASE_QUANTITY", payload: { id: itemId } });
    }
  };

  // Skeleton loading component
  const ItemSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 md:h-56 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  );

  // Render skeletons during loading
  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <ItemSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <div className="w-11/12 md:w-4/5 m-auto mt-8 mb-14">
      {/* Breadcrumbs */}
      {!isSubcategoryLoading && (
        <nav className="flex mb-6 text-sm md:text-base">
          <Link href="/" className="text-gray-500 hover:text-green4">
            الرئيسية
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          {categoryName && (
            <>
              <Link href="/categories" className="text-gray-500 hover:text-green4">
                {categoryName}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </>
          )}
          <span className="font-medium text-green5">{subcategoryName}</span>
        </nav>
      )}

      {items.length === 0 && !isPageLoading ? (
        <div className="text-center text-gray-500 py-20 text-lg">عذراً لا يوجد مواد هنا</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-green4 mb-4 md:mb-0">
              {subcategoryName || "المنتجات المتاحة"}
            </h1>
            
            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-green4"
              >
                <option value="newest">الأحدث</option>
                <option value="priceAsc">السعر: من الأقل للأعلى</option>
                <option value="priceDesc">السعر: من الأعلى للأقل</option>
                <option value="nameAsc">أبجدياً: أ-ي</option>
              </select>
            </div>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible" 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {isPageLoading ? (
              renderSkeletons()
            ) : (
              items.map((item, index) => {
                const quantityInCart = getItemQuantityInCart(item.id);
                
                return (
                  <motion.div 
                    key={item.id} 
                    variants={itemVariants}
                    ref={index === items.length - 1 ? lastItemRef : null}
                  >
                    <div className="h-full">
                      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                        <Link href={`/item/${item.id}`} className="block relative pt-[100%]">
                          <Image
                            src={item.attributes.item_thumbnail.data.attributes.url}
                            alt={item.attributes.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            priority
                          />
                          
                          {/* Quick action buttons */}
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                            <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-green4 hover:bg-green4 hover:text-white transition-colors">
                              <FaEye size={14} />
                            </button>
                          </div>
                          
                          {/* Out of stock badge */}
                          {item.attributes.out_of_stock && (
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 m-2 rounded">
                              نفذت الكمية
                            </div>
                          )}
                        </Link>
                        
                        <div className="p-3 flex-grow flex flex-col">
                          <Link href={`/item/${item.id}`}>
                            <h3 className="font-medium text-gray-800 mb-1 line-clamp-1 hover:text-green4 transition-colors">
                              {item.attributes.name}
                            </h3>
                          </Link>
                          
                          <div className="mt-auto pt-2 flex justify-between items-center">
                            <span className={`font-bold ${item.attributes.out_of_stock ? 'text-gray-400' : 'text-green4'}`}>
                              {item.attributes.out_of_stock
                                ? "غير متوفر"
                                : `${Number(item.attributes.state).toLocaleString()} د.ع`}
                            </span>
                            
                            {/* Cart interaction button */}
                            {item.attributes.out_of_stock ? (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 cursor-not-allowed">
                                <FaShoppingCart size={14} />
                              </div>
                            ) : quantityInCart > 0 ? (
                              <div className="flex items-center">
                                <motion.button 
                                  onClick={() => decreaseQuantity(item.id)}
                                  className="w-7 h-7 rounded-full bg-green1 flex items-center justify-center text-green4 hover:bg-green2 transition-colors"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <FaMinus size={10} />
                                </motion.button>
                                
                                <span className="mx-2 font-medium text-green4">{quantityInCart}</span>
                                
                                <motion.button 
                                  onClick={() => addToCart(item)}
                                  className="w-7 h-7 rounded-full bg-green4 flex items-center justify-center text-white hover:bg-green3 transition-colors"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <FaPlus size={10} />
                                </motion.button>
                              </div>
                            ) : (
                              <motion.button 
                                onClick={() => addToCart(item)}
                                className="w-8 h-8 rounded-full bg-green1 flex items-center justify-center text-green4 hover:bg-green4 hover:text-white transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaShoppingCart size={14} />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </>
      )}
      
      {isFetchingNextPage && (
        <div className="justify-center items-center flex mt-6">
          <Spinner />
        </div>
      )}
      
      {!isPageLoading && !hasNextPage && items.length > 0 && (
        <div className="text-center text-gray-500 mt-8 pb-4">
          لقد وصلت إلى نهاية القائمة
        </div>
      )}
    </div>
  );
};

export default Items;

