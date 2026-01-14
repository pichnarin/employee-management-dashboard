<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { VerifyOTPPayload } from '@/types'

const appName = import.meta.env.VITE_APP_NAME
const router = useRouter()
const route = useRoute()
const { verifyOTP } = useAuth()

const formData = ref<VerifyOTPPayload>({
  identifier: '',
  otp: ''
})

const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  // Get identifier from query params
  const identifier = route.query.identifier as string
  if (identifier) {
    formData.value.identifier = identifier
  } else {
    // No identifier, redirect to login
    error.value = 'Invalid session. Please login again.'
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  }
})

function formatOTP(event: Event) {
  const input = event.target as HTMLInputElement
  // Only allow digits
  input.value = input.value.replace(/\D/g, '')
  formData.value.otp = input.value
}

async function handleSubmit() {
  if (formData.value.otp.length !== 4) {
    error.value = 'Please enter a 4-digit OTP code'
    return
  }

  try {
    isLoading.value = true
    error.value = null

    const result = await verifyOTP(formData.value)

    if (result.success) {
      // OTP verified successfully, navigate to dashboard
      router.push({ name: 'dashboard' })
    } else {
      error.value = result.error || 'Invalid OTP. Please try again.'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="otp-container">
    <div class="otp-card">
      <h1>{{ appName }}</h1>
      <h2>Verify OTP</h2>
      <p class="subtitle">Enter the OTP code sent to your email</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="otp">OTP Code</label>
          <input
            id="otp"
            v-model="formData.otp"
            type="text"
            placeholder="Enter 4-digit OTP"
            maxlength="4"
            required
            :disabled="isLoading"
            @input="formatOTP"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="isLoading || formData.otp.length !== 4" class="btn-primary">
          {{ isLoading ? 'Verifying...' : 'Verify OTP' }}
        </button>

        <button type="button" @click="goBack" class="btn-secondary" :disabled="isLoading">
          Back to Login
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.otp-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.otp-card {
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #667eea;
  text-align: center;
}

h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
  text-align: center;
}

.subtitle {
  margin: 0 0 30px 0;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 24px;
  text-align: center;
  letter-spacing: 10px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 10px;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-secondary:hover:not(:disabled) {
  background: #f8f9ff;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #fee;
  color: #c33;
  border-radius: 5px;
  font-size: 14px;
}
</style>
