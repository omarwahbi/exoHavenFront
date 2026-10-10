"use client";

import { createContext, useContext, useReducer, useEffect, useMemo, useState } from "react";
import { flattenEntry } from "@/utils/strapi";
import { entryKey } from "@/utils/ids";
import { cartVariant, hasVariants, isOutOfStock } from "@/utils/product";

const CartContext = createContext();

// Cart lines are matched by documentId (Strapi 5 gives an entry a new numeric id
// every time it is published) and, for items with variants, the variant's label.
const sameItem = (a, b) => entryKey(a) === entryKey(b) && (a.variant?.label ?? null) === (b.variant?.label ?? null);

export const cartReducer = (state, action) => {
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

    case "LOAD":
      return action.lines;

    default:
      return state;
  }
};

const loadCart = () => {
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
  // The server knows nothing about the visitor's cart, so the first render is
  // always empty (on the server and in the browser, so they match) and the saved
  // cart is loaded right after.
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch({ type: "LOAD", lines: loadCart() });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return; // don't overwrite the saved cart before it is read
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // Storage full or blocked: the cart still works for this visit.
    }
  }, [cart, loaded]);

  const value = useMemo(
    () => ({
      cart,
      loaded,
      itemCount: cart.reduce((total, line) => total + line.quantity, 0),
      // `variant` defaults to the one a cart line already carries.
      quantityOf: (item, variant = item.variant) =>
        cart.find((line) => sameItem(line, { ...item, variant }))?.quantity ?? 0,
      addItem: (item, variant = item.variant) => {
        if (hasVariants(item) && !variant) return; // the shopper must pick one
        if (isOutOfStock(item, variant)) return;
        // The line keeps the chosen variant, not the item's whole list.
        const { variants, ...line } = item;
        dispatch({ type: "ADD_ITEM", item: { ...line, variant: cartVariant(variant) } });
      },
      decreaseItem: (item) => dispatch({ type: "DECREASE_ITEM", item }),
      removeItem: (item) => dispatch({ type: "REMOVE_ITEM", item }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    }),
    [cart, loaded]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
