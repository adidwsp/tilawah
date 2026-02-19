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
            <h1 class="text-2xl font-bold">Leaderboard ({{ authStore.currentUserGender === 'laki-laki' ? 'Ikhwan' : 'Akhwat' }})</h1>
            <p class="text-emerald-100">Peringkat Berdasarkan Progress Terakhir</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 -mt-6">
      <!-- Current User Position -->
      <div v-if="currentUserRank" class="mb-6 p-4 bg-white rounded-2xl shadow-lg border-l-4 border-primary">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
              #{{ currentUserRank.rank }}
            </div>
            <div>
              <p class="font-bold text-gray-800">{{ currentUserRank.full_name }}</p>
              <p class="text-sm text-gray-600 flex items-center gap-2">
                <span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  Juz {{ currentUserRank.juz }}
                </span>
                <span class="text-gray-500">•</span>
                <span class="truncate max-w-[150px]">
                  {{ currentUserRank.surah_name }}:{{ currentUserRank.ayat_end }}
                </span>
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Progress Score</p>
            <p class="text-xl font-bold text-primary">{{ currentUserRank.progressScore.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Top 3 Podium -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-center mb-6 text-gray-800">Top 3 Performers</h2>

        <div class="flex items-end justify-center gap-4 mb-8">
          <!-- Second Place -->
          <div v-if="top3[1]" class="flex flex-col items-center flex-1 max-w-32">
            <div
              class="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-lg">
              2
            </div>
            <div class="w-full bg-white rounded-2xl shadow-lg p-4 text-center">
              <div class="font-bold text-gray-700 truncate">{{ top3[1].full_name }}</div>
              <div class="text-2xl font-bold text-gray-600 mt-2">Juz {{ top3[1].juz }}</div>
              <div class="text-xs text-gray-500 truncate">{{ top3[1].surah_name }}:{{ top3[1].ayat_end }}</div>
              <div class="text-xs text-emerald-600 mt-1 font-medium">
                {{ calculateKhatamPercentage(top3[1].juz) }}% Khatam
              </div>
            </div>
          </div>

          <!-- First Place -->
          <div v-if="top3[0]" class="flex flex-col items-center flex-1 max-w-40 -mt-8">
            <div
              class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-2 shadow-lg border-4 border-yellow-300">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div
              class="w-full bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-2xl shadow-xl p-4 text-center border-2 border-yellow-200">
              <div class="font-bold text-gray-800 truncate">{{ top3[0].full_name }}</div>
              <div class="text-3xl font-bold text-gray-800 mt-2">Juz {{ top3[0].juz }}</div>
              <div class="text-sm text-gray-600 truncate">{{ top3[0].surah_name }}:{{ top3[0].ayat_end }}</div>
              <div class="text-sm font-semibold text-emerald-700 mt-1">
                {{ calculateKhatamPercentage(top3[0].juz) }}% Khatam
              </div>
            </div>
          </div>

          <!-- Third Place -->
          <div v-if="top3[2]" class="flex flex-col items-center flex-1 max-w-32">
            <div
              class="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-lg">
              3
            </div>
            <div class="w-full bg-white rounded-2xl shadow-lg p-4 text-center">
              <div class="font-bold text-gray-700 truncate">{{ top3[2].full_name }}</div>
              <div class="text-2xl font-bold text-gray-600 mt-2">Juz {{ top3[2].juz }}</div>
              <div class="text-xs text-gray-500 truncate">{{ top3[2].surah_name }}:{{ top3[2].ayat_end }}</div>
              <div class="text-xs text-emerald-600 mt-1 font-medium">
                {{ calculateKhatamPercentage(top3[2].juz) }}% Khatam
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ranking Table -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Peringkat Lengkap</h2>

        <!-- Loading State -->
        <div v-if="leaderboardStore.isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-gray-600">Memuat peringkat...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="leaderboardStore.rankedLeaderboard.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Belum ada data</h3>
          <p class="text-gray-500">Mulai catat tilawah untuk muncul di leaderboard!</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[600px]">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-20">Rank</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Nama</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Progress Terakhir</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Waktu</th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600">Total Juz</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in rankedLeaderboard.slice(3)" :key="user.user_id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                :class="{ 'bg-blue-50': user.user_id === currentUser?.id }">
                <td class="py-4 px-4">
                  <div
                    class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-bold">
                    {{ user.rank }}
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div v-if="user.avatar_url" class="w-10 h-10 rounded-full overflow-hidden">
                      <img :src="user.avatar_url" class="w-full h-full object-cover">
                    </div>
                    <div v-else
                      class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {{ user.username?.charAt(0).toUpperCase() || 'U' }}
                    </div>
                    <div>
                      <div class="font-medium text-gray-800">{{ user.username }}</div>
                      <div class="text-xs text-gray-500">
                        {{ user.full_name || 'Anggota' }}
                      </div>
                    </div>
                    <span v-if="user.user_id === currentUser?.id"
                      class="text-xs bg-primary text-white px-2 py-1 rounded-full">
                      Anda
                    </span>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        Juz {{ user.juz }}
                      </span>
                      <span class="text-sm text-gray-600">•</span>
                      <span class="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                        {{ user.surah_name }}:{{ user.ayat_end }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ user.report_type === 'juz' ? 'Catatan Juz' : 'Catatan Surah' }}
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div class="text-sm text-gray-800">{{ formatRelativeTime(user.last_activity) }}</div>
                  <div class="text-xs text-gray-500">
                    {{ formatDate(user.last_activity) }}
                  </div>
                </td>
                <td class="py-4 px-4">
                  <div class="text-right">
                    <div class="text-lg font-bold text-gray-800">{{ user.total_juz }}</div>
                    <div class="text-xs text-gray-500">
                      {{ calculateKhatamPercentage(user.total_juz) }}% Khatam
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- User's Position (if not in top 10) -->
        <div v-if="currentUserRank && currentUserRank.rank > 10"
          class="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                #{{ currentUserRank.rank }}
              </div>
              <div>
                <div class="font-bold text-gray-800">Posisi Anda</div>
                <div class="text-sm text-gray-600">
                  {{ currentUserRank.surah_name }}:{{ currentUserRank.ayat_end }} • Juz {{ currentUserRank.juz }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600">Progress Score</div>
              <div class="text-xl font-bold text-primary">{{ currentUserRank.progressScore.toLocaleString() }}</div>
            </div>
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

        <router-link to="/leaderboard" class="flex flex-col items-center text-primary">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span class="text-xs mt-1">Leaderboard</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLeaderboardStore } from '../stores/leaderboard'

const router = useRouter()
const authStore = useAuthStore()
const leaderboardStore = useLeaderboardStore()

// Computed
const currentUser = computed(() => authStore.user)

const rankedLeaderboard = computed(() => {
  return leaderboardStore.rankedLeaderboard
})

const top3 = computed(() => rankedLeaderboard.value.slice(0, 3))

const currentUserRank = computed(() => {
  if (!currentUser.value) return null
  return rankedLeaderboard.value.find(user => user.user_id === currentUser.value.id)
})

// Methods
const goBack = () => {
  router.push('/dashboard')
}

const calculateKhatamPercentage = (juz) => {
  const percentage = (juz / 30) * 100
  return Math.min(Math.round(percentage), 100)
}

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 0) return `${diffDay} hari lalu`
  if (diffHour > 0) return `${diffHour} jam lalu`
  if (diffMin > 0) return `${diffMin} menit lalu`
  return 'Baru saja'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
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

  await leaderboardStore.fetchLeaderboard()
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-2xl shadow-lg p-6 border border-gray-100;
}

/* Active link in navigation */
.router-link-exact-active {
  @apply text-primary;
}

.router-link-exact-active svg {
  @apply text-primary;
}

/* Table row hover effect */
tbody tr {
  transition: all 0.2s ease;
}

tbody tr:hover {
  @apply transform scale-[1.002];
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded hover:bg-gray-400 transition-colors;
}
</style>