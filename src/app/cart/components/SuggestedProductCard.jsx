"use client";
import Link from "next/link";
import Image from "next/image";
import { useSale } from "@/app/context/SaleContext";
import { calculateSalePrice, isSaleActive } from "@/utils/saleUtils";
import { itemImageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";

// A "you may also like" product under the cart.
export default function SuggestedProductCard({ product, index }) {
  const sale = useSale();
  return (
    <Link href={`/products/${entryKey(product)}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
        <div className="relative pt-[100%]">
          <Image
            src={itemImageUrl(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={index < 2}
            loading={index < 2 ? "eager" : "lazy"}
          />
          {product.out_of_stock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              نفذت الكمية
            </div>
          )}
          {product.new_arrival && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">جديد</div>
          )}
          {/* Sale tag */}
          {isSaleActive(sale) && !product.out_of_stock && (
            <div className="absolute top-2 left-2 bg-green4/20 border border-green4/40 text-green4 text-xs font-semibold px-2.5 py-1 rounded-full">
              -{sale.percent}%
            </div>
          )}
        </div>
        <div className="p-3 flex-grow flex flex-col">
          <h4 className="font-medium text-gray-800 mb-1 line-clamp-1 group-hover:text-green4 transition-colors text-right">
            {product.name}
          </h4>
          {product.description && (
            <p className="text-gray-500 text-xs line-clamp-2 mb-2 text-right">{product.description}</p>
          )}
          <div className="mt-auto text-right">
            {product.out_of_stock ? (
              <span className="font-bold text-gray-400">غير متوفر</span>
            ) : isSaleActive(sale) ? (
              <div>
                <span className="text-gray-500 line-through text-xs block">
                  {Number(product.state).toLocaleString()} IQD
                </span>
                <span className="font-bold text-red-600">
                  {calculateSalePrice(product.state, sale).toLocaleString()} IQD
                </span>
              </div>
            ) : (
              <span className="font-bold text-green4">{Number(product.state).toLocaleString()} IQD</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
