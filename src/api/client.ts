import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import type { ApiResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Flag to prevent multiple refresh token requests
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('access_token')

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token is already being refreshed, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        // No refresh token, redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Call refresh token endpoint
        const response = await axios.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
          `${API_BASE_URL}/api/auth/refresh-token`,
          { refresh_token: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        )

        if (response.data.success && response.data.data) {
          const { access_token, refresh_token } = response.data.data

          // Store new tokens
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
          }

          // Process queued requests
          processQueue(null)
          isRefreshing = false

          // Retry original request
          return apiClient(originalRequest)
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError as Error)
        isRefreshing = false

        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')

        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
