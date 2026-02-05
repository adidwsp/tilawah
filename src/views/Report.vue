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
              <h1 class="text-2xl font-bold">Lapor Tilawah</h1>
              <p class="text-emerald-100">Catat progress tilawah Anda</p>
            </div>
          </div>
  
          <!-- Date Display -->
          <div class="text-center bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <div class="date-hijri text-xl font-bold">
              {{ hijriDate }}
            </div>
            <div class="text-sm text-emerald-100">
              {{ gregorianDate }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- Main Form -->
      <div class="container mx-auto px-4 -mt-6">
        <div class="card bg-white mb-6">
          <!-- Toggle Input Mode -->
          <div class="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              @click="inputMode = 'juz'"
              class="flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all duration-200"
              :class="inputMode === 'juz' 
                ? 'bg-white text-primary shadow-md' 
                : 'text-gray-600 hover:text-primary'"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>Lapor Juz</span>
              </div>
            </button>
            
            <button
              @click="inputMode = 'surah'"
              class="flex-1 py-3 px-4 rounded-lg text-center font-medium transition-all duration-200"
              :class="inputMode === 'surah' 
                ? 'bg-white text-primary shadow-md' 
                : 'text-gray-600 hover:text-primary'"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 3h20v4H2V3zm0 6h20v4H2V9zm0 6h20v4H2v-4z"/>
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
              <input
                v-model.number="selectedJuz"
                type="number"
                min="1"
                max="30"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-2xl font-bold"
                placeholder="1"
              />
              <div v-if="selectedJuz && selectedJuz >= 1 && selectedJuz <= 30" class="mt-4 p-3 bg-emerald-50 rounded-xl">
                <div class="text-sm text-emerald-800">
                  <span class="font-semibold">Juz {{ selectedJuz }}</span> 
                  <span class="text-emerald-600 ml-2">{{ getJuzRange(selectedJuz) }}</span>
                </div>
              </div>
              <div v-if="juzError" class="text-red-600 text-xs mt-2">{{ juzError }}</div>
            </div>
  
            <!-- Quick Action -->
            <button
              v-if="lastJuz > 0 && lastJuz < 30"
              @click="selectedJuz = lastJuz + 1"
              class="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
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
                <input
                  v-model="surahSearch"
                  @input="filterSurahs"
                  type="text"
                  placeholder="Ketik nama surah (contoh: Al-Fatihah, Yasin)"
                  class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
              </div>
  
              <!-- Surah Suggestions -->
              <div v-if="filteredSurahs.length > 0 && surahSearch" class="mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-sm">
                <button
                  v-for="surah in filteredSurahs.slice(0, 8)"
                  :key="surah.id"
                  @click="selectSurah(surah)"
                  class="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 flex items-center justify-between"
                >
                  <div>
                    <div class="font-medium text-gray-800">{{ surah.name }}</div>
                    <div class="text-xs text-gray-500">
                      <span class="text-primary">Juz {{ surah.juz }}</span> • 
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
                    Juz {{ selectedSurah.juz }} • {{ selectedSurah.ayat }} ayat
                  </p>
                </div>
                <span class="text-2xl font-arabic text-emerald-700">{{ selectedSurah.arabic }}</span>
              </div>
              
              <!-- Ayat Terakhir Input -->
              <div class="mt-3">
                <label class="block text-xs font-medium text-gray-600 mb-1">
                  Ayat Terakhir yang Dibaca
                </label>
                <input
                  v-model.number="ayatEnd"
                  type="number"
                  min="1"
                  :max="selectedSurah.ayat"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center"
                  placeholder="1"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Membaca dari ayat 1 sampai ayat {{ ayatEnd || 1 }}
                </p>
                <div v-if="ayatError" class="text-red-600 text-xs mt-2">{{ ayatError }}</div>
              </div>
            </div>
          </div>
  
          <!-- Notes (Optional) -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              v-model="notes"
              rows="2"
              placeholder="Tambahkan catatan atau refleksi tilawah Anda..."
              class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
            ></textarea>
          </div>
        </div>
  
        <!-- Submit Button -->
        <button
            @click="submitReport"
            :disabled="isSubmitting || !isFormValid"
            class="w-full btn-primary py-4 text-lg font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
            <div class="flex items-center justify-center gap-3">
                <svg v-if="isSubmitting" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Perbarui Laporan' : 'Simpan Laporan') }}
            </div>
            </button>
  
        <!-- Recent Reports -->
        <div v-if="recentReports.length > 0" class="card bg-white mt-6">
          <h3 class="font-bold text-gray-800 mb-4">Laporan Terbaru Anda</h3>
          <div class="space-y-3">
            <div 
              v-for="report in recentReports.slice(0, 3)" 
              :key="report.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <span class="font-bold">{{ report.juz || '📖' }}</span>
                </div>
                <div>
                  <div class="font-medium">
                    <span v-if="report.report_type === 'juz'">Juz {{ report.juz }}</span>
                    <span v-else>{{ report.surah_name }}: {{ report.ayat_end }}</span>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatDate(report.created_at) }}
                  </div>
                </div>
              </div>
              <button 
                @click="editReport(report)"
                class="text-gray-400 hover:text-primary transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
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
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import { useReportsStore } from '../stores/reports'
  import HijriDate from 'hijri-date'

  import { juzRanges } from '../utils/surahData'
  
  
  const router = useRouter()
  const authStore = useAuthStore()
  const reportsStore = useReportsStore()
  const isEditMode = ref(false)
  const editingReportId = ref(null)
  
  // Data
  const inputMode = ref('juz') // 'juz' or 'surah'
  const selectedJuz = ref('')
  const surahSearch = ref('')
  const selectedSurah = ref(null)
  const ayatEnd = ref('')
  const notes = ref('')
  const isSubmitting = ref(false)
  const recentReports = ref([])
  
  // Surah data (simplified)
  const surahs = ref([
    { id: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', ayat: 7, juz: 1, type: 'Makkiyah' },
    { id: 2, name: 'Al-Baqarah', arabic: 'البقرة', ayat: 286, juz: '1-3', type: 'Madaniyah' },
    { id: 3, name: 'Ali Imran', arabic: 'آل عمران', ayat: 200, juz: '3-4', type: 'Madaniyah' },
    { id: 4, name: 'An-Nisa', arabic: 'النساء', ayat: 176, juz: '4-6', type: 'Madaniyah' },
    { id: 5, name: 'Al-Maidah', arabic: 'المائدة', ayat: 120, juz: '6-7', type: 'Madaniyah' },
    { id: 6, name: "Al-An'am", arabic: 'الأنعام', ayat: 165, juz: '7-8', type: 'Makkiyah' },
    { id: 7, name: "Al-A'raf", arabic: 'الأعراف', ayat: 206, juz: '8-9', type: 'Makkiyah' },
    { id: 8, name: 'Al-Anfal', arabic: 'الأنفال', ayat: 75, juz: '9-10', type: 'Madaniyah' },
    { id: 9, name: 'At-Taubah', arabic: 'التوبة', ayat: 129, juz: '10-11', type: 'Madaniyah' },
    { id: 10, name: 'Yunus', arabic: 'يونس', ayat: 109, juz: '11', type: 'Makkiyah' },
    { id: 36, name: 'Yasin', arabic: 'يس', ayat: 83, juz: '22-23', type: 'Makkiyah' },
    { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', ayat: 78, juz: '27', type: 'Madaniyah' },
    { id: 56, name: 'Al-Waqiah', arabic: 'الواقعة', ayat: 96, juz: '27', type: 'Makkiyah' },
    { id: 67, name: 'Al-Mulk', arabic: 'الملك', ayat: 30, juz: '29', type: 'Makkiyah' },
    { id: 73, name: 'Al-Muzzammil', arabic: 'المزمل', ayat: 20, juz: '29', type: 'Makkiyah' },
    { id: 78, name: 'An-Naba', arabic: 'النبأ', ayat: 40, juz: '30', type: 'Makkiyah' },
    { id: 114, name: 'An-Nas', arabic: 'الناس', ayat: 6, juz: '30', type: 'Makkiyah' },
  ])
  
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
  
  const filteredSurahs = computed(() => {
    if (!surahSearch.value.trim()) return []
    const searchTerm = surahSearch.value.toLowerCase()
    return surahs.value.filter(surah => 
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
    const juz = parseInt(selectedJuz.value)
    if (!selectedJuz.value) return ''
    if (juz < 1) return 'Juz minimal 1'
    if (juz > 30) return 'Juz maksimal 30'
    return ''
  })
  
  const ayatError = computed(() => {
    if (!selectedSurah.value || !ayatEnd.value) return ''
    
    const end = parseInt(ayatEnd.value)
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
  
  // Methods
  const goBack = () => {
    router.push('/dashboard')
  }
  
  const getJuzRange = (juz) => {
    return juzRanges[Number(juz)] || `Juz ${juz}`
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
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  const editReport = (report) => {
    if (report.report_type === 'juz') {
      inputMode.value = 'juz'
      selectedJuz.value = report.juz
    } else {
      inputMode.value = 'surah'
      const surah = surahs.value.find(s => s.name === report.surah_name)
      if (surah) {
        selectedSurah.value = surah
        surahSearch.value = surah.name
        ayatEnd.value = report.ayat_end
      }
    }
    notes.value = report.notes || ''
  }
  
  const submitReport = async () => {
    if (!isFormValid.value) return
    
    isSubmitting.value = true

    try {
        const reportData = {
        user_id: authStore.user.id,
        report_type: inputMode.value,
        juz: inputMode.value === 'juz' ? parseInt(selectedJuz.value) : null,
        surah_name: inputMode.value === 'surah' ? selectedSurah.value.name : null,
        ayat_start: null,
        ayat_end: inputMode.value === 'surah' ? parseInt(ayatEnd.value) : null,
        notes: notes.value.trim() || null
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
        alert(isEditMode.value ? '✅ Laporan berhasil diperbarui!' : '✅ Laporan berhasil disimpan!')
        
        // Reset form
        selectedJuz.value = ''
        selectedSurah.value = null
        surahSearch.value = ''
        ayatEnd.value = ''
        notes.value = ''
        isEditMode.value = false
        editingReportId.value = null
        
        await loadRecentReports()
        } else {
        alert('❌ Gagal menyimpan laporan: ' + result.error)
        }
    } catch (error) {
        console.error('Submit error:', error)
        alert('❌ Terjadi kesalahan saat menyimpan laporan')
    } finally {
        isSubmitting.value = false
    }
    }
  
  const loadRecentReports = async () => {
    if (authStore.user) {
      await reportsStore.fetchUserReports(authStore.user.id)
      recentReports.value = reportsStore.reports.slice(0, 5)
    }
  }

  const loadReportForEdit = async (reportId) => {
    try {
        const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single()

        if (error) throw error

        // Set form values based on report
        inputMode.value = data.report_type
        if (data.report_type === 'juz') {
        selectedJuz.value = data.juz
        } else {
        const surah = surahs.value.find(s => s.name === data.surah_name)
        if (surah) {
            selectedSurah.value = surah
            surahSearch.value = surah.name
            ayatEnd.value = data.ayat_end
        }
        }
        notes.value = data.notes || ''
        editingReportId.value = reportId
        isEditMode.value = true
        
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
        // Check if we're in edit mode
        if (route.query.edit) {
        await loadReportForEdit(route.query.edit)
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
  
  .date-hijri {
    font-family: 'Amiri', serif;
    font-weight: 700;
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
  </style>