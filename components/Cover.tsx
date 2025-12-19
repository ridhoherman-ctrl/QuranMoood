
import React, { useState } from 'react';
import { loginWithGoogle } from '../services/firebase';

interface CoverProps {
  onStart: () => void;
}

const Cover: React.FC<CoverProps> = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // App.tsx will automatically detect user change
    } catch (err) {
      alert("Gagal masuk dengan Google. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-1000">
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] dark:invert"></div>
      
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center gap-8">
        <div className="mb-4 animate-[fadeInUp_1s_ease-out]">
           <p className="font-arabic text-3xl md:text-4xl text-emerald-800 dark:text-emerald-200 opacity-80 leading-relaxed">
             بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
           </p>
        </div>

        <div className="relative group animate-[scaleIn_0.8s_ease-out]">
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-slate-800 rounded-full shadow-2xl flex items-center justify-center border border-emerald-50 dark:border-emerald-900">
             <div className="text-6xl md:text-7xl">🕌</div>
          </div>
        </div>

        <div className="space-y-4 animate-[fadeInUp_1.2s_ease-out]">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Qur'an <span className="text-emerald-600 dark:text-emerald-400">Mood</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
            "Temukan ketenangan jiwa melalui ayat-ayat yang mengerti perasaanmu."
          </p>
        </div>

        <div className="pt-8 animate-[fadeInUp_1.4s_ease-out]">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="group relative px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 border border-slate-200 dark:border-slate-700 flex items-center gap-3 font-semibold"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></span>
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" className="w-5 h-5" />
            )}
            Masuk dengan Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cover;
