<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userApi } from '@/api/user.api'
import type { User } from '@/types'

const route = useRoute()
const router = useRouter()

const user = ref<User | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Image modal state
const showImageModal = ref(false)
const activeImage = ref<string | null>(null)
const activeImageTitle = ref('')

function openImage(imageUrl?: string | null, title: string = '') {
  if (!imageUrl) return
  activeImage.value = imageUrl
  activeImageTitle.value = title
  showImageModal.value = true
}

function closeImage() {
  showImageModal.value = false
  activeImage.value = null
  activeImageTitle.value = ''
}

// Fetch user by ID
async function fetchUser() {
  const userId = route.params.id as string
  if (!userId) {
    error.value = 'User ID not provided'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    error.value = null
    const response = await userApi.getUserById(userId)
    if (response.success && response.data) {
      user.value = response.data
    } else {
      error.value = response.message || 'Failed to fetch user'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch user details'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUser()
})

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

// Format created date
const formattedCreatedAt = computed(() => {
  if (!user.value?.created_at) return 'N/A'
  const date = new Date(user.value.created_at)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

function goBack() {
  router.push('/users')
}
</script>

<template>
  <div class="user-detail">
    <!-- Image Modal -->
    <div v-if="showImageModal" class="image-modal" @click.self="closeImage">
      <div class="modal-content">
        <h3 class="modal-title">{{ activeImageTitle }}</h3>
        <img :src="activeImage!" class="modal-image" />
        <button class="close-btn" @click="closeImage">×</button>
      </div>
    </div>

    <header class="page-header">
      <h1>User Details</h1>
      <button @click="goBack" class="btn-back">Back to Users</button>
    </header>

    <div v-if="isLoading" class="loading">Loading user details...</div>

    <div v-else-if="error" class="error-message">
      {{ error }}
      <button @click="goBack" class="btn-back" style="margin-top: 20px;">Back to Users</button>
    </div>

    <div v-else-if="user" class="profile-content">
      <!-- Profile Header with Photo -->
      <div class="profile-header-card">
        <div class="profile-photo-section">
          <img
            :src="user.personal_information?.professtional_photo_url || '/default-profile.png'"
            alt="Profile Photo"
            class="profile-photo"
            @click="openImage(user.personal_information?.professtional_photo_url, 'Professional Photo')"
          />
          <div class="profile-header-info">
            <h2>{{ user.full_name }}</h2>
            <span :class="['role-badge', user.role]">{{ user.role }}</span>
            <p class="member-since">Member since {{ formattedCreatedAt }}</p>
            <span :class="['status-badge', user.is_suspended ? 'suspended' : 'active']">
              {{ user.is_suspended ? 'Suspended' : 'Active' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Basic Information -->
      <div class="profile-card">
        <h2>Basic Information</h2>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">First Name:</span>
            <span class="value">{{ user.first_name }}</span>
          </div>
          <div class="info-item">
            <span class="label">Last Name:</span>
            <span class="value">{{ user.last_name }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Social Media:</span>
            <span class="value">{{ user.personal_information?.social_media || 'N/A' }}</span>
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
          <div class="info-item full-width">
            <span class="label">Address:</span>
            <span class="value">{{ user.address || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Personal Documents -->
      <div v-if="user.personal_information" class="profile-card">
        <h2>Personal Documents</h2>

        <div class="documents-grid">
          <div class="document-item">
            <span class="label">Nationality Card</span>
            <div v-if="user.personal_information.nationality_card_url" class="document-preview">
              <img
                :src="user.personal_information.nationality_card_url"
                alt="Nationality Card"
                class="document-thumbnail"
                @click="openImage(user.personal_information.nationality_card_url, 'Nationality Card')"
              />
            </div>
            <span v-else class="no-document">Not uploaded</span>
          </div>

          <div class="document-item">
            <span class="label">Family Book</span>
            <div v-if="user.personal_information.family_book_url" class="document-preview">
              <img
                :src="user.personal_information.family_book_url"
                alt="Family Book"
                class="document-thumbnail"
                @click="openImage(user.personal_information.family_book_url, 'Family Book')"
              />
            </div>
            <span v-else class="no-document">Not uploaded</span>
          </div>

          <div class="document-item">
            <span class="label">Birth Certificate</span>
            <div v-if="user.personal_information.birth_certificate_url" class="document-preview">
              <img
                :src="user.personal_information.birth_certificate_url"
                alt="Birth Certificate"
                class="document-thumbnail"
                @click="openImage(user.personal_information.birth_certificate_url, 'Birth Certificate')"
              />
            </div>
            <span v-else class="no-document">Not uploaded</span>
          </div>

          <div class="document-item">
            <span class="label">Degree Certificate</span>
            <div v-if="user.personal_information.degree_certificate_url" class="document-preview">
              <img
                :src="user.personal_information.degree_certificate_url"
                alt="Degree Certificate"
                class="document-thumbnail"
                @click="openImage(user.personal_information.degree_certificate_url, 'Degree Certificate')"
              />
            </div>
            <span v-else class="no-document">Not uploaded</span>
          </div>
        </div>
      </div>

      <!-- Emergency Contact -->
      <div v-if="user.emergency_contact" class="profile-card">
        <h2>Emergency Contact</h2>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Contact Name:</span>
            <span class="value">{{ user.emergency_contact.contact_first_name }} {{ user.emergency_contact.contact_last_name }}</span>
          </div>
          <div class="info-item">
            <span class="label">Relationship:</span>
            <span class="value">{{ user.emergency_contact.contact_relationship }}</span>
          </div>
          <div class="info-item">
            <span class="label">Phone Number:</span>
            <span class="value">{{ user.emergency_contact.contact_phone_number }}</span>
          </div>
          <div class="info-item">
            <span class="label">Social Media:</span>
            <span class="value">{{ user.emergency_contact.contact_social_media || 'N/A' }}</span>
          </div>
          <div class="info-item full-width">
            <span class="label">Address:</span>
            <span class="value">{{ user.emergency_contact.contact_address }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-detail {
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
  border: none;
  cursor: pointer;
}

.btn-back:hover {
  background: #7f8c8d;
}

.profile-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Profile Header Card */
.profile-header-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-photo-section {
  display: flex;
  align-items: center;
  gap: 25px;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.profile-photo:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.profile-header-info h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.member-since {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}

/* Profile Card */
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
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
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

/* Documents Grid */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.document-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.document-item .label {
  margin-bottom: 10px;
}

.document-preview {
  width: 100%;
}

.document-thumbnail {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #eee;
  transition: transform 0.2s, border-color 0.2s;
}

.document-thumbnail:hover {
  transform: scale(1.05);
  border-color: #667eea;
}

.no-document {
  font-size: 14px;
  color: #999;
  padding: 40px 10px;
  background: #f8f9fa;
  border-radius: 8px;
  width: 100%;
}

/* Role Badge */
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

/* Status Badge */
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  margin-top: 8px;
}

.status-badge.active {
  background: #e5ffe5;
  color: #27ae60;
}

.status-badge.suspended {
  background: #ffe5e5;
  color: #e74c3c;
}

/* Image Modal */
.image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-title {
  color: white;
  text-align: center;
  margin: 0 0 15px 0;
  font-size: 18px;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 10px;
  object-fit: contain;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loading,
.error-message {
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
}

.error-message {
  color: #e74c3c;
}

/* Responsive */
@media (max-width: 768px) {
  .user-detail {
    padding: 20px;
  }

  .profile-photo-section {
    flex-direction: column;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .documents-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
