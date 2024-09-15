import React from "react";
import useCartActions from "../context/cartActions";
import { useCart } from "../context/CartContext";
export default function Quantity({ item }) {
  const { cart } = useCart();
  const { removeFromCart, decreaseQuantity, increaseQuantity, clearCart } =
    useCartActions();
  const getItemQuantityById = (cart, id) => {
    const item = cart.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const quantity = getItemQuantityById(cart, item.id);
  return (
    <div className="flex items-center justify-between md:order-3 md:justify-end">
      <div className="flex items-center">
        <button
          disabled={item.attributes.out_of_stock}
          type="button"
          onClick={() => decreaseQuantity(item.id)}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
        >
          <svg
            className="h-2.5 w-2.5 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h16"
            />
          </svg>
        </button>
        <input
          type="text"
          className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-600 focus:outline-none focus:ring-0"
          value={quantity}
          readOnly
        />
        <button
          disabled={item.attributes.out_of_stock}
          type="button"
          onClick={() => increaseQuantity(item)}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
        >
          <svg
            className="h-2.5 w-2.5 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
