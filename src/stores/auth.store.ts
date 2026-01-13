import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api'
import type {
  User,
  UserRole,
  LoginPayload,
  VerifyOTPPayload,
  LogoutPayload
} from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userRole = computed<UserRole | null>(() => user.value?.role || null)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isEmployee = computed(() => userRole.value === 'employee')
  const isTrainee = computed(() => userRole.value === 'trainee')

  // Actions
  async function login(payload: LoginPayload) {
    try {
      isLoading.value = true
      error.value = null

      const response = await authApi.login(payload)

      if (response.success) {
        return response
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function verifyOTP(payload: VerifyOTPPayload) {
    try {
      isLoading.value = true
      error.value = null

      const response = await authApi.verifyOTP(payload)

      if (response.success && response.data) {
        // Store tokens
        accessToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token

        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)

        // Fetch user profile
        await fetchProfile()

        return response
      } else {
        throw new Error(response.message || 'OTP verification failed')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'OTP verification failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProfile() {
    try {
      isLoading.value = true
      error.value = null

      const response = await authApi.getProfile()

      if (response.success && response.data) {
        user.value = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch profile')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch profile'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      isLoading.value = true
      error.value = null

      if (refreshToken.value) {
        const payload: LogoutPayload = {
          refresh_token: refreshToken.value
        }
        await authApi.logout(payload)
      }
    } catch (err: any) {
      console.error('Logout error:', err)
      // Continue with logout even if API call fails
    } finally {
      // Clear state
      user.value = null
      accessToken.value = null
      refreshToken.value = null

      // Clear localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')

      isLoading.value = false
    }
  }

  function initializeAuth() {
    // Try to restore auth state from localStorage
    const storedAccessToken = localStorage.getItem('access_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    const storedUser = localStorage.getItem('user')

    if (storedAccessToken && storedRefreshToken && storedUser) {
      accessToken.value = storedAccessToken
      refreshToken.value = storedRefreshToken
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Failed to parse stored user:', err)
        // Clear invalid data
        localStorage.removeItem('user')
      }
    }
  }

  function clearError() {
    error.value = null
  }

  // Initialize on store creation
  initializeAuth()

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    // Computed
    isAuthenticated,
    userRole,
    isAdmin,
    isEmployee,
    isTrainee,
    // Actions
    login,
    verifyOTP,
    fetchProfile,
    logout,
    initializeAuth,
    clearError
  }
})
