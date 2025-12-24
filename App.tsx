
import React, { useState, useEffect, useRef } from 'react';
import MoodSelector from './components/MoodSelector';
import ContentDisplay from './components/ContentDisplay';
import Dashboard from './components/Dashboard';
import Cover from './components/Cover';
import AccessControl from './components/AccessControl';
import { HealingContent, MoodType } from './types';
import { generateHealingContent } from './services/geminiService';
import { saveMoodLog } from './services/historyService';
import { getMoodConfig, getRandomLoadingMessage } from './constants';
import { auth, db, UserProfile, logout } from './services/firebase';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [content, setContent] = useState<HealingContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [currentLogId, setCurrentLogId] = useState<string | undefined>(undefined);
  
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Handle Authentication and Realtime Status Check
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Subscribe to real-time updates of user profile
        const unsubscribeProfile = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data() as UserProfile);
          }
          setAuthLoading(false);
        });
        return () => unsubscribeProfile();
      } else {
        setUser(null);
        setUserProfile(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (loading && selectedMood) {
      setLoadingMessage(getRandomLoadingMessage(selectedMood));
      loadingIntervalRef.current = setInterval(() => {
        setLoadingMessage(getRandomLoadingMessage(selectedMood));
      }, 2500);
    } else if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
    }
    return () => { if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current); };
  }, [loading, selectedMood]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleReset = () => {
    setContent(null);
    setSelectedMood(null);
    setError(null);
  };

  const currentConfig = selectedMood ? getMoodConfig(selectedMood) : null;
  const themeClass = currentConfig ? currentConfig.theme.background : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950';
  const textClass = currentConfig ? currentConfig.theme.primaryText : 'text-emerald-950 dark:text-emerald-50';
  const secondaryTextClass = currentConfig ? currentConfig.theme.secondaryText : 'text-slate-600 dark:text-slate-400';
  const accentButtonClass = currentConfig ? currentConfig.theme.ui.buttonSecondary : 'bg-white/80 text-emerald-800 border-emerald-100 hover:bg-emerald-50 dark:bg-slate-800 dark:text-emerald-200 dark:border-emerald-800 dark:hover:bg-emerald-900';

  const fetchContent = async (mood: MoodType) => {
    setLoading(true);
    setError(null);
    setContent(null);
    try {
      const data = await generateHealingContent(mood);
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      if (!content) setSelectedMood(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    const log = saveMoodLog(mood);
    setCurrentLogId(log.id);
    await fetchContent(mood);
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-600 dark:text-emerald-400 font-medium animate-pulse text-sm">Menghubungkan ke Qalbu...</p>
      </div>
    );
  }

  if (!user) {
    return <Cover onStart={() => {}} />; 
  }

  return (
    <AccessControl userProfile={userProfile}>
      <div className={`min-h-screen bg-fixed relative transition-colors duration-1000 ease-in-out ${themeClass}`}>
        <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] dark:invert"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60 dark:to-slate-900/60 pointer-events-none"></div>

        <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col items-center animate-[fadeIn_1s_ease-out]">
          
          <div className="w-full flex justify-between items-center mb-10 px-2 md:px-4">
             {/* User Section */}
             <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${userProfile?.displayName}`} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800"></div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${secondaryTextClass}`}>Assalamualaikum,</span>
                  <span className={`text-sm md:text-base font-bold ${textClass}`}>
                    {userProfile ? getFirstName(userProfile.displayName) : 'Hamba Allah'}
                  </span>
                </div>
             </div>

             {/* Functional Header Center Icon */}
             <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
               {selectedMood ? (
                 <button 
                  onClick={handleReset}
                  className={`
                    relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-500 
                    hover:scale-110 active:scale-95 shadow-lg border-2
                    ${accentButtonClass}
                  `}
                 >
                   <span className="text-2xl md:text-3xl relative z-10 animate-[bounce_3s_infinite]">{currentConfig?.icon}</span>
                   <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 whitespace-nowrap">Beranda</span>
                 </button>
               ) : (
                 <div className="p-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/40 dark:border-slate-700/50 shadow-sm">
                   <span className="text-2xl md:text-3xl">🕌</span>
                 </div>
               )}
             </div>

             {/* Right Controls */}
             <div className="flex gap-2">
                <button 
                  onClick={toggleTheme} 
                  title="Ganti Tema"
                  className={`p-2.5 backdrop-blur-sm border rounded-full transition-all shadow-sm ${accentButtonClass}`}
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>
                <button 
                  onClick={() => setShowDashboard(true)} 
                  className={`hidden sm:flex items-center gap-2 px-4 py-2.5 backdrop-blur-sm border rounded-full text-sm font-bold transition-all shadow-sm group ${accentButtonClass}`}
                >
                  <span className="group-hover:rotate-12 transition-transform">📊</span>
                  <span className="hidden md:inline">Jurnal</span>
                </button>
                <button 
                  onClick={() => logout()} 
                  title="Keluar"
                  className={`p-2.5 backdrop-blur-sm border border-red-100/30 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm`}
                >
                  🚪
                </button>
             </div>
          </div>

          {!content && !loading && !error && (
            <div className="text-center mb-10 md:mb-16 animate-fadeInUp">
              <h2 className={`text-3xl md:text-5xl font-serif font-bold mb-4 tracking-tight ${textClass}`}>
                Apa yang sedang Anda rasakan?
              </h2>
              <p className={`text-lg max-w-lg mx-auto opacity-80 ${secondaryTextClass}`}>
                Pilihlah suasana hati Anda saat ini, biarkan Al-Quran menyentuh hati dan memberikan ketenangan.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 animate-scaleIn">
              <div className="relative mb-8">
                <div className={`w-24 h-24 border-8 border-t-transparent rounded-full animate-spin ${currentConfig ? currentConfig.theme.accent.replace('text-', 'border-') : 'border-emerald-500'}`}></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {selectedMood ? getMoodConfig(selectedMood)?.icon : "🤲"}
                </div>
              </div>
              <p className={`text-xl font-serif font-bold text-center animate-pulse px-4 ${textClass}`}>
                {loadingMessage}
              </p>
              <p className="text-xs text-slate-400 mt-4 tracking-widest uppercase font-bold">Sedang Menghubungkan Qalbu...</p>
            </div>
          )}

          {error && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-xl max-w-md text-center animate-scaleIn">
              <div className="text-5xl mb-4">😔</div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Maaf, terjadi kendala</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">{error}</p>
              <button 
                onClick={() => selectedMood && fetchContent(selectedMood)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95"
              >
                Coba Lagi
              </button>
              <button 
                onClick={handleReset}
                className="w-full mt-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-sm font-medium"
              >
                Kembali ke Menu Utama
              </button>
            </div>
          )}

          {!content && !loading && !error && (
            <MoodSelector onSelect={handleMoodSelect} disabled={loading} selectedMood={selectedMood} />
          )}

          {content && !loading && currentConfig && (
            <ContentDisplay 
              data={content} 
              onReset={handleReset} 
              onRefresh={() => fetchContent(selectedMood as MoodType)}
              logId={currentLogId}
              config={currentConfig}
            />
          )}

          <footer className="mt-auto pt-20 pb-10 text-center opacity-40 text-[10px] tracking-[0.3em] uppercase pointer-events-none font-bold">
            <p>&copy; {new Date().getFullYear()} Qur'an Mood • Kedamaian dalam Iman</p>
          </footer>
        </main>

        <Dashboard isOpen={showDashboard} onClose={() => setShowDashboard(false)} />
        
        {/* Floating Mobile Dashboard Button */}
        <button 
          onClick={() => setShowDashboard(true)} 
          className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl z-40 active:scale-90 transition-transform ring-4 ring-white dark:ring-slate-800"
        >
          📊
        </button>
      </div>
    </AccessControl>
  );
};

export default App;
