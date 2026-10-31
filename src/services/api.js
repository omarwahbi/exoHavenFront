import axios from 'axios';

import { API_URL } from '@/utils/apiUrl';
import { flattenResponse } from '@/utils/strapi';

export { API_URL };

// Create axios instance with default config and improved caching
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
// The app reads Strapi data in its flat v5 shape (see utils/strapi.js).
api.interceptors.response.use((response) => {
  response.data = flattenResponse(response.data);
  return response;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Categories
export const fetchCategories = async () => {
  const { data } = await api.get('/api/categories', {
    params: {
      populate: '*'
    }
  });
  return data.data;
};

// Subcategories
export const fetchSubCategories = async (categoryId) => {
  const { data } = await api.get('/api/sub-categories', {
    params: {
      'filters[category][documentId][$eq]': categoryId,
      'populate': 'subcategory_thumbnail'
    }
  });
  return data.data || [];
};

// Items
export const fetchItemById = async (id) => {
  const { data } = await api.get(`/api/items/${id}`, {
    params: {
      populate: '*'
    }
  });
  return data.data;
};

export const fetchCategoryItems = async (categoryId, page = 1, pageSize = 12) => {
  const { data } = await api.get('/api/items', {
    params: {
      'filters[category][documentId][$eq]': categoryId,
      'populate': 'item_thumbnail,item_images,variants',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort[0]': 'new_arrival:desc',
      'sort[1]': 'out_of_stock:asc',
      'sort[2]': 'createdAt:desc'
    }
  });
  return data.data || [];
};

export const fetchSubCategoryItems = async (subCategoryId, page = 1, pageSize = 12, sortBy = null) => {
  const { data } = await api.get('/api/items', {
    params: {
      'filters[sub_category][documentId][$eq]': subCategoryId,
      'populate': '*',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort[0]': 'new_arrival:desc',
      'sort[1]': 'out_of_stock:asc',
      'sort[2]': sortBy || 'createdAt:desc'
    }
  });
  return data;
};

export const fetchNewArrivals = async (limit = 6) => {
  const { data } = await api.get('/api/items', {
    params: {
      'filters[new_arrival][$eq]': true,
      'populate': 'category,sub_category,item_thumbnail,item_images,variants',
      'pagination[limit]': limit
    }
  });
  return data.data;
};

export const fetchFeaturedProducts = async (limit = 4, sort = null) => {
  const { data } = await api.get('/api/items', {
    params: {
      'populate': '*',
      'pagination[limit]': limit,
      'sort[0]': 'new_arrival:desc',
      'sort[1]': 'out_of_stock:asc',
      'sort[2]': sort || 'createdAt:desc'
    }
  });
  return data.data;
};

export const fetchLatestProducts = async (limit = 3) => {
  const { data } = await api.get('/api/items', {
    params: {
      'populate': '*',
      'pagination[limit]': limit,
      'sort': 'createdAt:desc'
    }
  });
  return data.data;
};

export const fetchRelatedProducts = async (categoryId, currentItemId, limit = 4) => {
  const { data } = await api.get('/api/items', {
    params: {
      'filters[category][documentId][$eq]': categoryId,
      'filters[documentId][$ne]': currentItemId,
      'populate': 'item_thumbnail,item_images,variants',
      'pagination[limit]': limit,
      'sort[0]': 'new_arrival:desc',
      'sort[1]': 'out_of_stock:asc',
      'sort[2]': 'createdAt:desc'
    }
  });
  return data.data;
};

export const fetchSubCategoryById = async (id) => {
  const { data } = await api.get(`/api/sub-categories/${id}`, {
    params: {
      populate: 'category'
    }
  });
  return data;
};

export const fetchSuggestedItems = async (limit = 4) => {
  const { data } = await api.get('/api/items', {
    params: {
      populate: 'item_thumbnail,item_images,variants',
      'pagination[limit]': limit,
      sort: 'updatedAt:desc',
      'filters[out_of_stock][$eq]': false
    }
  });
  return data.data;
};

// One page of /products: optionally one category and a name search.
export const fetchProductsPage = async ({ pageParam = 1, categoryId, searchQuery, signal }) => {
  const params = {
    pagination: {
      page: pageParam,
      pageSize: 12
    },
    // Only select specific fields we need, excluding buffer data
    fields: ['name', 'description', 'state', 'new_arrival', 'out_of_stock', 'low_stock', 'Item_ID'],
    // Use specific fields to populate instead of '*' to reduce response size
    populate: {
      item_thumbnail: {
        fields: ['name', 'url', 'width', 'height', 'formats']
      },
      // Fallback image for items saved without a thumbnail
      item_images: {
        fields: ['url']
      },
      variants: true,
      category: {
        fields: ['name']
      },
      sub_category: {
        fields: ['name']
      }
    },
    // Sort: new items first, out of stock at bottom, then by creation date
    sort: ['new_arrival:desc', 'out_of_stock:asc', 'createdAt:desc']
  };

  if (categoryId) {
    params.filters = {
      ...params.filters,
      category: { documentId: { $eq: categoryId } }
    };
  }
  
  if (searchQuery) {
    params.filters = {
      ...params.filters,
      name: { $containsi: searchQuery }
    };
  }

  try {
    const data = await api.get('/api/items', { params, signal });
    return {
      items: data.data.data,
      nextPage: pageParam + 1,
      hasMore: pageParam < data.data.meta.pagination.pageCount,
      total: data.data.meta.pagination.total,
    };
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// Product search and listings (the backend's /api/search: Meilisearch, or its
// database when that's down). Options: q, category, subCategory (documentIds),
// inStock, sort (relevance | featured | newest | price_asc | price_desc | name),
// page, pageSize, suggest (also return categories whose name matches).
//
// A backend from before /api/search answers 404; then the same filters go to
// /api/items, without the smarter matching and with sorting by the price text.
let searchEndpointMissing = false;

const LEGACY_SORT = {
  relevance: ['new_arrival:desc', 'out_of_stock:asc', 'createdAt:desc'],
  featured: ['new_arrival:desc', 'out_of_stock:asc', 'createdAt:desc'],
  newest: ['out_of_stock:asc', 'createdAt:desc'],
  price_asc: ['out_of_stock:asc', 'state:asc'],
  price_desc: ['out_of_stock:asc', 'state:desc'],
  name: ['out_of_stock:asc', 'name:asc'],
};

const legacySearch = async ({ q, category, subCategory, inStock, sort, page, pageSize, signal }) => {
  const filters = {};
  if (q) filters.name = { $containsi: q };
  if (category) filters.category = { documentId: { $eq: category } };
  if (subCategory) filters.sub_category = { documentId: { $eq: subCategory } };
  if (inStock) filters.out_of_stock = { $eq: false };
  const { data } = await api.get('/api/items', {
    params: {
      filters,
      sort: LEGACY_SORT[sort] ?? LEGACY_SORT.featured,
      populate: { item_thumbnail: true, item_images: true, variants: true, category: true, sub_category: true },
      pagination: { page, pageSize },
    },
    signal,
  });
  return { items: data.data || [], pagination: data.meta.pagination, categories: [] };
};

export const searchProducts = async ({
  q = '',
  category = null,
  subCategory = null,
  inStock = false,
  sort,
  page = 1,
  pageSize = 12,
  suggest = false,
  signal,
} = {}) => {
  const options = { q, category, subCategory, inStock, sort: sort || (q ? 'relevance' : 'featured'), page, pageSize, signal };
  let result;
  if (!searchEndpointMissing) {
    try {
      const { data } = await api.get('/api/search', {
        params: {
          q: q || undefined,
          category: category || undefined,
          sub_category: subCategory || undefined,
          instock: inStock ? 1 : undefined,
          sort: options.sort,
          page,
          pageSize,
          suggest: suggest ? 1 : undefined,
        },
        signal,
      });
      result = { items: data.data || [], pagination: data.meta.pagination, categories: data.meta.categories || [] };
    } catch (error) {
      if (error?.response?.status !== 404) throw error;
      searchEndpointMissing = true;
    }
  }
  if (!result) result = await legacySearch(options);
  const { page: current, pageCount, total } = result.pagination;
  return {
    items: result.items,
    categories: result.categories,
    total,
    page: current,
    pageCount,
    hasMore: current < pageCount,
    nextPage: current + 1,
  };
};

// Search results carry what a product card shows, but not the description the
// /products list view prints: fetch those for one page of results.
export const withDescriptions = async (page) => {
  const ids = page.items.map((item) => item.documentId).filter(Boolean);
  if (!ids.length || page.items.every((item) => 'description' in item)) return page;
  try {
    const { data } = await api.get('/api/items', {
      params: {
        filters: { documentId: { $in: ids } },
        fields: ['description'],
        pagination: { pageSize: ids.length },
      },
    });
    const byId = new Map((data.data || []).map((item) => [item.documentId, item.description]));
    return { ...page, items: page.items.map((item) => ({ ...item, description: byId.get(item.documentId) ?? null })) };
  } catch {
    return page;
  }
};

export default api;
 