
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
        // Subscribe to real-time updates of user profile (for instant approval)
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
        <p className="text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">Menghubungkan ke Qalbu...</p>
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

        <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 md:py-16 min-h-screen flex flex-col items-center animate-[fadeIn_1s_ease-out]">
          
          <div className="w-full flex justify-between items-center mb-8 px-2 md:px-4">
             <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={userProfile?.photoURL || "https://ui-avatars.com/api/?name=" + (userProfile?.displayName || "User")} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800"></div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${secondaryTextClass}`}>Assalamualaikum,</span>
                  <span className={`text-sm md:text-base font-bold ${textClass}`}>
                    {userProfile ? getFirstName(userProfile.displayName) : 'Hamba Allah'}
                  </span>
                </div>
             </div>

             <div className="flex gap-2">
                <button onClick={toggleTheme} className={`p-2 backdrop-blur-sm border rounded-full transition-all shadow-sm ${accentButtonClass}`}>
                  {darkMode ? "☀️" : "🌙"}
                </button>
                <button onClick={() => setShowDashboard(true)} className={`hidden md:flex items-center gap-2 px-4 py-2 backdrop-blur-sm border rounded-full text-sm font-medium transition-all shadow-sm group ${accentButtonClass}`}>
                  Jurnal
                </button>
                <button onClick={() => logout()} className="p-2 backdrop-blur-sm border rounded-full transition-all shadow-sm bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                </button>
             </div>
          </div>

          <header className="text-center mb-12 space-y-4 w-full">
            <div className="inline-flex items-center justify-center p-3 rounded-full mb-4 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
               <span className="text-3xl">🕌</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold font-serif tracking-tight ${textClass}`}>Qur'an Mood</h1>
            <p className={`text-lg max-w-md mx-auto ${secondaryTextClass}`}>Sapaan batin dari Al-Quran sesuai suasana hatimu.</p>
          </header>

          {loading && (
             <div className="flex flex-col items-center py-20 animate-fadeIn">
                <div className="animate-bounce text-5xl mb-6">{currentConfig?.icon || '🤲'}</div>
                <h3 className={`text-xl font-medium text-center max-w-sm ${textClass}`}>{loadingMessage}</h3>
             </div>
          )}

          {error && <div className="text-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">{error}</div>}

          {!content && !loading && !error && (
            <div className="w-full flex flex-col items-center">
              <h2 className={`text-xl font-medium mb-8 text-center ${secondaryTextClass}`}>
                Bagaimana perasaanmu hari ini, {userProfile ? getFirstName(userProfile.displayName) : 'saudaraku'}?
              </h2>
              <MoodSelector onSelect={handleMoodSelect} disabled={loading} selectedMood={selectedMood} />
            </div>
          )}

          {content && !loading && currentConfig && (
            <ContentDisplay data={content} onReset={() => setContent(null)} onRefresh={() => fetchContent(selectedMood!)} logId={currentLogId} config={currentConfig} />
          )}

          <footer className={`mt-auto pt-16 text-center text-[10px] uppercase tracking-widest ${secondaryTextClass} opacity-60`}>
             <p>&copy; {new Date().getFullYear()} Qur'an Mood</p>
          </footer>
        </main>
        <Dashboard isOpen={showDashboard} onClose={() => setShowDashboard(false)} />
      </div>
    </AccessControl>
  );
};

export default App;
