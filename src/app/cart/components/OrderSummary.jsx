"use client";
import { motion } from "framer-motion";
import { MdLocalShipping, MdLocationOn } from "react-icons/md";
import ContinueOnWhatsApp from "@/app/Components/ContinueOnWhatsapp";
import { FREE_DELIVERY_THRESHOLD } from "@/utils/pricing";
import { toEnglishDigits } from "@/utils/orderMessage";

// The cart's side panel: totals, the customer's name, phone and address, a note
// and the WhatsApp order button.
export default function OrderSummary({
  cart,
  subtotal,
  grandTotal,
  fee,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  userAddress,
  setUserAddress,
  fieldError,
  setFieldError,
  orderNote,
  setOrderNote,
  orderMessage,
  validateOrder,
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
              {subtotal.toLocaleString()} <span className="text-sm font-normal">د.ع</span>
            </p>
          </div>

          {/* Customer details */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <MdLocationOn className="shrink-0 ml-1 text-green4" size={20} />
              <p className="text-sm font-medium text-gray-700">معلومات التوصيل</p>
            </div>

            <OrderField
              id="order-name"
              label="الاسم"
              value={customerName}
              onChange={setCustomerName}
              placeholder="الاسم الكامل"
              autoComplete="name"
              error={fieldError === "name" && "يرجى إدخال الاسم للمتابعة"}
              onFix={() => fieldError === "name" && setFieldError(null)}
            />

            <OrderField
              id="order-phone"
              label="رقم الهاتف"
              value={customerPhone}
              // Digits typed in Arabic show as English ones (as in the WhatsApp message).
              onChange={(value) => setCustomerPhone(toEnglishDigits(value))}
              placeholder="07xx xxx xxxx"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              error={fieldError === "phone" && "يرجى إدخال رقم هاتف صحيح، مثال: 07801234567"}
              hint="سنتواصل معك على هذا الرقم لتأكيد الطلب"
              onFix={() => fieldError === "phone" && setFieldError(null)}
            />

            <OrderField
              id="order-address"
              label="عنوان التوصيل"
              value={userAddress}
              onChange={setUserAddress}
              placeholder="بغداد-الكرخ-حي الجامعة"
              autoComplete="street-address"
              error={fieldError === "address" && "يرجى إدخال عنوان التوصيل للمتابعة"}
              hint="مثال: المحافظة-المدينة-الحي أو الشارع"
              onFix={() => fieldError === "address" && setFieldError(null)}
            />

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
                {subtotal >= FREE_DELIVERY_THRESHOLD ? "رسوم التوصيل" : "رسوم التوصيل (لجميع المحافظات)"}
              </p>
            </div>
            {subtotal >= FREE_DELIVERY_THRESHOLD ? (
              <p className="text-sm font-medium bg-green-100 text-green5 px-2 py-0.5 rounded-full">مجاني</p>
            ) : (
              <p className="text-sm font-medium">{fee.toLocaleString()} د.ع</p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 pb-2">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">المجموع الكلي</p>
              <p className="text-xl font-bold text-green5">
                {grandTotal.toLocaleString()} <span className="text-sm font-normal">د.ع</span>
              </p>
            </div>
          </div>

          <ContinueOnWhatsApp messageText={orderMessage} totalPrice={grandTotal} onValidate={validateOrder} />

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>يتم تأكيد الطلب عبر واتساب</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// A required field of the order form, in the style the address field always had:
// a red border and message when it's missing or wrong.
function OrderField({ id, label, value, onChange, error, hint, onFix, dir = "rtl", ...inputProps }) {
  return (
    <div className="mt-3">
      <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onFix();
        }}
        className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg focus:outline-none transition-colors bg-white text-gray-900 ${
          dir === "ltr" ? "text-right" : ""
        } ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
            : "border-gray-300 focus:border-green4 focus:ring-2 focus:ring-green4/30"
        }`}
        dir={dir}
        required
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
      {error ? (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      ) : (
        hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>
      )}
    </div>
  );
}
