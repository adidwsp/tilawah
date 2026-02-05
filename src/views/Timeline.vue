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
              <h1 class="text-2xl font-bold">Linimasa</h1>
              <p class="text-emerald-100">Aktivitas tilawah terkini</p>
            </div>
          </div>
  
          <!-- Stats Summary -->
          <div class="flex justify-around text-center mb-4">
            <div>
              <div class="text-2xl font-bold">{{ stats.totalToday }}</div>
              <div class="text-sm text-emerald-100">Hari Ini</div>
            </div>
            <div>
              <div class="text-2xl font-bold">{{ stats.totalUsers }}</div>
              <div class="text-sm text-emerald-100">User Aktif</div>
            </div>
            <div>
              <div class="text-2xl font-bold">{{ stats.totalJuz }}</div>
              <div class="text-sm text-emerald-100">Total Juz</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="container mx-auto px-4 -mt-6">
        <!-- Filter Controls -->
        <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            @click="setFilter('all')"
            class="flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200"
            :class="currentFilter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'"
          >
            Semua
          </button>
          <button
            @click="setFilter('juz')"
            class="flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200"
            :class="currentFilter === 'juz' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'"
          >
            Juz
          </button>
          <button
            @click="setFilter('surah')"
            class="flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200"
            :class="currentFilter === 'surah' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'"
          >
            Surah
          </button>
          
          <!-- User Filter -->
          <div class="relative">
            <button
              @click="showUserFilter = !showUserFilter"
              class="flex-shrink-0 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
              {{ selectedUser ? selectedUser.username : 'Semua User' }}
            </button>
            
            <!-- User Dropdown -->
            <div v-if="showUserFilter" class="absolute top-full mt-1 left-0 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
              <button
                @click="selectUser(null)"
                class="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100"
              >
                Semua User
              </button>
              <button
                v-for="user in allUsers"
                :key="user.id"
                @click="selectUser(user)"
                class="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                {{ user.username }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-gray-600">Memuat timeline...</p>
        </div>
  
        <!-- Empty State -->
        <div v-else-if="filteredReports.length === 0" class="card text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Belum ada laporan</h3>
          <p class="text-gray-500 mb-6">Jadilah yang pertama melaporkan tilawah!</p>
          <button @click="goToReport" class="btn-primary px-6 py-2">
            Laporkan Tilawah
          </button>
        </div>
  
        <!-- Timeline -->
        <div v-else class="space-y-4">
          <!-- Today's Reports -->
          <div v-if="todayReports.length > 0">
            <h2 class="text-lg font-bold text-gray-800 mb-3 sticky top-0 bg-gradient-to-b from-emerald-50 to-blue-50 py-2 z-10">Hari Ini</h2>
            <div class="space-y-4">
                <TimelineItem
                    v-for="report in todayReports"
                    :key="report.id"
                    :report="report"
                    @delete="handleDeleteReport"
                    />
            </div>
          </div>
  
          <!-- Yesterday's Reports -->
          <div v-if="yesterdayReports.length > 0">
            <h2 class="text-lg font-bold text-gray-800 mb-3 sticky top-0 bg-gradient-to-b from-emerald-50 to-blue-50 py-2 z-10">Kemarin</h2>
            <div class="space-y-4">
              <TimelineItem
                v-for="report in yesterdayReports"
                :key="report.id"
                :report="report"
                @reaction="handleReaction"
              />
            </div>
          </div>
  
          <!-- Older Reports -->
          <div v-if="olderReports.length > 0">
            <h2 class="text-lg font-bold text-gray-800 mb-3 sticky top-0 bg-gradient-to-b from-emerald-50 to-blue-50 py-2 z-10">Sebelumnya</h2>
            <div class="space-y-4">
              <TimelineItem
                v-for="report in olderReports"
                :key="report.id"
                :report="report"
                @reaction="handleReaction"
              />
            </div>
          </div>
  
          <!-- Load More Button -->
          <div v-if="hasMore" class="text-center pt-6">
            <button
              @click="loadMore"
              :disabled="isLoadingMore"
              class="btn-primary px-8 py-3 disabled:opacity-50"
            >
              {{ isLoadingMore ? 'Memuat...' : 'Muat Lebih Banyak' }}
            </button>
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
            class="flex flex-col items-center text-gray-500 hover:text-primary"
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
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import { supabase } from '../supabase/client'
  import TimelineItem from '../components/TimelineItem.vue'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  // State
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const showUserFilter = ref(false)
  const currentFilter = ref('all') // 'all', 'juz', 'surah'
  const selectedUser = ref(null)
  
  // Reports data
  const allReports = ref([])
  const allUsers = ref([])
  
  // Pagination
  const page = ref(1)
  const pageSize = 20
  const hasMore = ref(true)
  
  // Stats
  const stats = ref({
    totalToday: 0,
    totalUsers: 0,
    totalJuz: 0
  })
  
  // Computed
  const filteredReports = computed(() => {
    let reports = allReports.value
  
    // Filter by type
    if (currentFilter.value === 'juz') {
      reports = reports.filter(r => r.report_type === 'juz')
    } else if (currentFilter.value === 'surah') {
      reports = reports.filter(r => r.report_type === 'surah')
    }
  
    // Filter by user
    if (selectedUser.value) {
      reports = reports.filter(r => r.user_id === selectedUser.value.id)
    }
  
    return reports
  })
  
  const todayReports = computed(() => {
    const today = new Date().toDateString()
    return filteredReports.value.filter(report => 
      new Date(report.created_at).toDateString() === today
    )
  })
  
  const yesterdayReports = computed(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    return filteredReports.value.filter(report => 
      new Date(report.created_at).toDateString() === yesterdayStr &&
      !todayReports.value.includes(report)
    )
  })
  
  const olderReports = computed(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    return filteredReports.value.filter(report => {
      const reportDate = new Date(report.created_at).toDateString()
      return reportDate !== new Date().toDateString() && 
             reportDate !== yesterdayStr
    })
  })
  
  // Methods
  const goBack = () => {
    router.push('/dashboard')
  }
  
  const goToReport = () => {
    router.push('/report')
  }
  
  const setFilter = (filter) => {
    currentFilter.value = filter
  }
  
  const selectUser = (user) => {
    selectedUser.value = user
    showUserFilter.value = false
  }
  
  const handleReaction = async (reactionData) => {
    console.log('Reaction:', reactionData)
    // TODO: Implement reaction system
  }
  
  const loadMore = async () => {
    if (isLoadingMore.value || !hasMore.value) return
    
    isLoadingMore.value = true
    page.value += 1
    
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          users (username)
        `)
        .order('created_at', { ascending: false })
        .range((page.value - 1) * pageSize, page.value * pageSize - 1)
      
      if (error) throw error
      
      if (data.length < pageSize) {
        hasMore.value = false
      }
      
      allReports.value = [...allReports.value, ...data]
    } catch (error) {
      console.error('Error loading more reports:', error)
    } finally {
      isLoadingMore.value = false
    }
  }
  
  const loadStats = async () => {
    try {
      // Total today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { count: todayCount } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())
      
      // Total users
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      
      // Total juz
      const { data: juzData } = await supabase
        .from('reports')
        .select('juz')
        .eq('report_type', 'juz')
      
      const totalJuz = juzData.reduce((sum, report) => sum + (report.juz || 0), 0)
      
      stats.value = {
        totalToday: todayCount || 0,
        totalUsers: userCount || 0,
        totalJuz: totalJuz
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }
  
  const loadInitialData = async () => {
    isLoading.value = true
    
    try {
      // Load users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, username')
        .order('username')
      
      if (usersError) throw usersError
      allUsers.value = users || []
      
      // Load reports with user info
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select(`
          *,
          users (username)
        `)
        .order('created_at', { ascending: false })
        .limit(pageSize)
      
      if (reportsError) throw reportsError
      allReports.value = reports || []
      
      // Check if there's more data
      const { count: totalCount } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
      
      hasMore.value = totalCount > pageSize
      
      // Load stats
      await loadStats()
    } catch (error) {
      console.error('Error loading initial data:', error)
      alert('Gagal memuat data timeline')
    } finally {
      isLoading.value = false
    }
  }
  
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('realtime-reports')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'reports' },
        async (payload) => {
          // Fetch the new report with user info
          const { data: newReport, error } = await supabase
            .from('reports')
            .select(`
              *,
              users (username)
            `)
            .eq('id', payload.new.id)
            .single()
          
          if (!error && newReport) {
            // Add to beginning of list
            allReports.value.unshift(newReport)
            
            // Update stats
            await loadStats()
          }
        }
      )
      .subscribe()
    
    return channel
  }

  // Tambahkan method di Timeline.vue:
    const handleDeleteReport = async (reportId) => {
    const result = await reportsStore.deleteReport(reportId)
    if (result.success) {
        // Remove from local state
        allReports.value = allReports.value.filter(r => r.id !== reportId)
        alert('✅ Laporan berhasil dihapus')
    } else {
        alert('❌ Gagal menghapus laporan: ' + result.error)
    }
    }

    const setupRealtime = () => {
        const channel = supabase
            .channel(`report-${props.report.id}`)
            .on('postgres_changes', 
            { 
                event: '*', 
                schema: 'public', 
                table: 'reactions',
                filter: `report_id=eq.${props.report.id}`
            },
            async () => {
                // Refresh reactions
                const freshReactions = await interactionsStore.fetchReactionsForReport(props.report.id)
                reactions.value = freshReactions
            }
            )
            .on('postgres_changes', 
            { 
                event: '*', 
                schema: 'public', 
                table: 'comments',
                filter: `report_id=eq.${props.report.id}`
            },
            async () => {
                // Refresh comments
                const freshComments = await interactionsStore.fetchCommentsForReport(props.report.id)
                comments.value = freshComments
            }
            )
            .subscribe()
        
        return channel
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
    
    await loadInitialData()
    
    // Setup realtime subscription
    const channel = setupRealtimeSubscription()
    
    // Close subscription on unmount
    onUnmounted(() => {
      supabase.removeChannel(channel)
    })
  })
  
  // Close user dropdown when clicking outside
  onMounted(() => {
    
    
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        showUserFilter.value = false
      }
    })
  })
  </script>
  
  <style scoped>
  .card {
    @apply bg-white rounded-2xl shadow-lg p-6 border border-gray-100;
  }
  
  .btn-primary {
    @apply bg-primary text-white font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2;
  }
  
  .router-link-exact-active {
    @apply text-primary;
  }
  
  .router-link-exact-active svg {
    @apply text-primary;
  }
  </style>