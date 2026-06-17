import api from './api'
import type {
  ApiResponse,
  Cart,
  CheckoutData,
  Order,
  PaginatedResponse,
} from '../types'

export const cartApi = {
  getCart: () => api.get<ApiResponse<Cart>>('/cart'),

  addItem: (productId: string, quantity = 1) =>
    api.post<ApiResponse<Cart>>('/cart/items', { productId, quantity }),

  updateItem: (itemId: string, quantity: number) =>
    api.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity }),

  removeItem: (itemId: string) =>
    api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`),

  clearCart: () => api.delete<ApiResponse<Cart>>('/cart'),

  applyPromo: (code: string) =>
    api.post<ApiResponse<Cart>>('/cart/promo', { code }),
}

export const ordersApi = {
  getOrders: (page = 1, pageSize = 10) =>
    api.get<PaginatedResponse<Order>>('/orders', { params: { page, pageSize } }),

  getOrder: (id: string) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),

  checkout: (data: CheckoutData) =>
    api.post<ApiResponse<Order>>('/orders/checkout', data),

  cancelOrder: (id: string) =>
    api.post<ApiResponse<Order>>(`/orders/${id}/cancel`),
}
