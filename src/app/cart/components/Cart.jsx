"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MdShoppingCart, MdKeyboardBackspace, MdShoppingBag, MdLocalShipping } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/app/context/CartContext";
import { useSale } from "@/app/context/SaleContext";
import Spinner from "@/app/Components/Spinner";
import { fetchSuggestedItems } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { FREE_DELIVERY_THRESHOLD, cartSubtotal, deliveryFee } from "@/utils/pricing";
import { buildOrderMessage } from "@/utils/orderMessage";
import CartLine from "./CartLine";
import OrderSummary from "./OrderSummary";
import ProductCard from "@/app/Components/ProductCard";
import Breadcrumbs from "@/app/Components/Breadcrumbs";
import { isOutOfStock, lineKey } from "@/utils/product";

const Cart = () => {
  const sale = useSale();
  const { cart, loaded, removeItem, clearCart } = useCart();

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [clearCartConfirm, setClearCartConfirm] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('baghdad'); // 'baghdad' or 'other'
  const [userAddress, setUserAddress] = useState(''); // User's custom address
  const [addressError, setAddressError] = useState(false); // Track if address is required but empty
  const [orderNote, setOrderNote] = useState(''); // Optional note from user
  
  // Fetch suggested items using React Query
  const { 
    data: suggestedItems = []
  } = useQuery({
    queryKey: [QueryKeys.suggestedItems],
    // Products whose every variant is out of stock aren't suggested either.
    queryFn: () => fetchSuggestedItems(8).then((items) => items.filter((item) => !isOutOfStock(item))),
    enabled: cart.length === 0 // Only fetch suggested items when cart is empty
  });

  const confirmDelete = (key) => {
    setDeleteConfirm(key);
    // Auto-hide after 2 seconds
    setTimeout(() => {
      setDeleteConfirm(null);
    }, 2000);
  };

  const handleDelete = (item) => {
    if (deleteConfirm === lineKey(item)) {
      removeItem(item);
      setDeleteConfirm(null);
    } else {
      confirmDelete(lineKey(item));
    }
  };

  const confirmClearCart = () => {
    setClearCartConfirm(true);
    // Auto-hide after 2 seconds
    setTimeout(() => {
      setClearCartConfirm(false);
    }, 2000);
  };

  const handleClearCart = () => {
    if (clearCartConfirm) {
      clearCart();
      setClearCartConfirm(false);
    } else {
      confirmClearCart();
    }
  };

  const validateAddress = () => {
    const trimmedAddress = userAddress.trim();
    if (!trimmedAddress) {
      setAddressError(true);
      // Scroll to the address field
      const addressInput = document.querySelector('input[type="text"][required]');
      if (addressInput) {
        addressInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        addressInput.focus();
      }
      return false;
    }
    setAddressError(false);
    return true;
  };

  const subtotal = cartSubtotal(cart, sale);
  const fee = deliveryFee(subtotal, deliveryLocation);
  const grandTotal = subtotal + fee;
  const orderMessage = buildOrderMessage({
    cart,
    sale,
    subtotal,
    fee,
    location: deliveryLocation,
    address: userAddress,
    note: orderNote,
  });

  // Until the saved cart is read, show a spinner rather than "your cart is empty".
  if (!loaded) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren" 
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



  return (
    <section className="py-4 antialiased md:py-8">
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8">
        <Breadcrumbs className="mb-4" items={[{ label: "عربة التسوق" }]} />
        <div dir="rtl" className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <MdShoppingCart className="shrink-0 me-4 text-green4" size={24} />
            <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
              عربة التسوق
            </h1>
          </div>
          <Link href="/products" className="inline-flex items-center text-green4 hover:text-green3 transition-colors">
            <MdKeyboardBackspace className="shrink-0 ml-1" size={20} />
            <span>العودة إلى المنتجات</span>
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
            <motion.div 
              className="flex flex-col justify-center items-center min-h-[50vh] bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MdShoppingBag className="shrink-0 mb-6 text-gray-300" size="5rem" />
              <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-4">عربة التسوق فارغة!</h2>
              <p className="text-gray-500 mb-8 text-center">قم بإضافة بعض المنتجات لتظهر هنا</p>
              <Link href="/products">
                <motion.button 
                  className="px-6 py-3 bg-green4 text-white rounded-lg font-medium hover:bg-green3 transition-colors duration-300 flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MdShoppingCart className="shrink-0 ml-2" size={20} />
                  تصفح المنتجات
                </motion.button>
              </Link>

              {/* Suggested products when cart is empty */}
              {suggestedItems.length > 0 && (
                <div className="w-full mt-16">
                  <h3 className="text-lg font-medium text-gray-700 mb-6 text-center">منتجات قد تعجبك</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {suggestedItems.slice(0, 4).map((product, index) => (
                      <ProductCard key={product.id} item={product} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <>
              <div className="mt-6 sm:mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
                {/* Cart items - taking more space on desktop */}
                <motion.div 
                  className="lg:col-span-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Free delivery notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center" dir="rtl">
                      <MdLocalShipping size={24} className="shrink-0 text-green4 ml-2" />
                      <p className="text-sm text-gray-800">
                        {subtotal >= FREE_DELIVERY_THRESHOLD ? (
                          <span className="font-medium">تهانينا! لقد حصلت على توصيل مجاني في جميع أنحاء العراق!</span>
                        ) : (
                          <>
                            <span className="font-medium">توصيل مجاني</span> للطلبات التي تزيد عن {FREE_DELIVERY_THRESHOLD.toLocaleString()} د.ع في جميع أنحاء العراق. 
                            <span className="text-green4 font-medium mr-1">
                              أضف {(FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString()} د.ع أخرى للحصول على توصيل مجاني!
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {cart.map((item) => (
                      <CartLine
                        key={lineKey(item)}
                        item={item}
                        variants={itemVariants}
                        confirmingDelete={deleteConfirm === lineKey(item)}
                        onDelete={handleDelete}
                      />
                    ))}

                    <motion.div
                      className="flex justify-end mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <button
                        onClick={handleClearCart}
                        className={`text-sm font-medium flex items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                          clearCartConfirm 
                            ? "bg-red-100 text-red-600" 
                            : "text-red-600 hover:text-red-800 hover:bg-red-50"
                        }`}
                      >
                        <FaTrash className="h-3 w-3" />
                        {clearCartConfirm ? "تأكيد إفراغ السلة" : "إفراغ السلة"}
                      </button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Order summary - fixed width on desktop */}
                <OrderSummary
                  cart={cart}
                  subtotal={subtotal}
                  grandTotal={grandTotal}
                  deliveryLocation={deliveryLocation}
                  setDeliveryLocation={setDeliveryLocation}
                  userAddress={userAddress}
                  setUserAddress={setUserAddress}
                  addressError={addressError}
                  setAddressError={setAddressError}
                  orderNote={orderNote}
                  setOrderNote={setOrderNote}
                  orderMessage={orderMessage}
                  validateAddress={validateAddress}
                />
              </div>

              {/* Recommended Products - Display only in-stock items */}
              {suggestedItems.length > 0 && (
                <motion.div 
                  className="mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <h3 className="text-lg font-medium text-gray-800 px-4">منتجات قد تعجبك</h3>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {suggestedItems.slice(0, 4).map((product, index) => (
                      <ProductCard key={product.id} item={product} />
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Cart;
