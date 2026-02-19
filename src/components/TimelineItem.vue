<template>
    <div class="card bg-white hover:shadow-xl transition-all duration-200">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
            {{ userInitial }}
          </div>
          
          <!-- User Info -->
          <div>
            <div class="font-bold text-gray-800">{{ full_name }}</div>
            <div class="text-xs text-gray-500 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
              </svg>
              {{ formatTime(report.created_at) }}
            </div>
          </div>
        </div>
        
        <!-- Action Menu (hanya untuk catatan sendiri) -->
        <div v-if="isOwnReport" class="relative">
          <button 
            @click="showMenu = !showMenu"
            class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="showMenu" class="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
            <button 
              @click="editReport"
              class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-t-xl flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Catatan
            </button>
            <button 
              @click="deleteReport"
              class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2 rounded-b-xl"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Hapus Catatan
            </button>
          </div>
        </div>
        
        <!-- Type Badge -->
        <div v-else class="px-3 py-1 rounded-full text-xs font-semibold" 
             :class="report.report_type === 'juz' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'">
          {{ report.report_type === 'juz' ? 'Juz' : 'Surah' }}
        </div>
      </div>
  
      <!-- Content -->
      <div class="mb-4">
        <!-- Juz Report -->
        <div v-if="report.report_type === 'juz'" class="flex items-center gap-3">
          <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border-2 border-emerald-200">
            <span class="text-2xl font-bold text-emerald-700">{{ report.juz }}</span>
          </div>
          <div>
            <div class="font-bold text-gray-800 text-lg">Telah mengkhatamkan</div>
            <div class="text-emerald-600 font-semibold">Juz {{ report.juz }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ getJuzRange(report.juz) }}</div>
          </div>
        </div>
        
        <!-- Surah Report -->
        <div v-else class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-200">
            <span class="text-2xl font-arabic text-blue-700">📖</span>
          </div>
          <div>
            <div class="font-bold text-gray-800 text-lg">Telah membaca</div>
            <div class="text-blue-600 font-semibold">{{ report.surah_name }}</div>
            <div class="text-xs text-gray-500 mt-1">
              Ayat 1 sampai {{ report.ayat_end }}
              <span v-if="report.juz"> • Juz {{ report.juz }}</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Notes -->
      <div v-if="report.notes" class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div class="text-sm text-gray-700">{{ report.notes }}</div>
      </div>
  
      <!-- Reactions -->
      <div class="flex items-center gap-4 mb-4 pt-3 border-t border-gray-100">
        <!-- Reaction Buttons -->
        <div class="flex items-center gap-2">
          <button 
            v-for="emoji in ['👍', '🎉', '🙏']" 
            :key="emoji"
            @click="toggleReaction(emoji)"
            class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
            :class="getReactionClass(emoji)"
            :title="`${reactionCounts[emoji] || 0} ${getEmojiName(emoji)}`"
          >
            <span class="text-lg">{{ emoji }}</span>
          </button>
        </div>
        
        <!-- Reaction Counts -->
        <div class="text-xs text-gray-500 flex gap-3">
          <span v-for="emoji in ['👍', '🎉', '🙏']" :key="emoji" v-if="reactionCounts[emoji]">
            {{ reactionCounts[emoji] }} {{ getEmojiName(emoji) }}
          </span>
        </div>
      </div>
  
      <!-- Comments Section -->
      <div class="border-t border-gray-100 pt-3">
        <!-- Add Comment Form -->
        <div class="flex gap-2 mb-3">
          <input
            v-model="newComment"
            @keyup.enter="addComment"
            type="text"
            placeholder="Tulis komentar..."
            class="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <button 
            @click="addComment"
            :disabled="!newComment.trim()"
            class="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Kirim
          </button>
        </div>
  
        <!-- Comments List -->
        <div v-if="comments.length > 0" class="space-y-2 max-h-40 overflow-y-auto">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
          >
            <div class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
              {{ comment.users?.full_name?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-xs font-semibold text-gray-700">{{ comment.users?.full_name || 'User' }}</span>
                  <span class="text-xs text-gray-500 ml-2">{{ formatCommentTime(comment.created_at) }}</span>
                </div>
                <button 
                  v-if="comment.user_id === currentUserId"
                  @click="deleteComment(comment.id)"
                  class="text-gray-400 hover:text-red-500 text-xs"
                >
                  Hapus
                </button>
              </div>
              <div class="text-sm text-gray-800 mt-1">{{ comment.comment }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import { useReportsStore } from '../stores/reports'
  import { useInteractionsStore } from '../stores/interactions'
  
  const props = defineProps({
    report: {
      type: Object,
      required: true
    }
  })
  
  const router = useRouter()
  const authStore = useAuthStore()
  const reportsStore = useReportsStore()
  const interactionsStore = useInteractionsStore()
  
  // State
  const showMenu = ref(false)
  const newComment = ref('')
  const comments = ref([])
  const reactions = ref([])
  
  // Computed
  const userInitial = computed(() => {
    return props.report.users?.full_name?.charAt(0).toUpperCase() || 'U'
  })
  
  const full_name = computed(() => {
    return props.report.users?.full_name || 'User'
  })
  
  const isOwnReport = computed(() => {
    return props.report.user_id === authStore.user?.id
  })
  
  const currentUserId = computed(() => authStore.user?.id)
  
  const reactionCounts = computed(() => {
    return interactionsStore.getReactionCounts(reactions.value)
  })
  
  // Methods
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays === 1) return 'Kemarin'
    return `${diffDays} hari lalu`
  }
  
  const formatCommentTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'baru saja'
    if (diffMins < 60) return `${diffMins}m`
    
    const diffHours = Math.floor(diffMs / 3600000)
    if (diffHours < 24) return `${diffHours}j`
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }
  
  const getJuzRange = (juz) => {
    const ranges = {
      1: 'Al-Fatihah 1 - Al-Baqarah 141',
      2: 'Al-Baqarah 142 - Al-Baqarah 252',
      3: 'Al-Baqarah 253 - Ali Imran 92',
      30: 'An-Naba 1 - An-Nas 6'
    }
    return ranges[juz] || `Juz ${juz}`
  }
  
  const getEmojiName = (emoji) => {
    const names = {
      '👍': 'Like',
      '🎉': 'Celebration',
      '🙏': 'Pray'
    }
    return names[emoji] || emoji
  }
  
  const getReactionClass = (emoji) => {
    const userReaction = interactionsStore.getUserReaction(reactions.value, currentUserId.value)
    const isActive = userReaction?.emoji === emoji
    
    if (isActive) {
      const bgClasses = {
        '👍': 'bg-blue-100 border border-blue-300',
        '🎉': 'bg-yellow-100 border border-yellow-300',
        '🙏': 'bg-green-100 border border-green-300'
      }
      return bgClasses[emoji] || 'bg-gray-100'
    }
    return 'bg-gray-100 hover:bg-gray-200'
  }
  
  const editReport = () => {
    showMenu.value = false
    router.push(`/report?edit=${props.report.id}`)
  }
  
  const deleteReport = async () => {
    showMenu.value = false
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return
    
    const result = await reportsStore.deleteReport(props.report.id)
    if (result.success) {
      alert('✅ Catatan berhasil dihapus')
    } else {
      alert('❌ Gagal menghapus catatan: ' + result.error)
    }
  }
  
  const toggleReaction = async (emoji) => {
    if (!currentUserId.value) {
      alert('Silakan login untuk memberikan reaction')
      return
    }
    
    const userReaction = interactionsStore.getUserReaction(reactions.value, currentUserId.value)
    
    if (userReaction?.emoji === emoji) {
      // Remove existing reaction
      const result = await interactionsStore.removeReaction(userReaction.id)
      if (result.success) {
        reactions.value = reactions.value.filter(r => r.id !== userReaction.id)
      }
    } else {
      // Remove previous reaction if exists
      if (userReaction) {
        await interactionsStore.removeReaction(userReaction.id)
        reactions.value = reactions.value.filter(r => r.id !== userReaction.id)
      }
      
      // Add new reaction
      const result = await interactionsStore.addReaction(props.report.id, currentUserId.value, emoji)
      if (result.success) {
        reactions.value.push(result.data)
      }
    }
  }
  
  const addComment = async () => {
    if (!newComment.value.trim()) return
    
    const result = await interactionsStore.addComment(
      props.report.id, 
      currentUserId.value, 
      newComment.value
    )
    
    if (result.success) {
      comments.value.push(result.data)
      newComment.value = ''
    } else {
      alert('Gagal menambahkan komentar: ' + result.error)
    }
  }
  
  const deleteComment = async (commentId) => {
    if (!confirm('Hapus komentar ini?')) return
    
    const result = await interactionsStore.deleteComment(commentId)
    if (result.success) {
      comments.value = comments.value.filter(c => c.id !== commentId)
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    // Load reactions
    const loadedReactions = await interactionsStore.fetchReactionsForReport(props.report.id)
    reactions.value = loadedReactions
    
    // Load comments
    const loadedComments = await interactionsStore.fetchCommentsForReport(props.report.id)
    comments.value = loadedComments
    
    // Close menu when clicking outside
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  
  const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
      showMenu.value = false
    }
  }
  </script>
  
  <style scoped>
  .card {
    @apply bg-white rounded-2xl shadow-md p-4 border border-gray-100;
  }
  
  .font-arabic {
    font-family: 'Amiri', serif;
  }
  
  /* Custom scrollbar for comments */
  ::-webkit-scrollbar {
    width: 4px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded;
  }
  </style>