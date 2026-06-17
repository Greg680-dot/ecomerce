import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '../types'
import { authApi, type ApiUser } from '../services/auth'

function mapUser(apiUser: ApiUser): User {
  const name = (apiUser.name ?? '').trim()
  const [firstName, ...rest] = name.split(' ')

  return {
    id: String(apiUser.id),
    email: apiUser.email,
    firstName: firstName ?? '',
    lastName: rest.join(' '),
    phone: apiUser.phone ?? undefined,
    avatar: apiUser.avatar ?? undefined,
    role: (apiUser.role as UserRole) ?? 'customer',
    isVerified: !!apiUser.email_verified_at,
    createdAt: apiUser.created_at ?? '',
    updatedAt: apiUser.created_at ?? '',
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string) => void
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => Promise<void>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      setToken: (token) => {
        localStorage.setItem('accessToken', token)
      },

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authApi.login({ email, password })
          get().setToken(data.token)
          set({ user: mapUser(data.user), isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (registerData) => {
        set({ isLoading: true })
        try {
          const fullName = `${registerData.firstName} ${registerData.lastName}`.trim()
          const { data } = await authApi.register({
            name: fullName,
            email: registerData.email,
            password: registerData.password,
            password_confirmation: registerData.password,
            phone: registerData.phone,
          })
          get().setToken(data.token)
          set({ user: mapUser(data.user), isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // ignore logout errors
        } finally {
          localStorage.removeItem('accessToken')
          set({ user: null, isAuthenticated: false })
        }
      },

      fetchProfile: async () => {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        set({ isLoading: true })
        try {
          const { data } = await authApi.getProfile()
          set({ user: mapUser(data.data), isAuthenticated: true, isLoading: false })
        } catch {
          localStorage.removeItem('accessToken')
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
