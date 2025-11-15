"use client";

import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";

const AddToCartButton = ({ item }) => {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [particles, setParticles] = useState([]);

  const addToCart = (e) => {
    if (item.attributes.out_of_stock || added) return;

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();

    setRipples((prev) => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    // Create particle effect
    const particleArray = Array.from({ length: 8 }, (_, i) => ({
      id: `${rippleId}-${i}`,
      angle: (i * 360) / 8,
    }));
    setParticles(particleArray);

    dispatch({ type: "ADD_ITEM", payload: item });
    setAdded(true);

    // Reset the animation after a delay
    setTimeout(() => {
      setAdded(false);
      setParticles([]);
    }, 2000);
  };

  const isOutOfStock = item.attributes.out_of_stock;
  // Button is disabled when out of stock OR when showing the success animation
  const isDisabled = isOutOfStock || added;

  return (
    <motion.button
      disabled={isDisabled}
      onClick={addToCart}
      className={`relative w-full flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 rounded-full font-medium overflow-hidden transition-all duration-400 ${
        isOutOfStock
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : added
          ? "bg-gradient-to-r from-green4 to-green3 text-white border-2 border-green4 shadow-green cursor-not-allowed"
          : "bg-white text-green4 hover:bg-gradient-to-r hover:from-green4 hover:to-green3 hover:text-white border-2 border-green4 shadow-sm hover:shadow-green"
      }`}
      whileHover={!isDisabled ? { scale: 1.03, y: -2 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      initial={false}
      animate={added ? {
        y: [0, -8, 0],
        scale: [1, 1.05, 1]
      } : {}}
      transition={{
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1]
      }}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/40"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{
              width: 300,
              height: 300,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Particle effects */}
      <AnimatePresence>
        {added && particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-white"
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: Math.cos((particle.angle * Math.PI) / 180) * 40,
              y: Math.sin((particle.angle * Math.PI) / 180) * 40,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>

      {isOutOfStock ? (
        <span className="flex items-center text-sm sm:text-base relative z-10">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          نافذ الكمية
        </span>
      ) : added ? (
        <motion.span
          className="flex items-center text-sm sm:text-base relative z-10"
          initial={{ opacity: 0, scale: 0.5, rotateZ: -20 }}
          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 360, 360]
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            <FaCheckCircle className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 mx-1" />
          </motion.div>
          تمت الإضافة
        </motion.span>
      ) : (
        <motion.span
          className="flex items-center text-sm sm:text-base relative z-10"
          initial={{ opacity: 1 }}
        >
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <FaShoppingCart className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 mx-1" />
          </motion.div>
          إضافة إلى العربة
        </motion.span>
      )}

      {/* Background glow effect on hover */}
      {!isOutOfStock && !added && (
        <motion.span
          className="absolute inset-0 rounded-full bg-gradient-to-r from-green3/20 to-green4/20"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Success pulse effect */}
      {added && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-white"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{
            scale: [1, 1.2, 1.2],
            opacity: [0.8, 0, 0]
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      )}
    </motion.button>
  );
};

export default AddToCartButton;
