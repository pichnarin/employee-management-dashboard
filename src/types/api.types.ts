export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta
  links?: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export interface ValidationError {
  field: string
  message: string
}
