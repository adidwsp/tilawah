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
            <h1 class="text-2xl font-bold">{{ isEditMode ? 'Edit Laporan' : 'Lapor Tilawah' }}</h1>
            <p class="text-emerald-100">{{ isEditMode ? 'Edit progress tilawah Anda' : 'Catat progress tilawah Anda' }}
            </p>
          </div>
        </div>

        <!-- Date Display -->
        <div class="text-center bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
          <div class="date-hijri text-xl font-bold flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ currentDate }}
          </div>
          <div class="text-sm text-emerald-100 mt-1">
            {{ currentTime }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Form -->
    <div class="container mx-auto px-4 -mt-6">
      <div class="card bg-white mb-6">
        <!-- Toggle Input Mode -->
        <div class="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
          <button @click="inputMode = 'juz'"
            class="flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all duration-200" :class="inputMode === 'juz'
              ? 'bg-white text-primary shadow-md'
              : 'text-gray-600 hover:text-primary'">
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Lapor Juz</span>
            </div>
          </button>

          <button @click="inputMode = 'surah'"
            class="flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all duration-200" :class="inputMode === 'surah'
              ? 'bg-white text-primary shadow-md'
              : 'text-gray-600 hover:text-primary'">
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 3h20v4H2V3zm0 6h20v4H2V9zm0 6h20v4H2v-4z" />
              </svg>
              <span>Surah & Ayat</span>
            </div>
          </button>
        </div>

        <!-- Juz Input -->
        <div v-if="inputMode === 'juz'" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Masukkan Juz yang Telah Dikhatamkan
            </label>
            <input v-model.number="selectedJuz" type="number" min="1" max="30"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-2xl font-bold"
              placeholder="1" />
            <div v-if="selectedJuz && selectedJuz >= 1 && selectedJuz <= 30" class="mt-4 p-3 bg-emerald-50 rounded-xl">
              <div class="text-sm text-emerald-800">
                <span class="font-semibold">Juz {{ selectedJuz }}</span>
                <span class="text-emerald-600 ml-2">{{ getJuzRange(selectedJuz) }}</span>
              </div>
            </div>
            <div v-if="juzError" class="text-red-600 text-xs mt-2">{{ juzError }}</div>
          </div>

          <!-- Quick Action -->
          <button v-if="lastJuz > 0 && lastJuz < 30" @click="selectedJuz = lastJuz + 1"
            class="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 transition-all duration-200 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Lanjutkan Juz {{ lastJuz + 1 }}
          </button>
        </div>

        <!-- Surah Input -->
        <div v-else class="space-y-6">
          <!-- Surah Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cari Surah
            </label>
            <div class="relative">
              <input v-model="surahSearch" @input="filterSurahs" type="text"
                placeholder="Ketik nama surah (contoh: Al-Fatihah, Yasin)"
                class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200" />
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </div>
            </div>

            <!-- Surah Suggestions -->
            <div v-if="filteredSurahs.length > 0 && surahSearch"
              class="mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-sm">
              <button v-for="surah in filteredSurahs.slice(0, 8)" :key="surah.id" @click="selectSurah(surah)"
                class="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-800">{{ surah.name }}</div>
                  <div class="text-xs text-gray-500">
                    <span class="text-primary">Juz {{ getSurahJuzInfo(surah) }}</span> •
                    {{ surah.ayat }} ayat •
                    {{ surah.type }}
                  </div>
                </div>
                <div class="text-lg text-gray-300 font-arabic">{{ surah.arabic }}</div>
              </button>
            </div>
          </div>

          <!-- Selected Surah Info -->
          <div v-if="selectedSurah" class="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div class="flex items-center justify-between mb-2">
              <div>
                <h3 class="font-bold text-emerald-800">{{ selectedSurah.name }}</h3>
                <p class="text-sm text-emerald-600">
                  {{ getSurahJuzInfo(selectedSurah) }} • {{ selectedSurah.ayat }} ayat
                </p>
              </div>
              <span class="text-2xl font-arabic text-emerald-700">{{ selectedSurah.arabic }}</span>
            </div>

            <!-- Ayat Terakhir Input -->
            <div class="mt-3">
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Ayat Terakhir yang Dibaca
              </label>
              <div class="relative">
                <input v-model.number="ayatEnd" type="number" min="1" :max="selectedSurah.ayat"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center"
                  placeholder="1" />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  / {{ selectedSurah.ayat }}
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Membaca dari ayat 1 sampai ayat {{ ayatEnd || 1 }}
              </p>
              <div v-if="ayatError" class="text-red-600 text-xs mt-2">{{ ayatError }}</div>

              <!-- Auto calculate juz preview -->
              <div v-if="ayatEnd && ayatEnd > 0" class="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                <span class="font-medium">Juz terdeteksi: {{ calculateJuzFromSurahAndAyat() }}</span>
              </div>
            </div>
          </div>

          <!-- Recent Surah History -->
          <div v-if="surahHistory.length > 0" class="mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Surah terakhir Anda:</h4>
            <div class="flex flex-wrap gap-2">
              <button v-for="report in surahHistory.slice(0, 5)" :key="report.id" @click="loadSurahFromHistory(report)"
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2">
                <span>{{ report.surah_name }}</span>
                <span class="text-xs bg-gray-300 text-gray-700 px-1.5 py-0.5 rounded">:{{ report.ayat_end }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Notes (Optional) -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Catatan (Opsional)
          </label>
          <textarea v-model="notes" rows="2" placeholder="Tambahkan catatan atau refleksi tilawah Anda..."
            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"></textarea>
          <div class="text-xs text-gray-500 mt-1 flex justify-between">
            <span>Maksimal 500 karakter</span>
            <span :class="notes.length > 490 ? 'text-red-500' : 'text-gray-400'">{{ notes.length }}/500</span>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button @click="submitReport" :disabled="isSubmitting || !isFormValid"
        class="w-full btn-primary py-4 text-lg font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
        <div class="flex items-center justify-center gap-3">
          <svg v-if="isSubmitting" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Perbarui Laporan' : 'Simpan Laporan') }}
        </div>
      </button>

      <!-- Recent Reports -->
      <div v-if="recentReports.length > 0 && !isEditMode" class="card bg-white mt-6">
        <h3 class="font-bold text-gray-800 mb-4">Laporan Terbaru Anda</h3>
        <div class="space-y-3">
          <div v-for="report in recentReports.slice(0, 3)" :key="report.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <span class="font-bold">{{ report.juz || '📖' }}</span>
              </div>
              <div>
                <div class="font-medium">
                  <span v-if="report.report_type === 'juz'">Juz {{ report.juz }}</span>
                  <span v-else>{{ report.surah_name }}: {{ report.ayat_end }}</span>
                </div>
                <div class="text-xs text-gray-500 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatTime(report.created_at) }}
                </div>
              </div>
            </div>
            <button @click="editReport(report)" class="text-gray-400 hover:text-primary transition-colors"
              title="Edit laporan ini">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
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

        <router-link to="/report" class="flex flex-col items-center text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-xs mt-1">Lapor</span>
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
          <span class="text-xs mt-1">Leaderboard</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth'
import { useReportsStore } from '../stores/reports'
import { surahs as allSurahs, juzRanges } from '../utils/surahData'
import { getJuzFromSurahAndAyat, getSurahAndAyatFromJuz } from '../utils/juzCalculator'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const toast = useToast()

// State
const inputMode = ref('juz')
const selectedJuz = ref('')
const surahSearch = ref('')
const selectedSurah = ref(null)
const ayatEnd = ref('')
const notes = ref('')
const isSubmitting = ref(false)
const isEditMode = ref(false)
const editingReportId = ref(null)
const recentReports = ref([])

// Computed
const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
})

const filteredSurahs = computed(() => {
  if (!surahSearch.value.trim()) return []
  const searchTerm = surahSearch.value.toLowerCase()
  return allSurahs.filter(surah =>
    surah.name.toLowerCase().includes(searchTerm) ||
    surah.arabic.includes(surahSearch.value)
  )
})

const isFormValid = computed(() => {
  if (inputMode.value === 'juz') {
    const juz = parseInt(selectedJuz.value)
    return juz >= 1 && juz <= 30
  } else {
    if (!selectedSurah.value) return false
    const end = parseInt(ayatEnd.value)
    return end >= 1 && end <= selectedSurah.value.ayat
  }
})

const juzError = computed(() => {
  if (!selectedJuz.value) return ''
  const juz = parseInt(selectedJuz.value)
  if (isNaN(juz)) return 'Harus berupa angka'
  if (juz < 1) return 'Juz minimal 1'
  if (juz > 30) return 'Juz maksimal 30'
  return ''
})

const ayatError = computed(() => {
  if (!selectedSurah.value || !ayatEnd.value) return ''

  const end = parseInt(ayatEnd.value)
  if (isNaN(end)) return 'Harus berupa angka'

  const maxAyat = selectedSurah.value.ayat

  if (end < 1) return 'Ayat terakhir minimal 1'
  if (end > maxAyat) return `Ayat terakhir maksimal ${maxAyat}`
  return ''
})

const lastJuz = computed(() => {
  if (recentReports.value.length === 0) return 0
  const juzReports = recentReports.value.filter(r => r.report_type === 'juz')
  if (juzReports.length === 0) return 0
  return Math.max(...juzReports.map(r => r.juz))
})

const surahHistory = computed(() => {
  return recentReports.value
    .filter(r => r.report_type === 'surah' && r.surah_name)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// Methods
const goBack = () => {
  if (isEditMode.value) {
    router.push('/edit')
  } else {
    router.push('/dashboard')
  }
}

const getJuzRange = (juz) => {
  return juzRanges[Number(juz)] || `Juz ${juz}`
}

const getSurahJuzInfo = (surah) => {
  // Handle juz ranges like "1-3"
  if (surah.juz.includes('-')) {
    return `Juz ${surah.juz}`
  }
  return `Juz ${surah.juz}`
}

const filterSurahs = () => {
  if (selectedSurah.value && !surahSearch.value.includes(selectedSurah.value.name)) {
    selectedSurah.value = null
    ayatEnd.value = ''
  }
}

const selectSurah = (surah) => {
  selectedSurah.value = surah
  surahSearch.value = surah.name
  ayatEnd.value = '1'

  // Auto-scroll to ayat input
  nextTick(() => {
    const ayatInput = document.querySelector('input[type="number"]')
    if (ayatInput) ayatInput.focus()
  })
}

const calculateJuzFromSurahAndAyat = () => {
  if (!selectedSurah.value || !ayatEnd.value) return 1
  return getJuzFromSurahAndAyat(selectedSurah.value.name, parseInt(ayatEnd.value))
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editReport = (report) => {
  // Reset form first
  resetForm()

  isEditMode.value = true
  editingReportId.value = report.id

  if (report.report_type === 'juz') {
    inputMode.value = 'juz'
    selectedJuz.value = report.juz
  } else {
    inputMode.value = 'surah'
    const surah = allSurahs.find(s => s.name === report.surah_name)
    if (surah) {
      selectedSurah.value = surah
      surahSearch.value = surah.name
      ayatEnd.value = report.ayat_end
    }
  }
  notes.value = report.notes || ''
}

const loadSurahFromHistory = (report) => {
  inputMode.value = 'surah'
  const surah = allSurahs.find(s => s.name === report.surah_name)
  if (surah) {
    selectedSurah.value = surah
    surahSearch.value = surah.name
    ayatEnd.value = report.ayat_end
  }
}

const resetForm = () => {
  selectedJuz.value = ''
  selectedSurah.value = null
  surahSearch.value = ''
  ayatEnd.value = ''
  notes.value = ''
  isEditMode.value = false
  editingReportId.value = null
}

const submitReport = async () => {
  if (!isFormValid.value) {
    toast.error('Harap isi form dengan benar');
    return
  }

  isSubmitting.value = true

  try {
    let reportData = {
      user_id: authStore.user.id,
      report_type: inputMode.value,
      notes: notes.value.trim() || null
    }

    if (inputMode.value === 'juz') {
      reportData.juz = parseInt(selectedJuz.value)

      // Auto calculate surah and ayat from juz
      const juzInfo = getSurahAndAyatFromJuz(reportData.juz)
      reportData.surah_name = juzInfo.surahName
      reportData.ayat_start = juzInfo.ayatStart || 1
      reportData.ayat_end = juzInfo.ayatEnd
    } else {
      reportData.surah_name = selectedSurah.value.name
      reportData.ayat_start = 1
      reportData.ayat_end = parseInt(ayatEnd.value)

      // Auto calculate juz from surah and ayat
      reportData.juz = getJuzFromSurahAndAyat(selectedSurah.value.name, reportData.ayat_end)
    }

    let result
    if (isEditMode.value && editingReportId.value) {
      // Update existing report
      result = await reportsStore.updateReport(editingReportId.value, reportData)
    } else {
      // Create new report
      result = await reportsStore.createReport(reportData)
    }

    if (result.success) {
      toast.success(isEditMode.value ? 'Laporan berhasil diperbarui!' : 'Laporan berhasil disimpan!');

      if (isEditMode.value) {
        router.push('/edit')
      } else {
        resetForm()
        await loadRecentReports()
      }
    } else {
      toast.error('Gagal menyimpan laporan: ' + result.error);
    }
  } catch (error) {
    console.error('Submit error:', error)
    toast.error('Terjadi kesalahan saat menyimpan laporan');
  } finally {
    isSubmitting.value = false
  }
}

const loadRecentReports = async () => {
  if (authStore.user) {
    await reportsStore.fetchUserReports(authStore.user.id)
    recentReports.value = reportsStore.reports
      .filter(r => r.user_id === authStore.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
  }
}

const loadReportForEdit = async (reportId) => {
  try {
    // Find report in store first
    const report = reportsStore.reports.find(r => r.id === reportId)
    if (report) {
      editReport(report)
      return
    }

    // If not in store, fetch from supabase
    const { supabase } = await import('../supabase/client')
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (error) throw error
    editReport(data)
  } catch (error) {
    console.error('Error loading report for edit:', error)
    alert('Gagal memuat data laporan untuk diedit')
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

  await loadRecentReports()

  // Check if we're in edit mode from query parameter
  if (route.query.edit) {
    await loadReportForEdit(route.query.edit)
  }
})

// Watch for mode changes
watch(inputMode, (newMode) => {
  if (newMode === 'juz') {
    selectedSurah.value = null
    surahSearch.value = ''
    ayatEnd.value = ''
  } else {
    selectedJuz.value = ''
  }
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-2xl shadow-lg p-6 border border-gray-100;
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

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded hover:bg-gray-400 transition-colors;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
