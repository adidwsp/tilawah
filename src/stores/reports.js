import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase/client'
import { useAuthStore } from './auth'
import { getJuzFromSurahAndAyat, getSurahAndAyatFromJuz } from '../utils/juzCalculator'

export const useReportsStore = defineStore('reports', () => {
  // State
  const reports = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

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

      let query = supabase.from('reports').select('*')

      if (userId) {
        query = query.eq('user_id', userId)
      }
      
      query = query.order('created_at', { ascending: false })

      const { data, error: supabaseError } = await query

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

  const fetchTimelineReports = async () => {
    try {
      isLoading.value = true
      error.value = null

      const userGender = authStore.currentUserGender
      if (!userGender) {
        reports.value = []
        return
      }

      const { data, error: supabaseError } = await supabase
        .from('reports')
        .select(`
          *,
          users!inner(
            id,
            username,
            full_name,
            avatar_url,
            gender
          )
        `)
        .eq('users.gender', userGender)
        .order('created_at', { ascending: false })
        .limit(50) // Limit to the last 50 reports for performance

      if (supabaseError) throw supabaseError
      reports.value = data || []
      return data
    } catch (err) {
      console.error('Error fetching timeline reports:', err)
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
      .insert([{
        user_id: processedData.user_id,
        report_type: processedData.report_type,
        juz: processedData.juz,
        surah_name: processedData.surah_name,
        ayat_start: processedData.ayat_start,
        ayat_end: processedData.ayat_end,
        notes: processedData.notes,
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

const updateReport = async (reportId, reportData) => {
  try {
    isLoading.value = true
    error.value = null

    let processedData = { ...reportData }

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
    reports,
    isLoading,
    error,
    todayReports,
    totalJuzCompleted,
    averageDailyJuz,
    fetchUserReports,
    fetchTimelineReports,
    createReport,
    updateReport,
    deleteReport,
  }
})
