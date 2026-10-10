// Sort orders of product listings, as the backend's /api/search names them.
// "relevance" only makes sense with a search; "featured" (new arrivals first) is
// the default without one.
export const SORT_OPTIONS = [
  { value: "relevance", label: "الأكثر صلة", needsQuery: true },
  { value: "featured", label: "المميزة" },
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل للأعلى" },
  { value: "price_desc", label: "السعر: من الأعلى للأقل" },
  { value: "name", label: "أبجدياً: أ-ي" },
];

export const sortOptions = (hasQuery) => SORT_OPTIONS.filter((o) => hasQuery || !o.needsQuery);

export const defaultSort = (hasQuery) => (hasQuery ? "relevance" : "featured");

// A sort from the URL, or the default when it's missing or doesn't apply.
export const parseSort = (value, hasQuery) =>
  sortOptions(hasQuery).some((o) => o.value === value) ? value : defaultSort(hasQuery);

// Searches the shopper made recently (newest first), kept in this browser only.
const RECENT_KEY = "recentSearches";
const RECENT_MAX = 5;

export const readRecentSearches = () => {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(list) ? list.filter((q) => typeof q === "string").slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (query) => {
  const q = String(query ?? "").trim();
  if (!q) return readRecentSearches();
  const list = [q, ...readRecentSearches().filter((x) => x !== q)].slice(0, RECENT_MAX);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Storage blocked (private mode): just don't remember.
  }
  return list;
};

export const clearRecentSearches = () => {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    // ignore
  }
};
