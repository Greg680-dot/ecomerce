import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url: string | undefined = error.config?.url

    // On an expired/invalid token, clear it and send the user back to login.
    // Skip this for the auth endpoints themselves so failed logins surface their
    // validation message instead of triggering a redirect.
    const isAuthRequest = url?.startsWith('/auth/login') || url?.startsWith('/auth/register')

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem('accessToken')
      if (window.location.pathname !== '/anmelden') {
        window.location.href = '/anmelden'
      }
    }

    return Promise.reject(error)
  },
)

export default api
