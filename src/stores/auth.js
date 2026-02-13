import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase/client'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const users = ref([]) // This might be deprecated on login page but kept for other uses
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)

  // Actions

  /**
   * Initializes authentication state from localStorage.
   */
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('tilawah_user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  /**
   * Fetches all users. (Could be used for admin panels or other features)
   */
  const fetchAllUsers = async () => {
    try {
      const { data, error: fetchError } = await supabase.from('users').select('username')
      if (fetchError) throw fetchError
      users.value = data
    } catch (err) {
      console.error('Error fetching all users:', err)
    }
  }

  /**
   * Handles user registration.
   */
  const register = async ({ username, fullName, phoneNumber }) => {
    isLoading.value = true
    error.value = null
    try {
      // 1. Validate phone number format
      if (!/^62\d{9,15}$/.test(phoneNumber)) {
        throw new Error('Format nomor telepon salah. Gunakan 62xxxxxxxxxx.')
      }

      // 2. Check for duplicate username or phone number
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username, phone')
        .or(`username.eq.${username}`, `phone.eq.${phoneNumber}`)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        throw checkError
      }

      if (existingUser) {
        if (existingUser.username === username) {
          throw new Error('Username sudah digunakan.')
        }
        if (existingUser.phone === phoneNumber) {
          throw new Error('Nomor telepon sudah terdaftar.')
        }
      }

      // 3. Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ 
          username, 
          full_name: fullName, 
          phone: phoneNumber 
        }])
        .select()
        .single()

      if (createError) throw createError

      // 4. Log the user in
      user.value = newUser
      localStorage.setItem('tilawah_user', JSON.stringify(newUser))

      return { success: true, user: newUser }
    } catch (err) {
      console.error('Registration error:', err)
      error.value = err.message || 'Gagal mendaftar. Coba lagi.'
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Handles user login.
   */
  const login = async (username) => {
    isLoading.value = true
    error.value = null
    try {
      if (!username) {
        throw new Error('Username tidak boleh kosong.')
      }

      // 1. Find user by username
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (fetchError || !existingUser) {
        throw new Error('Username tidak ditemukan.')
      }

      // 2. Log the user in
      user.value = existingUser
      localStorage.setItem('tilawah_user', JSON.stringify(existingUser))

      return { success: true, user: existingUser }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message || 'Gagal login. Coba lagi.'
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logs the user out.
   */
  const logout = () => {
    user.value = null
    localStorage.removeItem('tilawah_user')
  }

  /**
   * Clears any authentication errors.
   */
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
    fetchAllUsers, // Keep for potential future use
    register,
    login,
    logout,
    clearError,
  }
})
