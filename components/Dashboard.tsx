import React, { useEffect, useState, useMemo } from 'react';
import { MoodLog, MoodType, FavoriteItem } from '../types';
import { getMoodHistory, clearMoodHistory } from '../services/historyService';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import { getMoodConfig, MOOD_CONFIGS } from '../constants';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'history' | 'favorites';

const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [history, setHistory] = useState<MoodLog[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getMoodHistory());
      setFavorites(getFavorites());
    }
  }, [isOpen, activeTab]); // Refresh when tab changes or opens

  const handleClearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua data Jurnal Qur'an Mood Anda?")) {
      clearMoodHistory();
      setHistory([]);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    if (window.confirm("Hapus item ini dari favorit?")) {
      removeFavorite(id);
      setFavorites(prev => prev.filter(item => item.id !== id));
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  // --- Statistics Logic (All Time) ---
  const allTimeStats = useMemo(() => {
    if (history.length === 0) return null;

    const total = history.length;
    
    // Count per mood
    const counts: Record<string, number> = {};
    history.forEach(h => {
      counts[h.mood] = (counts[h.mood] || 0) + 1;
    });

    // Find dominant mood
    let dominantMood = history[0].mood;
    let maxCount = 0;
    Object.entries(counts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood as MoodType;
      }
    });

    const dominantConfig = getMoodConfig(dominantMood);

    return {
      total,
      dominant: dominantConfig,
      counts
    };
  }, [history]);

  // --- Statistics Logic (Last 30 Days for Chart) ---
  const monthlyStats = useMemo(() => {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const recentLogs = history.filter(h => h.timestamp >= thirtyDaysAgo);

    const counts: Record<string, number> = {};
    MOOD_CONFIGS.forEach(config => {
      counts[config.type] = 0;
    });

    let maxVal = 0;
    recentLogs.forEach(log => {
      counts[log.mood] = (counts[log.mood] || 0) + 1;
      if (counts[log.mood] > maxVal) maxVal = counts[log.mood];
    });

    return { counts, maxVal, total: recentLogs.length };
  }, [history]);

  // Helper to get strong bar color based on mood
  const getBarColor = (mood: string) => {
    switch (mood) {
      case MoodType.HAPPY: return 'bg-yellow-400 dark:bg-yellow-500';
      case MoodType.GRATEFUL: return 'bg-emerald-500 dark:bg-emerald-500';
      case MoodType.OPTIMISTIC: return 'bg-cyan-400 dark:bg-cyan-500';
      case MoodType.CONFUSED: return 'bg-violet-400 dark:bg-violet-500';
      case MoodType.ANXIOUS: return 'bg-indigo-400 dark:bg-indigo-500';
      case MoodType.RESTLESS: return 'bg-lime-400 dark:bg-lime-500';
      case MoodType.GALAU: return 'bg-fuchsia-400 dark:bg-fuchsia-500';
      case MoodType.TIRED: return 'bg-orange-400 dark:bg-orange-500';
      case MoodType.ANGRY: return 'bg-red-400 dark:bg-red-500';
      case MoodType.DISAPPOINTED: return 'bg-stone-400 dark:bg-stone-500';
      case MoodType.LONELY: return 'bg-slate-400 dark:bg-slate-500';
      case MoodType.SAD: return 'bg-blue-400 dark:bg-blue-500';
      default: return 'bg-emerald-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Main Card */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl h-[90vh] md:h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-scaleIn">
        
        {/* Header with Pattern */}
        <div className="relative bg-emerald-900 dark:bg-emerald-950 p-6 md:p-8 text-white overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] dark:opacity-20"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-1">Jurnal Qur'an Mood</h2>
                <p className="text-emerald-200 opacity-90">Rekaman jejak spiritual dan emosionalmu.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'history' 
                    ? 'bg-white text-emerald-900 shadow-lg' 
                    : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                📊 Riwayat Perasaan
              </button>
              <button 
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'favorites' 
                    ? 'bg-white text-emerald-900 shadow-lg' 
                    : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                ❤️ Ayat Favorit
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* --- TAB: HISTORY --- */}
            {activeTab === 'history' && (
              <>
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400 dark:text-slate-500">
                    <div className="text-6xl mb-4 opacity-50">📖</div>
                    <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400">Belum ada catatan</h3>
                    <p>Mulai dengan memilih suasana hatimu hari ini.</p>
                  </div>
                ) : (
                  <>
                    {/* Stats Grid */}
                    {allTimeStats && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl">📝</div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Refleksi</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{allTimeStats.total} <span className="text-sm font-normal text-slate-400">kali</span></p>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl">{allTimeStats.dominant?.icon}</div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Dominan Terasa</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{allTimeStats.dominant?.type}</p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-700 dark:to-emerald-900 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                          <p className="text-emerald-100 text-sm font-medium">Pengingat</p>
                          <p className="font-serif italic text-lg leading-tight">"Maka sesungguhnya bersama kesulitan ada kemudahan."</p>
                        </div>
                      </div>
                    )}

                    {/* Chart */}
                    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Frekuensi Mood</h3>
                          <p className="text-sm text-slate-400 dark:text-slate-500">Statistik 30 hari terakhir</p>
                        </div>
                        {monthlyStats.total === 0 && (
                          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md">Tidak ada data bulan ini</span>
                        )}
                      </div>
                      <div className="h-64 flex items-end gap-2 md:gap-4 overflow-x-auto pb-2">
                        {MOOD_CONFIGS.map((config) => {
                          const count = monthlyStats.counts[config.type] || 0;
                          const percentage = monthlyStats.maxVal > 0 ? (count / monthlyStats.maxVal) * 100 : 0;
                          return (
                            <div key={config.type} className="flex-1 flex flex-col items-center group min-w-[40px]">
                              <div className={`mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-6 z-10 whitespace-nowrap ${count === 0 ? 'hidden' : ''}`}>{count} kali</div>
                              <div className="w-full h-48 bg-slate-50 dark:bg-slate-900/50 rounded-t-xl relative flex items-end justify-center overflow-hidden">
                                <div className={`w-full ${getBarColor(config.type)} rounded-t-xl transition-all duration-1000 ease-out-spring relative group-hover:brightness-110`} style={{ height: `${percentage === 0 ? 2 : percentage}%`, opacity: count === 0 ? 0.2 : 1 }}>
                                  {percentage > 15 && <span className="absolute top-2 w-full text-center text-white text-xs font-bold shadow-sm">{count}</span>}
                                </div>
                              </div>
                              <div className="mt-3 text-center">
                                <div className="text-xl md:text-2xl mb-1 transform group-hover:scale-110 transition-transform cursor-default" title={config.type}>{config.icon}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                        Riwayat Perjalanan
                      </h3>
                      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-6 pb-2">
                        {history.map((log, index) => {
                          const config = getMoodConfig(log.mood);
                          
                          return (
                            <div 
                              key={log.id} 
                              className="relative pl-8 opacity-0 animate-fadeInUp"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className={`absolute -left-[17px] top-0 w-9 h-9 rounded-full border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center text-base shadow-sm z-10 ${config?.color}`}>{config?.icon}</div>
                              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{log.mood}</h4>
                                    <p className="text-xs text-slate-400">{formatDate(log.timestamp)}</p>
                                  </div>
                                </div>
                                {log.note ? (
                                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mt-2 text-slate-600 dark:text-slate-300 text-sm italic relative">
                                    <span className="absolute top-2 left-2 text-3xl text-slate-200 dark:text-slate-600 -z-10 font-serif">"</span>
                                    {log.note}
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 italic pl-1">Tidak ada catatan tambahan.</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* --- TAB: FAVORITES --- */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                {favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400 dark:text-slate-500">
                    <div className="text-6xl mb-4 text-rose-200 dark:text-rose-900">❤️</div>
                    <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400">Belum ada Favorit</h3>
                    <p className="text-center max-w-xs mx-auto mt-2">Simpan ayat atau hadist yang menyentuh hatimu dengan menekan ikon hati.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {favorites.map((item, index) => {
                      const moodConfig = getMoodConfig(item.moodContext as MoodType);
                      const isQuran = item.type === 'quran';
                      
                      return (
                        <div 
                          key={item.id} 
                          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all relative group opacity-0 animate-fadeInUp"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          
                          {/* Header Badge */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-2">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${isQuran ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'}`}>
                                {isQuran ? 'Al-Quran' : 'Hadist'}
                              </span>
                              {moodConfig && (
                                <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${moodConfig.color.replace('hover:', '')} bg-opacity-10 border-opacity-20`}>
                                  {moodConfig.icon} {item.moodContext}
                                </span>
                              )}
                            </div>
                            <button 
                              onClick={() => handleRemoveFavorite(item.id)}
                              className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                              title="Hapus dari favorit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>

                          {/* Content */}
                          {isQuran ? (
                            <div className="space-y-3">
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">QS. {(item.content as any).surahName}: {(item.content as any).ayahNumber}</h4>
                              <p className="font-arabic text-2xl text-right leading-loose text-slate-700 dark:text-slate-200" dir="rtl">{(item.content as any).arabicText}</p>
                              <p className="text-slate-600 dark:text-slate-400 italic text-sm">"{(item.content as any).translation}"</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <blockquote className="font-serif text-lg text-slate-700 dark:text-slate-300 italic border-l-4 border-yellow-300 dark:border-yellow-600 pl-4 py-1">
                                "{(item.content as any).text}"
                              </blockquote>
                              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wide">{(item.content as any).source}</p>
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
                             <span>Disimpan pada {formatDate(item.timestamp)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
        
        {/* Footer Actions */}
        {activeTab === 'history' && history.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 flex justify-end shrink-0">
             <button 
               onClick={handleClearHistory}
               className="text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
             >
               Hapus Semua Riwayat
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;