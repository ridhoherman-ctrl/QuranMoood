import React from 'react';
import { MoodType } from '../types';
import { MOOD_CONFIGS } from '../constants';

interface MoodSelectorProps {
  onSelect: (mood: MoodType) => void;
  disabled: boolean;
  selectedMood: MoodType | null;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect, disabled, selectedMood }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto p-4 perspective-[1000px]">
      {MOOD_CONFIGS.map((m) => {
        const isSelected = selectedMood === m.type;
        const isAnySelected = selectedMood !== null;
        
        return (
          <button
            key={m.type}
            onClick={() => onSelect(m.type)}
            disabled={disabled}
            className={`
              relative p-6 rounded-2xl border-2 text-left group bg-white dark:bg-slate-800
              transition-all duration-500 ease-out-spring
              ${m.color}
              
              ${/* Dynamic Classes based on Selection State */ ''}
              ${isSelected 
                  ? 'ring-4 ring-emerald-400/30 scale-105 shadow-2xl z-10 translate-y-[-4px]' 
                  : isAnySelected 
                    ? 'opacity-60 scale-95 hover:opacity-100 hover:scale-100 hover:shadow-lg blur-[0.5px] hover:blur-none' 
                    : 'scale-100 shadow-sm hover:scale-105 hover:shadow-lg hover:-translate-y-1'
              }

              ${disabled ? 'opacity-50 cursor-not-allowed filter grayscale' : 'cursor-pointer'}
            `}
          >
            <div className={`
              text-3xl mb-3 transition-transform duration-500 ease-out-spring origin-left
              ${isSelected ? 'scale-125 translate-x-1' : 'group-hover:scale-110'}
            `}>
              {m.icon}
            </div>
            
            <div className={`
               transition-all duration-300
               ${isSelected ? 'translate-x-1' : ''}
            `}>
              <div className="font-semibold text-lg">{m.type}</div>
              <div className="text-sm opacity-80">{m.description}</div>
            </div>
            
            {/* Animated Checkmark */}
            {isSelected && (
              <div className="absolute top-3 right-3 text-emerald-600 animate-bounce-in bg-white/50 dark:bg-slate-700/50 rounded-full p-1 shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
            
            {/* Subtle background glow for selected item */}
            {isSelected && (
              <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-2xl animate-pulse pointer-events-none"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;