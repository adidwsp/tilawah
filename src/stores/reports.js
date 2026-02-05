import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase/client'

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
  
      const { data, error: supabaseError } = await supabase
        .from('reports')
        .insert([{
          user_id: reportData.user_id,
          report_type: reportData.report_type,
          juz: reportData.juz,
          surah_name: reportData.surah_name,
          ayat_start: reportData.ayat_start,
          ayat_end: reportData.ayat_end,
          notes: reportData.notes // ← tambah ini
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

  const clearError = () => {
    error.value = null
  }

  // Tambahkan actions setelah createReport:

const updateReport = async (reportId, reportData) => {
    try {
      isLoading.value = true
      error.value = null
  
      const { data, error: supabaseError } = await supabase
        .from('reports')
        .update({
          report_type: reportData.report_type,
          juz: reportData.juz,
          surah_name: reportData.surah_name,
          ayat_start: reportData.ayat_start,
          ayat_end: reportData.ayat_end,
          notes: reportData.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId)
        .select()
        .single()
  
      if (supabaseError) throw supabaseError
      
      // Update local state
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
    clearError,
    updateReport,
    deleteReport,
  }
})