import React, { useEffect, useState } from 'react';
import { MoodLog } from '../types';
import { getMoodHistory, clearMoodHistory } from '../services/historyService';
import { getMoodConfig } from '../constants';

interface MoodTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<MoodLog[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getMoodHistory());
    }
  }, [isOpen]);

  const handleClear = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat perasaan?")) {
      clearMoodHistory();
      setHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[80vh] animate-[scaleIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-800">Riwayat Hati</h2>
            <p className="text-sm text-slate-500">Jejak perjalanan perasaanmu</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <div className="text-4xl mb-3">🍃</div>
              <p>Belum ada riwayat tercatat.</p>
              <p className="text-sm">Mulailah dengan memilih suasana hatimu.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
              {history.map((log) => {
                const config = getMoodConfig(log.mood);
                return (
                  <div key={log.id} className="relative pl-8">
                    {/* Dot on Timeline */}
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-200"></div>
                    
                    <div className={`p-4 rounded-2xl border ${config?.color.replace('hover:', '') || 'bg-white'} transition-all`}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                           <span className="text-2xl">{config?.icon}</span>
                           <span className="font-semibold">{log.mood}</span>
                        </div>
                        <span className="text-xs text-slate-500/80 font-medium">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 mt-1">
                        {config?.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
           <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-center">
             <button 
               onClick={handleClear}
               className="text-red-500 text-sm hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
             >
               Hapus Semua Riwayat
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;