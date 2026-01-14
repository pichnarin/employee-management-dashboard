<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { LoginPayload } from '@/types'

const appName = import.meta.env.VITE_APP_NAME
const router = useRouter()
const { login, isLoading: authLoading } = useAuth()

const formData = ref<LoginPayload>({
  identifier: '',
  password: ''
})

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const error = ref<string | null>(null)

// Use local loading state to avoid reactivity issues
const isLoading = ref(false)

async function handleSubmit() {
  if (!formData.value.identifier || !formData.value.password) {
    error.value = 'Please fill in all fields'
    return
  }

  try {
    isLoading.value = true
    error.value = null

    const result = await login(formData.value)

    if (result.success) {
      // Login successful, OTP sent to email
      router.push({
        name: 'verify-otp',
        query: { identifier: formData.value.identifier }
      })
    } else {
      error.value = result.error || 'Login failed. Please check your credentials.'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>{{ appName }}</h1>
      <h2>Login</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="identifier">Email or Username</label>
          <input
            id="identifier"
            v-model="formData.identifier"
            type="text"
            placeholder="Enter email or username"
            required
            :disabled="isLoading"
          />
        </div>

         <div class="form-group">
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
  </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="isLoading" class="btn-primary">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
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
  margin: 0 0 30px 0;
  font-size: 28px;
  color: #333;
  text-align: center;
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
  font-size: 14px;
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

.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
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
