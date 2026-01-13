import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { useNotification } from './useNotification'
import { handleError } from '@/utils/error.util'
import type { CreateUserPayload, UpdateUserPayload } from '@/types'

/**
 * Composable for user management operations with error handling
 */
export function useUserManagement() {
  const userStore = useUserStore()
  const router = useRouter()
  const notification = useNotification()

  // Local loading states for specific operations
  const isDeleting = ref(false)
  const isRestoring = ref(false)

  // Computed properties
  const users = computed(() => userStore.users)
  const pagination = computed(() => userStore.pagination)
  const isLoading = computed(() => userStore.isLoading)
  const filters = computed(() => userStore.filters)

  /**
   * Fetch users with current filters
   */
  async function fetchUsers(): Promise<{ success: boolean; error?: string }> {
    try {
      await userStore.fetchUsers()
      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'Fetch Users')
      notification.error(apiError.message)
      return { success: false, error: apiError.message }
    }
  }

  /**
   * Create a new user
   */
  async function createUser(payload: CreateUserPayload): Promise<{ success: boolean; error?: string }> {
    try {
      await userStore.createUser(payload)
      notification.success('User created successfully!')
      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'Create User')
      notification.error(apiError.message)
      return { success: false, error: apiError.message }
    }
  }

  /**
   * Update an existing user
   */
  async function updateUser(
    userId: string,
    payload: UpdateUserPayload
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await userStore.updateUser(userId, payload)
      notification.success('User updated successfully!')
      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'Update User')
      notification.error(apiError.message)
      return { success: false, error: apiError.message }
    }
  }

  /**
   * Soft delete a user
   */
  async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      isDeleting.value = true
      await userStore.softDeleteUser(userId)
      notification.success('User deleted successfully')
      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'Delete User')
      notification.error(apiError.message)
      return { success: false, error: apiError.message }
    } finally {
      isDeleting.value = false
    }
  }

  /**
   * Restore a soft-deleted user
   */
  async function restoreUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      isRestoring.value = true
      await userStore.restoreUser(userId)
      notification.success('User restored successfully')
      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'Restore User')
      notification.error(apiError.message)
      return { success: false, error: apiError.message }
    } finally {
      isRestoring.value = false
    }
  }

  /**
   * Permanently delete a user
   */
  async function permanentlyDeleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      isDeleting.value = true
      await userStore.hardDeleteUser(userId)
      notification.success('User permanently deleted')
      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'Permanently Delete User')
      notification.error(apiError.message)
      return { success: false, error: apiError.message }
    } finally {
      isDeleting.value = false
    }
  }

  /**
   * Update search filter
   */
  function setSearch(search: string): void {
    userStore.setFilters({ search, page: 1 })
  }

  /**
   * Update role filter
   */
  function setRoleFilter(role: string): void {
    userStore.setFilters({ role, page: 1 })
  }

  /**
   * Update suspension filter
   */
  function setSuspensionFilter(isSuspended: boolean | undefined): void {
    userStore.setFilters({ is_suspended: isSuspended, page: 1 })
  }

  /**
   * Go to specific page
   */
  function goToPage(page: number): void {
    userStore.setPage(page)
  }

  /**
   * Go to next page
   */
  function nextPage(): void {
    if (pagination.value && pagination.value.current_page < pagination.value.last_page) {
      goToPage(pagination.value.current_page + 1)
    }
  }

  /**
   * Go to previous page
   */
  function previousPage(): void {
    if (pagination.value && pagination.value.current_page > 1) {
      goToPage(pagination.value.current_page - 1)
    }
  }

  /**
   * Reset all filters
   */
  function resetFilters(): void {
    userStore.resetFilters()
  }

  /**
   * Navigate to user creation page
   */
  function navigateToCreateUser(): void {
    router.push({ name: 'create-user' })
  }

  /**
   * Navigate to user detail page
   */
  function navigateToUserDetail(userId: string): void {
    router.push({ name: 'user-detail', params: { id: userId } })
  }

  /**
   * Navigate back to user list
   */
  function navigateToUserList(): void {
    router.push({ name: 'users' })
  }

  return {
    // State
    users,
    pagination,
    isLoading,
    isDeleting,
    isRestoring,
    filters,
    // Methods
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    permanentlyDeleteUser,
    setSearch,
    setRoleFilter,
    setSuspensionFilter,
    goToPage,
    nextPage,
    previousPage,
    resetFilters,
    navigateToCreateUser,
    navigateToUserDetail,
    navigateToUserList
  }
}
