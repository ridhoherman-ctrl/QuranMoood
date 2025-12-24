
import React, { useState, useEffect } from 'react';
import { HealingContent, MoodConfig, FavoriteItem } from '../types';
import AudioPlayer from './AudioPlayer';
import { updateMoodLog } from '../services/historyService';
import { 
  saveFavorite, 
  removeFavorite, 
  isFavorited, 
  generateQuranId, 
  generateHadithId 
} from '../services/favoriteService';

interface ContentDisplayProps {
  data: HealingContent;
  onReset: () => void;
  onRefresh: () => void;
  logId?: string;
  config: MoodConfig; 
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ data, onReset, onRefresh, logId, config }) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntry, setSavedEntry] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Favorites State
  const [isQuranSaved, setIsQuranSaved] = useState(false);
  const [isHadithSaved, setIsHadithSaved] = useState(false);

  const { theme } = config;

  // IDs for current content
  const quranId = generateQuranId(data.quran.surahNumber, data.quran.ayahNumber);
  const hadithId = generateHadithId(data.hadith.text);

  // Check favorite status on mount or when data changes
  useEffect(() => {
    setIsQuranSaved(isFavorited(quranId));
    setIsHadithSaved(isFavorited(hadithId));
  }, [quranId, hadithId, data]);

  // Construct Quran Audio URL (Mishary Rashid Alafasy)
  const surahPad = data.quran.surahNumber.toString().padStart(3, '0');
  const ayahPad = data.quran.ayahNumber.toString().padStart(3, '0');
  const quranAudioUrl = `https://everyayah.com/data/Alafasy_128kbps/${surahPad}${ayahPad}.mp3`;

  const handleSaveJournal = () => {
    if (!journalEntry.trim()) return;
    
    if (logId) {
      updateMoodLog(logId, journalEntry);
    }
    
    setSavedEntry(journalEntry);
    setIsEditing(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowSuccess(false);
  };

  const handleCancelEdit = () => {
    setJournalEntry(savedEntry);
    setIsEditing(false);
  };

  const toggleFavoriteQuran = () => {
    if (isQuranSaved) {
      removeFavorite(quranId);
      setIsQuranSaved(false);
    } else {
      const item: FavoriteItem = {
        id: quranId,
        type: 'quran',
        content: data.quran,
        timestamp: Date.now(),
        moodContext: data.mood
      };
      saveFavorite(item);
      setIsQuranSaved(true);
    }
  };

  const toggleFavoriteHadith = () => {
    if (isHadithSaved) {
      removeFavorite(hadithId);
      setIsHadithSaved(false);
    } else {
      const item: FavoriteItem = {
        id: hadithId,
        type: 'hadith',
        content: data.hadith,
        timestamp: Date.now(),
        moodContext: data.mood
      };
      saveFavorite(item);
      setIsHadithSaved(true);
    }
  };

  const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-all duration-300 ${filled ? 'text-rose-500 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-rose-400'}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );

  const reflectionBaseDelay = savedEntry ? 0.2 : 0.8;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 pb-16">
      
      {/* Intro Summary */}
      <div 
        className={`opacity-0 animate-fadeInUp bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border rounded-xl p-6 text-center shadow-sm ${theme.border}`}
        style={{ animationDelay: '0.1s' }}
      >
        <h2 className={`text-lg font-medium italic ${theme.accent}`}>
          "{data.summary}"
        </h2>
      </div>

      {/* --- SECTION 1: SUMBER KETENANGAN (QURAN & HADITS) --- */}
      
      {/* Quran Section */}
      <div 
        className={`opacity-0 animate-bounce-in bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border ${theme.border} relative`}
        style={{ animationDelay: '0.2s' }}
      >
        <div className={`h-2 w-full ${theme.ui.highlight}`}></div>
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-6">
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mt-1 ${theme.ui.pill}`}>
              Al-Quran
            </span>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                 <button 
                  onClick={toggleFavoriteQuran}
                  className="p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  title={isQuranSaved ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                 >
                   <HeartIcon filled={isQuranSaved} />
                 </button>
                 <div className={`font-serif text-lg ${theme.accent}`}>
                  QS. {data.quran.surahName}: {data.quran.ayahNumber}
                 </div>
              </div>
              <AudioPlayer 
                mode="url" 
                src={quranAudioUrl} 
                label="Dengar Murottal" 
                className={`${theme.ui.iconBg} hover:opacity-80`}
              />
            </div>
          </div>

          <div className="mb-8 text-right" dir="rtl">
            <p className="font-arabic text-3xl md:text-5xl leading-[1.8] md:leading-[2.0] text-slate-800 dark:text-slate-100 transition-all duration-500 ease-out-spring hover:scale-[1.02] hover:drop-shadow-sm origin-right cursor-default">
              {data.quran.arabicText}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300 italic text-lg leading-relaxed">
              "{data.quran.translation}"
            </p>
          </div>

          {/* Refresh Verse Button */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-center">
            <button
              onClick={onRefresh}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all transform active:scale-95 border hover:shadow-md ${theme.ui.buttonSecondary}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 animate-[spin_3s_linear_infinite]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Ganti Ayat & Konteks Baru
            </button>
          </div>
        </div>
      </div>

      {/* Hadith Section */}
      <div 
        className="opacity-0 animate-bounce-in bg-white dark:bg-slate-800 rounded-3xl shadow-lg overflow-hidden border border-yellow-200 dark:border-yellow-900/50 relative"
        style={{ animationDelay: '0.3s' }}
      >
         <div className="bg-yellow-400 h-2 w-full"></div>
         <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Hadist
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleFavoriteHadith}
                className="p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors mr-1"
                title={isHadithSaved ? "Hapus dari Favorit" : "Simpan ke Favorit"}
              >
                <HeartIcon filled={isHadithSaved} />
              </button>
              <AudioPlayer 
                mode="tts" 
                src={data.hadith.text} 
                label="Baca Hadist" 
                className="bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-200 dark:ring-yellow-900/50 dark:hover:bg-yellow-900/40"
              />
            </div>
          </div>
          
          <blockquote className="text-xl md:text-2xl font-serif text-slate-700 dark:text-slate-200 leading-relaxed mb-6 text-center">
            "{data.hadith.text}"
          </blockquote>

          <div className="text-center mt-4">
             <cite className="not-italic text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {data.hadith.source}
            </cite>
          </div>
         </div>
      </div>

      {/* --- SECTION 2: HIKMAH & PRAKTIK (SOLUSI) --- */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Wisdom Card */}
        <div 
          className={`opacity-0 animate-fadeInUp rounded-3xl p-8 shadow-lg border ${theme.border} ${theme.ui.pill}`}
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💡</span>
            <h3 className="font-serif text-2xl font-semibold">Hikmah</h3>
          </div>
          <p className="leading-relaxed opacity-90 text-sm md:text-base font-medium">
            {data.wisdom}
          </p>
        </div>

        {/* Action/Practice Card */}
        <div 
          className={`opacity-0 animate-fadeInUp bg-white dark:bg-slate-800 border ${theme.border} rounded-3xl p-8 shadow-lg`}
          style={{ animationDelay: '0.5s' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌿</span>
            <h3 className={`font-serif text-2xl font-semibold ${theme.accent}`}>Amalan Penenang</h3>
          </div>
          <ul className="space-y-4">
            {data.practicalSteps.map((step, idx) => (
              <li 
                key={idx} 
                className="opacity-0 animate-fadeInUp flex items-start gap-3"
                style={{ animationDelay: `${0.6 + (idx * 0.15)}s` }}
              >
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${theme.ui.pill}`}>
                  {idx + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-300">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- SECTION 3: RUANG REFLEKSI --- */}
      
      <div 
        className="opacity-0 animate-fadeInUp bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 md:p-10 relative overflow-hidden"
        style={{ animationDelay: '0.8s' }}
      >
        <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${theme.ui.iconBg}`}></div>

        <div className="relative z-10">
          <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-2">Ruang Refleksi Diri</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Curahkan perasaanmu berdasarkan renungan ayat di atas.</p>

          {showSuccess && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-scaleIn bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800`}>
              <div className="bg-green-100 dark:bg-green-800/40 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-green-600 dark:text-green-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="font-medium text-sm">Alhamdulillah, catatan hatimu telah tersimpan.</span>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Pertanyaan Renungan:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 italic">
                  {data.reflectionQuestions.map((q, i) => (
                    <li 
                      key={i} 
                      className="opacity-0 animate-fadeInUp"
                      style={{ animationDelay: `${reflectionBaseDelay + (i * 0.15)}s` }}
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Apa pelajaran yang bisa kamu ambil dari ayat ini untuk kondisimu sekarang?"
                  className={`w-full h-40 p-4 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 transition-all resize-none bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none ${theme.border.replace('border-', 'focus:border-').replace('200', '500')} ${theme.ui.iconBg.replace('bg-', 'focus:ring-').replace('100', '200')}`}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                {savedEntry && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-5 py-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
                  >
                    Batal
                  </button>
                )}
                <button
                  onClick={handleSaveJournal}
                  disabled={!journalEntry.trim()}
                  className={`
                    px-6 py-2.5 rounded-full font-medium transition-all transform active:scale-95 shadow-sm
                    ${journalEntry.trim() 
                      ? theme.ui.buttonPrimary
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'}
                  `}
                >
                  {savedEntry ? 'Simpan Perubahan' : 'Simpan Catatan Hati'}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-scaleIn">
              <div className={`bg-amber-50/50 dark:bg-slate-900 p-6 rounded-2xl border ${theme.border} relative shadow-sm`}>
                 <div className="absolute top-4 left-4 text-6xl opacity-10 font-serif leading-none">"</div>
                 <div className="relative z-10 px-4 pt-2 pb-4">
                   <p className="text-slate-700 dark:text-slate-300 text-lg font-serif italic whitespace-pre-line leading-relaxed">
                     {savedEntry}
                   </p>
                 </div>
                 <div className="absolute bottom-4 right-4 flex gap-2">
                   <button 
                     onClick={handleEdit}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-500 shadow-sm`}
                   >
                     Edit
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div 
        className="opacity-0 animate-fadeInUp flex justify-center pt-8"
        style={{ animationDelay: '0.9s' }}
      >
        <button
          onClick={onReset}
          className={`group flex items-center gap-2 px-6 py-3 rounded-full transition-all shadow-sm hover:shadow-md ${theme.ui.buttonSecondary}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Pilih suasana hati lain
        </button>
      </div>

    </div>
  );
};

export default ContentDisplay;
