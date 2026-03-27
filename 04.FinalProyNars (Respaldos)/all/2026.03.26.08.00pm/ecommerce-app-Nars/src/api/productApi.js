import { apiClient } from "./apiClient";

const getProductItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.products)) return data.products;
  return [];
};

const mapProductCollectionResponse = (data) => {
  const products = getProductItems(data);

  if (Array.isArray(data)) {
    return {
      products,
      items: products,
      total: products.length,
      page: 1,
      pages: 1,
      pagination: null,
    };
  }

  return {
    ...data,
    products,
    items: products,
    total: data?.total ?? data?.totalResults ?? products.length,
    page: data?.page ?? data?.currentPage ?? data?.pagination?.currentPage ?? 1,
    pages: data?.pages ?? data?.totalPages ?? data?.pagination?.totalPages ?? 1,
  };
};

export const productApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/products", { params });
    return mapProductCollectionResponse(response.data);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (categoryId) => {
    const response = await apiClient.get(`/products/category/${categoryId}`);
    return mapProductCollectionResponse(response.data);
  },

  search: async (query) => {
    const response = await apiClient.get("/products/search", {
      params: { q: query },
    });
    return mapProductCollectionResponse(response.data);
  },
};
