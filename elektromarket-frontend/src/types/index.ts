export type UserRole = 'customer' | 'admin' | 'staff'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: UserRole
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  productCount: number
  isActive: boolean
  children?: Category[]
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export interface ProductSpec {
  key: string
  value: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  price: number
  originalPrice?: number
  discountPercent?: number
  categoryId: string
  category?: Category
  brand: string
  images: ProductImage[]
  specs: ProductSpec[]
  stock: number
  rating: number
  reviewCount: number
  isNew: boolean
  isFeatured: boolean
  isOnSale: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  itemCount: number
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  status: OrderStatus
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: PaymentStatus
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  userId: string
  label: string
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Payment {
  id: string
  orderId: string
  orderNumber: string
  amount: number
  method: string
  status: PaymentStatus
  transactionId?: string
  createdAt: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  isVerified: boolean
  createdAt: string
}

export interface Promotion {
  id: string
  title: string
  description: string
  code?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  startDate: string
  endDate: string
  isActive: boolean
  image?: string
  minOrderAmount?: number
}

export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'order' | 'promotion' | 'system' | 'review'
  isRead: boolean
  link?: string
  createdAt: string
}

export interface ReturnRequest {
  id: string
  orderId: string
  orderNumber: string
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  items: OrderItem[]
  createdAt: string
}

export interface StockItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  reserved: number
  available: number
  lowStockThreshold: number
  lastUpdated: string
}

export interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueChange: number
  ordersChange: number
  customersChange: number
  topProducts: { name: string; sales: number; revenue: number }[]
  recentOrders: Order[]
  salesByCategory: { category: string; revenue: number }[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ProductFilters {
  category?: string
  brand?: string[]
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  onSale?: boolean
  isNew?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular'
  search?: string
  page?: number
  pageSize?: number
}

export interface CheckoutData {
  shippingAddressId: string
  billingAddressId: string
  paymentMethod: string
  notes?: string
  promoCode?: string
}

export interface AdminSettings {
  storeName: string
  storeEmail: string
  currency: string
  taxRate: number
  shippingCost: number
  freeShippingThreshold: number
  maintenanceMode: boolean
}
