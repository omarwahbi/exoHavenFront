import React from "react";
import useCartActions from "../context/cartActions";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function Quantity({ item, removeOnZero = false }) {
  const { cart } = useCart();
  const { removeFromCart, decreaseQuantity, increaseQuantity, clearCart } =
    useCartActions();
    
  const getItemQuantityById = (cart, id) => {
    const item = cart.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const quantity = getItemQuantityById(cart, item.id);
  const isOutOfStock = item.attributes.out_of_stock;
  
  // Modified decrease function to handle removal at quantity 1
  const handleDecrease = () => {
    if (quantity === 1 && removeOnZero) {
      removeFromCart(item.id);
    } else {
      decreaseQuantity(item.id);
    }
  };
  
  return (
    <div className="flex items-center justify-between w-full sm:w-auto">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-1.5 sm:px-2 py-1">
        <motion.button
          disabled={isOutOfStock || quantity <= 0}
          type="button"
          onClick={handleDecrease}
          className={`flex h-7 sm:h-8 w-7 sm:w-8 shrink-0 items-center justify-center rounded-full shadow-sm focus:outline-none transition-colors duration-200 ${
            isOutOfStock || quantity <= 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          }`}
          whileTap={!isOutOfStock && quantity > 0 ? { scale: 0.9 } : {}}
        >
          <FaMinus className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
        </motion.button>
        
        <motion.div
          className="relative w-8 sm:w-10"
          initial={false}
          animate={{ scale: quantity > 0 ? [1.2, 1] : 1 }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="text"
            className="w-full border-0 bg-transparent text-center text-xs sm:text-sm font-bold text-gray-700 focus:outline-none focus:ring-0 dark:text-white"
            value={quantity}
            readOnly
          />
        </motion.div>
        
        <motion.button
          disabled={isOutOfStock}
          type="button"
          onClick={() => increaseQuantity(item)}
          className={`flex h-7 sm:h-8 w-7 sm:w-8 shrink-0 items-center justify-center rounded-full shadow-sm focus:outline-none transition-colors duration-200 ${
            isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green4 text-white hover:bg-green3"
          }`}
          whileTap={!isOutOfStock ? { scale: 0.9 } : {}}
        >
          <FaPlus className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
        </motion.button>
      </div>
      
      {quantity > 0 && (
        <div className="ml-3 sm:ml-4 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
          {item.attributes.state && (
            <span>
              {(item.attributes.state * quantity).toLocaleString()} IQD
            </span>
          )}
        </div>
      )}
    </div>
  );
}
