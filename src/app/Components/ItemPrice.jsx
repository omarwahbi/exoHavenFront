"use client";
import { useSale } from "@/app/context/SaleContext";
import { isSaleActive, calculateSalePrice } from "@/utils/saleUtils";
import { basePrice, hasPriceRange, isOutOfStock } from "@/utils/product";

// An item's price for product cards: "غير متوفر" when out of stock, the original
// price struck through above the sale price while a sale runs, and "من" (from)
// before the lowest price when its variants cost different amounts.
export default function ItemPrice({ item }) {
  const sale = useSale();
  const outOfStock = isOutOfStock(item);
  const price = basePrice(item);
  const from = hasPriceRange(item) ? "من " : "";
  return (
    <span className={`font-bold ${outOfStock ? "text-gray-400" : ""}`}>
      {outOfStock ? (
        "غير متوفر"
      ) : isSaleActive(sale) ? (
        <div>
          <span className="text-gray-500 line-through text-xs block">{price.toLocaleString()} IQD</span>
          <span className="text-red-600">
            {from}
            {calculateSalePrice(price, sale).toLocaleString()} IQD
          </span>
        </div>
      ) : (
        `${from}${price.toLocaleString()} IQD`
      )}
    </span>
  );
}
