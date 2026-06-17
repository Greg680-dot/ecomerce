import api from './api'
import type {
  ApiResponse,
  Category,
  PaginatedResponse,
  Product,
  ProductFilters,
  Review,
} from '../types'

export const productsApi = {
  getProducts: (filters?: ProductFilters) =>
    api.get<PaginatedResponse<Product>>('/products', { params: filters }),

  getProduct: (slug: string) =>
    api.get<ApiResponse<Product>>(`/products/${slug}`),

  getFeatured: () =>
    api.get<ApiResponse<Product[]>>('/products/featured'),

  getNewArrivals: (limit = 12) =>
    api.get<ApiResponse<Product[]>>('/products/new', { params: { limit } }),

  getOnSale: (limit = 12) =>
    api.get<ApiResponse<Product[]>>('/products/sale', { params: { limit } }),

  search: (query: string, filters?: ProductFilters) =>
    api.get<PaginatedResponse<Product>>('/products/search', {
      params: { q: query, ...filters },
    }),

  getCategories: () =>
    api.get<ApiResponse<Category[]>>('/categories'),

  getCategory: (slug: string) =>
    api.get<ApiResponse<Category>>(`/categories/${slug}`),

  getProductReviews: (productId: string) =>
    api.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`),

  getBrands: () =>
    api.get<ApiResponse<string[]>>('/products/brands'),

  compare: (ids: string[]) =>
    api.get<ApiResponse<Product[]>>('/products/compare', {
      params: { ids: ids.join(',') },
    }),
}
