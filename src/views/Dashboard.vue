<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-blue-50 pb-24">
    <!-- Header -->
    <div class="relative bg-[url('/images/bg-green.jpg')] bg-cover bg-center">
      <div class="absolute inset-0 bg-gradient-to-b from-emerald-400/60 to-emerald-800/90"></div>

      <div class="relative text-white container mx-auto px-4 py-6">
        <!-- User Info & Logout -->
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-2xl font-bold">Khatam Bareng Skrt</h1>
            <p class="text-emerald-100">Selamat datang, {{ user?.username || 'User' }}</p>
          </div>
          <button @click="handleLogout"
            class="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>

        <!-- Date Display (New Format) -->
        <div class="text-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <!-- Time - Simple and Clean -->
          <div class="text-2xl font-bold mb-1" style="font-family: 'JetBrains Mono', monospace;">
            {{ currentTime }}
          </div>

          <!-- Hijri Date -->
          <div class="text-lg font-semibold mb-1" style="font-family: 'Amiri', serif;">
            {{ hijriDate.day }} {{ hijriDate.month }} {{ hijriDate.year }} H
          </div>

          <!-- Gregorian Date -->
          <div class="text-sm text-emerald-100">
            {{ gregorianDate }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 -mt-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-gray-600">Memuat data dashboard...</p>
      </div>

      <div v-else>
        <!-- Today's Stats -->
        <!-- <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="card bg-white transform hover:scale-[1.02] transition-all duration-200">
            <div class="flex items-center gap-3">
              <div class="bg-emerald-100 p-3 rounded-xl">
                <svg class="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Juz Terakhir</p>
                <p class="text-2xl font-bold">{{ todaySummary.juz || '0' }}</p>
              </div>
            </div>
          </div>

          <div class="card bg-white transform hover:scale-[1.02] transition-all duration-200">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 p-3 rounded-xl">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Peringkat Anda</p>
                <p class="text-2xl font-bold" v-if="userRank">#{{ userRank }}</p>
                <p class="text-2xl font-bold" v-else>-</p>
              </div>
            </div>
          </div>

          <div class="card bg-white transform hover:scale-[1.02] transition-all duration-200">
            <div class="flex items-center gap-3">
              <div class="bg-purple-100 p-3 rounded-xl">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Terakhir Update</p>
                <p class="text-sm font-semibold">{{ todaySummary.lastUpdate ? new Date(todaySummary.lastUpdate).toLocaleString('id-ID') + ' WIB' : '-' }}</p>
              </div>
            </div>
          </div>

          <div class="card bg-white transform hover:scale-[1.02] transition-all duration-200">
            <div class="flex items-center gap-3">
              <div class="bg-amber-100 p-3 rounded-xl">
                <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Surah Terakhir</p>
                <p class="text-sm font-semibold">{{ todaySummary.lastSurah || '-' }}</p>
              </div>
            </div>
          </div>
        </div> -->

        <!-- Today's Stats dengan Responsive Mobile -->
        <div class="grid grid-cols-2 gap-3 md:gap-4 mb-6">
          <!-- Juz Terakhir -->
          <div class="card bg-white transform hover:scale-[1.02] transition-all duration-200">
            <div class="flex items-center gap-2 sm:gap-3 mobile:justify-center mobile:text-center">
              <!-- Icon disembunyikan di layar < 340px -->
              <div class="bg-emerald-100 p-2 sm:p-3 rounded-xl hide-on-mobile-small">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs sm:text-sm text-gray-500">Juz Terakhir</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ todaySummary.juz || '0' }}</p>
              </div>
            </div>
          </div>

          <!-- Peringkat Anda -->
          <div class="card bg-white transform hover:scale-[1.02] transition-all duration-200">
            <div class="flex items-center gap-2 sm:gap-3 mobile:justify-center mobile:text-center">
              <div class="bg-blue-100 p-2 sm:p-3 rounded-xl hide-on-mobile-small">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs sm:text-sm text-gray-500">Peringkat Anda</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800" v-if="userRank">#{{ userRank }}</p>
                <p class="text-xl sm:text-2xl font-bold text-gray-800" v-else>-</p>
              </div>
            </div>
          </div>

          <!-- Terakhir Update -->
          <div class="card bg-white transform hover:scale-[1.02] transition-all duration-200">
            <div class="flex items-center gap-2 sm:gap-3 mobile:justify-center mobile:text-center">
              <div class="bg-purple-100 p-2 sm:p-3 rounded-xl hide-on-mobile-small">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs sm:text-sm text-gray-500">Terakhir Update</p>
                <p class="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                  {{ formatLastUpdate(todaySummary.lastUpdate) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Surah Terakhir -->
          <div class="card bg-white transform hover:scale-[1.02] transition-all duration-200">
            <div class="flex items-center gap-2 sm:gap-3 mobile:justify-center mobile:text-center">
              <div class="bg-amber-100 p-2 sm:p-3 rounded-xl hide-on-mobile-small">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs sm:text-sm text-gray-500">Surah Terakhir</p>
                <p class="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                  {{ todaySummary.lastSurah || '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Progress Tilawah</h2>

          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <span class="font-semibold">Progress Khatam</span>
              <span class="text-primary font-bold">{{ progressPercentage }}%</span>
            </div>
            <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-1000"
                :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <div class="flex justify-between text-sm text-gray-500 mt-1">
              <span>{{ userStats.completedJuz || 0 }} / 30 Juz</span>
              <span v-if="userStats.estimatedDays > 0">Estimasi: {{ userStats.estimatedDays }} hari lagi</span>
              <span v-else>🎉 Sudah khatam!</span>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-emerald-50 rounded-xl">
              <div class="text-2xl font-bold text-primary">{{ userStats.averageDaily || '0.0' }}</div>
              <div class="text-sm text-gray-600">Rata-rata Harian</div>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-xl">
              <div class="text-2xl font-bold text-blue-600">{{ userStats.targetDaily || '1.0' }}</div>
              <div class="text-sm text-gray-600">Target Harian</div>
            </div>
          </div>
        </div>

        <!-- Enhanced Chart with Lines -->
        <div class="card mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">Aktivitas 7 Hari Terakhir</h2>
            <div class="text-sm text-gray-500">
              Total: {{ weeklyTotal }} Juz
            </div>
          </div>

          <!-- Chart Container -->
          <div class="h-48 relative">
            <!-- Grid Lines -->
            <div class="absolute inset-0 flex flex-col justify-between">
              <div v-for="line in 4" :key="line" class="border-t border-gray-100"></div>
            </div>

            <!-- Bars and Line Chart -->
            <div class="absolute inset-0 flex items-end px-2">
              <!-- Bars -->
              <div v-for="(day, index) in weeklyActivity" :key="index"
                class="flex-1 flex flex-col items-center mx-1 relative group">
                <!-- Bar -->
                <div class="w-full rounded-t-lg transition-all duration-300 cursor-pointer relative z-10"
                  :class="day.active ? 'bg-primary' : 'bg-gray-200'" :style="{ height: day.height + '%' }"
                  :title="`${day.day}: ${day.juz} Juz`">
                  <!-- Hover Effect -->
                  <div
                    class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg">
                  </div>
                </div>

                <!-- Day Label -->
                <div class="text-xs mt-2 text-gray-600">{{ day.day }}</div>
                <!-- Value -->
                <div class="text-xs font-semibold" :class="day.active ? 'text-primary' : 'text-gray-400'">
                  {{ day.juz }}
                </div>

                <!-- Line Connection Points -->
                <div class="absolute top-0 w-2 h-2 bg-white border-2 rounded-full transform -translate-y-1/2 z-20"
                  :class="day.active ? 'border-primary' : 'border-gray-300'" :style="{
                    top: `calc(${100 - day.height}% - 8px)`,
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-50%)'
                  }"></div>
              </div>

              <!-- Connecting Lines (SVG) -->
              <svg class="absolute inset-0 w-full h-48 pointer-events-none">
                <path v-if="linePath" :d="linePath" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" stroke-dasharray="5,5" />
              </svg>
            </div>

            <!-- Y-axis Labels -->
            <div class="absolute -left-1 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
              <div>{{ maxJuz }}</div>
              <div>{{ Math.round(maxJuz * 0.75) }}</div>
              <div>{{ Math.round(maxJuz * 0.5) }}</div>
              <div>{{ Math.round(maxJuz * 0.25) }}</div>
              <div>0</div>
            </div>
          </div>

          <!-- Legend -->
          <div class="flex justify-center gap-4 mt-4 text-xs">
            <div class="flex items-center gap-1">
              <div class="w-3 h-3 bg-primary rounded"></div>
              <span class="text-gray-600">Aktivitas</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-3 h-3 border-2 border-primary rounded-full"></div>
              <span class="text-gray-600">Trend</span>
            </div>
          </div>
        </div>

        <!-- Top 3 Leaderboard -->
        <div class="card mb-6">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Top 3 Leaderboard</h2>
          <div v-if="top3.length === 0" class="text-center py-4 text-gray-500">
            Belum ada data leaderboard
          </div>
          <div v-else class="space-y-4">
            <div v-for="(user, index) in top3" :key="user.id" class="flex items-center justify-between p-3 rounded-xl"
              :class="{
                'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200': index === 0,
                'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200': index === 1,
                'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200': index === 2
              }">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" :class="{
                  'bg-gradient-to-br from-yellow-500 to-yellow-600': index === 0,
                  'bg-gradient-to-br from-gray-400 to-gray-500': index === 1,
                  'bg-gradient-to-br from-amber-700 to-amber-800': index === 2
                }">
                  {{ index + 1 }}
                </div>
                <div>
                  <div class="font-bold text-gray-800">{{ user.username }}</div>
                  <div class="text-sm text-gray-600">{{ user.total_juz }} Juz</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-800">
                  {{ calculateKhatamPercentage(user.total_juz) }}%
                </div>
                <div class="text-xs text-gray-500">Khatam</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="card mb-24">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Pencapaian</h2>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="badge in achievements" :key="badge.id"
              class="flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200"
              :class="badge.achieved ? 'border-primary bg-emerald-50' : 'border-gray-200 bg-gray-50 opacity-60'">
              <div class="text-2xl mb-2">{{ badge.icon }}</div>
              <div class="text-sm font-semibold text-center">{{ badge.name }}</div>
              <div class="text-xs text-gray-500 text-center">{{ badge.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Button (Fixed with proper spacing) -->
      <div class="fixed bottom-20 left-0 right-0 px-4 z-10">
        <div class="bg-white rounded-2xl shadow-lg p-4">
          <button @click="goToReport" class="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Catat Tilawah
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div class="flex justify-around items-center py-3">
        <router-link to="/dashboard" class="flex flex-col items-center text-primary">
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

        <router-link to="/leaderboard" class="flex flex-col items-center text-gray-500 hover:text-primary">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span class="text-xs mt-1">Ranking</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDashboardStore } from '../stores/dashboard'
import HijriDate from 'hijri-date'

const router = useRouter()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

// State
const isLoading = ref(true)
const userRank = ref(null)
const currentTime = ref('')

// Update time every second
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

// User data
const user = computed(() => authStore.user)

// Date calculations
const hijriDate = computed(() => {
  const months = [
    'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
    'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
    'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'
  ]

  try {
    const hijri = new HijriDate()
    return {
      day: hijri.getDate() - 2,
      month: months[hijri.getMonth() - 1],

      year: hijri.getFullYear()
    }
  } catch (err) {
    // Fallback if library fails
    return {
      day: 1,
      month: "Sya'ban",
      year: 1447
    }
  }
})

const gregorianDate = computed(() => {
  const now = new Date()
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const dayName = days[now.getDay()]
  const date = now.getDate()
  const month = months[now.getMonth()]
  const year = now.getFullYear()

  return `${dayName}, ${date} ${month} ${year}`
})

// Format last update dengan human readable & compact
const formatLastUpdate = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} mnt`;
  if (diffHours < 24) return `${diffHours} jam`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hr`;

  // Format pendek: 12 Mar, 14:30
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', '');
}




// Dashboard data from store
const userStats = computed(() => dashboardStore.userStats)
const weeklyActivity = computed(() => dashboardStore.weeklyActivity)
const todaySummary = computed(() => dashboardStore.todaySummary)
const top3 = computed(() => dashboardStore.leaderboard)

// Progress percentage (limited to 1 decimal)
const progressPercentage = computed(() => {
  const completed = userStats.value.completedJuz || 0
  const percentage = (completed / 30) * 100
  return Math.min(percentage, 100).toFixed(1)
})

// Chart calculations
const weeklyTotal = computed(() => {
  return weeklyActivity.value.reduce((sum, day) => sum + day.juz, 0)
})

const maxJuz = computed(() => {
  const values = weeklyActivity.value.map(day => day.juz)
  return Math.max(...values, 1) // At least 1 for chart scaling
})

// Calculate line path for connecting dots
const linePath = computed(() => {
  if (weeklyActivity.value.length < 2) return ''

  const barWidth = 100 / weeklyActivity.value.length
  const padding = barWidth / 2

  const points = weeklyActivity.value.map((day, index) => {
    const x = padding + (index * barWidth)
    const y = 100 - day.height // Invert because SVG y=0 is top
    return `${x}%,${y}%`
  })

  return `M ${points.join(' L ')}`
})

// Achievements
const achievements = computed(() => {
  const stats = userStats.value
  const completedJuz = stats.completedJuz || 0

  return [
    {
      id: 1,
      name: 'Juz 1',
      description: 'Mulai perjalanan',
      icon: '📖',
      achieved: completedJuz >= 1
    },
    {
      id: 2,
      name: 'Streak 3',
      description: '3 hari berturut',
      icon: '🔥',
      achieved: checkStreak(3)
    },
    {
      id: 3,
      name: 'Konsisten',
      description: 'Rata-rata 1 juz/hari',
      icon: '⭐',
      achieved: parseFloat(stats.averageDaily || 0) >= 1.0
    },
    {
      id: 4,
      name: 'Top 10',
      description: 'Peringkat 10 besar',
      icon: '🏆',
      achieved: userRank.value && userRank.value <= 10
    },
    {
      id: 5,
      name: 'Juz 10',
      description: 'Sepuluh juz pertama',
      icon: '🎯',
      achieved: completedJuz >= 10
    },
    {
      id: 6,
      name: 'Ramadhan',
      description: 'Aktif di Ramadhan',
      icon: '🌙',
      achieved: checkRamadhanActivity()
    }
  ]
})

// Methods
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const goToReport = () => {
  router.push('/report')
}

const calculateKhatamPercentage = (totalJuz) => {
  const percentage = (totalJuz / 30) * 100
  return Math.min(percentage, 100).toFixed(1)
}

const checkStreak = (days) => {
  const activityDays = weeklyActivity.value.filter(day => day.active).length
  return activityDays >= days
}

const checkRamadhanActivity = () => {
  const today = new Date()
  // Example: Ramadhan 1445 ≈ March 11 - April 9, 2024
  const ramadhanStart = new Date('2024-03-11')
  const ramadhanEnd = new Date('2024-04-09')
  return today >= ramadhanStart && today <= ramadhanEnd
}


const loadDashboardData = async () => {
  if (!authStore.user?.id) return

  try {
    isLoading.value = true

    // Load user stats
    await dashboardStore.fetchUserStats(authStore.user.id)

    // Load user rank
    const rank = await dashboardStore.fetchUserRank(authStore.user.id)
    userRank.value = rank

    // Load top 3
    await dashboardStore.fetchTop3()

  } catch (error) {
    console.error('Error loading dashboard:', error)
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

  // Start clock
  updateTime()
  setInterval(updateTime, 1000)

  await loadDashboardData()

  // Auto-refresh every 30 seconds
  setInterval(async () => {
    if (authStore.user?.id) {
      await loadDashboardData()
    }
  }, 180000)
})
</script>

<style scoped>
/* Responsive untuk mobile kecil (lebar <= 340px) */
@media (max-width: 340px) {
  .hide-on-mobile-small {
    display: none !important;
  }

  .mobile\:justify-center {
    justify-content: center !important;
  }

  .mobile\:text-center {
    text-align: center !important;
  }

  /* Sesuaikan padding card */
  .card {
    @apply p-3;
  }
}

/* Utility truncate */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* Perbaikan umum untuk mobile */
@media (max-width: 640px) {
  .grid-cols-2 {
    gap: 0.75rem;
  }

  .card {
    @apply p-3;
  }
}


.card {
  @apply bg-white rounded-2xl shadow-lg p-4 border border-gray-100;
}

.btn-primary {
  @apply bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2;
}

.router-link-exact-active {
  @apply text-primary;
}

.router-link-exact-active svg {
  @apply text-primary;
}

/* Smooth scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded hover:bg-gray-400 transition-colors;
}
</style>
