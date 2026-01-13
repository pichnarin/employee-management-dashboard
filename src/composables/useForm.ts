import { ref, reactive, computed, type Ref } from 'vue'
import type { ValidationRule } from '@/utils/validation.util'
import { validateField } from '@/utils/validation.util'

export interface FieldValidation {
  rules: ValidationRule[]
  errors: Ref<string[]>
  touched: Ref<boolean>
  dirty: Ref<boolean>
}

export interface FormOptions {
  validateOnBlur?: boolean
  validateOnChange?: boolean
}

/**
 * Composable for form handling with validation
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  options: FormOptions = {}
) {
  const { validateOnBlur = true, validateOnChange = false } = options

  // Form state
  const formData = reactive<T>({ ...initialValues })
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)

  // Field validations
  const fieldValidations = reactive<Record<string, FieldValidation>>({})

  /**
   * Register a field with validation rules
   */
  function registerField(fieldName: keyof T, rules: ValidationRule[]): void {
    if (!fieldValidations[fieldName as string]) {
      fieldValidations[fieldName as string] = {
        rules,
        errors: ref([]),
        touched: ref(false),
        dirty: ref(false)
      }
    }
  }

  /**
   * Validate a specific field
   */
  function validateFieldByName(fieldName: keyof T): boolean {
    const validation = fieldValidations[fieldName as string]
    if (!validation) return true

    const value = formData[fieldName]
    const errors = validateField(value, validation.rules)
    validation.errors.value = errors
    return errors.length === 0
  }

  /**
   * Validate all registered fields
   */
  function validateForm(): boolean {
    let isValid = true

    Object.keys(fieldValidations).forEach(fieldName => {
      const fieldIsValid = validateFieldByName(fieldName as keyof T)
      if (!fieldIsValid) {
        isValid = false
      }
    })

    return isValid
  }

  /**
   * Handle field blur event
   */
  function handleBlur(fieldName: keyof T): void {
    const validation = fieldValidations[fieldName as string]
    if (validation) {
      validation.touched.value = true
      if (validateOnBlur) {
        validateFieldByName(fieldName)
      }
    }
  }

  /**
   * Handle field change event
   */
  function handleChange(fieldName: keyof T, value: any): void {
    formData[fieldName] = value

    const validation = fieldValidations[fieldName as string]
    if (validation) {
      validation.dirty.value = true
      if (validateOnChange) {
        validateFieldByName(fieldName)
      }
    }
  }

  /**
   * Get field error message
   */
  function getFieldError(fieldName: keyof T): string | null {
    const validation = fieldValidations[fieldName as string]
    if (!validation) return null

    const { errors, touched } = validation
    return touched.value && errors.value.length > 0 ? errors.value[0] : null
  }

  /**
   * Check if field has error
   */
  function hasFieldError(fieldName: keyof T): boolean {
    return getFieldError(fieldName) !== null
  }

  /**
   * Reset form to initial values
   */
  function resetForm(): void {
    Object.assign(formData, { ...initialValues })

    Object.keys(fieldValidations).forEach(fieldName => {
      const validation = fieldValidations[fieldName]
      validation.errors.value = []
      validation.touched.value = false
      validation.dirty.value = false
    })

    isSubmitting.value = false
    submitError.value = null
  }

  /**
   * Clear all validation errors
   */
  function clearErrors(): void {
    Object.values(fieldValidations).forEach(validation => {
      validation.errors.value = []
    })
    submitError.value = null
  }

  /**
   * Set field-level errors (e.g., from API response)
   */
  function setFieldErrors(errors: Record<string, string[]>): void {
    Object.entries(errors).forEach(([fieldName, messages]) => {
      const validation = fieldValidations[fieldName]
      if (validation) {
        validation.errors.value = messages
        validation.touched.value = true
      }
    })
  }

  /**
   * Check if form is valid
   */
  const isFormValid = computed(() => {
    return Object.values(fieldValidations).every(
      validation => validation.errors.value.length === 0
    )
  })

  /**
   * Check if form is dirty (any field changed)
   */
  const isFormDirty = computed(() => {
    return Object.values(fieldValidations).some(
      validation => validation.dirty.value
    )
  })

  return {
    formData,
    isSubmitting,
    submitError,
    isFormValid,
    isFormDirty,
    registerField,
    validateFieldByName,
    validateForm,
    handleBlur,
    handleChange,
    getFieldError,
    hasFieldError,
    resetForm,
    clearErrors,
    setFieldErrors
  }
}
