import api from './api'
import type { ApiResponse, User } from '../types'

export interface ApiUser {
  id: number
  name: string
  email: string
  role: string
  role_label?: string
  phone?: string | null
  company_name?: string | null
  vat_number?: string | null
  avatar?: string | null
  is_active?: boolean
  last_login_at?: string | null
  email_verified_at?: string | null
  created_at?: string | null
}

export interface AuthResponse {
  message: string
  user: ApiUser
  token: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}

export interface LoginPayload {
  email: string
  password: string
  device_name?: string
}

export const authApi = {
  login: (credentials: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', credentials),

  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  getProfile: () => api.get<ApiResponse<ApiUser>>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<ApiUser>>('/auth/profile', data),
}
