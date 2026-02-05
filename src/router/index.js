import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/report',
      name: 'Report',
      component: () => import('../views/Report.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/timeline',
      name: 'Timeline',
      component: () => import('../views/Timeline.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/edit',
      name: 'Edit',
      component: () => import('../views/Edit.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: () => import('../views/Leaderboard.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth from localStorage
  if (!authStore.isAuthenticated) {
    authStore.initializeAuth()
  }
  
  // If route requires auth but user is not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // If route requires guest but user is authenticated
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router