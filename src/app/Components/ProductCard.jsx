"use client";
import Image from "next/image";
import Link from "next/link";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { useSale } from "@/app/context/SaleContext";
import { isSaleActive, calculateSalePrice } from "@/utils/saleUtils";
import { basePrice, hasPriceRange, hasVariants, isLowStock, isOutOfStock } from "@/utils/product";
import { itemImageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";

// The product card used everywhere products are listed: image with badges, name,
// price (with the running sale), and a quick add / quantity control. Items with
// variants link to their page, where the shopper picks one.
export default function ProductCard({ item, priority = false, className = "" }) {
  const sale = useSale();
  const { quantityOf, addItem, decreaseItem } = useCart();
  const href = `/products/${entryKey(item)}`;
  const outOfStock = isOutOfStock(item);
  const onSale = isSaleActive(sale) && !outOfStock;
  const price = basePrice(item);
  const from = hasPriceRange(item) ? "من " : "";
  const quantity = hasVariants(item) ? 0 : quantityOf(item);

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover ${className}`}
    >
      <Link href={href} className="relative block aspect-square overflow-hidden bg-gray-50">
        <Image
          src={itemImageUrl(item)}
          alt={item.name || ""}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? "opacity-60 grayscale" : ""}`}
          priority={priority}
        />
        {/* Badges: start corner for state, end corner for the discount. */}
        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1">
          <div className="flex flex-col items-start gap-1">
            {outOfStock ? (
              <span className="badge bg-gray-900/80 text-white">نفذت الكمية</span>
            ) : isLowStock(item) ? (
              <span className="badge bg-amber-500 text-white">آخر قطعة</span>
            ) : item.new_arrival ? (
              <span className="badge bg-white/90 text-green5">جديد</span>
            ) : null}
          </div>
          {onSale && (
            <span className="badge bg-red-600 text-white" dir="ltr">
              -{sale.percent}%
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <Link href={href} className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-gray-900 hover:text-green5 sm:text-[15px]">
          {item.name}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="leading-tight">
            {outOfStock ? (
              <span className="text-sm font-semibold text-gray-400">غير متوفر</span>
            ) : (
              <>
                {onSale && (
                  <span className="block text-xs text-gray-400 line-through">{price.toLocaleString("en-US")} د.ع</span>
                )}
                <span className={`text-base font-bold ${onSale ? "text-red-600" : "text-gray-900"}`}>
                  <span className="text-xs font-medium text-gray-500">{from}</span>
                  {(onSale ? calculateSalePrice(price, sale) : price).toLocaleString("en-US")}
                  <span className="mr-1 text-xs font-medium">د.ع</span>
                </span>
              </>
            )}
          </div>

          {outOfStock ? null : hasVariants(item) ? (
            <Link href={href} className="btn-chip">
              اختر
            </Link>
          ) : quantity > 0 ? (
            <div className="flex items-center gap-1 rounded-full bg-green1 p-1">
              <button type="button" onClick={() => decreaseItem(item)} aria-label="إنقاص الكمية" className="qty-btn bg-white text-green5">
                <FaMinus size={9} />
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-bold text-green5">{quantity}</span>
              <button type="button" onClick={() => addItem(item)} aria-label="زيادة الكمية" className="qty-btn bg-green4 text-white">
                <FaPlus size={9} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => addItem(item)} aria-label={`أضف ${item.name} إلى السلة`} className="qty-btn h-9 w-9 bg-green4 text-white hover:bg-green5">
              <FaShoppingCart size={14} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
