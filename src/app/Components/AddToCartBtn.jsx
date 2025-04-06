"use client";

import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";

const AddToCartButton = ({ item }) => {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    if (item.attributes.out_of_stock || added) return;
    
    dispatch({ type: "ADD_ITEM", payload: item });
    setAdded(true);
    
    // Reset the animation after a delay
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const isOutOfStock = item.attributes.out_of_stock;
  // Button is disabled when out of stock OR when showing the success animation
  const isDisabled = isOutOfStock || added;

  return (
    <motion.button
      disabled={isDisabled}
      onClick={addToCart}
      className={`relative w-full flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 rounded-full font-medium transition-all duration-300 ${
        isOutOfStock
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : added
          ? "bg-green4 text-white border-2 border-green4 cursor-not-allowed"
          : "bg-white text-green4 hover:bg-green4 hover:text-white border-2 border-green4"
      }`}
      whileHover={!isDisabled ? { scale: 1.03 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      initial={false}
      animate={added ? { y: [0, -5, 0] } : {}}
    >
      {isOutOfStock ? (
        <span className="flex items-center text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          نافذ الكمية
        </span>
      ) : added ? (
        <motion.span 
          className="flex items-center text-sm sm:text-base"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaCheckCircle className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 mx-1" />
          تمت الإضافة
        </motion.span>
      ) : (
        <motion.span 
          className="flex items-center text-sm sm:text-base"
          initial={{ opacity: 1 }}
        >
          <FaShoppingCart className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 mx-1" />
          إضافة إلى العربة
        </motion.span>
      )}
      
      {!isOutOfStock && !added && (
        <motion.span
          className="absolute inset-0 rounded-full bg-green3/10"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default AddToCartButton;
