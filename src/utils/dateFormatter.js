// Format tanggal Indonesia
export function formatIndonesianDate(dateString) {
    const date = new Date(dateString)
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    
    const day = days[date.getDay()]
    const dateNum = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    
    return `${day}, ${dateNum} ${month} ${year}`
  }
  
  // Format waktu Indonesia
  export function formatIndonesianTime(dateString) {
    const date = new Date(dateString)
    
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    
    return `${hours}:${minutes}:${seconds}`
  }
  
  // Format relatif waktu (contoh: "2 menit lalu")
  export function formatRelativeTime(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    
    if (diffDay > 7) {
      return formatIndonesianDate(dateString)
    } else if (diffDay > 0) {
      return `${diffDay} hari lalu`
    } else if (diffHour > 0) {
      return `${diffHour} jam lalu`
    } else if (diffMin > 0) {
      return `${diffMin} menit lalu`
    } else {
      return 'Baru saja'
    }
  }