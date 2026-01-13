import type { User, UserRole } from './user.types'

export interface LoginPayload {
  identifier: string // email or username
  password: string
}

export interface VerifyOTPPayload {
  identifier: string // email or username
  otp: string
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  dob: string
  address: string
  gender: 'male' | 'female' | 'other'
  nationality: string
  email: string
  username: string
  phone_number: string
  password: string
  password_confirmation: string
  role: UserRole
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface RefreshTokenPayload {
  refresh_token: string
}

export interface LogoutPayload {
  refresh_token: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  role: UserRole | null
}
