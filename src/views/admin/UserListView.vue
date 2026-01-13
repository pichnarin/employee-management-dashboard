<template>
  <div class="user-list">
    <header class="page-header">
      <h1>User Management</h1>
      <router-link to="/users/create" class="btn-create">
        Create New User
      </router-link>
    </header>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, email, username..."
        class="search-input"
      />
      <select v-model="roleFilter" @change="handleFilter" class="filter-select">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="employee">Employee</option>
        <option value="trainee">Trainee</option>
      </select>
    </div>

    <div v-if="isLoading" class="loading">Loading users...</div>

    <div v-else-if="users.length === 0" class="empty-state">
      No users found.
    </div>

    <div v-else class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.full_name }}</td>
            <td>{{ user.email }}</td>
            <td><span :class="['role-badge', user.role]">{{ user.role }}</span></td>
            <td>{{ user.phone_number }}</td>
            <td>
              <span :class="['status-badge', user.is_suspended ? 'suspended' : 'active']">
                {{ user.is_suspended ? 'Suspended' : 'Active' }}
              </span>
            </td>
            <td class="actions">
              <button @click="viewUser(user.id)" class="btn-action btn-view">View</button>
              <button @click="handleDeleteUser(user.id)" class="btn-action btn-delete" :disabled="isDeleting">
                {{ isDeleting ? 'Deleting...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination" class="pagination">
        <button
          @click="handlePageChange(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="btn-page"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ pagination.current_page }} of {{ pagination.last_page }}
        </span>
        <button
          @click="handlePageChange(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="btn-page"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUserManagement } from '@/composables/useUserManagement'
import { useNotification } from '@/composables/useNotification'

const {
  users,
  pagination,
  isLoading,
  isDeleting,
  fetchUsers,
  deleteUser: deleteUserAction,
  setSearch,
  setRoleFilter,
  goToPage,
  navigateToUserDetail
} = useUserManagement()

const notification = useNotification()

const searchQuery = ref('')
const roleFilter = ref('')

onMounted(async () => {
  await fetchUsers()
})

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
watch(searchQuery, (newValue) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    setSearch(newValue)
    fetchUsers()
  }, 300)
})

function handleFilter() {
  setRoleFilter(roleFilter.value)
  fetchUsers()
}

function handlePageChange(page: number) {
  goToPage(page)
  fetchUsers()
}

function viewUser(userId: string) {
  navigateToUserDetail(userId)
}

async function handleDeleteUser(userId: string) {
  if (!confirm('Are you sure you want to delete this user?')) return

  const result = await deleteUserAction(userId)

  if (result.success) {
    await fetchUsers() // Refresh the list
  }
}
</script>

<style scoped>
.user-list {
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

.btn-create {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input,
.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.search-input {
  flex: 1;
}

.table-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.user-table {
  color: #333;
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.user-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
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

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #e5ffe5;
  color: #27ae60;
}

.status-badge.suspended {
  background: #ffe5e5;
  color: #e74c3c;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-view {
  background: #3498db;
  color: white;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-action:hover {
  opacity: 0.8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.btn-page {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 14px;
}

.loading,
.error-message,
.empty-state {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 10px;
}

.error-message {
  color: #e74c3c;
}
</style>
