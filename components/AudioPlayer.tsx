import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';
import { PcmPlayer } from '../services/audioService';

interface AudioPlayerProps {
  mode: 'url' | 'tts';
  src: string; // URL for 'url' mode, Text content for 'tts' mode
  className?: string;
  label?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ mode, src, className = '', label = 'Dengarkan' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pcmPlayerRef = useRef<PcmPlayer | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (pcmPlayerRef.current) {
        pcmPlayerRef.current.stop();
      }
    };
  }, []);

  const handlePlay = async () => {
    if (isPlaying) {
      // Stop logic
      if (mode === 'url' && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else if (mode === 'tts' && pcmPlayerRef.current) {
        pcmPlayerRef.current.stop();
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'url') {
        if (!audioRef.current) {
          audioRef.current = new Audio(src);
          audioRef.current.onended = () => setIsPlaying(false);
          audioRef.current.onerror = () => {
             setIsPlaying(false);
             setIsLoading(false);
             alert("Gagal memuat audio ayat ini.");
          };
        }
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        // TTS Mode
        // We use a simple cache logic: if we generated it once, we could store it, 
        // but for simplicity, we regenerate or let the PcmPlayer handle the session.
        // Here we fetch every time to ensure freshness or simply because we don't have a persistent store.
        const base64Audio = await generateSpeech(src);
        
        if (!pcmPlayerRef.current) {
          pcmPlayerRef.current = new PcmPlayer();
        }
        
        setIsPlaying(true);
        setIsLoading(false); // Done fetching, now playing
        await pcmPlayerRef.current.play(base64Audio);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      alert("Gagal memutar audio.");
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all
        ${isPlaying 
          ? 'bg-red-50 text-red-600 ring-1 ring-red-200' 
          : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
        }
        ${isLoading ? 'opacity-70 cursor-wait' : ''}
        ${className}
      `}
      title={label}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          <path d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm5.25 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V5.25z" /> 
          {/* Using a Stop/Pause icon metaphor */}
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
        </svg>
      )}
      <span>{isPlaying ? 'Berhenti' : label}</span>
    </button>
  );
};

export default AudioPlayer;