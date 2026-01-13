import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import { useNotification } from './useNotification'
import { handleError } from '@/utils/error.util'
import type { LoginPayload, VerifyOTPPayload } from '@/types'

/**
 * Composable for authentication operations with error handling
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const notification = useNotification()

  // Computed properties
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoading = computed(() => authStore.isLoading)
  const userRole = computed(() => authStore.userRole)
  const isAdmin = computed(() => authStore.isAdmin)
  const isEmployee = computed(() => authStore.isEmployee)
  const isTrainee = computed(() => authStore.isTrainee)

  /**
   * Login user and send OTP
   */
  async function login(payload: LoginPayload): Promise<{ success: boolean; error?: string }> {
    try {
      await authStore.login(payload)
      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'Login')
      return { success: false, error: apiError.message }
    }
  }

  /**
   * Verify OTP and complete authentication
   */
  async function verifyOTP(payload: VerifyOTPPayload): Promise<{ success: boolean; error?: string }> {
    try {
      await authStore.verifyOTP(payload)
      notification.success('Login successful!')
      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'OTP Verification')
      return { success: false, error: apiError.message }
    }
  }

  /**
   * Logout user
   */
  async function logout(): Promise<void> {
    try {
      await authStore.logout()
      notification.info('You have been logged out')
      router.push({ name: 'login' })
    } catch (error) {
      // Log error but still redirect to login
      handleError(error, 'Logout')
      router.push({ name: 'login' })
    }
  }

  /**
   * Fetch current user profile
   */
  async function fetchProfile(): Promise<{ success: boolean; error?: string }> {
    try {
      await authStore.fetchProfile()
      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'Fetch Profile')
      return { success: false, error: apiError.message }
    }
  }

  /**
   * Check if user has specific role
   */
  function hasRole(role: string): boolean {
    return userRole.value === role
  }

  /**
   * Check if user has any of the specified roles
   */
  function hasAnyRole(roles: string[]): boolean {
    return roles.includes(userRole.value || '')
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    userRole,
    isAdmin,
    isEmployee,
    isTrainee,
    // Methods
    login,
    verifyOTP,
    logout,
    fetchProfile,
    hasRole,
    hasAnyRole
  }
}
