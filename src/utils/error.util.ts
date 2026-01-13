import type { AxiosError } from 'axios'

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

/**
 * Extracts error message from various error types
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred'

  // Axios error
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<any>

    // Server responded with error
    if (axiosError.response?.data) {
      const data = axiosError.response.data

      // Laravel validation errors
      if (data.errors && typeof data.errors === 'object') {
        const firstErrorKey = Object.keys(data.errors)[0]
        const firstError = data.errors[firstErrorKey]
        return Array.isArray(firstError) ? firstError[0] : String(firstError)
      }

      // General error message
      if (data.message) return data.message
    }

    // Network errors
    if (axiosError.message === 'Network Error') {
      return 'Network error. Please check your internet connection.'
    }

    // Timeout errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.'
    }

    // HTTP status codes
    if (axiosError.response?.status) {
      switch (axiosError.response.status) {
        case 401:
          return 'Unauthorized. Please login again.'
        case 403:
          return 'Access denied. You do not have permission to perform this action.'
        case 404:
          return 'Resource not found.'
        case 422:
          return 'Validation failed. Please check your input.'
        case 429:
          return 'Too many requests. Please try again later.'
        case 500:
          return 'Server error. Please try again later.'
        case 503:
          return 'Service unavailable. Please try again later.'
        default:
          return `Request failed with status ${axiosError.response.status}`
      }
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message
  }

  // String error
  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}

/**
 * Extracts all validation errors from API response
 */
export function extractValidationErrors(error: unknown): Record<string, string[]> {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<any>
    if (axiosError.response?.data?.errors) {
      return axiosError.response.data.errors
    }
  }
  return {}
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true
}

/**
 * Parses API error into structured format
 */
export function parseApiError(error: unknown): ApiError {
  const message = extractErrorMessage(error)
  const errors = extractValidationErrors(error)

  let statusCode: number | undefined
  if (isAxiosError(error)) {
    statusCode = (error as AxiosError).response?.status
  }

  return {
    message,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    statusCode
  }
}

/**
 * Logs error to console in development
 */
export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error)
  }
}

/**
 * Handles error with logging and returns user-friendly message
 */
export function handleError(error: unknown, context?: string): ApiError {
  logError(error, context)
  return parseApiError(error)
}
