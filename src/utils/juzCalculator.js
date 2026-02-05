import { surahs } from './surahData.js'

// Data detail pembagian juz (batas setiap juz)
const juzDetails = [
  // Juz 1
  { juz: 1, surah: 1, ayat: 7 }, // Al-Fatihah
  { juz: 1, surah: 2, ayat: 141 }, // Al-Baqarah
  
  // Juz 2
  { juz: 2, surah: 2, ayat: 252 },
  
  // Juz 3
  { juz: 3, surah: 3, ayat: 92 },
  
  // Juz 4
  { juz: 4, surah: 4, ayat: 23 },
  
  // Juz 5
  { juz: 5, surah: 4, ayat: 147 },
  
  // Juz 6
  { juz: 6, surah: 5, ayat: 81 },
  
  // Juz 7
  { juz: 7, surah: 6, ayat: 110 },
  
  // Juz 8
  { juz: 8, surah: 7, ayat: 87 },
  
  // Juz 9
  { juz: 9, surah: 8, ayat: 40 },
  
  // Juz 10
  { juz: 10, surah: 9, ayat: 92 },
  
  // Juz 11
  { juz: 11, surah: 11, ayat: 5 },
  
  // Juz 12
  { juz: 12, surah: 12, ayat: 52 },
  
  // Juz 13
  { juz: 13, surah: 14, ayat: 52 },
  
  // Juz 14
  { juz: 14, surah: 16, ayat: 128 },
  
  // Juz 15
  { juz: 15, surah: 18, ayat: 74 },
  
  // Juz 16
  { juz: 16, surah: 20, ayat: 135 },
  
  // Juz 17
  { juz: 17, surah: 22, ayat: 78 },
  
  // Juz 18
  { juz: 18, surah: 25, ayat: 20 },
  
  // Juz 19
  { juz: 19, surah: 27, ayat: 55 },
  
  // Juz 20
  { juz: 20, surah: 29, ayat: 45 },
  
  // Juz 21
  { juz: 21, surah: 33, ayat: 30 },
  
  // Juz 22
  { juz: 22, surah: 36, ayat: 27 },
  
  // Juz 23
  { juz: 23, surah: 39, ayat: 31 },
  
  // Juz 24
  { juz: 24, surah: 41, ayat: 46 },
  
  // Juz 25
  { juz: 25, surah: 45, ayat: 37 },
  
  // Juz 26
  { juz: 26, surah: 51, ayat: 30 },
  
  // Juz 27
  { juz: 27, surah: 57, ayat: 29 },
  
  // Juz 28
  { juz: 28, surah: 66, ayat: 12 },
  
  // Juz 29
  { juz: 29, surah: 77, ayat: 50 },
  
  // Juz 30
  { juz: 30, surah: 114, ayat: 6 }
]

// Fungsi untuk mendapatkan juz dari surah dan ayat
export function getJuzFromSurahAndAyat(surahName, ayatNumber) {
  const surah = surahs.find(s => s.name === surahName)
  if (!surah) return 1
  
  const surahId = surah.id
  
  // Cari juz berdasarkan surah dan ayat
  for (const juzDetail of juzDetails) {
    if (surahId < juzDetail.surah) {
      return juzDetail.juz
    } else if (surahId === juzDetail.surah) {
      if (ayatNumber <= juzDetail.ayat) {
        return juzDetail.juz
      }
    }
  }
  
  return 30 // Default juz 30 jika tidak ditemukan
}

// Fungsi untuk mendapatkan info juz (surah dan ayat terakhir)
export function getJuzInfo(juzNumber) {
  const juzIndex = juzDetails.findIndex(j => j.juz === juzNumber)
  
  if (juzIndex === -1) {
    return {
      juz: juzNumber,
      surahName: 'Al-Fatihah',
      ayatEnd: 7,
      surahId: 1
    }
  }
  
  const currentJuz = juzDetails[juzIndex]
  const nextJuz = juzDetails[juzIndex + 1]
  
  // Cari surah sebelumnya untuk ayat awal
  const prevJuz = juzDetails[juzIndex - 1]
  
  return {
    juz: juzNumber,
    surahName: surahs.find(s => s.id === currentJuz.surah)?.name || 'Al-Fatihah',
    ayatEnd: currentJuz.ayat,
    surahId: currentJuz.surah,
    ayatStart: prevJuz ? prevJuz.ayat + 1 : 1
  }
}

// Fungsi untuk mendapatkan surah dan ayat terakhir dari juz
export function getSurahAndAyatFromJuz(juzNumber) {
  const juzInfo = getJuzInfo(juzNumber)
  
  // Jika juz terakhir, gunakan ayat terakhir dari surah terakhir
  if (juzNumber === 30) {
    return {
      surahName: 'An-Nas',
      ayatStart: 1,
      ayatEnd: 6
    }
  }
  
  // Untuk juz lainnya, cari surah berikutnya untuk ayat awal
  const nextJuzInfo = getJuzInfo(juzNumber + 1)
  const currentSurah = surahs.find(s => s.id === juzInfo.surahId)
  
  return {
    surahName: juzInfo.surahName,
    ayatStart: juzInfo.ayatStart || 1,
    ayatEnd: juzInfo.ayatEnd,
    currentSurahAyatCount: currentSurah?.ayat || 286
  }
}

// Fungsi untuk menghitung progress dalam bentuk angka untuk perangkingan
export function calculateProgress(surahName, ayatNumber) {
  const juz = getJuzFromSurahAndAyat(surahName, ayatNumber)
  const surah = surahs.find(s => s.name === surahName)
  
  if (!surah) return { juz, surahId: 1, ayat: ayatNumber, score: juz * 10000 }
  
  // Score = (juz * 10000) + (surah.id * 100) + ayat
  // Ini memastikan urutan: Juz > Surah > Ayat
  const score = (juz * 1000000) + (surah.id * 1000) + ayatNumber
  
  return {
    juz,
    surahId: surah.id,
    ayat: ayatNumber,
    score
  }
}

// Fungsi untuk mengurutkan user berdasarkan progress
export function sortUsersByProgress(usersWithProgress) {
  return usersWithProgress.sort((a, b) => b.progressScore - a.progressScore)
}