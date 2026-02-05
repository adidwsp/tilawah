import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase/client'

import { getJuzFromSurahAndAyat, getSurahAndAyatFromJuz } from '../utils/juzCalculator'

export const useReportsStore = defineStore('reports', () => {
  // State
  const reports = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const todayReports = computed(() => {
    const today = new Date().toDateString()
    return reports.value.filter(report => 
      new Date(report.created_at).toDateString() === today
    )
  })

  const totalJuzCompleted = computed(() => {
    return reports.value.reduce((sum, report) => sum + (report.juz || 0), 0)
  })

  const averageDailyJuz = computed(() => {
    if (reports.value.length === 0) return 0
    const days = new Set(reports.value.map(r => 
      new Date(r.created_at).toDateString()
    )).size
    return days > 0 ? (totalJuzCompleted.value / days).toFixed(1) : 0
  })

  // Actions
  const fetchUserReports = async (userId) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: supabaseError } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError
      reports.value = data || []
      return data
    } catch (err) {
      console.error('Error fetching reports:', err)
      error.value = err.message
      return []
    } finally {
      isLoading.value = false
    }
  }

const createReport = async (reportData) => {
  try {
    isLoading.value = true
    error.value = null

    let processedData = { ...reportData }

    // Jika report type adalah surah, hitung juz secara otomatis
    if (reportData.report_type === 'surah' && reportData.surah_name && reportData.ayat_end) {
      processedData.juz = getJuzFromSurahAndAyat(
        reportData.surah_name, 
        reportData.ayat_end
      )
    }
    
    // Jika report type adalah juz, tentukan surah dan ayat terakhir
    if (reportData.report_type === 'juz' && reportData.juz) {
      const juzInfo = getSurahAndAyatFromJuz(reportData.juz)
      processedData.surah_name = juzInfo.surahName
      processedData.ayat_start = juzInfo.ayatStart
      processedData.ayat_end = juzInfo.ayatEnd
    }

    const { data, error: supabaseError } = await supabase
      .from('reports')
      .insert([{
        user_id: processedData.user_id,
        report_type: processedData.report_type,
        juz: processedData.juz,
        surah_name: processedData.surah_name,
        ayat_start: processedData.ayat_start,
        ayat_end: processedData.ayat_end,
        notes: processedData.notes,
        // Tambah created_at untuk sorting
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (supabaseError) throw supabaseError
    
    reports.value.unshift(data)
    return { success: true, data }
  } catch (err) {
    console.error('Error creating report:', err)
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    isLoading.value = false
  }
}

// Update juga updateReport function dengan logika yang sama
const updateReport = async (reportId, reportData) => {
  try {
    isLoading.value = true
    error.value = null

    let processedData = { ...reportData }

    // Logika auto-calculate yang sama
    if (reportData.report_type === 'surah' && reportData.surah_name && reportData.ayat_end) {
      processedData.juz = getJuzFromSurahAndAyat(
        reportData.surah_name, 
        reportData.ayat_end
      )
    }
    
    if (reportData.report_type === 'juz' && reportData.juz) {
      const juzInfo = getSurahAndAyatFromJuz(reportData.juz)
      processedData.surah_name = juzInfo.surahName
      processedData.ayat_start = juzInfo.ayatStart
      processedData.ayat_end = juzInfo.ayatEnd
    }

    const { data, error: supabaseError } = await supabase
      .from('reports')
      .update({
        report_type: processedData.report_type,
        juz: processedData.juz,
        surah_name: processedData.surah_name,
        ayat_start: processedData.ayat_start,
        ayat_end: processedData.ayat_end,
        notes: processedData.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single()

    if (supabaseError) throw supabaseError
    
    const index = reports.value.findIndex(r => r.id === reportId)
    if (index !== -1) {
      reports.value[index] = data
    }
    
    return { success: true, data }
  } catch (err) {
    console.error('Error updating report:', err)
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    isLoading.value = false
  }
}
  
  const deleteReport = async (reportId) => {
    try {
      isLoading.value = true
      error.value = null
  
      const { error: supabaseError } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId)
  
      if (supabaseError) throw supabaseError
      
      // Remove from local state
      const index = reports.value.findIndex(r => r.id === reportId)
      if (index !== -1) {
        reports.value.splice(index, 1)
      }
      
      return { success: true }
    } catch (err) {
      console.error('Error deleting report:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    reports,
    isLoading,
    error,

    // Getters
    todayReports,
    totalJuzCompleted,
    averageDailyJuz,

    // Actions
    fetchUserReports,
    createReport,
    updateReport,
    deleteReport,
  }
})