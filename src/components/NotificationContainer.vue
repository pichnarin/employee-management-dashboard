<script setup lang="ts">
import { useNotification, type NotificationType } from '@/composables/useNotification'
const { notifications, dismiss } = useNotification()

function getIcon(type: NotificationType): string {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
    default:
      return 'ℹ'
  }
}
</script>

<template>
  <div class="notification-container">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
        @click="dismiss(notification.id)"
      >
        <div class="notification-content">
          <span class="notification-icon">{{ getIcon(notification.type) }}</span>
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button class="notification-close" @click.stop="dismiss(notification.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  min-width: 300px;
}

.notification:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
}

.notification-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.notification-close {
  background: none;
  border: none;
  font-size: 24px;
  color: inherit;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
}

/* Success notification */
.notification-success {
  background: #d4edda;
  border-left: 4px solid #28a745;
  color: #155724;
}

.notification-success .notification-icon {
  background: #28a745;
  color: white;
}

/* Error notification */
.notification-error {
  background: #f8d7da;
  border-left: 4px solid #dc3545;
  color: #721c24;
}

.notification-error .notification-icon {
  background: #dc3545;
  color: white;
}

/* Warning notification */
.notification-warning {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  color: #856404;
}

.notification-warning .notification-icon {
  background: #ffc107;
  color: #333;
}

/* Info notification */
.notification-info {
  background: #d1ecf1;
  border-left: 4px solid #17a2b8;
  color: #0c5460;
}

.notification-info .notification-icon {
  background: #17a2b8;
  color: white;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
