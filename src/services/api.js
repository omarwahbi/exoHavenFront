import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin.exohaven-iq.com';

// Create axios instance with default config and improved caching
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
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
export const fetchItems = async (params = {}) => {
  const { data } = await api.get('/api/items', {
    params: {
      populate: '*',
      ...params
    }
  });
  return data;
};

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
      'populate': 'item_thumbnail,item_images',
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
      'populate': 'category,sub_category,item_thumbnail,item_images',
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
      'populate': 'item_thumbnail,item_images',
      'pagination[limit]': limit,
      'sort[0]': 'new_arrival:desc',
      'sort[1]': 'out_of_stock:asc',
      'sort[2]': 'createdAt:desc'
    }
  });
  return data.data;
};

// Accepts a documentId or an old numeric id (the backend resolves both).
export const fetchCategoryById = async (id) => {
  const { data } = await api.get(`/api/categories/${id}`);
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
      populate: 'item_thumbnail,item_images',
      'pagination[limit]': limit,
      sort: 'updatedAt:desc',
      'filters[out_of_stock][$eq]': false
    }
  });
  return data.data;
};

export default api; 