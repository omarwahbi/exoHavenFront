"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import useCartActions from "../context/cartActions";
import ContinueOnWhatsApp from "./ContinueOnWhatsapp";
import Link from "next/link";
import Image from "next/image";

const Cart = () => {
  const { cart } = useCart();
  const { removeFromCart, decreaseQuantity, increaseQuantity, clearCart } =
    useCartActions();

  const [totalState, setTotalState] = useState(0);
  const [items, setItems] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const getItemNamesWithQuantities = (cart) => {
    // Calculate the total price
    const totalPrice = cart.reduce((sum, item) => {
      return sum + item.attributes.state * item.quantity;
    }, 0);

    // Format each item detail
    const itemDetails = cart
      .map(
        (item) =>
          `${item.attributes.name}\nالعدد: ${item.quantity}\nالسعر: ${(
            item.attributes.state * item.quantity
          ).toLocaleString()} IQD\n`
      )
      .join("\n- ");

    // Append total price to the end
    return `${itemDetails}\n\nإجمالي السعر بدون توصيل: ${totalPrice.toLocaleString()} IQD`;
  };

  const itemsToMessage = getItemNamesWithQuantities(cart);

  const calculateTotalCost = (cart) => {
    return cart.reduce((total, item) => {
      const cost = parseInt(item.attributes.state, 10); // Convert state to an integer
      if (!isNaN(cost)) {
        return total + cost * item.quantity; // Multiply by the quantity and add to total
      }
      return total;
    }, 0);
  };

  const fetchItems = async () => {
    try {
      const url = `https://exohavenbackend.onrender.com/api/items?pagination[limit]=3`; // Adjust the limit or URL as needed
      const response = await fetch(url);
      const data = await response.json();
      setItems(data.data); // Store fetched items in state
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    setIsClient(true); // Mark the component as client-side
    fetchItems(); // Fetch items when the component mounts
  }, []);

  useEffect(() => {
    // Update the total state whenever the cart changes
    const total = calculateTotalCost(cart);
    setTotalState(total);
  }, [cart]);

  if (!isClient) {
    // Render nothing on server-side to avoid mismatch
    return null;
  }

  return (
    <section className="py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-green4 sm:text-2xl">
          Shopping Cart
        </h2>
        {cart.length === 0 ? (
          <h1>Your cart is empty add some items now!</h1>
        ) : (
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-green-4 dark:bg-green3 md:p-6"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <Link
                        href={`/item/${item.id}`}
                        className="shrink-0 md:order-1"
                      >
                        <Image
                          className="h-20 w-20 dark:hidden"
                          src={item.attributes.image}
                          alt={item.attributes.name}
                          width={80}
                          height={80}
                        />
                        <Image
                          className="hidden h-20 w-20 dark:block"
                          src={item.attributes.image}
                          alt={item.attributes.name}
                          width={80}
                          height={80}
                        />
                      </Link>

                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <div className="flex items-center">
                          <button
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
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h16"
                              />
                            </svg>
                          </button>
                          <input
                            type="text"
                            className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-white focus:outline-none focus:ring-0"
                            value={item.quantity}
                            readOnly
                          />
                          <button
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
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 1v16M1 9h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="text-end md:order-4 md:w-32">
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            {(
                              item.attributes.state * item.quantity
                            ).toLocaleString()}{" "}
                            IQD
                          </p>
                        </div>
                      </div>

                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <Link
                          href={`/item/${item.id}`}
                          className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                        >
                          {item.attributes.name}
                        </Link>

                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="inline-flex items-center text-sm font-bold text-red-900 hover:underline dark:text-red-500"
                          >
                            <svg
                              className="me-1.5 h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L17.94 6M18 18L6.06 6"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden xl:mt-8 xl:block">
                <h3 className="text-2xl font-semibold text-green4">
                  People also bought
                </h3>
                <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                  {items.map((item) => (
                    <Link key={item.id} href={`/item/${item.id}`}>
                      <div className="mb-14 relative">
                        <div className="justify-center flex">
                          <Image
                            className="h-auto max-w-full rounded-lg"
                            src={item.attributes.image}
                            alt={item.attributes.name}
                            width={300}
                            height={300}
                          />
                        </div>
                        <div className="absolute bottom-8 right-2 bg-black bg-opacity-50 text-white text-base p-2 rounded-e-3xl">
                          {item.attributes.state}
                        </div>
                        <p className="text-center">{item.attributes.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 sm:mt-10 lg:sticky lg:top-16 lg:mt-0 lg:w-full lg:max-w-sm lg:flex-none">
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-green-4 dark:bg-green3 md:p-6">
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      {totalState.toLocaleString()} IQD
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-green-4 dark:bg-green3 md:p-6">
                  <button
                    onClick={clearCart}
                    className="w-full text-xl font-bold text-red-900 hover:underline dark:text-red-500"
                  >
                    Clear Cart
                  </button>
                </div>
                <div>
                  <ContinueOnWhatsApp message={itemsToMessage} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
