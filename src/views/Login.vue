<template>
    <div class="min-h-screen gradient-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <!-- Background Pattern -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>
  
      <div class="relative sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <div class="bg-emerald-600 p-3 rounded-2xl shadow-lg">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <h1 class="text-4xl font-bold text-emerald-800 mb-2">Khabar Qurma</h1>
          <p class="text-emerald-600">Laporan Tilawah Qur'an Ramadhan</p>
        </div>
  
        <!-- Login Card -->
        <div class="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-emerald-100">
          <!-- Date Display -->
          <div class="text-center mb-8">
            <div class="date-hijri text-2xl font-bold text-emerald-700 mb-1">
              {{ hijriDate }}
            </div>
            <div class="date-masehi text-sm text-gray-500">
              {{ gregorianDate }}
            </div>
          </div>
  
          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Pilih atau masukkan nama Anda
              </label>
              
              <!-- User Selection -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                </div>
                
                <!-- Auto-complete Input -->
                <input
                  id="username"
                  v-model="username"
                  list="userList"
                  type="text"
                  required
                  :disabled="isLoading"
                  class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all duration-200"
                  placeholder="Ketik nama atau pilih dari daftar"
                  @input="filterUsers"
                />
                
                <datalist id="userList">
                  <option v-for="user in filteredUsers" :key="user.id" :value="user.username" />
                </datalist>
  
                <!-- Clear Button -->
                <button
                  v-if="username"
                  type="button"
                  @click="username = ''"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
  
              <!-- User Suggestions -->
              <div v-if="filteredUsers.length > 0 && username" class="mt-2">
                <p class="text-xs text-gray-500 mb-1">Pilih dari daftar:</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="user in filteredUsers.slice(0, 5)"
                    :key="user.id"
                    type="button"
                    @click="username = user.username"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors duration-200"
                  >
                    {{ user.username }}
                    <span v-if="isRecentUser(user)" class="ml-1 text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                      Baru
                    </span>
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>
              </div>
            </div>
  
            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="!username.trim() || isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <span v-if="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
                <span v-else class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ isExistingUser ? 'Masuk dengan Akun' : 'Buat Akun Baru' }}
                </span>
              </button>
            </div>
  
            <!-- Info Text -->
            <div class="text-center mt-4">
              <p class="text-xs text-gray-500">
                Dengan melanjutkan, Anda menyetujui bahwa semua data laporan tilawah akan bersifat publik dalam komunitas ini.
              </p>
              <p class="text-xs text-gray-400 mt-1">
                Tidak perlu password! Data tersimpan di perangkat Anda.
              </p>
            </div>
          </form>
  
          <!-- Recent Users -->
          <div v-if="recentUsers.length > 0" class="mt-8 pt-8 border-t border-gray-100">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Pengguna Terbaru</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="user in recentUsers"
                :key="user.id"
                type="button"
                @click="username = user.username"
                class="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
              >
                <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                {{ user.username }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-500">
            © 2024 Khabar Qurma • Dibuat dengan ❤️ untuk tilawah Ramadhan
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import  HijriDate  from 'hijri-date'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  // Refs
  const username = ref('')
  const isLoading = ref(false)
  const error = ref('')
  
  // Computed
  const hijriDate = computed(() => {
    const hijri = new HijriDate()
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    return hijri.toLocaleString('id-ID', options)
  })
  
  const gregorianDate = computed(() => {
    const now = new Date()
    return now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  })
  
  const isExistingUser = computed(() => {
    return authStore.users.some(user => 
      user.username.toLowerCase() === username.value.toLowerCase()
    )
  })
  
  const filteredUsers = computed(() => {
    if (!username.value.trim()) return []
    const searchTerm = username.value.toLowerCase()
    return authStore.users.filter(user => 
      user.username.toLowerCase().includes(searchTerm)
    )
  })
  
  const recentUsers = computed(() => {
    return [...authStore.users]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8)
  })
  
  // Methods
  const isRecentUser = (user) => {
    const userDate = new Date(user.created_at)
    const now = new Date()
    const diffTime = Math.abs(now - userDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 // User dibuat dalam 7 hari terakhir
  }
  
  const filterUsers = () => {
    error.value = ''
  }
  
  const handleLogin = async () => {
    if (!username.value.trim()) {
      error.value = 'Silakan masukkan nama Anda'
      return
    }
  
    if (username.value.trim().length < 2) {
      error.value = 'Nama minimal 2 karakter'
      return
    }
  
    isLoading.value = true
    error.value = ''
  
    try {
      const result = await authStore.login(username.value.trim())
      
      if (result.success) {
        // Redirect ke dashboard setelah 500ms untuk efek smooth
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      } else {
        error.value = result.error || 'Gagal login. Coba lagi.'
      }
    } catch (err) {
      error.value = err.message || 'Terjadi kesalahan. Coba lagi.'
    } finally {
      isLoading.value = false
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    // Cek jika sudah login
    await authStore.initializeAuth()
    if (authStore.isAuthenticated) {
      router.push('/dashboard')
      return
    }
  
    // Fetch semua user untuk dropdown
    await authStore.fetchAllUsers()
  })
  </script>
  
  <style scoped>
  /* Custom animations */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .floating {
    animation: float 6s ease-in-out infinite;
  }
  
  /* Custom scrollbar for datalist dropdown */
  input::-webkit-calendar-picker-indicator {
    display: none !important;
  }
  
  /* Smooth transitions */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* Hanya custom CSS yang tidak ada di Tailwind */
.date-hijri {
  font-family: 'Amiri', serif;
  font-weight: 700;
}

/* Animasi custom */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.floating {
  animation: float 6s ease-in-out infinite;
}
  </style>