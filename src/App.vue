<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Loading overlay -->
    <div v-if="isInitializing" class="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Memuat aplikasi...</p>
      </div>
    </div>

    <!-- Main app content -->
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../src/stores/auth'

const authStore = useAuthStore()
const isInitializing = ref(true)

onMounted(async () => {
  // Inisialisasi auth saat app pertama kali load
  await authStore.initializeAuth()
  
  // Fetch semua user untuk dropdown
  await authStore.fetchAllUsers()
  
  // Beri sedikit delay untuk smooth loading
  setTimeout(() => {
    isInitializing.value = false
  }, 500)
})
</script>