import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase/client'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const users = ref([]) // Daftar semua user untuk dropdown
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)

  // Actions
  const initializeAuth = async () => {
    try {
      // Cek localStorage untuk user yang sudah login
      const storedUser = localStorage.getItem('tilawah_user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
        return true
      }
      return false
    } catch (err) {
      console.error('Auth initialization error:', err)
      return false
    }
  }

  // Tambahkan di actions:
  const fetchAllUsers = async () => {
  try {
    const { data, error: supabaseError } = await supabase
      .from('users')
      .select('id, username, created_at') // Hapus full_name, avatar_url
      .order('username', { ascending: true })

    if (supabaseError) throw supabaseError
    
    // Tambah field default jika diperlukan
    users.value = (data || []).map(user => ({
      ...user,
      full_name: user.username, // Fallback ke username
      avatar_url: null
    }))
    return data
  } catch (err) {
    console.error('Error fetching users:', err)
    error.value = err.message
    return []
  }
}

  const login = async (username) => {
    try {
      isLoading.value = true
      error.value = null

      // Cek apakah user sudah ada
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .limit(1)

      if (fetchError) throw fetchError

      let currentUserData

      if (existingUsers && existingUsers.length > 0) {
        // User sudah ada, login dengan user tersebut
        currentUserData = existingUsers[0]
      } else {
        // Buat user baru
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ username }])
          .select()
          .single()

        if (createError) throw createError
        currentUserData = newUser
      }

      // Simpan di state dan localStorage
      user.value = currentUserData
      localStorage.setItem('tilawah_user', JSON.stringify(currentUserData))

      // Ambil semua user untuk dropdown
      await fetchAllUsers()

      return { success: true, user: currentUserData }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message || 'Gagal login. Coba lagi.'
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('tilawah_user')
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    users,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    currentUser,

    // Actions
    initializeAuth,
    fetchAllUsers,
    login,
    logout,
    clearError,
  }
})