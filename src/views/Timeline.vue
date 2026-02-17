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
              <p class="text-emerald-100">Aktivitas tilawah terkini ({{ authStore.currentUserGender === 'laki-laki' ? 'Ikhwan' : 'Akhwat' }})</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="container mx-auto px-4 -mt-6">
        <!-- Loading State -->
        <div v-if="reportsStore.isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-gray-600">Memuat timeline...</p>
        </div>
  
        <!-- Empty State -->
        <div v-else-if="reportsStore.reports.length === 0" class="card text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Belum ada catatan</h3>
          <p class="text-gray-500 mb-6">Jadilah yang pertama mencatat tilawah!</p>
          <button @click="goToReport" class="btn-primary px-6 py-2">
            Catat Tilawah
          </button>
        </div>
  
        <!-- Timeline -->
        <div v-else class="space-y-4">
          <TimelineItem
            v-for="report in reportsStore.reports"
            :key="report.id"
            :report="report"
            @delete="handleDeleteReport"
          />
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
            <span class="text-xs mt-1">Catat</span>
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
  import { onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import { useReportsStore } from '../stores/reports'
  import { supabase } from '../supabase/client'
  import TimelineItem from '../components/TimelineItem.vue'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const reportsStore = useReportsStore()
  
  const goBack = () => {
    router.push('/dashboard')
  }
  
  const goToReport = () => {
    router.push('/report')
  }
  
  const handleDeleteReport = async (reportId) => {
    const result = await reportsStore.deleteReport(reportId)
    if (result.success) {
        alert('✅ Catatan berhasil dihapus')
    } else {
        alert('❌ Gagal menghapus catatan: ' + result.error)
    }
  }
  
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('realtime-reports')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'reports' },
        () => {
          // Refetch timeline on any change
          reportsStore.fetchTimelineReports()
        }
      )
      .subscribe()
    
    return channel
  }
  
  onMounted(async () => {
    if (!authStore.user) {
      authStore.initializeAuth()
      if (!authStore.user) {
        router.push('/login')
        return
      }
    }
    
    await reportsStore.fetchTimelineReports()
    
    const channel = setupRealtimeSubscription()
    
    onUnmounted(() => {
      supabase.removeChannel(channel)
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