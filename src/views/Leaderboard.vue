<template>
    <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-blue-50 pb-24">
      <!-- Header -->
      <div class="bg-primary text-white">
        <div class="container mx-auto px-4 py-6">
          <!-- Back Button & Title -->
          <div class="flex items-center gap-4 mb-4">
            <button 
              @click="goBack"
              class="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold">Leaderboard</h1>
              <p class="text-emerald-100">Peringkat Tilawah Terbaik</p>
            </div>
          </div>
  
          <!-- Stats -->
          <div class="flex justify-around text-center">
            <div>
              <div class="text-2xl font-bold">{{ stats.totalUsers }}</div>
              <div class="text-sm text-emerald-100">Total User</div>
            </div>
            <div>
              <div class="text-2xl font-bold">{{ stats.totalJuz }}</div>
              <div class="text-sm text-emerald-100">Total Juz</div>
            </div>
            <div>
              <div class="text-2xl font-bold">{{ stats.activeToday }}</div>
              <div class="text-sm text-emerald-100">Aktif Hari Ini</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="container mx-auto px-4 -mt-6">
        <!-- Top 3 Podium -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-center mb-6 text-gray-800">Top 3 Performers</h2>
          
          <div class="flex items-end justify-center gap-4 mb-8">
            <!-- Second Place -->
            <div v-if="leaderboard[1]" class="flex flex-col items-center flex-1 max-w-32">
              <div class="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-lg">
                2
              </div>
              <div class="w-full bg-white rounded-2xl shadow-lg p-4 text-center">
                <div class="font-bold text-gray-700 truncate">{{ leaderboard[1].username }}</div>
                <div class="text-2xl font-bold text-gray-600 mt-2">{{ leaderboard[1].total_juz }}</div>
                <div class="text-xs text-gray-500">Juz</div>
                <div class="text-xs text-emerald-600 mt-1">
                  {{ calculateProgress(leaderboard[1].total_juz) }}% Khatam
                </div>
              </div>
            </div>
  
            <!-- First Place -->
            <div v-if="leaderboard[0]" class="flex flex-col items-center flex-1 max-w-40 -mt-8">
              <div class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-2 shadow-lg border-4 border-yellow-300">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
              </div>
              <div class="w-full bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-2xl shadow-xl p-4 text-center border-2 border-yellow-200">
                <div class="font-bold text-gray-800 truncate">{{ leaderboard[0].username }}</div>
                <div class="text-3xl font-bold text-gray-800 mt-2">{{ leaderboard[0].total_juz }}</div>
                <div class="text-sm text-gray-600">Juz</div>
                <div class="text-sm font-semibold text-emerald-700 mt-1">
                  {{ calculateProgress(leaderboard[0].total_juz) }}% Khatam
                </div>
              </div>
            </div>
  
            <!-- Third Place -->
            <div v-if="leaderboard[2]" class="flex flex-col items-center flex-1 max-w-32">
              <div class="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-lg">
                3
              </div>
              <div class="w-full bg-white rounded-2xl shadow-lg p-4 text-center">
                <div class="font-bold text-gray-700 truncate">{{ leaderboard[2].username }}</div>
                <div class="text-2xl font-bold text-gray-600 mt-2">{{ leaderboard[2].total_juz }}</div>
                <div class="text-xs text-gray-500">Juz</div>
                <div class="text-xs text-emerald-600 mt-1">
                  {{ calculateProgress(leaderboard[2].total_juz) }}% Khatam
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Ranking Table -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Peringkat Lengkap</h2>
          
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p class="text-gray-600">Memuat peringkat...</p>
          </div>
  
          <!-- Empty State -->
          <div v-else-if="leaderboard.length === 0" class="text-center py-8">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Belum ada data</h3>
            <p class="text-gray-500">Mulai laporkan tilawah untuk muncul di leaderboard!</p>
          </div>
  
          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Rank</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Nama</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Total Juz</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Progress</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Rata-rata</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(user, index) in leaderboard.slice(3)" 
                  :key="user.id"
                  class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                  :class="{ 'bg-blue-50': user.id === currentUser?.id }"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <span class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold">
                        {{ index + 4 }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {{ user.username.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="font-medium text-gray-800">{{ user.username }}</div>
                        <div class="text-xs text-gray-500">
                          Bergabung {{ formatJoinDate(user.created_at) }}
                        </div>
                      </div>
                      <span v-if="user.id === currentUser?.id" class="text-xs bg-primary text-white px-2 py-1 rounded-full">
                        Anda
                      </span>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="text-2xl font-bold text-gray-800">{{ user.total_juz }}</div>
                    <div class="text-xs text-gray-500">Juz</div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="w-32">
                      <div class="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{{ calculateProgress(user.total_juz) }}%</span>
                        <span>{{ user.total_juz }}/30</span>
                      </div>
                      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
                          :style="{ width: calculateProgress(user.total_juz) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="text-lg font-bold text-gray-800">{{ user.daily_average.toFixed(1) }}</div>
                    <div class="text-xs text-gray-500">Juz/hari</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- User's Position (if not in top 10) -->
          <div v-if="userPosition > 10 && currentUser" class="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-bold text-gray-800">Posisi Anda</div>
                <div class="text-sm text-gray-600">Peringkat #{{ userPosition }} dari {{ leaderboard.length }} user</div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-primary">{{ userRank?.total_juz || 0 }} Juz</div>
                <div class="text-sm text-gray-600">
                  {{ calculateProgress(userRank?.total_juz || 0) }}% Khatam
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Time Filter -->
        <div class="card mt-6">
          <h3 class="font-bold text-gray-800 mb-4">Filter Periode</h3>
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="period in timePeriods"
              :key="period.id"
              @click="selectedPeriod = period.id"
              class="flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200"
              :class="selectedPeriod === period.id 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
  
        <!-- Legend -->
        <div class="mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="text-sm text-gray-600 mb-2">Keterangan:</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Progress khatam</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-blue-100 rounded-full border border-blue-300"></div>
              <span>Posisi Anda</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Peringkat 1</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span>Peringkat 2-3</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Bottom Navigation -->
      <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div class="flex justify-around items-center py-3">
          <router-link 
            to="/dashboard" 
            class="flex flex-col items-center text-gray-500 hover:text-primary"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span class="text-xs mt-1">Dashboard</span>
          </router-link>
  
          <router-link 
            to="/report" 
            class="flex flex-col items-center text-gray-500 hover:text-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-xs mt-1">Lapor</span>
          </router-link>
  
          <router-link 
            to="/timeline" 
            class="flex flex-col items-center text-gray-500 hover:text-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs mt-1">Linimasa</span>
          </router-link>
  
          <router-link 
            to="/leaderboard" 
            class="flex flex-col items-center text-primary"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
            </svg>
            <span class="text-xs mt-1">Leaderboard</span>
          </router-link>
        </div>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import { supabase } from '../supabase/client'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  // State
  const isLoading = ref(true)
  const leaderboard = ref([])
  const selectedPeriod = ref('all') // 'all', 'week', 'month', 'ramadhan'
  const stats = ref({
    totalUsers: 0,
    totalJuz: 0,
    activeToday: 0
  })
  
  // Time periods
  const timePeriods = ref([
    { id: 'all', label: 'Semua Waktu' },
    { id: 'ramadhan', label: 'Ramadhan' },
    { id: 'month', label: '30 Hari' },
    { id: 'week', label: '7 Hari' }
  ])
  
  // Computed
  const currentUser = computed(() => authStore.user)
  
  const userPosition = computed(() => {
    if (!currentUser.value) return 0
    const index = leaderboard.value.findIndex(user => user.id === currentUser.value.id)
    return index + 1 // +1 karena index mulai dari 0
  })
  
  const userRank = computed(() => {
    return leaderboard.value.find(user => user.id === currentUser.value?.id)
  })
  
  // Methods
  const goBack = () => {
    router.push('/dashboard')
  }
  
  const calculateProgress = (totalJuz) => {
    const percentage = (totalJuz / 30) * 100
    return Math.min(Math.round(percentage), 100)
  }
  
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'hari ini'
    if (diffDays <= 7) return `${diffDays} hari lalu`
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short' 
    })
  }
  
  const loadLeaderboard = async () => {
    isLoading.value = true
    
    try {
      // Get date filter based on selected period
      let startDate = null
      const now = new Date()
      
      switch (selectedPeriod.value) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7))
          break
        case 'month':
          startDate = new Date(now.setDate(now.getDate() - 30))
          break
        case 'ramadhan':
          // Contoh: Ramadhan 1445 H ≈ 11 Maret - 9 April 2024
          startDate = new Date('2024-03-11')
          break
      }
  
      // Build query for reports
      let reportsQuery = supabase
        .from('reports')
        .select('user_id, juz, created_at')
        .eq('report_type', 'juz')
      
      if (startDate) {
        reportsQuery = reportsQuery.gte('created_at', startDate.toISOString())
      }
  
      const { data: reports, error: reportsError } = await reportsQuery
      
      if (reportsError) throw reportsError
  
      // Get all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, username, created_at')
      
      if (usersError) throw usersError
  
      // Calculate stats for each user
      const userStats = users.map(user => {
        const userReports = reports?.filter(r => r.user_id === user.id) || []
        const total_juz = userReports.reduce((sum, report) => sum + (report.juz || 0), 0)
        
        // Calculate daily average (juz per day)
        const firstReport = userReports[0]
        let daily_average = 0
        
        if (firstReport) {
          const firstDate = new Date(firstReport.created_at)
          const daysActive = Math.max(1, Math.ceil((new Date() - firstDate) / (1000 * 60 * 60 * 24)))
          daily_average = total_juz / daysActive
        }
  
        // Check if active today
        const today = new Date().toDateString()
        const activeToday = userReports.some(r => 
          new Date(r.created_at).toDateString() === today
        )
  
        return {
          id: user.id,
          username: user.username,
          created_at: user.created_at,
          total_juz,
          daily_average,
          active_today: activeToday
        }
      })
  
      // Sort by total_juz descending
      userStats.sort((a, b) => b.total_juz - a.total_juz)
      leaderboard.value = userStats
  
      // Calculate overall stats
      stats.value = {
        totalUsers: users.length,
        totalJuz: userStats.reduce((sum, user) => sum + user.total_juz, 0),
        activeToday: userStats.filter(user => user.active_today).length
      }
  
    } catch (error) {
      console.error('Error loading leaderboard:', error)
      alert('Gagal memuat leaderboard')
    } finally {
      isLoading.value = false
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
    
    await loadLeaderboard()
  })
  
  // Watch for period changes
  watch(selectedPeriod, () => {
    loadLeaderboard()
  })
  </script>
  
  <style scoped>
  .card {
    @apply bg-white rounded-2xl shadow-lg p-6 border border-gray-100;
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
  
  /* Active link in navigation */
  .router-link-exact-active {
    @apply text-primary;
  }
  
  .router-link-exact-active svg {
    @apply text-primary;
  }
  
  /* Custom scrollbar for table */
  .table-container {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .table-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .table-container::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded;
  }
  
  .table-container::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded hover:bg-gray-400 transition-colors;
  }
  
  /* Rank badge styling */
  .rank-badge-1 {
    @apply bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-lg;
  }
  
  .rank-badge-2 {
    @apply bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md;
  }
  
  .rank-badge-3 {
    @apply bg-gradient-to-br from-amber-700 to-amber-800 text-white shadow-md;
  }
  </style>