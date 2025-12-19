
import React, { useState } from 'react';
import { loginWithEmail, registerWithEmail } from '../services/firebase';

interface CoverProps {
  onStart: () => void;
}

const Cover: React.FC<CoverProps> = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        if (!name) throw new Error("Nama harus diisi");
        await registerWithEmail(name, email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      let msg = "Terjadi kesalahan";
      if (err.code === 'auth/user-not-found') msg = "Email tidak terdaftar";
      if (err.code === 'auth/wrong-password') msg = "Password salah";
      if (err.code === 'auth/email-already-in-use') msg = "Email sudah digunakan";
      if (err.code === 'auth/weak-password') msg = "Password terlalu lemah (min. 6 karakter)";
      setError(err.message || msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950 flex flex-col items-center justify-center p-6 transition-colors duration-1000">
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] dark:invert"></div>
      
      <div className="relative z-10 max-w-md w-full flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-8 text-center animate-fadeInUp">
          <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900 mx-auto mb-6 transform hover:rotate-12 transition-transform">
             <span className="text-5xl">🕌</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Qur'an <span className="text-emerald-600 dark:text-emerald-400">Mood</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 italic">
            "Tenangkan hati dengan kalam Ilahi"
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800 animate-scaleIn">
          <div className="flex gap-4 mb-8 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button 
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${!isRegister ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
            >
              Masuk
            </button>
            <button 
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${isRegister ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all outline-none"
                  placeholder="Nama panggil"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all outline-none"
                placeholder="email@contoh.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isRegister ? "Buat Akun" : "Masuk Sekarang"
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-xs text-slate-400 dark:text-slate-600 text-center max-w-[200px]">
          {isRegister 
            ? "Akun Anda akan ditinjau oleh admin sebelum dapat digunakan." 
            : "Gunakan email dan password yang telah didaftarkan."}
        </p>
      </div>
    </div>
  );
};

export default Cover;
