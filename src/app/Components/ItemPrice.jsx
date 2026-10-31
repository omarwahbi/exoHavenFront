"use client";
import { useSale } from "@/app/context/SaleContext";
import { isSaleActive, calculateSalePrice } from "@/utils/saleUtils";

// An item's price for product cards: "غير متوفر" when out of stock, the original
// price struck through above the sale price while a sale runs.
export default function ItemPrice({ item }) {
  const sale = useSale();
  return (
    <span className={`font-bold ${item.out_of_stock ? "text-gray-400" : ""}`}>
      {item.out_of_stock ? (
        "غير متوفر"
      ) : isSaleActive(sale) ? (
        <div>
          <span className="text-gray-500 line-through text-xs block">{Number(item.state).toLocaleString()} IQD</span>
          <span className="text-red-600">{calculateSalePrice(item.state, sale).toLocaleString()} IQD</span>
        </div>
      ) : (
        `${Number(item.state).toLocaleString()} IQD`
      )}
    </span>
  );
}
