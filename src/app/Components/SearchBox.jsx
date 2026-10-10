"use client";
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FiClock, FiGrid, FiSearch, FiX } from "react-icons/fi";
import { searchProducts } from "@/services/api";
import { useSale } from "@/app/context/SaleContext";
import { unitPrice } from "@/utils/pricing";
import { hasPriceRange, isOutOfStock } from "@/utils/product";
import { itemImageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";
import { addRecentSearch, clearRecentSearches, readRecentSearches } from "@/utils/search";

const MIN_CHARS = 2;
const SUGGESTIONS = 6;

const productsUrl = (q) => `/products?q=${encodeURIComponent(q)}`;

const useDebounced = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// The header's product search, with suggestions as the shopper types (matching
// categories and products, from the backend's /api/search) and their recent
// searches. Submitting opens /products?q=….
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
  const pathname = usePathname();
  const sale = useSale();
  const id = useId();
  const listId = `${id}-list`;
  const inputRef = useRef(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState([]);

  const typed = query.trim();
  const debounced = useDebounced(typed, 200);
  const searching = debounced.length >= MIN_CHARS;
  const { data, isFetching, isError } = useQuery({
    queryKey: ["search-suggestions", debounced],
    queryFn: ({ signal }) => searchProducts({ q: debounced, pageSize: SUGGESTIONS, suggest: true, signal }),
    enabled: open && searching,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // Close when the page changes (a suggestion was followed).
  useEffect(() => setOpen(false), [pathname]);

  // What the list shows, in keyboard order.
  const options = searching
    ? [
        ...(data?.categories ?? []).map((c) => ({
          key: `c-${c.documentId}`,
          kind: "category",
          entry: c,
          href: c.type === "category" ? `/categories/${c.documentId}` : `/sub-categories/${c.documentId}`,
        })),
        ...(data?.items ?? []).map((item) => ({ key: `p-${entryKey(item)}`, kind: "product", item, href: `/products/${entryKey(item)}` })),
        ...(data?.total ? [{ key: "all", kind: "all", href: productsUrl(debounced) }] : []),
      ]
    : recent.map((q) => ({ key: `r-${q}`, kind: "recent", q, href: productsUrl(q) }));

  const showList = open && (searching ? Boolean(data) || isError : recent.length > 0);
  const noResults = searching && data && !isFetching && options.length === 0;

  const go = (href, remember) => {
    if (remember) setRecent(addRecentSearch(remember));
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
    router.push(href);
  };

  const submit = (event) => {
    event.preventDefault();
    const option = options[active];
    if (option) return go(option.href, option.kind === "all" ? debounced : option.kind === "recent" ? option.q : null);
    go(typed ? productsUrl(typed) : "/products", typed);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (!options.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      // -1 is the box itself; moving past either end wraps around through it.
      setActive((current) => {
        const next = current + step;
        if (next < -1) return options.length - 1;
        return next >= options.length ? -1 : next;
      });
    } else if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        ابحث عن منتج
      </label>
      <input
        ref={inputRef}
        id={id}
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && options[active] ? `${id}-${active}` : undefined}
        autoComplete="off"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(-1);
          setOpen(true);
        }}
        onFocus={() => {
          setRecent(readRecentSearches());
          setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        placeholder="ابحث عن منتج، مثل: إضاءة، حوض، طعام…"
        autoFocus={autoFocus}
        enterKeyHint="search"
        className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pr-11 pl-10 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-green3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green2 [&::-webkit-search-cancel-button]:hidden"
      />
      <button type="submit" aria-label="بحث" className="absolute inset-y-0 right-1 my-1 flex w-9 items-center justify-center rounded-full text-gray-500 hover:text-green5">
        <FiSearch size={18} />
      </button>
      {query && (
        <button
          type="button"
          aria-label="مسح"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setQuery("");
            setActive(-1);
            inputRef.current?.focus();
          }}
          className="absolute inset-y-0 left-2 flex items-center text-gray-400 hover:text-gray-600"
        >
          <FiX size={16} />
        </button>
      )}

      {showList && (
        // mousedown would blur the input (closing the list) before the click lands.
        <div
          onMouseDown={(event) => event.preventDefault()}
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white py-2 shadow-xl"
        >
          {!searching && (
            <div className="flex items-center justify-between px-4 pb-1 pt-1 text-xs font-semibold text-gray-400">
              <span>عمليات البحث الأخيرة</span>
              <button
                type="button"
                onClick={() => {
                  clearRecentSearches();
                  setRecent([]);
                }}
                className="hover:text-red-600"
              >
                مسح
              </button>
            </div>
          )}
          {isError && options.length === 0 && <p className="px-4 py-3 text-sm text-gray-500">تعذر تحميل الاقتراحات. اضغط Enter للبحث.</p>}
          {noResults && <p className="px-4 py-3 text-sm text-gray-500">لا توجد نتائج لـ «{debounced}». جرّب كلمة أخرى.</p>}
          <ul id={listId} role="listbox" aria-label="اقتراحات البحث">
            {options.map((option, index) => (
              <li key={option.key} id={`${id}-${index}`} role="option" aria-selected={index === active}>
                <Link
                  href={option.href}
                  tabIndex={-1}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey) return; // new tab/window
                    event.preventDefault();
                    go(option.href, option.kind === "all" ? debounced : option.kind === "recent" ? option.q : null);
                  }}
                  onMouseEnter={() => setActive(index)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm ${index === active ? "bg-green1" : ""}`}
                >
                  <OptionContent option={option} sale={sale} query={debounced} total={data?.total} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

function OptionContent({ option, sale, query, total }) {
  if (option.kind === "recent") {
    return (
      <>
        <FiClock className="shrink-0 text-gray-400" size={16} />
        <span className="truncate text-gray-700">{option.q}</span>
      </>
    );
  }
  if (option.kind === "category") {
    const { entry } = option;
    return (
      <>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green1 text-green5">
          <FiGrid size={16} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold text-gray-900">{entry.name}</span>
          <span className="block truncate text-xs text-gray-500">{entry.parent ? `قسم فرعي في ${entry.parent}` : "قسم"}</span>
        </span>
      </>
    );
  }
  if (option.kind === "product") {
    const { item } = option;
    const outOfStock = isOutOfStock(item);
    return (
      <>
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-50">
          <Image src={itemImageUrl(item)} alt="" fill sizes="44px" className={`object-cover ${outOfStock ? "grayscale" : ""}`} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-gray-900">{item.name}</span>
          <span className="block truncate text-xs text-gray-500">{item.sub_category?.name || item.category?.name}</span>
        </span>
        <span className="shrink-0 text-left text-xs font-bold">
          {outOfStock ? (
            <span className="text-gray-400">غير متوفر</span>
          ) : (
            <span className="text-green5">
              {hasPriceRange(item) ? "من " : ""}
              {unitPrice(item, sale).toLocaleString("en-US")} د.ع
            </span>
          )}
        </span>
      </>
    );
  }
  return (
    <span className="w-full text-center font-semibold text-green5">
      عرض كل النتائج لـ «{query}»{total ? ` (${total.toLocaleString("en-US")})` : ""}
    </span>
  );
}
