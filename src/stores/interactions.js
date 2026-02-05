import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase/client'

export const useInteractionsStore = defineStore('interactions', () => {
  // State
  const reactions = ref([])
  const comments = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Actions untuk Reactions
  const fetchReactionsForReport = async (reportId) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('reactions')
        .select('*, users(username)')
        .eq('report_id', reportId)

      if (supabaseError) throw supabaseError
      return data || []
    } catch (err) {
      console.error('Error fetching reactions:', err)
      error.value = err.message
      return []
    }
  }

  const addReaction = async (reportId, userId, emoji) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('reactions')
        .insert([{ report_id: reportId, user_id: userId, emoji }])
        .select('*, users(username)')
        .single()

      if (supabaseError) throw supabaseError
      return { success: true, data }
    } catch (err) {
      console.error('Error adding reaction:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const removeReaction = async (reactionId) => {
    try {
      const { error: supabaseError } = await supabase
        .from('reactions')
        .delete()
        .eq('id', reactionId)

      if (supabaseError) throw supabaseError
      return { success: true }
    } catch (err) {
      console.error('Error removing reaction:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Actions untuk Comments
  const fetchCommentsForReport = async (reportId) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('comments')
        .select('*, users(username)')
        .eq('report_id', reportId)
        .order('created_at', { ascending: true })

      if (supabaseError) throw supabaseError
      return data || []
    } catch (err) {
      console.error('Error fetching comments:', err)
      error.value = err.message
      return []
    }
  }

  const addComment = async (reportId, userId, commentText) => {
    try {
      if (!commentText.trim()) {
        throw new Error('Komentar tidak boleh kosong')
      }

      const { data, error: supabaseError } = await supabase
        .from('comments')
        .insert([{ 
          report_id: reportId, 
          user_id: userId, 
          comment: commentText.trim() 
        }])
        .select('*, users(username)')
        .single()

      if (supabaseError) throw supabaseError
      return { success: true, data }
    } catch (err) {
      console.error('Error adding comment:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const deleteComment = async (commentId) => {
    try {
      const { error: supabaseError } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (supabaseError) throw supabaseError
      return { success: true }
    } catch (err) {
      console.error('Error deleting comment:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Helper functions
  const getReactionCounts = (reactionsList) => {
    const counts = {
      '👍': 0,
      '🎉': 0,
      '🙏': 0
    }
    
    reactionsList.forEach(reaction => {
      if (counts[reaction.emoji] !== undefined) {
        counts[reaction.emoji]++
      }
    })
    
    return counts
  }

  const getUserReaction = (reactionsList, userId) => {
    return reactionsList.find(r => r.user_id === userId)
  }

  return {
    // State
    reactions,
    comments,
    isLoading,
    error,

    // Actions
    fetchReactionsForReport,
    addReaction,
    removeReaction,
    fetchCommentsForReport,
    addComment,
    deleteComment,
    
    // Helpers
    getReactionCounts,
    getUserReaction
  }
})