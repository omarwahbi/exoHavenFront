"use client";
import { useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";

// The header's product search. Submitting opens /products?q=… (the products page
// reads `q`).
//
// The header stays mounted between pages, so the box restarts (via its key)
// whenever the URL's search changes: back/forward or clearing the search on
// /products then shows the right text.
export default function SearchBox(props) {
  const q = useSearchParams().get("q") ?? "";
  return <SearchForm key={q} initialQuery={q} {...props} />;
}

function SearchForm({ initialQuery, className = "", autoFocus = false }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  // The header renders one box for phones and one for desktop, so ids must differ.
  const id = useId();

  const submit = (event) => {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        ابحث عن منتج
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="ابحث عن منتج، مثل: إضاءة، حوض، طعام…"
        autoFocus={autoFocus}
        enterKeyHint="search"
        className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pr-11 pl-10 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-green3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green2 [&::-webkit-search-cancel-button]:hidden"
      />
      <button type="submit" aria-label="بحث" className="absolute inset-y-0 right-1 my-1 flex w-9 items-center justify-center rounded-full text-gray-500 hover:text-green5">
        <FiSearch size={18} />
      </button>
      {query && (
        <button type="button" aria-label="مسح" onClick={() => setQuery("")} className="absolute inset-y-0 left-2 flex items-center text-gray-400 hover:text-gray-600">
          <FiX size={16} />
        </button>
      )}
    </form>
  );
}
