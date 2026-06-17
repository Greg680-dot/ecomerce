import api from './api'
import type {
  AdminSettings,
  AnalyticsData,
  ApiResponse,
  Category,
  Order,
  PaginatedResponse,
  Payment,
  Product,
  Promotion,
  ReturnRequest,
  Review,
  StockItem,
  User,
} from '../types'

export const adminApi = {
  getDashboard: () =>
    api.get<ApiResponse<AnalyticsData>>('/admin/dashboard'),

  getUsers: (page = 1, pageSize = 20) =>
    api.get<PaginatedResponse<User>>('/admin/users', { params: { page, pageSize } }),

  updateUser: (id: string, data: Partial<User>) =>
    api.patch<ApiResponse<User>>(`/admin/users/${id}`, data),

  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`),

  getProducts: (page = 1, pageSize = 20) =>
    api.get<PaginatedResponse<Product>>('/admin/products', { params: { page, pageSize } }),

  createProduct: (data: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/admin/products', data),

  updateProduct: (id: string, data: Partial<Product>) =>
    api.patch<ApiResponse<Product>>(`/admin/products/${id}`, data),

  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`),

  getCategories: () =>
    api.get<ApiResponse<Category[]>>('/admin/categories'),

  createCategory: (data: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/admin/categories', data),

  updateCategory: (id: string, data: Partial<Category>) =>
    api.patch<ApiResponse<Category>>(`/admin/categories/${id}`, data),

  deleteCategory: (id: string) =>
    api.delete(`/admin/categories/${id}`),

  getOrders: (page = 1, pageSize = 20, status?: string) =>
    api.get<PaginatedResponse<Order>>('/admin/orders', {
      params: { page, pageSize, status },
    }),

  updateOrderStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Order>>(`/admin/orders/${id}`, { status }),

  getPayments: (page = 1, pageSize = 20) =>
    api.get<PaginatedResponse<Payment>>('/admin/payments', { params: { page, pageSize } }),

  getReviews: (page = 1, pageSize = 20) =>
    api.get<PaginatedResponse<Review>>('/admin/reviews', { params: { page, pageSize } }),

  deleteReview: (id: string) =>
    api.delete(`/admin/reviews/${id}`),

  getPromotions: () =>
    api.get<ApiResponse<Promotion[]>>('/admin/promotions'),

  createPromotion: (data: Partial<Promotion>) =>
    api.post<ApiResponse<Promotion>>('/admin/promotions', data),

  updatePromotion: (id: string, data: Partial<Promotion>) =>
    api.patch<ApiResponse<Promotion>>(`/admin/promotions/${id}`, data),

  deletePromotion: (id: string) =>
    api.delete(`/admin/promotions/${id}`),

  getAnalytics: (period = '30d') =>
    api.get<ApiResponse<AnalyticsData>>('/admin/analytics', { params: { period } }),

  getSettings: () =>
    api.get<ApiResponse<AdminSettings>>('/admin/settings'),

  updateSettings: (data: Partial<AdminSettings>) =>
    api.patch<ApiResponse<AdminSettings>>('/admin/settings', data),

  getStock: (page = 1, pageSize = 20) =>
    api.get<PaginatedResponse<StockItem>>('/admin/stock', { params: { page, pageSize } }),

  updateStock: (productId: string, quantity: number) =>
    api.patch<ApiResponse<StockItem>>(`/admin/stock/${productId}`, { quantity }),

  getReturns: (page = 1, pageSize = 20) =>
    api.get<PaginatedResponse<ReturnRequest>>('/admin/returns', { params: { page, pageSize } }),

  updateReturnStatus: (id: string, status: string) =>
    api.patch<ApiResponse<ReturnRequest>>(`/admin/returns/${id}`, { status }),
}
