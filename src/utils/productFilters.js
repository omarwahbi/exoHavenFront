// The /products filters. They live in the page's address, so a filtered view can be
// shared and the back button works:
//   q        search text
//   category category documentId
//   sub      sub-category documentId
//   min, max price range in IQD, as the shopper sees it (after any sale)
//   sort     see SORT_OPTIONS
//   new=1    new arrivals only
//   instock=1 hide products that are out of stock

import { isSaleActive } from "./saleUtils";

// The page's usual order (new arrivals, then in stock, then newest) is "listing".
export const DEFAULT_SORT = "listing";

export const SORT_OPTIONS = [
  { value: "relevance", label: "الأكثر صلة", needsQuery: true },
  { value: "listing", label: "الافتراضي" },
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل للأعلى" },
  { value: "price_desc", label: "السعر: من الأعلى للأقل" },
  { value: "name", label: "أبجدياً: أ-ي" },
];

export const sortOptions = (hasQuery) => SORT_OPTIONS.filter((option) => hasQuery || !option.needsQuery);

export const defaultSort = (hasQuery) => (hasQuery ? "relevance" : DEFAULT_SORT);

// Quick price ranges under the price boxes.
export const PRICE_PRESETS = [
  { label: "أقل من 10,000", min: null, max: 10000 },
  { label: "10,000 - 25,000", min: 10000, max: 25000 },
  { label: "25,000 - 50,000", min: 25000, max: 50000 },
  { label: "أكثر من 50,000", min: 50000, max: null },
];

const ID = /^[a-z0-9]{1,64}$/;

const toPrice = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replace(/[,٬\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
};

// URLSearchParams (or anything with get()) -> filters, ignoring invalid values.
export const readFilters = (params) => {
  const q = params.get("q")?.trim() || "";
  const id = (key) => {
    const value = params.get(key);
    return value && ID.test(value) ? value : null;
  };
  const sort = params.get("sort");
  const category = id("category");
  return {
    q,
    category,
    // A sub-category is chosen within a category.
    sub: category ? id("sub") : null,
    min: toPrice(params.get("min")),
    max: toPrice(params.get("max")),
    sort: sortOptions(Boolean(q)).some((option) => option.value === sort) ? sort : defaultSort(Boolean(q)),
    newOnly: params.get("new") === "1",
    inStock: params.get("instock") === "1",
  };
};

// The address query for some filters (defaults left out).
export const filtersToQuery = (filters) => {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.sub) params.set("sub", filters.sub);
  if (filters.min !== null && filters.min !== undefined) params.set("min", String(filters.min));
  if (filters.max !== null && filters.max !== undefined) params.set("max", String(filters.max));
  if (filters.sort && filters.sort !== defaultSort(Boolean(filters.q))) params.set("sort", filters.sort);
  if (filters.newOnly) params.set("new", "1");
  if (filters.inStock) params.set("instock", "1");
  return params.toString();
};

// The plain listing (at most a category chosen): loaded exactly as the page always
// has. Anything else goes through the search API, which filters on the server.
export const isPlainListing = (filters) =>
  !filters.q &&
  !filters.sub &&
  filters.min === null &&
  filters.max === null &&
  !filters.newOnly &&
  !filters.inStock &&
  filters.sort === DEFAULT_SORT;

// How many filters are on (shown on the filter button). The sort isn't a filter.
export const activeFilterCount = (filters) =>
  [filters.q, filters.category, filters.sub, filters.min !== null || filters.max !== null, filters.newOnly, filters.inStock].filter(Boolean)
    .length;

// The shopper types prices as cards show them, after the sale; the API filters on
// prices before it. A bound of 9,000 with 10% off means 10,000 before the sale.
// Cards round the sale price (calculateSalePrice), so the bounds are the widest
// pre-sale prices that still show inside the range: shown = round(price × factor).
export const priceBoundsBeforeSale = (min, max, sale) => {
  const factor = isSaleActive(sale) ? (100 - sale.percent) / 100 : 1;
  return {
    minPrice: min === null ? null : Math.ceil((min - 0.5) / factor),
    maxPrice: max === null ? null : Math.ceil((max + 0.5) / factor) - 1,
  };
};
