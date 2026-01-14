<script setup lang="ts">
import { ref } from 'vue'
import { useUserManagement } from '@/composables/useUserManagement'
import { useNotification } from '@/composables/useNotification'
import { isValidEmail, isValidPassword, isValidPhoneNumber, getPasswordValidationMessage } from '@/utils/validation.util'
import type { CreateUserPayload, Gender, UserRole } from '@/types'

const { createUser, navigateToUserList } = useUserManagement()
const notification = useNotification()

const formData = ref<CreateUserPayload>({
  first_name: '',
  last_name: '',
  dob: '',
  address: '',
  gender: '' as Gender,
  nationality: '',
  email: '',
  username: '',
  phone_number: '',
  password: '',
  password_confirmation: '',
  role: '' as UserRole,
  contact_first_name: '',
  contact_last_name: '',
  contact_relationship: '',
  contact_phone_number: '',
  contact_address: '',
  contact_social_media: ''
})

const isLoading = ref(false)
const error = ref<string | null>(null)
const validationErrors = ref<Record<string, string>>({})

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

function handleFileChange(event: Event, fieldName: keyof CreateUserPayload) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notification.error('File size must not exceed 5MB')
      input.value = ''
      return
    }

    (formData.value as any)[fieldName] = file
  }
}

function validateForm(): boolean {
  validationErrors.value = {}

  // Email validation
  if (!isValidEmail(formData.value.email)) {
    validationErrors.value.email = 'Please enter a valid email address'
  }

  // Password validation
  const passwordError = getPasswordValidationMessage(formData.value.password)
  if (passwordError) {
    validationErrors.value.password = passwordError
  }

  // Password confirmation
  if (formData.value.password !== formData.value.password_confirmation) {
    validationErrors.value.password_confirmation = 'Passwords do not match'
  }

  // Phone number validation
  if (!isValidPhoneNumber(formData.value.phone_number)) {
    validationErrors.value.phone_number = 'Phone number must include country code (e.g., +1234567890)'
  }

  // Contact phone validation
  if (!isValidPhoneNumber(formData.value.contact_phone_number)) {
    validationErrors.value.contact_phone_number = 'Contact phone must include country code (e.g., +1234567890)'
  }

  return Object.keys(validationErrors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    error.value = 'Please fix the validation errors before submitting'
    notification.error('Please fix the validation errors')
    return
  }

  try {
    isLoading.value = true
    error.value = null

    const result = await createUser(formData.value)

    if (result.success) {
      navigateToUserList()
    } else {
      error.value = result.error || 'Failed to create user'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
    notification.error('Failed to create user')
  } finally {
    isLoading.value = false
  }
}

function handleCancel() {
  navigateToUserList()
}
</script>

<template>
  <div class="create-user">
    <header class="page-header">
      <h1>Create New User</h1>
      <router-link to="/users" class="btn-back">Back to Users</router-link>
    </header>

    <form @submit.prevent="handleSubmit" class="user-form">
      <div class="form-section">
        <h2>Personal Information</h2>
        <div class="form-row">
          <div class="form-group">
            <label for="first_name">First Name *</label>
            <input v-model="formData.first_name" id="first_name" type="text" required />
          </div>
          <div class="form-group">
            <label for="last_name">Last Name *</label>
            <input v-model="formData.last_name" id="last_name" type="text" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dob">Date of Birth *</label>
            <input v-model="formData.dob" id="dob" type="date" required />
          </div>
          <div class="form-group">
            <label for="gender">Gender *</label>
            <select v-model="formData.gender" id="gender" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address *</label>
          <textarea v-model="formData.address" id="address" rows="3" required></textarea>
        </div>

        <div class="form-group">
          <label for="nationality">Nationality *</label>
          <input v-model="formData.nationality" id="nationality" type="text" required />
        </div>
      </div>

      <div class="form-section">
        <h2>Account Credentials</h2>
        <div class="form-row">
          <div class="form-group" :class="{ 'has-error': validationErrors.email }">
            <label for="email">Email *</label>
            <input v-model="formData.email" id="email" type="email" required />
            <span v-if="validationErrors.email" class="error-text">{{ validationErrors.email }}</span>
          </div>
          <div class="form-group">
            <label for="username">Username *</label>
            <input v-model="formData.username" id="username" type="text" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group" :class="{ 'has-error': validationErrors.phone_number }">
            <label for="phone_number">Phone Number *</label>
            <input v-model="formData.phone_number" id="phone_number" type="tel" placeholder="+1234567890" required />
            <span v-if="validationErrors.phone_number" class="error-text">{{ validationErrors.phone_number }}</span>
          </div>
          <div class="form-group">
            <label for="role">Role *</label>
            <select v-model="formData.role" id="role" required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="trainee">Trainee</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group" :class="{ 'has-error': validationErrors.password }">
           <label
      for="password"
      @click.prevent="togglePassword"
      style="cursor: pointer;"
    >
      Password
      <span class="toggle-text">
        ({{ showPassword ? 'Hide' : 'Show' }})
      </span>
    </label>

    <input
      id="password"
      v-model="formData.password"
      :type="showPassword ? 'text' : 'password'"
      placeholder="Enter password"
      required
      :disabled="isLoading"
    />
            <small>Min 8 chars, uppercase, lowercase, number, special char</small>
            <span v-if="validationErrors.password" class="error-text">{{ validationErrors.password }}</span>
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.password_confirmation }">
            <label for="password_confirmation">Confirm Password *</label>
            <input v-model="formData.password_confirmation" id="password_confirmation" type="password" required />
            <span v-if="validationErrors.password_confirmation" class="error-text">{{ validationErrors.password_confirmation }}</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>Emergency Contact</h2>
        <div class="form-row">
          <div class="form-group">
            <label for="contact_first_name">Contact First Name *</label>
            <input v-model="formData.contact_first_name" id="contact_first_name" type="text" required />
          </div>
          <div class="form-group">
            <label for="contact_last_name">Contact Last Name *</label>
            <input v-model="formData.contact_last_name" id="contact_last_name" type="text" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="contact_relationship">Relationship *</label>
            <input v-model="formData.contact_relationship" id="contact_relationship" type="text" required />
          </div>
          <div class="form-group" :class="{ 'has-error': validationErrors.contact_phone_number }">
            <label for="contact_phone_number">Contact Phone *</label>
            <input v-model="formData.contact_phone_number" id="contact_phone_number" type="tel" placeholder="+1234567890" required />
            <span v-if="validationErrors.contact_phone_number" class="error-text">{{ validationErrors.contact_phone_number }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="contact_address">Contact Address *</label>
          <textarea v-model="formData.contact_address" id="contact_address" rows="2" required></textarea>
        </div>
      </div>

      <div class="form-section">
        <h2>Documents Upload</h2>
        <div class="form-row">
          <div class="form-group">
            <label for="professtional_photo">Professional Photo</label>
            <input @change="handleFileChange($event, 'professtional_photo')" id="professtional_photo" type="file" accept="image/*" />
          </div>
          <div class="form-group">
            <label for="nationality_card">Nationality Card</label>
            <input @change="handleFileChange($event, 'nationality_card')" id="nationality_card" type="file" accept="image/*,application/pdf" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="family_book">Family Book</label>
            <input @change="handleFileChange($event, 'family_book')" id="family_book" type="file" accept="image/*,application/pdf" />
          </div>
          <div class="form-group">
            <label for="birth_certificate">Birth Certificate</label>
            <input @change="handleFileChange($event, 'birth_certificate')" id="birth_certificate" type="file" accept="image/*,application/pdf" />
          </div>
        </div>

        <div class="form-group">
          <label for="degreee_certificate">Degree Certificate</label>
          <input @change="handleFileChange($event, 'degreee_certificate')" id="degreee_certificate" type="file" accept="image/*,application/pdf" />
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isLoading" class="btn-submit">
          {{ isLoading ? 'Creating...' : 'Create User' }}
        </button>
        <button type="button" @click="handleCancel" class="btn-cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-user {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.btn-back {
  padding: 10px 20px;
  background: #95a5a6;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 14px;
}

.user-form {
  max-width: 1000px;
  margin: 0 auto;
}

.form-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #000000;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  color: #000000;
}

.form-group small {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-submit,
.btn-cancel {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.error-message {
  padding: 15px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #f5c6cb;
}

.form-group.has-error input,
.form-group.has-error select,
.form-group.has-error textarea {
  border-color: #dc3545;
}

.error-text {
  display: block;
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}
</style>
