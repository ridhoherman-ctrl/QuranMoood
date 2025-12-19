
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
          <div className="text-6xl mb-6">⏳</div>
          <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-4">Akses Sedang Ditinjau</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Terima kasih telah mendaftar di <strong>Qur'an Mood</strong>. Akun kamu (<span className="text-emerald-600 font-medium">{userProfile.email}</span>) sedang menunggu persetujuan admin untuk menjaga komunitas tetap kondusif.
          </p>
          <div className="space-y-4">
            <p className="text-xs text-slate-400 italic">Silakan hubungi pemilik aplikasi untuk aktivasi cepat.</p>
            <button 
              onClick={() => logout()}
              className="px-6 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Keluar / Ganti Akun
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userProfile.status === 'blocked') {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30">
          <div className="text-6xl mb-6">🚫</div>
          <h2 className="text-2xl font-serif font-bold text-red-800 dark:text-red-400 mb-4">Akses Ditolak</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Maaf, akses kamu ke aplikasi ini telah dinonaktifkan.</p>
          <button onClick={() => logout()} className="text-red-600 font-medium">Logout</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AccessControl;
