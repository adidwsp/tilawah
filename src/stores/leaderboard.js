import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase/client'
import { calculateProgress, sortUsersByProgress, getSurahAndAyatFromJuz } from '../utils/juzCalculator'

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const leaderboard = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      isLoading.value = true
      error.value = null

      // Fetch semua reports dengan data user
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select(`
          id,
          user_id,
          report_type,
          juz,
          surah_name,
          ayat_end,
          progress_score,
          created_at,
          users!inner (
            id,
            username,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (reportsError) throw reportsError

      // Kelompokkan by user dan ambil report terbaru
      const userLatestReports = {}
      reports.forEach(report => {
        if (!userLatestReports[report.user_id] || 
            new Date(report.created_at) > new Date(userLatestReports[report.user_id].created_at)) {
          userLatestReports[report.user_id] = report
        }
      })

      // Hitung progress untuk setiap user
      const usersWithProgress = Object.values(userLatestReports).map(report => {
        let progressScore = 0
        
        if (report.report_type === 'juz') {
          // Untuk laporan juz, gunakan surah dan ayat terakhir dari juz tersebut
          const { surahName, ayatEnd } = getSurahAndAyatFromJuz(report.juz)
          const progress = calculateProgress(surahName, ayatEnd)
          progressScore = progress.score
        } else if (report.report_type === 'surah' && report.surah_name && report.ayat_end) {
          // Untuk laporan surah, hitung langsung
          const progress = calculateProgress(report.surah_name, report.ayat_end)
          progressScore = progress.score
        }

        return {
          user_id: report.user_id,
          username: report.users?.username || 'Unknown',
          full_name: report.users?.full_name || '',
          avatar_url: report.users?.avatar_url || '',
          last_report: report,
          progressScore,
          juz: report.juz || 0,
          surah_name: report.surah_name || '',
          ayat_end: report.ayat_end || 0,
          report_type: report.report_type,
          last_activity: report.created_at
        }
      })

      // Urutkan berdasarkan progress score
      leaderboard.value = sortUsersByProgress(usersWithProgress)
      
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Getter untuk ranking dengan posisi
  const rankedLeaderboard = computed(() => {
    return leaderboard.value.map((user, index) => ({
      ...user,
      rank: index + 1
    }))
  })

  // Getter untuk top 10
  const top10 = computed(() => rankedLeaderboard.value.slice(0, 10))

  // Getter untuk current user position
  const getUserRank = (userId) => {
    const userIndex = leaderboard.value.findIndex(user => user.user_id === userId)
    return userIndex !== -1 ? userIndex + 1 : null
  }

  return {
    leaderboard,
    rankedLeaderboard,
    top10,
    isLoading,
    error,
    fetchLeaderboard,
    getUserRank
  }
})