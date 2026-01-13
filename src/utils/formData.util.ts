/**
 * Creates FormData from a payload object, handling files and regular fields
 * @param payload - Object with regular fields and/or File objects
 * @returns FormData ready for multipart/form-data requests
 */
export function createFormDataFromPayload(payload: Record<string, any>): FormData {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return // Skip undefined/null values
    }

    if (value instanceof File) {
      // Handle File objects
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item)
        } else {
          formData.append(`${key}[${index}]`, String(item))
        }
      })
    } else if (typeof value === 'object') {
      // Handle nested objects (convert to JSON string)
      formData.append(key, JSON.stringify(value))
    } else {
      // Handle primitive values
      formData.append(key, String(value))
    }
  })

  return formData
}

/**
 * Validates file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB (default: 5MB)
 * @returns true if valid, false otherwise
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Validates file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if valid, false otherwise
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Common file type validators
 */
export const fileValidators = {
  image: (file: File) => validateFileType(file, ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  pdf: (file: File) => validateFileType(file, ['application/pdf']),
  document: (file: File) => validateFileType(file, [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ])
}

/**
 * Creates a preview URL for an image file
 * @param file - Image file
 * @returns Object URL for preview
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Revokes a preview URL to free memory
 * @param url - Object URL to revoke
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url)
}
