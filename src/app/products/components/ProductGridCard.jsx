"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye, FaPlus, FaMinus, FaTag } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { useSale } from "@/app/context/SaleContext";
import { isSaleActive } from "@/utils/saleUtils";
import { itemImageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";
import ItemPrice from "@/app/Components/ItemPrice";

// A product in the /products grid view.
export default function ProductGridCard({ item, index }) {
  const sale = useSale();
  const { quantityOf, addItem, decreaseItem } = useCart();
  const quantityInCart = quantityOf(item);
  return (
    <div className="h-full">
      <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        <Link href={`/products/${entryKey(item)}`} className="block relative pt-[100%]">
          <Image
            src={itemImageUrl(item)}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={index < 4}
          />

          {/* Quick action buttons */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
            <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-green4 hover:bg-green4 hover:text-white transition-colors">
              <FaEye size={14} />
            </button>
          </div>

          {/* Out of stock badge */}
          {item.out_of_stock && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 m-2 rounded">
              نفذت الكمية
            </div>
          )}

          {/* New arrival badge */}
          {item.new_arrival && !item.out_of_stock && (
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
              جديد
            </div>
          )}

          {/* Sale badge */}
          {isSaleActive(sale) && !item.out_of_stock && (
            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 m-2 rounded-full animate-pulse">
              <FaTag className="inline-block ml-1" size={10} />
              خصم {sale.percent}%
            </div>
          )}
        </Link>

        <div className="p-3 flex-grow flex flex-col">
          <Link href={`/products/${entryKey(item)}`}>
            <h3 className="font-medium text-gray-800 mb-1 line-clamp-1 hover:text-green4 transition-colors">
              {item.name}
            </h3>
          </Link>

          <div className="mt-auto pt-2 flex justify-between items-center">
            <ItemPrice item={item} />

            {/* Cart interaction button */}
            {item.out_of_stock ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 cursor-not-allowed">
                <FaShoppingCart size={14} />
              </div>
            ) : quantityInCart > 0 ? (
              <div className="flex items-center">
                <motion.button
                  onClick={() => decreaseItem(item)}
                  className="w-7 h-7 rounded-full bg-green1 flex items-center justify-center text-green4 hover:bg-green2 transition-colors"
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
            ) : (
              <motion.button
                onClick={() => addItem(item)}
                className="w-8 h-8 rounded-full bg-green1 flex items-center justify-center text-green4 hover:bg-green4 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingCart size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
