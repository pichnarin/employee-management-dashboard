<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user, isLoading } = useAuth()

// Format date for better display
const formattedDob = computed(() => {
  if (!user.value?.dob) return 'N/A'
  const date = new Date(user.value.dob)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

// Capitalize gender
const formattedGender = computed(() => {
  if (!user.value?.gender) return 'N/A'
  return user.value.gender.charAt(0).toUpperCase() + user.value.gender.slice(1)
})
</script>

<template>
  <div class="profile">
    <header class="page-header">
      <h1>My Profile</h1>
      <router-link to="/dashboard" class="btn-back">Back to Dashboard</router-link>
    </header>

    <div v-if="isLoading" class="loading">Loading profile...</div>

    <div v-else-if="user" class="profile-content">
      <div class="profile-card">
        <h2>Personal Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Full Name:</span>
            <span class="value">{{ user.full_name }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Username:</span>
            <span class="value">{{ user.username }}</span>
          </div>
          <div class="info-item">
            <span class="label">Phone:</span>
            <span class="value">{{ user.phone_number }}</span>
          </div>
          <div class="info-item">
            <span class="label">Date of Birth:</span>
            <span class="value">{{ formattedDob }}</span>
          </div>
          <div class="info-item">
            <span class="label">Gender:</span>
            <span class="value">{{ formattedGender }}</span>
          </div>
          <div class="info-item">
            <span class="label">Nationality:</span>
            <span class="value">{{ user.nationality }}</span>
          </div>
          <div class="info-item">
            <span class="label">Role:</span>
            <span :class="['role-badge', user.role]">{{ user.role }}</span>
          </div>
          <div class="info-item full-width">
            <span class="label">Address:</span>
            <span class="value">{{ user.address }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
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

.profile-content {
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-card h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.value {
  font-size: 16px;
  color: #333;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
  display: inline-block;
  width: fit-content;
}

.role-badge.admin {
  background: #ffe5e5;
  color: #e74c3c;
}

.role-badge.employee {
  background: #e5f3ff;
  color: #3498db;
}

.role-badge.trainee {
  background: #e5ffe5;
  color: #27ae60;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
