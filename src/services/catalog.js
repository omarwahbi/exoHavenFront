import { cache } from 'react';
import { API_URL } from '@/utils/apiUrl';
import { flattenResponse } from '@/utils/strapi';

// Server-side reads of one catalogue entry, for a page's metadata and first render.
// cache() shares one request between generateMetadata and the page; Next caches the
// response for 5 minutes, like the sale.
//
// Returns { entry } when found, { missing: true } when the API says 404 (the page
// should 404 too), and {} on any other failure: the page then renders without it
// and its client code fetches it again.
const getEntry = cache(async (collection, id, query) => {
  try {
    const res = await fetch(`${API_URL}/api/${collection}/${encodeURIComponent(id)}?${query}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 404) return { missing: true };
    if (!res.ok) return {};
    return { entry: flattenResponse(await res.json()).data ?? null };
  } catch {
    return {};
  }
});

// Same populate as the client's fetchItemById, so the server copy can seed its cache.
export const getItem = (id) => getEntry('items', id, 'populate=*');
export const getCategory = (id) => getEntry('categories', id, 'populate=category_thumbnail');
export const getSubCategory = (id) => getEntry('sub-categories', id, 'populate=category,subcategory_thumbnail');
