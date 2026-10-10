"use client";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { isSaleActive } from "@/utils/saleUtils";
import { useSale } from "@/app/context/SaleContext";

// Thin strip above the header while a sale runs (text and visibility are set in
// the admin's Sale settings). Visitors can dismiss it for this visit.
const SaleBanner = () => {
  const sale = useSale();
  const [isVisible, setIsVisible] = useState(true);

  if (!isSaleActive(sale) || !sale.show_banner || !isVisible) return null;

  return (
    <div className="relative bg-green5 text-white" dir="rtl" role="region" aria-label="عرض">
      <p className="container-page flex items-center justify-center gap-2 py-2 pl-10 text-center text-xs font-medium sm:text-sm">
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-green5">خصم {sale.percent}%</span>
        <span>{sale.banner_text}</span>
      </p>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        aria-label="إغلاق"
        className="absolute inset-y-0 left-2 my-auto flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default SaleBanner;
