import api from './api'
import type {
  Address,
  ApiResponse,
  Notification,
  PaginatedResponse,
  WishlistItem,
} from '../types'

export const customerApi = {
  getAddresses: () =>
    api.get<ApiResponse<Address[]>>('/customer/addresses'),

  createAddress: (data: Omit<Address, 'id' | 'userId'>) =>
    api.post<ApiResponse<Address>>('/customer/addresses', data),

  updateAddress: (id: string, data: Partial<Address>) =>
    api.patch<ApiResponse<Address>>(`/customer/addresses/${id}`, data),

  deleteAddress: (id: string) =>
    api.delete(`/customer/addresses/${id}`),

  getWishlist: () =>
    api.get<ApiResponse<WishlistItem[]>>('/customer/wishlist'),

  addToWishlist: (productId: string) =>
    api.post<ApiResponse<WishlistItem>>('/customer/wishlist', { productId }),

  removeFromWishlist: (productId: string) =>
    api.delete(`/customer/wishlist/${productId}`),

  getNotifications: () =>
    api.get<ApiResponse<Notification[]>>('/customer/notifications'),

  markNotificationRead: (id: string) =>
    api.patch(`/customer/notifications/${id}/read`),

  markAllNotificationsRead: () =>
    api.post('/customer/notifications/read-all'),
}
