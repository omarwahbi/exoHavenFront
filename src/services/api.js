import axios from 'axios';

// Create axios instance with default config and improved caching
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track cancellation tokens to allow cancelling in-flight requests
const pendingRequests = new Map();

// Add request ID to enable deduplication of in-flight requests
api.interceptors.request.use(request => {
  // Create a unique request ID based on the URL and params
  const url = request.url;
  const params = request.params ? JSON.stringify(request.params) : '';
  request.id = `${url}|${params}`;
  
  // Create a cancellation token
  const source = axios.CancelToken.source();
  request.cancelToken = source.token;
  
  // Store the cancel function so we can cancel it if needed
  pendingRequests.set(request.id, source);
  
  return request;
});

// Request interceptor for deduplication
api.interceptors.request.use(
  (config) => {
    const requestId = config.id;
    
    // Check if we already have an ongoing request with the same ID
    if (pendingRequests.has(requestId)) {
      // Get the current cancelation source
      const currentSource = pendingRequests.get(requestId);
      
      // If this is a duplicate, but we want to make a fresh request,
      // cancel the previous one and continue with the new one
      if (config.fresh === true) {
        currentSource.cancel('Canceled due to duplicate request');
        pendingRequests.delete(requestId);
      } else {
        // Use the existing promise to avoid duplicate request
        return {
          ...config,
          adapter: () => currentSource.__promise,
        };
      }
    }

    // Store the original adapter from the config
    const originalAdapter = config.adapter;
    
    // Only modify the adapter if we have a valid one
    if (typeof originalAdapter === 'function') {
      config.adapter = (adapterConfig) => {
        const promise = originalAdapter(adapterConfig);
        
        // Store the promise with the source so we can reuse it
        if (pendingRequests.has(requestId)) {
          pendingRequests.get(requestId).__promise = promise;
        }

        // Clean up after the request is completed
        promise.finally(() => {
          pendingRequests.delete(requestId);
        });

        return promise;
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't report cancellation errors
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
      return Promise.reject({ cancelled: true });
    }
    
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Helper function to cancel all pending requests (useful when navigating)
export const cancelAllRequests = () => {
  pendingRequests.forEach((source) => {
    source.cancel('Request cancelled due to navigation');
  });
  pendingRequests.clear();
};

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
      'filters[category][id][$eq]': categoryId,
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
      'filters[category][id][$eq]': categoryId,
      'populate': 'item_thumbnail',
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
      'filters[sub_category][id][$eq]': subCategoryId,
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
      'populate': 'category,sub_category,item_thumbnail',
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
      'filters[category][id][$eq]': categoryId,
      'filters[id][$ne]': currentItemId,
      'populate': 'item_thumbnail',
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
      populate: 'item_thumbnail',
      'pagination[limit]': limit,
      sort: 'updatedAt:desc',
      'filters[out_of_stock][$eq]': false
    }
  });
  return data.data;
};

export default api; 