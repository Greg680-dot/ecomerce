import api from './api'
import type {
  ApiResponse,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  User,
} from '../types'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<ApiResponse<AuthTokens & { user: User }>>('/auth/login', credentials),

  register: (data: RegisterData) =>
    api.post<ApiResponse<AuthTokens & { user: User }>>('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  getProfile: () => api.get<ApiResponse<User>>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    api.patch<ApiResponse<User>>('/auth/me', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),
}
