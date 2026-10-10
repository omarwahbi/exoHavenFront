"use client";

import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { flattenEntry } from "@/utils/strapi";
import { entryKey } from "@/utils/ids";

const CartContext = createContext();

// Cart lines are matched by documentId: Strapi 5 gives an entry a new numeric id
// every time it is published.
const sameItem = (a, b) => entryKey(a) === entryKey(b);

const cartReducer = (state, action) => {
  const { item } = action;
  switch (action.type) {
    case "ADD_ITEM":
      if (state.some((line) => sameItem(line, item))) {
        return state.map((line) =>
          sameItem(line, item) ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...state, { ...item, quantity: 1 }];

    // Decreasing a line at quantity 1 removes it.
    case "DECREASE_ITEM":
      return state
        .map((line) =>
          sameItem(line, item) ? { ...line, quantity: line.quantity - 1 } : line
        )
        .filter((line) => line.quantity > 0);

    case "REMOVE_ITEM":
      return state.filter((line) => !sameItem(line, item));

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

const loadCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const storedCart = localStorage.getItem("cart");
    // Carts saved before the switch to Strapi 5 hold products in the old v4 shape.
    const lines = storedCart ? flattenEntry(JSON.parse(storedCart)) : [];
    return Array.isArray(lines) ? lines : [];
  } catch {
    return [];
  }
};

const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], loadCart);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // Storage full or blocked: the cart still works for this visit.
    }
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      itemCount: cart.reduce((total, line) => total + line.quantity, 0),
      quantityOf: (item) => cart.find((line) => sameItem(line, item))?.quantity ?? 0,
      addItem: (item) => {
        if (!item.out_of_stock) dispatch({ type: "ADD_ITEM", item });
      },
      decreaseItem: (item) => dispatch({ type: "DECREASE_ITEM", item }),
      removeItem: (item) => dispatch({ type: "REMOVE_ITEM", item }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
