"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MdDeleteOutline } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { useSale } from "@/app/context/SaleContext";
import { calculateSalePrice, isSaleActive } from "@/utils/saleUtils";
import { itemImageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";
import { basePrice } from "@/utils/product";

// One product in the cart, with its quantity controls and a delete button that
// asks for confirmation (`confirmingDelete`) before removing it.
export default function CartLine({ item, variants, confirmingDelete, onDelete }) {
  const sale = useSale();
  const { addItem, decreaseItem } = useCart();
  return (
    <motion.div
      key={entryKey(item)}
      variants={variants}
      className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6 hover:shadow-md transition-shadow duration-300"
    >
      <div className="space-y-4 md:flex md:items-center md:gap-6 md:space-y-0">
        <Link href={`/products/${entryKey(item)}`} className="shrink-0 md:order-1">
          <div className="overflow-hidden rounded-lg">
            <Image
              className="h-20 w-20 object-cover transition-transform duration-300 hover:scale-110"
              src={itemImageUrl(item)}
              alt={item.name}
              width={80}
              height={80}
              priority
            />
          </div>
        </Link>

        <div className="w-full min-w-0 flex-1 md:order-2 md:max-w-md">
          <div className="flex justify-between">
            <Link href={`/products/${entryKey(item)}`} className="text-lg font-bold text-gray-900 hover:text-green4">
              {item.name}
            </Link>
          </div>
          {item.variant && (
            <span className="mt-1 inline-block rounded-full bg-green1 px-2.5 py-0.5 text-xs font-medium text-green5">
              {item.variant.label}
            </span>
          )}

          {item.description && <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.description}</p>}
        </div>

        <div className="flex flex-col md:items-end md:order-3 gap-4">
          <div className="flex items-center gap-4 justify-between md:justify-end w-full">
            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
              <motion.button
                type="button"
                onClick={() => decreaseItem(item)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:bg-gray-200 focus:outline-none"
                whileTap={{ scale: 0.9 }}
                aria-label="تقليل الكمية"
              >
                <FaMinus className="h-3 w-3" />
              </motion.button>
              <span className="w-10 text-center text-sm font-medium text-gray-700">{item.quantity}</span>
              <motion.button
                type="button"
                onClick={() => addItem(item)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green4 text-white shadow-sm hover:bg-green3 focus:outline-none"
                whileTap={{ scale: 0.9 }}
                aria-label="زيادة الكمية"
              >
                <FaPlus className="h-3 w-3" />
              </motion.button>
            </div>
            <div className="text-end whitespace-nowrap">
              <p className="text-base font-bold text-gray-900">
                {isSaleActive(sale) ? (
                  <>
                    <span className="text-sm font-normal line-through text-gray-500 block">
                      {(basePrice(item, item.variant) * item.quantity).toLocaleString()} IQD
                    </span>
                    <span className="text-red-600">
                      {(calculateSalePrice(basePrice(item, item.variant), sale) * item.quantity).toLocaleString()}{" "}
                      <span className="text-sm font-normal">IQD</span>
                    </span>
                  </>
                ) : (
                  <>
                    {(basePrice(item, item.variant) * item.quantity).toLocaleString()} <span className="text-sm font-normal">IQD</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={() => onDelete(item)}
            className={`inline-flex items-center text-sm font-medium px-2 py-1 rounded-full self-end ${confirmingDelete ? "bg-red-100 text-red-600" : "text-gray-500 hover:text-red-600"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="إزالة من السلة"
          >
            {confirmingDelete ? (
              <>
                <span className="mr-1 text-xs">تأكيد</span>
                <MdDeleteOutline size={20} className="shrink-0" />
              </>
            ) : (
              <>
                <span className="mr-1 text-xs">حذف</span>
                <MdDeleteOutline size={20} className="shrink-0" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
