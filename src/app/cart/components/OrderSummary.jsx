"use client";
import { motion } from "framer-motion";
import { MdLocalShipping, MdLocationOn } from "react-icons/md";
import ContinueOnWhatsApp from "@/app/Components/ContinueOnWhatsapp";
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD } from "@/utils/pricing";

// The cart's side panel: totals, delivery location, address, note and the
// WhatsApp order button.
export default function OrderSummary({
  cart,
  subtotal,
  grandTotal,
  deliveryLocation,
  setDeliveryLocation,
  userAddress,
  setUserAddress,
  addressError,
  setAddressError,
  orderNote,
  setOrderNote,
  orderMessage,
  validateAddress,
}) {
  return (
    <motion.div
      className="mt-8 lg:col-span-4 lg:mt-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sticky top-20">
        <div className="space-y-4" dir="rtl">
          <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-4">ملخص الطلب</h2>

          <div className="flex justify-between">
            <p className="text-gray-500">عدد المنتجات</p>
            <p className="font-medium text-gray-900">{cart.reduce((total, item) => total + item.quantity, 0)}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-600">إجمالي السلة</p>
            <p className="font-medium text-gray-900">
              {subtotal.toLocaleString("en-US")} <span className="text-sm font-normal">د.ع</span>
            </p>
          </div>

          {/* Delivery location selector */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <MdLocationOn className="shrink-0 ml-1 text-green4" size={20} />
              <p className="text-sm font-medium text-gray-700">موقع التوصيل</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse mb-3">
              <label className="flex items-center cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-green4 transition-colors">
                <input
                  type="radio"
                  name="deliveryLocation"
                  value="baghdad"
                  checked={deliveryLocation === "baghdad"}
                  onChange={() => setDeliveryLocation("baghdad")}
                  className="mr-2 accent-green4 w-4 h-4"
                />
                <span className="text-sm text-gray-700 mr-1">بغداد</span>
              </label>
              <label className="flex items-center cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-green4 transition-colors">
                <input
                  type="radio"
                  name="deliveryLocation"
                  value="other"
                  checked={deliveryLocation === "other"}
                  onChange={() => setDeliveryLocation("other")}
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
                placeholder={deliveryLocation === "baghdad" ? "بغداد-الكرخ-حي الجامعة" : "كربلاء-الحسينية"}
                className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg focus:outline-none transition-colors bg-white text-gray-900 ${
                  addressError
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                    : "border-gray-300 focus:border-green4 focus:ring-2 focus:ring-green4/30"
                }`}
                dir="rtl"
                required
              />
              {addressError ? (
                <p className="text-xs text-red-500 mt-1.5">يرجى إدخال عنوان التوصيل للمتابعة</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1.5">مثال: المحافظة-المدينة-الحي أو الشارع</p>
              )}
            </div>

            {/* Order note field */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">ملاحظة إضافية (اختياري)</label>
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
              <MdLocalShipping className="shrink-0 ml-2" size={20} />
              <p className="text-sm">
                {subtotal >= FREE_DELIVERY_THRESHOLD
                  ? "رسوم التوصيل"
                  : `رسوم التوصيل ${deliveryLocation === "baghdad" ? "(داخل بغداد)" : "(المحافظات الأخرى)"}`}
              </p>
            </div>
            {subtotal >= FREE_DELIVERY_THRESHOLD ? (
              <p className="text-sm font-medium bg-green-100 text-green5 px-2 py-0.5 rounded-full">مجاني</p>
            ) : (
              <p className="text-sm font-medium">{DELIVERY_FEES[deliveryLocation].toLocaleString("en-US")} د.ع</p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 pb-2">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">المجموع الكلي</p>
              <p className="text-xl font-bold text-green5">
                {grandTotal.toLocaleString("en-US")} <span className="text-sm font-normal">د.ع</span>
              </p>
            </div>
          </div>

          <ContinueOnWhatsApp messageText={orderMessage} totalPrice={grandTotal} onValidate={validateAddress} />

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>يتم تأكيد الطلب عبر واتساب</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
