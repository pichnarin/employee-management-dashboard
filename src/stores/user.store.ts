import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/api'
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  PaginationMeta
} from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const pagination = ref<PaginationMeta | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const filters = ref({
    search: '',
    role: '',
    is_suspended: undefined as boolean | undefined,
    page: 1,
    per_page: 10
  })

  // Actions
  async function fetchUsers() {
    try {
      isLoading.value = true
      error.value = null

      const params = {
        page: filters.value.page,
        per_page: filters.value.per_page,
        ...(filters.value.search && { search: filters.value.search }),
        ...(filters.value.role && { role: filters.value.role }),
        ...(filters.value.is_suspended !== undefined && { is_suspended: filters.value.is_suspended })
      }

      const response = await userApi.getUsers(params)

      if (response.success && response.data) {
        users.value = response.data
        pagination.value = response.meta || null
        return response
      } else {
        throw new Error(response.message || 'Failed to fetch users')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch users'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(payload: CreateUserPayload) {
    try {
      isLoading.value = true
      error.value = null

      const response = await userApi.createUser(payload)

      if (response.success) {
        // Refresh user list after creation
        await fetchUsers()
        return response
      } else {
        throw new Error(response.message || 'Failed to create user')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to create user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(userId: string, payload: UpdateUserPayload) {
    try {
      isLoading.value = true
      error.value = null

      const response = await userApi.updateUser(userId, payload)

      if (response.success) {
        // Refresh user list after update
        await fetchUsers()
        return response
      } else {
        throw new Error(response.message || 'Failed to update user')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to update user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function softDeleteUser(userId: string) {
    try {
      isLoading.value = true
      error.value = null

      const response = await userApi.softDeleteUser(userId)

      if (response.success) {
        // Refresh user list after deletion
        await fetchUsers()
        return response
      } else {
        throw new Error(response.message || 'Failed to delete user')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function restoreUser(userId: string) {
    try {
      isLoading.value = true
      error.value = null

      const response = await userApi.restoreUser(userId)

      if (response.success) {
        // Refresh user list after restoration
        await fetchUsers()
        return response
      } else {
        throw new Error(response.message || 'Failed to restore user')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to restore user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function hardDeleteUser(userId: string) {
    try {
      isLoading.value = true
      error.value = null

      const response = await userApi.hardDeleteUser(userId)

      if (response.success) {
        // Refresh user list after permanent deletion
        await fetchUsers()
        return response
      } else {
        throw new Error(response.message || 'Failed to permanently delete user')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to permanently delete user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      search: '',
      role: '',
      is_suspended: undefined,
      page: 1,
      per_page: 10
    }
  }

  function setPage(page: number) {
    filters.value.page = page
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    users,
    currentUser,
    pagination,
    isLoading,
    error,
    filters,
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    softDeleteUser,
    restoreUser,
    hardDeleteUser,
    setFilters,
    resetFilters,
    setPage,
    clearError
  }
})
