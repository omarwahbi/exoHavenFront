"use client";
import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FaTags } from "react-icons/fa";
import { searchProducts } from "@/services/api";
import { useSale } from "@/app/context/SaleContext";
import { unitPrice } from "@/utils/pricing";
import { hasPriceRange, isOutOfStock } from "@/utils/product";
import { itemImageUrl } from "@/utils/media";
import { entryKey } from "@/utils/ids";

const MIN_CHARS = 2;
const SUGGESTIONS = 6;

const useDebounced = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// Suggestions under the /products search box while the shopper types: matching
// categories and products (from the backend's smart search), and a row that runs
// the full search. Returns props for the search <input> and the list to render
// under it. Enter without a highlighted suggestion submits the form as before.
export default function useSearchSuggestions({ value, onSearchAll }) {
  const router = useRouter();
  const sale = useSale();
  const id = useId();
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const typed = value.trim();
  const debounced = useDebounced(typed, 200);
  const searching = debounced.length >= MIN_CHARS;
  const { data, isFetching } = useQuery({
    queryKey: ["search-suggestions", debounced],
    queryFn: ({ signal }) => searchProducts({ q: debounced, pageSize: SUGGESTIONS, suggest: true, signal }),
    enabled: open && searching,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // New suggestions: nothing is highlighted until the shopper moves to one.
  useEffect(() => setActive(-1), [data]);

  const options = searching
    ? [
        ...(data?.categories ?? []).map((c) => ({
          key: `c-${c.documentId}`,
          kind: "category",
          entry: c,
          href: c.type === "category" ? `/categories/${c.documentId}` : `/sub-categories/${c.documentId}`,
        })),
        ...(data?.items ?? []).map((item) => ({ key: `p-${entryKey(item)}`, kind: "product", item, href: `/products/${entryKey(item)}` })),
        ...(data?.total ? [{ key: "all", kind: "all" }] : []),
      ]
    : [];

  // Suggestions still for an older query aren't offered to the keyboard.
  const current = searching && debounced === typed;
  const showList = open && searching && Boolean(data);
  const noResults = current && data && !isFetching && options.length === 0;

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const choose = (option) => {
    close();
    if (option.kind === "all") onSearchAll(debounced);
    else router.push(option.href);
  };

  const onKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!current || !options.length) return;
      event.preventDefault();
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      // -1 is the box itself; moving past either end wraps around through it.
      setActive((index) => {
        const next = index + step;
        if (next < -1) return options.length - 1;
        return next >= options.length ? -1 : next;
      });
    } else if (event.key === "Enter") {
      // With a suggestion highlighted, open it; otherwise the form submits as
      // before, and the list makes way for the results.
      if (current && options[active]) {
        event.preventDefault();
        choose(options[active]);
      } else {
        close();
      }
    } else if (event.key === "Escape" && showList) {
      event.preventDefault();
      close();
    }
  };

  const inputProps = {
    role: "combobox",
    "aria-autocomplete": "list",
    "aria-expanded": showList,
    "aria-controls": showList ? listId : undefined,
    "aria-activedescendant": showList && options[active] ? `${id}-${active}` : undefined,
    autoComplete: "off",
    onFocus: () => setOpen(true),
    onBlur: close,
    onKeyDown,
  };

  const list = showList ? (
    // mousedown would blur the input (closing the list) before the click lands.
    <div
      onMouseDown={(event) => event.preventDefault()}
      onMouseLeave={() => setActive(-1)}
      className="absolute right-0 left-0 top-full mt-1 z-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden text-right"
      dir="rtl"
    >
      {noResults && <p className="px-4 py-3 text-sm text-gray-500">لا توجد نتائج لـ «{debounced}»</p>}
      <ul id={listId} role="listbox" aria-label="اقتراحات البحث" className="max-h-[60vh] overflow-y-auto">
        {options.map((option, index) => (
          <li
            key={option.key}
            id={`${id}-${index}`}
            role="option"
            aria-selected={index === active}
            onClick={() => choose(option)}
            onMouseEnter={() => setActive(index)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${index === active ? "bg-green1" : ""} ${
              option.kind === "all" ? "justify-center border-t border-gray-100 font-medium text-green4" : ""
            }`}
          >
            <OptionContent option={option} sale={sale} query={debounced} total={data?.total} />
          </li>
        ))}
      </ul>
    </div>
  ) : null;

  return { inputProps, list };
}

function OptionContent({ option, sale, query, total }) {
  if (option.kind === "category") {
    const { entry } = option;
    return (
      <>
        <span className="w-10 h-10 shrink-0 rounded-md bg-green1 text-green4 flex items-center justify-center">
          <FaTags size={14} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium text-gray-800">{entry.name}</span>
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
        <span className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-gray-100">
          <Image src={itemImageUrl(item)} alt="" fill sizes="40px" className="object-cover" />
        </span>
        <span className="min-w-0 flex-1 truncate text-gray-800">{item.name}</span>
        <span className={`shrink-0 font-bold ${outOfStock ? "text-gray-400" : "text-green4"}`}>
          {outOfStock ? "غير متوفر" : `${hasPriceRange(item) ? "من " : ""}${unitPrice(item, sale).toLocaleString()} IQD`}
        </span>
      </>
    );
  }
  return (
    <span>
      عرض كل النتائج لـ «{query}»{total ? ` (${total})` : ""}
    </span>
  );
}
