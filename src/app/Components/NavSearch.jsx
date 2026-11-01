"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import useSearchSuggestions from "./useSearchSuggestions";

// The search bar that opens under the top bar (the magnifier next to the cart):
// the same box and suggestions as the products page. Searching opens
// /products?q=…; picking a suggestion opens that product or category. onDone(true)
// means the shopper closed it with Escape (focus goes back to the button).
export default function NavSearch({ onDone }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const search = (query) => {
    const q = query.trim();
    if (!q) return;
    onDone();
    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  const { inputProps, list } = useSearchSuggestions({ value, onSearchAll: search, onChoose: onDone });

  return (
    <div className="relative max-w-2xl mx-auto" dir="rtl">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          search(value);
        }}
        className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:border-green3 focus-within:border-green3 transition-colors"
      >
        <input
          type="search"
          placeholder="ابحث عن منتج..."
          aria-label="ابحث عن منتج"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoFocus
          enterKeyHint="search"
          {...inputProps}
          onKeyDown={(event) => {
            // Escape on an empty box (or with no suggestions open) closes the bar.
            if (event.key === "Escape" && !inputProps["aria-expanded"]) onDone(true);
            inputProps.onKeyDown(event);
          }}
          className="w-full py-3 px-4 text-right outline-none border-0 focus:ring-0 bg-white text-gray-800 placeholder-gray-400 [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          className="flex items-center justify-center px-5 bg-green4 hover:bg-green3 text-white transition-colors focus:outline-none"
          aria-label="بحث"
        >
          <FaSearch />
        </button>
      </form>
      {list}
    </div>
  );
}
