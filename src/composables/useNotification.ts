import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  duration: number
}

const notifications = ref<Notification[]>([])

let notificationId = 0

/**
 * Composable for displaying toast notifications
 */
export function useNotification() {
  /**
   * Show a notification
   */
  function show(
    message: string,
    type: NotificationType = 'info',
    duration: number = 5000
  ): string {
    const id = `notification-${++notificationId}`

    const notification: Notification = {
      id,
      message,
      type,
      duration
    }

    notifications.value.push(notification)

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  /**
   * Dismiss a notification by ID
   */
  function dismiss(id: string): void {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * Show success notification
   */
  function success(message: string, duration?: number): string {
    return show(message, 'success', duration)
  }

  /**
   * Show error notification
   */
  function error(message: string, duration: number = 7000): string {
    return show(message, 'error', duration)
  }

  /**
   * Show warning notification
   */
  function warning(message: string, duration?: number): string {
    return show(message, 'warning', duration)
  }

  /**
   * Show info notification
   */
  function info(message: string, duration?: number): string {
    return show(message, 'info', duration)
  }

  /**
   * Clear all notifications
   */
  function clearAll(): void {
    notifications.value = []
  }

  return {
    notifications,
    show,
    dismiss,
    success,
    error,
    warning,
    info,
    clearAll
  }
}
