import { supabase } from '../supabase/client'
import { getJuzFromSurahAndAyat, getSurahAndAyatFromJuz } from '../utils/juzCalculator'
import { surahs } from '../utils/surahData'

async function migrateExistingReports() {
  console.log('Starting migration of progress_score...')
  
  // 1. Ambil semua reports tanpa progress_score
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .is('progress_score', null)
    .limit(1000)
  
  if (error) {
    console.error('Error fetching reports:', error)
    return
  }
  
  console.log(`Found ${reports.length} reports to migrate`)
  
  // 2. Hitung progress_score untuk setiap report
  const updates = reports.map(report => {
    let juz = report.juz || 0
    let surahId = 0
    let ayat = report.ayat_end || 0
    
    if (report.report_type === 'surah' && report.surah_name) {
      // Cari surah ID
      const surah = surahs.find(s => s.name === report.surah_name)
      surahId = surah ? surah.id : 0
      
      // Hitung juz dari surah dan ayat
      if (report.ayat_end) {
        juz = getJuzFromSurahAndAyat(report.surah_name, report.ayat_end)
      }
    } else if (report.report_type === 'juz' && report.juz) {
      // Untuk catatan juz, cari surah dan ayat terakhir
      const juzInfo = getSurahAndAyatFromJuz(report.juz)
      const surah = surahs.find(s => s.name === juzInfo.surahName)
      surahId = surah ? surah.id : 0
      ayat = juzInfo.ayatEnd || 0
    }
    
    // Hitung progress_score
    const progress_score = (juz * 1000000) + (surahId * 1000) + ayat
    
    return {
      id: report.id,
      progress_score,
      juz: juz || report.juz,
      surah_name: report.surah_name || '',
      ayat_end: ayat || report.ayat_end
    }
  })
  
  // 3. Update batch ke database
  const batchSize = 100
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize)
    
    const { error: updateError } = await supabase
      .from('reports')
      .upsert(batch.map(r => ({
        id: r.id,
        progress_score: r.progress_score,
        juz: r.juz,
        surah_name: r.surah_name,
        ayat_end: r.ayat_end
      })))
    
    if (updateError) {
      console.error(`Error updating batch ${i / batchSize + 1}:`, updateError)
    } else {
      console.log(`Updated batch ${i / batchSize + 1}: ${batch.length} reports`)
    }
  }
  
  console.log('Migration completed!')
}

// Jalankan migration
migrateExistingReports()