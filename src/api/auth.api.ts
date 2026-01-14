import apiClient from './client'
import type {
  LoginPayload,
  VerifyOTPPayload,
  RegisterPayload,
  AuthTokens,
  RefreshTokenPayload,
  LogoutPayload,
  ApiResponse,
  User
} from '@/types'

export const authApi = {
  /**
   * Login - sends OTP to email
   */
  async login(payload: LoginPayload): Promise<ApiResponse<{ message: string }>> {

    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/login',
      payload
    )

    console.log('Login url:', response.config.baseURL?.toString());
    return response.data
  },

  /**
   * Verify OTP - returns access and refresh tokens
   */
  async verifyOTP(payload: VerifyOTPPayload): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      '/auth/verify-otp',
      payload
    )
    return response.data
  },

  /**
   * Register new user
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<{ user_id: string; email: string }>> {
    const response = await apiClient.post<ApiResponse<{ user_id: string; email: string }>>(
      '/auth/register',
      payload
    )
    return response.data
  },

  /**
   * Refresh access token
   */
  async refreshToken(payload: RefreshTokenPayload): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      '/auth/refresh-token',
      payload
    )
    return response.data
  },

  /**
   * Logout user
   */
  async logout(payload: LogoutPayload): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(
      '/auth/logout',
      payload
    )
    return response.data
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/get-profile')
    return response.data
  }
}
