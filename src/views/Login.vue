<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 px-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-emerald-600">Khatam Bareng Skrt</h1>
        <p class="text-gray-500 mt-2">Catat progres tilawah Anda, raih berkah bersama.</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Tab Buttons -->
        <div class="flex border-b border-gray-200 mb-6">
          <button 
            @click="activeTab = 'login'"
            :class="['flex-1 py-3 text-center font-semibold transition-all duration-300', activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700']"
          >
            Masuk
          </button>
          <button 
            @click="activeTab = 'register'"
            :class="['flex-1 py-3 text-center font-semibold transition-all duration-300', activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700']"
          >
            Daftar
          </button>
        </div>

        <!-- Error Display -->
        <div v-if="authStore.error" class="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {{ authStore.error }}
        </div>

        <!-- Login Form -->
        <div v-if="activeTab === 'login'" class="animate-fade-in">
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label for="login-username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                id="login-username" 
                type="text" 
                v-model="loginUsername"
                required
                placeholder="Masukkan username Anda"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <button 
              type="submit" 
              :disabled="authStore.isLoading || !loginUsername"
              class="w-full btn-primary py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center"
            >
              <span v-if="!authStore.isLoading">Masuk</span>
              <span v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            </button>
          </form>
        </div>

        <!-- Register Form -->
        <div v-if="activeTab === 'register'" class="animate-fade-in">
          <form @submit.prevent="handleRegister">
            <div class="mb-4">
              <label for="register-fullname" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                id="register-fullname"
                type="text" 
                v-model="registerFullName"
                required
                placeholder="Contoh: Abdullah"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div class="mb-4">
              <label for="register-username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                id="register-username"
                type="text" 
                v-model="registerUsername"
                required
                placeholder="Buat username unik"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            
            <div class="mb-4">
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select 
                id="gender" 
                v-model="registerGender"
                required
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="" disabled>Pilih</option>
                <option value="laki-laki">Laki-laki (Ikhwan)</option>
                <option value="perempuan">Perempuan (Akhwat)</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="register-phone" class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">62</span>
                <input 
                  id="register-phone"
                  type="tel" 
                  v-model="registerPhoneNumber"
                  @input="formatPhoneNumber"
                  required
                  placeholder="81234567890"
                  class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <p v-if="phoneError" class="text-xs text-red-500 mt-1">{{ phoneError }}</p>
              <p v-else class="text-xs text-gray-400 mt-1">Format: 62xxxxxxxxxx (9-15 digit)</p>
            </div>

            <button 
              type="submit" 
              :disabled="authStore.isLoading || !registerFullName || !registerUsername || !registerPhoneNumber || !!phoneError"
              class="w-full btn-primary py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center"
            >
              <span v-if="!authStore.isLoading">Daftar & Masuk</span>
              <span v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            </button>
          </form>
        </div>
      </div>
      
      <p class="text-center text-xs text-gray-400 mt-6">
        Dibuat dengan ❤️ untuk Ramadhan yang lebih bermakna.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State for UI
const activeTab = ref('login') // 'login' or 'register'

// State for Login
const loginUsername = ref('')

// State for Register
const registerFullName = ref('')
const registerUsername = ref('')
const registerPhoneNumber = ref('')
const registerGender = ref('')
const phoneError = ref('')

// Clear errors when tab changes
watch(activeTab, () => {
  authStore.clearError()
})

// Phone number validation logic
const formatPhoneNumber = (e) => {
  let value = e.target.value.replace(/\D/g, '') // Remove non-digits
  
  // Ensure it doesn't start with 62 if already there
  if (value.startsWith('62')) {
    value = value.substring(2)
  }
  
  registerPhoneNumber.value = value
  
  // Real-time validation
  if (value.length > 0 && !/^8\d{8,14}$/.test(value)) {
    phoneError.value = 'Nomor harus dimulai dengan 8 dan memiliki total 9-15 digit.'
  } else {
    phoneError.value = ''
  }
}

const handleLogin = async () => {
  if (!loginUsername.value) {
    authStore.error = 'Username tidak boleh kosong.'
    return
  }
  
  const result = await authStore.login(loginUsername.value)
  if (result.success) {
    router.push('/dashboard')
  }
}

const handleRegister = async () => {
  if (phoneError.value) return;
  
  if (!registerFullName.value || !registerUsername.value || !registerPhoneNumber.value || !registerGender.value) {
    authStore.error = 'Semua field wajib diisi.'
    return
  }

  const result = await authStore.register({
    fullName: registerFullName.value,
    username: registerUsername.value,
    phoneNumber: `62${registerPhoneNumber.value}`,
    gender: registerGender.value
  })

  if (result.success) {
    router.push('/dashboard')
  }
}


onMounted(() => {
  // If user is already logged in, redirect to dashboard
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
  // Clear any previous errors on mount
  authStore.clearError()
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
</style>
