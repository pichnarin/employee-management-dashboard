# Frontend Architecture Guide

## Overview

This application follows a modern Vue 3 architecture with **separation of concerns**, implementing a clear distinction between:
- **Views** (UI/presentation layer)
- **Composables** (business logic and state management)
- **Utilities** (helper functions)
- **Stores** (Pinia for global state)

## Directory Structure

```
src/
├── api/                  # API client and endpoint definitions
├── assets/              # Static assets
│   └── styles/
│       └── shared.css   # Shared CSS styles
├── components/          # Reusable Vue components
│   └── NotificationContainer.vue
├── composables/         # Vue composables (business logic)
│   ├── useAuth.ts
│   ├── useUserManagement.ts
│   ├── useForm.ts
│   └── useNotification.ts
├── stores/              # Pinia stores (global state)
│   ├── auth.store.ts
│   ├── user.store.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── error.util.ts
│   ├── validation.util.ts
│   └── formData.util.ts
├── views/               # Page-level components
│   ├── admin/
│   ├── auth/
│   └── user/
└── router/              # Vue Router configuration
```

## Architecture Layers

### 1. Views (Presentation Layer)

Views are kept **thin and focused on UI**. They should:
- Handle user interactions (clicks, form inputs)
- Display data from composables
- Not contain business logic
- Not make direct API calls

**Example:**
```vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { login, isLoading } = useAuth()

async function handleSubmit() {
  const result = await login(formData.value)
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>
```

### 2. Composables (Business Logic Layer)

Composables encapsulate **business logic and state management**. They:
- Handle API calls through stores
- Implement error handling
- Manage local state
- Provide methods for views to use
- Show notifications to users

**Available Composables:**

#### `useAuth()`
Authentication operations with error handling.

```typescript
const {
  user,              // Current user object
  isAuthenticated,   // Boolean - is user authenticated
  isLoading,         // Boolean - loading state
  userRole,          // Current user's role
  isAdmin,           // Boolean - is user admin
  isEmployee,        // Boolean - is user employee
  isTrainee,         // Boolean - is user trainee
  login,             // Function - login with credentials
  verifyOTP,         // Function - verify OTP code
  logout,            // Function - logout user
  fetchProfile,      // Function - fetch user profile
  hasRole,           // Function - check if user has role
  hasAnyRole         // Function - check if user has any of roles
} = useAuth()
```

#### `useUserManagement()`
User management operations for admin.

```typescript
const {
  users,                    // Array of users
  pagination,               // Pagination metadata
  isLoading,               // Boolean - loading state
  isDeleting,              // Boolean - deleting state
  isRestoring,             // Boolean - restoring state
  filters,                 // Current filters
  fetchUsers,              // Function - fetch users list
  createUser,              // Function - create new user
  updateUser,              // Function - update user
  deleteUser,              // Function - soft delete user
  restoreUser,             // Function - restore deleted user
  permanentlyDeleteUser,   // Function - hard delete user
  setSearch,               // Function - set search query
  setRoleFilter,           // Function - set role filter
  setSuspensionFilter,     // Function - set suspension filter
  goToPage,                // Function - navigate to page
  nextPage,                // Function - go to next page
  previousPage,            // Function - go to previous page
  resetFilters,            // Function - reset all filters
  navigateToCreateUser,    // Function - navigate to create user
  navigateToUserDetail,    // Function - navigate to user detail
  navigateToUserList       // Function - navigate to user list
} = useUserManagement()
```

#### `useNotification()`
Display toast notifications to users.

```typescript
const {
  notifications,   // Array of current notifications
  show,           // Function - show notification
  dismiss,        // Function - dismiss notification
  success,        // Function - show success message
  error,          // Function - show error message
  warning,        // Function - show warning message
  info,           // Function - show info message
  clearAll        // Function - clear all notifications
} = useNotification()

// Usage
notification.success('User created successfully!')
notification.error('Failed to create user')
notification.warning('Please verify your email')
notification.info('New features available')
```

#### `useForm()`
Generic form handling with validation.

```typescript
const {
  formData,           // Reactive form data
  isSubmitting,       // Boolean - submitting state
  submitError,        // String - submission error
  isFormValid,        // Computed - is form valid
  isFormDirty,        // Computed - has form changed
  registerField,      // Function - register field with validation
  validateFieldByName,// Function - validate specific field
  validateForm,       // Function - validate entire form
  handleBlur,         // Function - handle field blur
  handleChange,       // Function - handle field change
  getFieldError,      // Function - get field error message
  hasFieldError,      // Function - check if field has error
  resetForm,          // Function - reset form to initial state
  clearErrors,        // Function - clear all errors
  setFieldErrors      // Function - set field errors from API
} = useForm(initialValues, options)
```

### 3. Stores (Global State Layer)

Pinia stores manage **global application state**. They:
- Store user authentication state
- Store application data (users, etc.)
- Handle direct API communication
- Provide actions for data manipulation

Stores are accessed primarily through composables, not directly from views.

### 4. Utilities (Helper Functions)

#### Error Handling (`error.util.ts`)

Centralized error handling utilities:

```typescript
import { extractErrorMessage, handleError, parseApiError } from '@/utils/error.util'

// Extract user-friendly error message
const message = extractErrorMessage(error)

// Handle error with logging and return parsed error
const apiError = handleError(error, 'Context')

// Parse error into structured format
const { message, errors, statusCode } = parseApiError(error)
```

**Features:**
- Extracts error messages from various error types
- Handles Axios errors with proper status codes
- Parses Laravel validation errors
- Logs errors in development mode
- Returns user-friendly error messages

#### Validation (`validation.util.ts`)

Form validation utilities:

```typescript
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  getPasswordValidationMessage,
  isAtLeast18YearsOld
} from '@/utils/validation.util'

// Email validation
if (!isValidEmail(email)) {
  errors.email = 'Please enter a valid email'
}

// Password validation with detailed message
const passwordError = getPasswordValidationMessage(password)
if (passwordError) {
  errors.password = passwordError
}

// Phone number validation (requires country code)
if (!isValidPhoneNumber(phone)) {
  errors.phone = 'Phone must include country code (e.g., +1234567890)'
}
```

### 5. Shared Styles (`shared.css`)

Shared CSS classes for common UI elements:

**Layout Classes:**
- `.page-container` - Standard page container
- `.page-with-padding` - Page with 40px padding
- `.page-header` - Header with flex layout
- `.card` - White card with shadow

**Form Classes:**
- `.form-section` - Form section container
- `.form-row` - Two-column form row
- `.form-group` - Individual form field
- `.form-group.has-error` - Field with validation error
- `.error-text` - Validation error message

**Button Classes:**
- `.btn` - Base button
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.btn-success` - Success button
- `.btn-danger` - Danger/delete button
- `.btn-outline` - Outlined button

**Message Classes:**
- `.error-message` - Error message box
- `.success-message` - Success message box
- `.warning-message` - Warning message box
- `.info-message` - Info message box

**Badge Classes:**
- `.badge` - Base badge
- `.badge-admin` - Admin role badge
- `.badge-employee` - Employee role badge
- `.badge-trainee` - Trainee role badge
- `.badge-active` - Active status badge
- `.badge-suspended` - Suspended status badge

**Utility Classes:**
- `.loading` - Loading spinner
- `.empty-state` - Empty state display
- `.text-center` - Center text
- `.flex` - Flex container
- `.gap-1`, `.gap-2`, `.gap-3` - Gap utilities

## Best Practices

### 1. Separation of Concerns

**DO:**
```vue
<!-- View component -->
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { login, isLoading } = useAuth()

async function handleLogin() {
  const result = await login(credentials)
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>
```

**DON'T:**
```vue
<!-- View component -->
<script setup lang="ts">
import { authApi } from '@/api'

async function handleLogin() {
  try {
    const response = await authApi.login(credentials)
    // ... handling logic in view
  } catch (error) {
    // ... error handling in view
  }
}
</script>
```

### 2. Error Handling

Always handle errors through composables and display user-friendly messages:

```typescript
async function createUser(payload: CreateUserPayload) {
  try {
    const result = await userManagement.createUser(payload)

    if (result.success) {
      notification.success('User created successfully!')
      navigateToUserList()
    } else {
      notification.error(result.error || 'Failed to create user')
    }
  } catch (err) {
    notification.error('An unexpected error occurred')
  }
}
```

### 3. Form Validation

Use validation utilities for consistent validation:

```typescript
import { isValidEmail, getPasswordValidationMessage } from '@/utils/validation.util'

function validateForm() {
  const errors: Record<string, string> = {}

  if (!isValidEmail(formData.value.email)) {
    errors.email = 'Please enter a valid email address'
  }

  const passwordError = getPasswordValidationMessage(formData.value.password)
  if (passwordError) {
    errors.password = passwordError
  }

  return errors
}
```

### 4. Notifications

Use the notification system for user feedback:

```typescript
const notification = useNotification()

// Success notification
notification.success('Operation completed successfully!')

// Error notification (stays longer by default)
notification.error('Operation failed. Please try again.')

// Warning notification
notification.warning('Please verify your email address')

// Info notification
notification.info('New updates available')
```

### 5. Shared Styles

Use shared CSS classes instead of duplicating styles:

```vue
<template>
  <div class="page-container page-with-padding">
    <header class="page-header">
      <h1>Page Title</h1>
    </header>

    <div class="card">
      <form class="form-section">
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label>Email</label>
          <input v-model="email" type="email" />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <button class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>
```

## Component Communication

### Views → Composables → Stores → API

1. **View** calls composable method
2. **Composable** handles business logic and calls store
3. **Store** makes API call
4. **API** communicates with backend
5. Response flows back through the layers

### Example Flow

```
LoginView.vue
  ↓ calls login()
useAuth composable
  ↓ calls authStore.login()
authStore
  ↓ calls authApi.login()
API client
  ↓ HTTP POST
Backend
```

## Adding New Features

### 1. Create necessary utilities (if needed)
```typescript
// src/utils/myUtil.ts
export function myUtilityFunction() {
  // Implementation
}
```

### 2. Create composable for business logic
```typescript
// src/composables/useMyFeature.ts
import { useNotification } from './useNotification'
import { handleError } from '@/utils/error.util'

export function useMyFeature() {
  const notification = useNotification()

  async function doSomething() {
    try {
      // Business logic
      notification.success('Success!')
    } catch (error) {
      const apiError = handleError(error, 'MyFeature')
      notification.error(apiError.message)
    }
  }

  return { doSomething }
}
```

### 3. Use composable in view
```vue
<script setup lang="ts">
import { useMyFeature } from '@/composables/useMyFeature'

const { doSomething } = useMyFeature()
</script>
```

## Migration Guide

### Migrating Old Views to New Architecture

1. **Extract business logic** from view to composable
2. **Replace direct store/API calls** with composable methods
3. **Add error handling** through composables
4. **Add notifications** for user feedback
5. **Use shared styles** instead of component-specific styles
6. **Add validation** using validation utilities

## Summary

This architecture provides:
- ✅ **Clear separation of concerns**
- ✅ **Consistent error handling**
- ✅ **Reusable business logic**
- ✅ **Better testability**
- ✅ **Easier maintenance**
- ✅ **Improved developer experience**
- ✅ **User-friendly notifications**
- ✅ **Consistent UI with shared styles**
