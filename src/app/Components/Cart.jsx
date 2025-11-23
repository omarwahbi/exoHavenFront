"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import useCartActions from "../context/cartActions";
import ContinueOnWhatsApp from "./ContinueOnWhatsapp";
import Link from "next/link";
import Image from "next/image";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import Spinner from "./Spinner";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useQuery } from "@tanstack/react-query";
import { fetchSuggestedItems } from "@/services/api";
import { QueryKeys } from "@/utils/queryKeys";
import { calculateSalePrice, isSaleActive } from "@/utils/saleUtils";

const Cart = () => {
  const { cart } = useCart();
  const { removeFromCart, decreaseQuantity, increaseQuantity, clearCart } = useCartActions();

  const [totalState, setTotalState] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [clearCartConfirm, setClearCartConfirm] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('baghdad'); // 'baghdad' or 'other'
  const [userAddress, setUserAddress] = useState(''); // User's custom address
  const [addressError, setAddressError] = useState(false); // Track if address is required but empty
  const [orderNote, setOrderNote] = useState(''); // Optional note from user
  
  // Constants
  const BAGHDAD_DELIVERY_FEE = 5000;
  const OTHER_GOVERNORATES_DELIVERY_FEE = 6000;
  const FREE_DELIVERY_THRESHOLD = 50000;

  // Fetch suggested items using React Query
  const { 
    data: suggestedItems = []
  } = useQuery({
    queryKey: [QueryKeys.suggestedItems],
    queryFn: () => fetchSuggestedItems(4),
    enabled: cart.length === 0 // Only fetch suggested items when cart is empty
  });

  // Function to handle decreasing quantity (removes item at quantity 1)
  const handleDecrease = (itemId) => {
    const itemInCart = cart.find(item => item.id === itemId);
    if (itemInCart && itemInCart.quantity === 1) {
      removeFromCart(itemId);
    } else {
      decreaseQuantity(itemId);
    }
  };

  const confirmDelete = (itemId) => {
    setDeleteConfirm(itemId);
    // Auto-hide after 2 seconds
    setTimeout(() => {
      setDeleteConfirm(null);
    }, 2000);
  };

  const handleDelete = (itemId) => {
    if (deleteConfirm === itemId) {
      removeFromCart(itemId);
      setDeleteConfirm(null);
    } else {
      confirmDelete(itemId);
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

  const getDeliveryFee = () => {
    if (totalState >= FREE_DELIVERY_THRESHOLD) {
      return 0; // Free delivery for orders above the threshold regardless of location
    }
    return deliveryLocation === 'baghdad' ? BAGHDAD_DELIVERY_FEE : OTHER_GOVERNORATES_DELIVERY_FEE;
  };

  const getItemNamesWithQuantities = (cart) => {
    // Calculate total with sale prices if applicable
    const subtotal = cart.reduce((sum, item) => {
      const price = isSaleActive() ? calculateSalePrice(item.attributes.state) : item.attributes.state;
      return sum + price * item.quantity;
    }, 0);

    // Determine if delivery is free
    const isDeliveryFree = subtotal >= FREE_DELIVERY_THRESHOLD;
    const deliveryFee = isDeliveryFree ? 0 : (deliveryLocation === 'baghdad' ? BAGHDAD_DELIVERY_FEE : OTHER_GOVERNORATES_DELIVERY_FEE);
    const grandTotal = subtotal + deliveryFee;

    // Format each item detail with sale price if applicable
    const itemDetails = cart
      .map(
        (item) => {
          const price = isSaleActive() ? calculateSalePrice(item.attributes.state) : item.attributes.state;
          return `${item.attributes.name}\nالعدد: ${item.quantity}\nالسعر: ${(
            price * item.quantity
          ).toLocaleString()} IQD\n`;
        }
      )
      .join("\n- ");

    // Append total price and delivery fee to the end
    let deliveryText = '';
    if (isDeliveryFree) {
      deliveryText = 'مجاني';
    } else {
      deliveryText = `${deliveryFee.toLocaleString()} IQD ${deliveryLocation === 'baghdad' ? '(داخل بغداد)' : '(المحافظات الأخرى)'}`;
    }

    // Include address in the message
    const addressLine = userAddress ? `\nعنوان التوصيل: ${userAddress}` : '';

    // Include note if provided
    const noteLine = orderNote.trim() ? `\n\nملاحظة: ${orderNote.trim()}` : '';

    return `${itemDetails}\n\nإجمالي السلة: ${subtotal.toLocaleString()} IQD\nرسوم التوصيل: ${deliveryText}\nالمجموع الكلي: ${grandTotal.toLocaleString()} IQD${addressLine}${noteLine}`;
  };

  const itemsToMessage = getItemNamesWithQuantities(cart);

  const calculateTotalCost = (cart) => {
    return cart.reduce((total, item) => {
      let cost = parseInt(item.attributes.state, 10); // Convert state to an integer
      
      // Apply sale discount if active
      if (isSaleActive()) {
        cost = calculateSalePrice(cost);
      }
      
      if (!isNaN(cost)) {
        return total + cost * item.quantity; // Multiply by the quantity and add to total
      }
      return total;
    }, 0);
  };

  const calculateDeliveryFee = (subtotal) => {
    // Delivery is free if subtotal is >= FREE_DELIVERY_THRESHOLD
    if (subtotal >= FREE_DELIVERY_THRESHOLD) {
      return 0;
    }
    // Otherwise, return the fee based on location
    return deliveryLocation === 'baghdad' ? BAGHDAD_DELIVERY_FEE : OTHER_GOVERNORATES_DELIVERY_FEE;
  };

  const calculateGrandTotal = (subtotal) => {
    const deliveryFee = calculateDeliveryFee(subtotal);
    return subtotal + deliveryFee;
  };

  useEffect(() => {
    setIsClient(true); // Mark the component as client-side
    setLoading(false); // No longer need extra loading state since we use React Query
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

  if (loading) {
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

  // Product card component for consistent design
  const ProductCard = ({ product, index }) => (
    <Link href={`/item/${product.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
        <div className="relative pt-[100%]">
          <Image
            src={product.attributes.item_thumbnail.data.attributes.url}
            alt={product.attributes.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={index < 2}
            loading={index < 2 ? "eager" : "lazy"}
          />
          {product.attributes.out_of_stock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              نفذت الكمية
            </div>
          )}
          {product.attributes.new_arrival && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
              جديد
            </div>
          )}
          {/* Sale tag */}
          {isSaleActive() && !product.attributes.out_of_stock && (
            <div className="absolute top-2 left-2 bg-green4/20 border border-green4/40 text-green4 text-xs font-semibold px-2.5 py-1 rounded-full">
              -10%
            </div>
          )}
        </div>
        <div className="p-3 flex-grow flex flex-col">
          <h4 className="font-medium text-gray-800 mb-1 line-clamp-1 group-hover:text-green4 transition-colors text-right">
            {product.attributes.name}
          </h4>
          {product.attributes.description && (
            <p className="text-gray-500 text-xs line-clamp-2 mb-2 text-right">
              {product.attributes.description}
            </p>
          )}
          <div className="mt-auto text-right">
            {product.attributes.out_of_stock ? (
              <span className="font-bold text-gray-400">غير متوفر</span>
            ) : isSaleActive() ? (
              <div>
                <span className="text-gray-500 line-through text-xs block">
                  {Number(product.attributes.state).toLocaleString()} IQD
                </span>
                <span className="font-bold text-red-600">
                  {calculateSalePrice(product.attributes.state).toLocaleString()} IQD
                </span>
              </div>
            ) : (
              <span className="font-bold text-green4">
                {Number(product.attributes.state).toLocaleString()} IQD
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <section className="py-4 antialiased md:py-8">
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8">
        <div dir="rtl" className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <ShoppingCartIcon className="me-4 text-green4" fontSize="medium" />
            <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
              عربة التسوق
            </h1>
          </div>
          <Link href="/category" className="inline-flex items-center text-green4 hover:text-green3 transition-colors">
            <KeyboardBackspaceIcon className="ml-1" fontSize="small" />
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
              <ShoppingBagIcon className="mb-6 text-gray-300" style={{ fontSize: '5rem' }} />
              <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-4">عربة التسوق فارغة!</h2>
              <p className="text-gray-500 mb-8 text-center">قم بإضافة بعض المنتجات لتظهر هنا</p>
              <Link href="/category">
                <motion.button 
                  className="px-6 py-3 bg-green4 text-white rounded-lg font-medium hover:bg-green3 transition-colors duration-300 flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCartIcon className="ml-2" fontSize="small" />
                  تصفح المنتجات
                </motion.button>
              </Link>

              {/* Suggested products when cart is empty */}
              {suggestedItems.length > 0 && (
                <div className="w-full mt-16">
                  <h3 className="text-lg font-medium text-gray-700 mb-6 text-center">منتجات قد تعجبك</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {suggestedItems.slice(0, 4).map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
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
                      <LocalShippingIcon className="text-green4 ml-2" />
                      <p className="text-sm text-gray-800">
                        {totalState >= FREE_DELIVERY_THRESHOLD ? (
                          <span className="font-medium">تهانينا! لقد حصلت على توصيل مجاني في جميع أنحاء العراق!</span>
                        ) : (
                          <>
                            <span className="font-medium">توصيل مجاني</span> للطلبات التي تزيد عن {FREE_DELIVERY_THRESHOLD.toLocaleString()} IQD في جميع أنحاء العراق. 
                            <span className="text-green4 font-medium mr-1">
                              أضف {(FREE_DELIVERY_THRESHOLD - totalState).toLocaleString()} IQD أخرى للحصول على توصيل مجاني!
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="space-y-4 md:flex md:items-center md:gap-6 md:space-y-0">
                          <Link
                            href={`/item/${item.id}`}
                            className="shrink-0 md:order-1"
                          >
                            <div className="overflow-hidden rounded-lg">
                              <Image
                                className="h-20 w-20 object-cover transition-transform duration-300 hover:scale-110"
                                src={
                                  item.attributes.item_thumbnail.data.attributes.url
                                }
                                alt={item.attributes.name}
                                width={80}
                                height={80}
                                priority
                              />
                            </div>
                          </Link>

                          <div className="w-full min-w-0 flex-1 md:order-2 md:max-w-md">
                            <div className="flex justify-between">
                              <Link
                                href={`/item/${item.id}`}
                                className="text-lg font-bold text-gray-900 hover:text-green4"
                              >
                                {item.attributes.name}
                              </Link>
                            </div>
                  
                            {item.attributes.description && (
                              <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                {item.attributes.description}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col md:items-end md:order-3 gap-4">
                            <div className="flex items-center gap-4 justify-between md:justify-end w-full">
                              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                                <motion.button
                                  type="button"
                                  onClick={() => handleDecrease(item.id)}
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:bg-gray-200 focus:outline-none"
                                  whileTap={{ scale: 0.9 }}
                                  aria-label="تقليل الكمية"
                                >
                                  <FaMinus className="h-3 w-3" />
                                </motion.button>
                                <span className="w-10 text-center text-sm font-medium text-gray-700">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  type="button"
                                  onClick={() => increaseQuantity(item)}
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green4 text-white shadow-sm hover:bg-green3 focus:outline-none"
                                  whileTap={{ scale: 0.9 }}
                                  aria-label="زيادة الكمية"
                                >
                                  <FaPlus className="h-3 w-3" />
                                </motion.button>
                              </div>
                              <div className="text-end whitespace-nowrap">
                                <p className="text-base font-bold text-gray-900">
                                  {isSaleActive() ? (
                                    <>
                                      <span className="text-sm font-normal line-through text-gray-500 block">
                                        {(item.attributes.state * item.quantity).toLocaleString()} IQD
                                      </span>
                                      <span className="text-red-600">
                                        {(calculateSalePrice(item.attributes.state) * item.quantity).toLocaleString()}{" "}
                                        <span className="text-sm font-normal">IQD</span>
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      {(item.attributes.state * item.quantity).toLocaleString()}{" "}
                                      <span className="text-sm font-normal">IQD</span>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            <motion.button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className={`inline-flex items-center text-sm font-medium px-2 py-1 rounded-full self-end ${deleteConfirm === item.id ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="إزالة من السلة"
                            >
                              {deleteConfirm === item.id ? (
                                <>
                                  <span className="mr-1 text-xs">تأكيد</span>
                                  <DeleteOutlineIcon fontSize="small" />
                                </>
                              ) : (
                                <>
                                  <span className="mr-1 text-xs">حذف</span>
                                  <DeleteOutlineIcon fontSize="small" />
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
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
                <motion.div 
                  className="mt-8 lg:col-span-4 lg:mt-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sticky top-20">
                    <div className="space-y-4" dir="rtl">
                      <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-4">
                        ملخص الطلب
                      </h2>
                      
                      <div className="flex justify-between">
                        <p className="text-gray-500">عدد المنتجات</p>
                        <p className="font-medium text-gray-900">
                          {cart.reduce((total, item) => total + item.quantity, 0)}
                        </p>
                      </div>
                      
                      <div className="flex justify-between">
                        <p className="text-gray-600">إجمالي السلة</p>
                        <p className="font-medium text-gray-900">
                          {totalState.toLocaleString()} <span className="text-sm font-normal">د.ع</span>
                        </p>
                      </div>
                      
                      {/* Delivery location selector */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <LocationOnIcon className="ml-1 text-green4" fontSize="small" />
                          <p className="text-sm font-medium text-gray-700">موقع التوصيل</p>
                        </div>
                        <div className="flex items-center space-x-4 space-x-reverse mb-3">
                          <label className="flex items-center cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-green4 transition-colors">
                            <input
                              type="radio"
                              name="deliveryLocation"
                              value="baghdad"
                              checked={deliveryLocation === 'baghdad'}
                              onChange={() => setDeliveryLocation('baghdad')}
                              className="mr-2 accent-green4 w-4 h-4"
                            />
                            <span className="text-sm text-gray-700 mr-1">بغداد</span>
                          </label>
                          <label className="flex items-center cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-green4 transition-colors">
                            <input
                              type="radio"
                              name="deliveryLocation"
                              value="other"
                              checked={deliveryLocation === 'other'}
                              onChange={() => setDeliveryLocation('other')}
                              className="mr-2 accent-green4 w-4 h-4"
                            />
                            <span className="text-sm text-gray-700 mr-1">المحافظات الأخرى</span>
                          </label>
                        </div>

                        {/* Address input field */}
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            عنوان التوصيل <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={userAddress}
                            onChange={(e) => {
                              setUserAddress(e.target.value);
                              if (addressError && e.target.value.trim()) {
                                setAddressError(false);
                              }
                            }}
                            placeholder={deliveryLocation === 'baghdad' ? 'بغداد-الكرخ-حي الجامعة' : 'كربلاء-الحسينية'}
                            className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg focus:outline-none transition-colors bg-white text-gray-900 ${
                              addressError
                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                                : 'border-gray-300 focus:border-green4 focus:ring-2 focus:ring-green4/30'
                            }`}
                            dir="rtl"
                            required
                          />
                          {addressError ? (
                            <p className="text-xs text-red-500 mt-1.5">
                              يرجى إدخال عنوان التوصيل للمتابعة
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500 mt-1.5">مثال: المحافظة-المدينة-الحي أو الشارع</p>
                          )}
                        </div>

                        {/* Order note field */}
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            ملاحظة إضافية (اختياري)
                          </label>
                          <textarea
                            value={orderNote}
                            onChange={(e) => setOrderNote(e.target.value)}
                            placeholder="أضف أي ملاحظة إضافية"
                            className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green4 focus:ring-2 focus:ring-green4/30 transition-colors bg-white text-gray-900 resize-none"
                            dir="rtl"
                            rows="3"
                          />
                          <p className="text-xs text-gray-500 mt-1.5">مثال: أفضل وقت للتوصيل، تعليمات خاصة، إلخ.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 text-green4">
                        <div className="flex items-center">
                          <LocalShippingIcon className="ml-2" fontSize="small" />
                          <p className="text-sm">
                            {totalState >= FREE_DELIVERY_THRESHOLD 
                              ? 'رسوم التوصيل' 
                              : `رسوم التوصيل ${deliveryLocation === 'baghdad' ? '(داخل بغداد)' : '(المحافظات الأخرى)'}`}
                          </p>
                        </div>
                        {totalState >= FREE_DELIVERY_THRESHOLD ? (
                          <p className="text-sm font-medium bg-green-100 text-green5 px-2 py-0.5 rounded-full">مجاني</p>
                        ) : (
                          <p className="text-sm font-medium">
                            {(deliveryLocation === 'baghdad' ? BAGHDAD_DELIVERY_FEE : OTHER_GOVERNORATES_DELIVERY_FEE).toLocaleString()} د.ع
                          </p>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4 pb-2">
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-gray-900">المجموع الكلي</p>
                          <p className="text-xl font-bold text-green5">
                            {calculateGrandTotal(totalState).toLocaleString()} <span className="text-sm font-normal">د.ع</span>
                          </p>
                        </div>
                      </div>
                      
                      <ContinueOnWhatsApp
                        messageText={itemsToMessage}
                        totalPrice={calculateGrandTotal(totalState)}
                        onValidate={validateAddress}
                      />
                      
                      <div className="mt-4 text-center text-sm text-gray-500">
                        <p>يتم تأكيد الطلب عبر واتساب</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
                      <ProductCard key={product.id} product={product} index={index} />
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
