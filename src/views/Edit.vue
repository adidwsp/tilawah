<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-blue-50 pb-24">
    <!-- Header -->
    <div class="bg-primary text-white">
      <div class="container mx-auto px-4 py-6">
        <!-- Back Button & Title -->
        <div class="flex items-center gap-4 mb-4">
          <button @click="goBack"
            class="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold">Kelola Catatan</h1>
            <p class="text-emerald-100">Edit atau hapus catatan tilawah Anda</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex justify-around text-center">
          <div>
            <div class="text-2xl font-bold">{{ userStats.totalReports }}</div>
            <div class="text-sm text-emerald-100">Total Catatan</div>
          </div>
          <div>
            <div class="text-2xl font-bold">{{ userStats.totalJuz }}</div>
            <div class="text-sm text-emerald-100">Total Juz</div>
          </div>
          <div>
            <div class="text-2xl font-bold">{{ userStats.thisMonth }}</div>
            <div class="text-sm text-emerald-100">Bulan Ini</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 -mt-6">
      <!-- Filter Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button @click="activeTab = 'all'" class="flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200"
          :class="activeTab === 'all'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'">
          Semua
        </button>
        <button @click="activeTab = 'juz'" class="flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200"
          :class="activeTab === 'juz'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'">
          Juz
        </button>
        <button @click="activeTab = 'surah'" class="flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200"
          :class="activeTab === 'surah'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'">
          Surah
        </button>
        <button @click="activeTab = 'recent'" class="flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200"
          :class="activeTab === 'recent'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'">
          7 Hari Terakhir
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-gray-600">Memuat catatan Anda...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredReports.length === 0" class="card text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-xl font-bold text-gray-700 mb-2">Belum ada catatan</h3>
        <p class="text-gray-500 mb-6">Anda belum membuat catatan tilawah.</p>
        <button @click="goToReport" class="btn-primary px-6 py-2">
          Buat Catatan Pertama
        </button>
      </div>

      <!-- Reports List -->
      <div v-else class="space-y-4">
        <div v-for="report in filteredReports" :key="report.id"
          class="card bg-white hover:shadow-xl transition-all duration-200">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <!-- Report Header -->
              <div class="flex items-center gap-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="report.report_type === 'juz' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'">
                  {{ report.report_type === 'juz' ? 'Juz' : 'Surah' }}
                </span>
                <span class="text-sm text-gray-500">{{ formatDate(report.created_at) }}</span>
                <span class="text-sm text-gray-500">{{ formatTime(report.created_at) }}</span>
              </div>

              <!-- Report Content -->
              <div class="mb-3">
                <div v-if="report.report_type === 'juz'" class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border-2 border-emerald-200">
                    <span class="text-2xl font-bold text-emerald-700">{{ report.juz }}</span>
                  </div>
                  <div>
                    <div class="font-bold text-gray-800 text-lg">Juz {{ report.juz }}</div>
                    <div class="text-sm text-gray-600">{{ getJuzRange(report.juz) }}</div>
                  </div>
                </div>

                <div v-else class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-200">
                    <span class="text-2xl font-arabic text-blue-700">📖</span>
                  </div>
                  <div>
                    <div class="font-bold text-gray-800 text-lg">{{ report.surah_name }}</div>
                    <div class="text-sm text-gray-600">
                      Ayat 1 sampai {{ report.ayat_end }}
                      <span v-if="report.juz"> • Juz {{ report.juz }}</span>
                    </div>
                  </div>
                </div>

                <!-- Notes -->
                <div v-if="report.notes" class="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div class="text-sm text-gray-700 italic">"{{ report.notes }}"</div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2 ml-4">
              <!-- Edit Button -->
              <button @click="editReport(report)"
                class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center"
                title="Edit">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>

              <!-- Delete Button -->
              <button @click="deleteReport(report)"
                class="w-10 h-10 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-200 flex items-center justify-center"
                title="Hapus">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div v-if="filteredReports.length > 0" class="fixed bottom-20 left-0 right-0 px-4">
        <div class="bg-white rounded-2xl shadow-lg p-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            {{ filteredReports.length }} catatan
          </div>
          <div class="flex gap-2">
            <button @click="goToReport"
              class="px-4 py-2 bg-primary text-white rounded-xl hover:bg-emerald-700 transition-colors">
              + Tambah Baru
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div class="flex justify-around items-center py-3">
        <router-link to="/dashboard" class="flex flex-col items-center text-gray-500 hover:text-primary">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span class="text-xs mt-1">Dashboard</span>
        </router-link>

        <router-link to="/report" class="flex flex-col items-center text-gray-500 hover:text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-xs mt-1">Catat</span>
        </router-link>

        <router-link to="/timeline" class="flex flex-col items-center text-gray-500 hover:text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs mt-1">Linimasa</span>
        </router-link>

        <router-link to="/edit" class="flex flex-col items-center text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span class="text-xs mt-1">Edit</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useReportsStore } from '../stores/reports'

const router = useRouter()
const authStore = useAuthStore()
const reportsStore = useReportsStore()

// State
const isLoading = ref(true)
const activeTab = ref('all')

// Computed
const userReports = computed(() => {
  if (!authStore.user) return []
  return reportsStore.reports.filter(report => report.user_id === authStore.user.id)
})

const filteredReports = computed(() => {
  let reports = [...userReports.value].sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  )

  switch (activeTab.value) {
    case 'juz':
      return reports.filter(r => r.report_type === 'juz')
    case 'surah':
      return reports.filter(r => r.report_type === 'surah')
    case 'recent':
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return reports.filter(r => new Date(r.created_at) >= weekAgo)
    default:
      return reports
  }
})

const userStats = computed(() => {
  const totalReports = userReports.value.length
  const totalJuz = userReports.value
    .filter(r => r.report_type === 'juz')
    .reduce((sum, r) => sum + (r.juz || 0), 0)

  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const thisMonthReports = userReports.value.filter(r => {
    const date = new Date(r.created_at)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length

  return {
    totalReports,
    totalJuz,
    thisMonth: thisMonthReports
  }
})


const editReport = async (report) => {
  try {
    // Navigate to report page with edit mode
    // Add a small delay to ensure reports are loaded
    await router.push({
      path: '/report',
      query: {
        edit: report.id,
        timestamp: new Date().getTime() // Prevent caching
      }
    })

    // Force refresh the page to ensure data loads
    setTimeout(() => {
      window.location.reload()
    }, 100)
  } catch (error) {
    console.error('Error navigating to edit:', error)
    router.push({
      path: '/report',
      query: { edit: report.id }
    })
  }
}

// Methods
const goBack = () => {
  router.push('/dashboard')
}

const goToReport = () => {
  router.push('/report')
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getJuzRange = (juz) => {
  const ranges = {
    1: 'Al-Fatihah 1 - Al-Baqarah 141',
    2: 'Al-Baqarah 142 - Al-Baqarah 252',
    3: 'Al-Baqarah 253 - Ali Imran 92',
    30: 'An-Naba 1 - An-Nas 6'
  }
  return ranges[juz] || `Juz ${juz}`
}

const deleteReport = async (report) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus catatan ini?\n\n${report.report_type === 'juz' ? `Juz ${report.juz}` : `${report.surah_name} ayat 1-${report.ayat_end}`}`)) {
    return
  }

  const result = await reportsStore.deleteReport(report.id)

  if (result.success) {
    alert('✅ Catatan berhasil dihapus')
  } else {
    alert('❌ Gagal menghapus catatan: ' + result.error)
  }
}

// Lifecycle
onMounted(async () => {
  if (!authStore.user) {
    authStore.initializeAuth()
    if (!authStore.user) {
      router.push('/login')
      return
    }
  }

  // Load user's reports - force fresh data
  await reportsStore.fetchUserReports(authStore.user.id)

  // If there's a report ID in query, go directly to edit
  const urlParams = new URLSearchParams(window.location.search)
  const editId = urlParams.get('edit')
  if (editId) {
    const report = reportsStore.reports.find(r => r.id === editId)
    if (report) {
      await editReport(report)
    }
  }

  isLoading.value = false
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-2xl shadow-md p-4 border border-gray-100;
}

.btn-primary {
  @apply bg-primary text-white font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2;
}

.font-arabic {
  font-family: 'Amiri', serif;
}

.router-link-exact-active {
  @apply text-primary;
}

.router-link-exact-active svg {
  @apply text-primary;
}
</style>