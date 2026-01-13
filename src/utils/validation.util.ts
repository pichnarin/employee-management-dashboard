/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 * Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character
 */
export function isValidPassword(password: string): boolean {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  )
}

/**
 * Gets password validation error message
 */
export function getPasswordValidationMessage(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number'
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character'
  }
  return null
}

/**
 * Validates phone number (must include country code)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+\d{10,15}$/
  return phoneRegex.test(phone)
}

/**
 * Validates date format (YYYY-MM-DD)
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false

  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

/**
 * Validates if user is at least 18 years old
 */
export function isAtLeast18YearsOld(dob: string): boolean {
  const birthDate = new Date(dob)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18
  }

  return age >= 18
}

/**
 * Validates required field
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validates minimum length
 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min
}

/**
 * Validates maximum length
 */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max
}

/**
 * Generic validator interface
 */
export interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

/**
 * Run multiple validation rules and return errors
 */
export function validateField(value: any, rules: ValidationRule[]): string[] {
  const errors: string[] = []

  rules.forEach(rule => {
    if (!rule.validate(value)) {
      errors.push(rule.message)
    }
  })

  return errors
}
