import apiClient from './client'
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  ApiResponse,
  PaginatedResponse
} from '@/types'
import { createFormDataFromPayload } from '@/utils/formData.util'

export const userApi = {
  /**
   * Get all users (with filtering, search, pagination)
   */
  async getUsers(params?: {
    page?: number
    per_page?: number
    search?: string
    role?: string
    is_suspended?: boolean
  }): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/get-users', {
      params
    })

    console.log('Get Users Response Data:', JSON.stringify(response.data));

    return response.data
  },

  /**
   * Create new user (multipart/form-data with files)
   */
  async createUser(payload: CreateUserPayload): Promise<ApiResponse<{ user_id: string; email: string }>> {
    const formData = createFormDataFromPayload(payload)

    const response = await apiClient.post<ApiResponse<{ user_id: string; email: string }>>(
      '/create-user',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  },

  /**
   * Update user information (multipart/form-data with files)
   */
  async updateUser(userId: string, payload: UpdateUserPayload): Promise<ApiResponse<{ user_id: string }>> {
    const formData = createFormDataFromPayload(payload)

    const response = await apiClient.post<ApiResponse<{ user_id: string }>>(
      `/update-user-information/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PATCH' // Laravel workaround for PATCH with FormData
        }
      }
    )
    return response.data
  },

  /**
   * Soft delete user
   */
  async softDeleteUser(userId: string): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(
      `/soft-delete-user/${userId}`
    )
    return response.data
  },

  /**
   * Restore soft-deleted user
   */
  async restoreUser(userId: string): Promise<ApiResponse<{ user_id: string; email: string }>> {
    const response = await apiClient.patch<ApiResponse<{ user_id: string; email: string }>>(
      `/restore-user/${userId}`
    )
    return response.data
  },

  /**
   * Permanently delete user
   */
  async hardDeleteUser(userId: string): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(
      `/hard-delete-user/${userId}`
    )
    return response.data
  },

  /**
   * Get user by ID (returns same data as get-profile)
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(
      `/user-detail/${userId}`
    )
    return response.data
  }
}
