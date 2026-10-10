"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { flattenEntry } from "@/utils/strapi";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItemIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        // Item already exists in the cart, update the quantity
        const updatedCart = state.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return updatedCart;
      } else {
        // Item does not exist, add it with quantity 1
        return [...state, { ...action.payload, quantity: 1 }];
      }

    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload.id);

    case "DECREASE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      // Carts saved before the switch to Strapi 5 hold products in the old v4 shape.
      return storedCart ? flattenEntry(JSON.parse(storedCart)) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
