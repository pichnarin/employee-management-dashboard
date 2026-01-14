<template>
  <div class="unauthorized">
    <div class="content">
      <h1>403</h1>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
      <div class="actions">
        <button v-if="isAuthenticated" @click="goToProfile" class="btn-home">Go to Profile</button>
        <button v-if="isAuthenticated" @click="handleLogout" class="btn-logout">Logout</button>
        <router-link v-if="!isAuthenticated" to="/login" class="btn-home">Go to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

function goToProfile() {
  router.push('/profile')
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.unauthorized {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  padding: 20px;
}

.content {
  text-align: center;
  color: white;
}

h1 {
  font-size: 120px;
  margin: 0;
  font-weight: bold;
}

h2 {
  font-size: 36px;
  margin: 20px 0;
}

p {
  font-size: 18px;
  margin: 20px 0 40px;
  opacity: 0.9;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-home,
.btn-logout {
  display: inline-block;
  padding: 15px 30px;
  background: white;
  color: #e74c3c;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-home:hover,
.btn-logout:hover {
  transform: scale(1.05);
}
</style>
