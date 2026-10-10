"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaShoppingCart, FaPlus, FaMinus, FaTag } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { useSale } from "@/app/context/SaleContext";
import { isSaleActive } from "@/utils/saleUtils";
import { itemImageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";
import ItemPrice from "@/app/Components/ItemPrice";
import { hasVariants, isOutOfStock } from "@/utils/product";
import StockBadge from "@/app/Components/StockBadge";

// A product in the /products list view.
export default function ProductListCard({ item }) {
  const sale = useSale();
  const { quantityOf, addItem, decreaseItem } = useCart();
  const quantityInCart = quantityOf(item);
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex flex-row h-full">
        <Link href={`/products/${entryKey(item)}`} className="relative w-1/3 sm:w-1/4">
          <Image
            src={itemImageUrl(item)}
            alt={item.name}
            width={200}
            height={200}
            className="object-cover w-full h-full aspect-square"
            priority
          />
          {isOutOfStock(item) && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 m-1 rounded">
              نفذت الكمية
            </div>
          )}

          {/* New arrival badge */}
          {item.new_arrival && !isOutOfStock(item) && (
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 m-1 rounded">
              جديد
            </div>
          )}

          {/* Sale badge */}
          {isSaleActive(sale) && !isOutOfStock(item) && (
            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 m-1 rounded animate-pulse">
              <FaTag className="inline-block ml-1" size={10} />
              خصم {sale.percent}%
            </div>
          )}
        </Link>

        <div className="flex-grow p-4 flex flex-col">
          <Link href={`/products/${entryKey(item)}`}>
            <h3 className="font-medium text-gray-800 mb-1 hover:text-green4 transition-colors">{item.name}</h3>
          </Link>
          <StockBadge item={item} className="self-start mb-2" />

          <p className="text-gray-500 text-sm line-clamp-2 mb-2">{item.description || "وصف المنتج غير متوفر"}</p>

          <div className="mt-auto flex justify-between items-center">
            <ItemPrice item={item} />

            {/* Cart interaction for list view */}
            {isOutOfStock(item) ? (
              <button disabled className="px-3 py-1.5 bg-gray-200 text-gray-400 rounded-lg text-sm cursor-not-allowed">
                غير متوفر
              </button>
            ) : hasVariants(item) ? (
              // Variants are picked on the product page.
              <Link
                href={`/products/${entryKey(item)}`}
                className="px-3 py-1.5 bg-green1 text-green4 rounded-lg text-sm hover:bg-green4 hover:text-white transition-colors"
              >
                اختر النوع
              </Link>
            ) : quantityInCart > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-green2 rounded-full">
                  <motion.button
                    onClick={() => decreaseItem(item)}
                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-green4 hover:bg-green1 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaMinus size={10} />
                  </motion.button>

                  <span className="mx-2 font-medium text-green4">{quantityInCart}</span>

                  <motion.button
                    onClick={() => addItem(item)}
                    className="w-7 h-7 rounded-full bg-green4 flex items-center justify-center text-white hover:bg-green3 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaPlus size={10} />
                  </motion.button>
                </div>

                <span className="text-sm text-green4">في السلة</span>
              </div>
            ) : (
              <motion.button
                onClick={() => addItem(item)}
                className="px-3 py-1.5 bg-green1 text-green4 rounded-lg text-sm hover:bg-green4 hover:text-white transition-colors flex items-center gap-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <FaShoppingCart size={12} />
                <span>إضافة للسلة</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
