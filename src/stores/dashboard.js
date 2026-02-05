import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase/client'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const isLoading = ref(false)
  const error = ref(null)
  const userStats = ref({})
  const weeklyActivity = ref([])
  const todaySummary = ref({})
  const leaderboard = ref([])

  // Actions
  const fetchUserStats = async (userId) => {
    try {
      isLoading.value = true
      error.value = null

      // Get today's date range
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // 1. Get user's reports
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (reportsError) throw reportsError

      // 2. Calculate stats
      const totalJuz = reports
        .filter(r => r.report_type === 'juz')
        .reduce((sum, r) => sum + (r.juz || 0), 0)

      const totalReports = reports.length
      
      // Average daily juz (based on days active)
      const firstReport = reports[reports.length - 1]
      let dailyAverage = 0
      if (firstReport) {
        const firstDate = new Date(firstReport.created_at)
        const daysActive = Math.max(1, Math.ceil((new Date() - firstDate) / (1000 * 60 * 60 * 24)))
        dailyAverage = totalJuz / daysActive
      }

      // Today's reports
      const todayReports = reports.filter(r => 
        new Date(r.created_at) >= today && new Date(r.created_at) < tomorrow
      )

      // Last 7 days activity for chart
      const weeklyData = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)

        const dayReports = reports.filter(r => 
          new Date(r.created_at) >= date && new Date(r.created_at) < nextDay
        )
        
        const dayJuz = dayReports
          .filter(r => r.report_type === 'juz')
          .reduce((sum, r) => sum + (r.juz || 0), 0)

        const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' })
        weeklyData.push({
          day: dayName,
          juz: dayJuz,
          active: dayJuz > 0,
          height: Math.min(100, (dayJuz / 3) * 100) // Cap at 3 juz for 100% height
        })
      }

      // Today's summary
      const lastTodayReport = todayReports[0]
      const todaySummaryData = {
        juz: todayReports.filter(r => r.report_type === 'juz').reduce((sum, r) => sum + (r.juz || 0), 0),
        lastUpdate: lastTodayReport ? formatTime(lastTodayReport.created_at) : '-',
        lastSurah: lastTodayReport?.report_type === 'surah' ? lastTodayReport.surah_name : '-'
      }

      // Estimated days to complete
      const remainingJuz = Math.max(0, 30 - totalJuz)
      const estimatedDays = dailyAverage > 0 ? Math.ceil(remainingJuz / dailyAverage) : 30
      const targetDaily = 30 / 30 // Default: 1 juz per day

      userStats.value = {
        completedJuz: totalJuz,
        totalJuz: 30,
        progressPercentage: Math.min(100, (totalJuz / 30) * 100),
        averageDaily: dailyAverage.toFixed(1),
        targetDaily: targetDaily.toFixed(1),
        estimatedDays: estimatedDays,
        totalReports: totalReports
      }

      weeklyActivity.value = weeklyData
      todaySummary.value = todaySummaryData

      return { success: true, data: userStats.value }
    } catch (err) {
      console.error('Error fetching user stats:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  const fetchTop3 = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('reports')
        .select(`
          user_id,
          juz,
          users!inner(username)
        `)
        .eq('report_type', 'juz')

      if (supabaseError) throw supabaseError

      // Calculate total juz per user
      const userTotals = {}
      data.forEach(report => {
        if (!userTotals[report.user_id]) {
          userTotals[report.user_id] = {
            id: report.user_id,
            username: report.users.username,
            total_juz: 0
          }
        }
        userTotals[report.user_id].total_juz += report.juz || 0
      })

      // Convert to array and sort
      const sortedUsers = Object.values(userTotals).sort((a, b) => b.total_juz - a.total_juz)
      leaderboard.value = sortedUsers.slice(0, 3)

      return leaderboard.value
    } catch (err) {
      console.error('Error fetching top 3:', err)
      return []
    }
  }

  const fetchUserRank = async (userId) => {
    try {
      // Get all users with their total juz
      const { data, error: supabaseError } = await supabase
        .from('reports')
        .select(`
          user_id,
          juz,
          users!inner(username)
        `)
        .eq('report_type', 'juz')

      if (supabaseError) throw supabaseError

      // Calculate totals
      const userTotals = {}
      data.forEach(report => {
        if (!userTotals[report.user_id]) {
          userTotals[report.user_id] = 0
        }
        userTotals[report.user_id] += report.juz || 0
      })

      // Convert to array and sort
      const sortedUsers = Object.entries(userTotals)
        .map(([user_id, total_juz]) => ({ user_id, total_juz }))
        .sort((a, b) => b.total_juz - a.total_juz)

      // Find user's rank
      const userIndex = sortedUsers.findIndex(u => u.user_id === userId)
      return userIndex !== -1 ? userIndex + 1 : null
    } catch (err) {
      console.error('Error fetching user rank:', err)
      return null
    }
  }

  // Helper function
  const formatTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    // State
    isLoading,
    error,
    userStats,
    weeklyActivity,
    todaySummary,
    leaderboard,

    // Actions
    fetchUserStats,
    fetchTop3,
    fetchUserRank
  }
})