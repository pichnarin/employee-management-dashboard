<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUserManagement } from '@/composables/useUserManagement'

const { user, logout } = useAuth()
const { users, fetchUsers, isLoading } = useUserManagement()

// Stats computed from users data
const totalUsers = computed(() => users.value.length)
const activeEmployees = computed(() =>
  users.value.filter(u => u.role === 'employee' && !u.is_suspended).length
)
const trainees = computed(() =>
  users.value.filter(u => u.role === 'trainee').length
)
const suspendedUsers = computed(() =>
  users.value.filter(u => u.is_suspended).length
)

onMounted(async () => {
  // Fetch users for stats display
  await fetchUsers()
})

async function handleLogout() {
  await logout()
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="user-info">
        <span>Welcome, {{ user?.full_name }}</span>
        <button @click="handleLogout" class="btn-logout">Logout</button>
      </div>
    </header>

    <div class="dashboard-content">
      <div v-if="isLoading" class="loading">Loading dashboard data...</div>

      <div v-else class="stats-grid">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p class="stat-value">{{ totalUsers }}</p>
        </div>
        <div class="stat-card">
          <h3>Active Employees</h3>
          <p class="stat-value">{{ activeEmployees }}</p>
        </div>
        <div class="stat-card">
          <h3>Trainees</h3>
          <p class="stat-value">{{ trainees }}</p>
        </div>
        <div class="stat-card">
          <h3>Suspended Users</h3>
          <p class="stat-value">{{ suspendedUsers }}</p>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <router-link to="/users" class="action-btn">
            View All Users
          </router-link>
          <router-link to="/users/create" class="action-btn">
            Create New User
          </router-link>
          <router-link to="/profile" class="action-btn">
            My Profile
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}

.dashboard-header {
  background: white;
  padding: 20px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info span {
  font-size: 14px;
  color: #666;
}

.btn-logout {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
}

.dashboard-content {
  padding: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0;
  font-size: 36px;
  font-weight: bold;
  color: #667eea;
}

.quick-actions {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-actions h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.3s;
}

.action-btn:hover {
  opacity: 0.9;
}
</style>
