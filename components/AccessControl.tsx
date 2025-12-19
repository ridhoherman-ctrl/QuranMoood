
import React, { ReactNode } from 'react';
import { UserProfile, logout } from '../services/firebase';

interface AccessControlProps {
  userProfile: UserProfile | null;
  children: ReactNode;
}

const AccessControl: React.FC<AccessControlProps> = ({ userProfile, children }) => {
  if (!userProfile) return null;

  if (userProfile.status === 'pending') {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950 flex flex-col items-center justify-center p-6 text-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] dark:invert"></div>
        
        <div className="relative z-10 max-w-lg w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white/50 dark:border-slate-800 animate-scaleIn">
          
          {/* Decorative Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-emerald-200 dark:bg-emerald-800 blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-900 dark:to-slate-800 rounded-full flex items-center justify-center shadow-inner border border-emerald-50 dark:border-emerald-700">
              <span className="text-5xl animate-bounce">⏳</span>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
            Sabrun Jameel
          </h2>
          
          <p className="text-emerald-700 dark:text-emerald-400 font-medium italic mb-8 text-lg">
            "Kesabaran yang indah adalah menunggu dengan ridho atas ketetapan-Nya."
          </p>

          <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              Assalamualaikum, <span className="font-bold text-slate-800 dark:text-slate-200">{userProfile.displayName}</span>. 
              Pendaftaranmu sedang kami tinjau dengan penuh doa.
            </p>
            
            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30 flex items-center justify-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_100ms]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_200ms]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_300ms]"></div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                Menunggu Persetujuan Admin
              </span>
            </div>

            <p className="text-sm opacity-80">
              Halaman ini akan terbuka otomatis segera setelah akunmu diaktifkan. Kamu tidak perlu memuat ulang halaman.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-4">
            <p className="text-xs text-slate-400 italic">Akun: {userProfile.email}</p>
            <button 
              onClick={() => logout()}
              className="text-sm font-bold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors tracking-widest uppercase"
            >
              Logout / Ganti Akun
            </button>
          </div>
        </div>

        <div className="mt-8 text-slate-400 dark:text-slate-600 text-[10px] uppercase tracking-[0.2em] animate-pulse">
          Sistem Terkoneksi Secara Real-Time
        </div>
      </div>
    );
  }

  if (userProfile.status === 'blocked') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-red-100 dark:border-red-900/30">
          <div className="text-6xl mb-6">🚫</div>
          <h2 className="text-2xl font-serif font-bold text-red-800 dark:text-red-400 mb-4">Akses Terbatas</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">Maaf, akses kamu ke aplikasi ini telah dinonaktifkan oleh administrator.</p>
          <button 
            onClick={() => logout()} 
            className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AccessControl;
