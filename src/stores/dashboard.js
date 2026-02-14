import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase/client'
import { getJuzFromSurahAndAyat } from '../utils/juzCalculator'

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

      // 1. Get user's reports, sorted by most recent first
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (reportsError) throw reportsError

      if (!reports || reports.length === 0) {
        // Handle case where user has no reports yet
        userStats.value = { completedJuz: 0, totalJuz: 30, progressPercentage: 0, averageDaily: '0.0', targetDaily: '1.0', estimatedDays: 30, totalReports: 0 };
        weeklyActivity.value = Array(7).fill({}).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return { day: date.toLocaleDateString('id-ID', { weekday: 'short' }), juz: 0, active: false, height: 0 };
        });
        todaySummary.value = { juz: 0, lastUpdate: null, lastSurah: '-' };
        return { success: true, data: userStats.value };
      }

      // 2. Determine Current Progress (completedJuz) from the most recent report
      const lastReport = reports[0];
      let completedJuz = 0;
      if (lastReport.report_type === 'juz') {
        completedJuz = lastReport.juz;
      } else if (lastReport.report_type === 'surah') {
        completedJuz = getJuzFromSurahAndAyat(lastReport.surah_name, lastReport.ayat_end);
      }

      // 3. Calculate Historical Stats for Average Daily Reading
      const totalJuzForAverage = reports
        .filter(r => r.report_type === 'juz')
        .reduce((sum, r) => sum + (r.juz || 0), 0)

      const totalReports = reports.length

      const firstReport = reports[reports.length - 1]
      let dailyAverage = 0
      if (firstReport) {
        const firstDate = new Date(firstReport.created_at)
        const daysActive = Math.max(1, Math.ceil((new Date() - firstDate) / (1000 * 60 * 60 * 24)))
        dailyAverage = totalJuzForAverage / daysActive
      }

      // 4. Last 7 days activity for chart
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

      // 5. Synchronized Summary Data from the single latest report
      const todaySummaryData = {
        juz: lastReport.juz,
        lastUpdate: lastReport.created_at,
        lastSurah: lastReport.surah_name ? `${lastReport.surah_name}:${lastReport.ayat_end}` : '-',
      };

      // 6. Calculate remaining stats based on new completedJuz
      const remainingJuz = Math.max(0, 30 - completedJuz)
      const estimatedDays = dailyAverage > 0 ? Math.ceil(remainingJuz / dailyAverage) : 30
      const targetDaily = 1.0 // 1 juz per day

      // 7. Update state
      userStats.value = {
        completedJuz: completedJuz,
        totalJuz: 30,
        progressPercentage: Math.min(100, (completedJuz / 30) * 100),
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
