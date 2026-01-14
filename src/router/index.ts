import { createRouter, createWebHistory, type RouteRecordRaw, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores'
import type { UserRole } from '@/types'

// Lazy-loaded views
const LoginView = () => import('@/views/auth/LoginView.vue')
const OTPVerificationView = () => import('@/views/auth/OTPVerificationView.vue')
const DashboardView = () => import('@/views/admin/DashboardView.vue')
const UserListView = () => import('@/views/admin/UserListView.vue')
const CreateUserView = () => import('@/views/admin/CreateUserView.vue')
const UserDetailView = () => import('@/views/admin/UserDetailView.vue')
const ProfileView = () => import('@/views/user/ProfileView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')
const UnauthorizedView = () => import('@/views/UnauthorizedView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      requiresAuth: false,
      guestOnly: true
    }
  },
  {
    path: '/verify-otp',
    name: 'verify-otp',
    component: OTPVerificationView,
    meta: {
      requiresAuth: false,
      guestOnly: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true,
      allowedRoles: ['admin']
    }
  },
  {
    path: '/users',
    name: 'users',
    component: UserListView,
    meta: {
      requiresAuth: true,
      allowedRoles: ['admin']
    }
  },
  {
    path: '/users/create',
    name: 'create-user',
    component: CreateUserView,
    meta: {
      requiresAuth: true,
      allowedRoles: ['admin']
    }
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: UserDetailView,
    meta: {
      requiresAuth: true,
      allowedRoles: ['admin']
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      requiresAuth: true,
      allowedRoles: ['admin', 'employee', 'trainee']
    }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard for authentication and role-based access
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth as boolean
  const guestOnly = to.meta.guestOnly as boolean
  const allowedRoles = to.meta.allowedRoles as UserRole[] | undefined

  // Check if route requires authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    // Not authenticated, redirect to login
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Check if route is for guests only (login, register)
  if (guestOnly && authStore.isAuthenticated) {
    // Already authenticated, redirect to dashboard
    next({ name: 'dashboard' })
    return
  }

  // Check role-based access
  if (requiresAuth && allowedRoles && allowedRoles.length > 0) {
    const userRole = authStore.userRole

    if (!userRole || !allowedRoles.includes(userRole)) {
      // User doesn't have the required role
      next({ name: 'unauthorized' })
      return
    }
  }

  // All checks passed, proceed
  next()
})

export default router
