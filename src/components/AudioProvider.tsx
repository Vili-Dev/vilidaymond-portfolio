'use client';

import { createContext, useContext, useRef, useEffect, ReactNode } from 'react';
import { useUIAudio } from '@/hooks/useAudio';
import { useApp } from '@/contexts/AppContext';

interface AudioContextType {
  playHover: () => void;
  playClick: () => void;
  isEnabled: boolean;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  volume: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const { isEnabled, volume, setVolume, toggleAudio, playHoverSound, playClickSound } = useUIAudio();
  const { state } = useApp();
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Initialize Web Audio Context
  useEffect(() => {
    if (!isEnabled || typeof window === 'undefined') return;

    const initializeAudioContext = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        
        // Create master gain node
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = volume;

        // Resume context on user interaction (required by browsers)
        const resumeContext = () => {
          if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
          }
        };

        document.addEventListener('click', resumeContext, { once: true });
        document.addEventListener('touchstart', resumeContext, { once: true });

        return () => {
          document.removeEventListener('click', resumeContext);
          document.removeEventListener('touchstart', resumeContext);
        };
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };

    initializeAudioContext();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isEnabled, volume]);

  // Update master volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Enhanced hover sound with Web Audio API
  const playHover = () => {
    if (!isEnabled || !state.preferences.audioEnabled) return;
    
    // Use the hook's simple implementation for now
    playHoverSound();
  };

  // Enhanced click sound
  const playClick = () => {
    if (!isEnabled || !state.preferences.audioEnabled) return;
    
    // Use the hook's simple implementation for now
    playClickSound();
  };

  // Advanced audio effects using Web Audio API
  const createAudioEffect = (
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine'
  ) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const effectGain = audioContextRef.current.createGain();

    oscillator.connect(effectGain);
    effectGain.connect(gainNodeRef.current);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);

    // Envelope
    effectGain.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    effectGain.gain.linearRampToValueAtTime(volume * 0.1, audioContextRef.current.currentTime + 0.01);
    effectGain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const contextValue: AudioContextType = {
    playHover,
    playClick,
    isEnabled: isEnabled && state.preferences.audioEnabled,
    toggleAudio,
    setVolume,
    volume
  };

  // Add global audio event listeners
  useEffect(() => {
    if (!isEnabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Play click sound for interactive elements
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.hasAttribute('data-audio-click') ||
        target.closest('[data-audio-click]')
      ) {
        playClick();
      }
    };

    const handleGlobalMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Play hover sound for interactive elements
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.hasAttribute('data-audio-hover') ||
        target.closest('[data-audio-hover]') ||
        target.classList.contains('hover-optimized')
      ) {
        playHover();
      }
    };

    // Use event delegation for performance
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('mouseenter', handleGlobalMouseEnter, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('mouseenter', handleGlobalMouseEnter, true);
    };
  }, [isEnabled, playClick, playHover]);

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
      
      {/* Audio control UI */}
      <AudioControls />
    </AudioContext.Provider>
  );
}

function AudioControls() {
  const audio = useAudio();
  
  if (!audio) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 glass-effect rounded-lg p-2 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-2">
        <button
          onClick={audio.toggleAudio}
          className="p-2 rounded hover:bg-primary-red/20 transition-colors"
          title={audio.isEnabled ? 'Disable Audio' : 'Enable Audio'}
          data-audio-click
        >
          {audio.isEnabled ? (
            <svg className="w-4 h-4 text-secondary-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.817L4.477 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.477l3.906-3.817a1 1 0 011.617-.817z" clipRule="evenodd" />
              <path d="M14.657 2.929a1 1 0 011.414 0A9.97 9.97 0 0119 10a9.97 9.97 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
              <path d="M11.929 5.929a1 1 0 011.414 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.657 4.071 1 1 0 01-1.414-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.071-2.657 1 1 0 010-1.414z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-secondary-lightGray" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.817L4.477 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.477l3.906-3.817a1 1 0 011.617-.817z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        {audio.isEnabled && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audio.volume}
            onChange={(e) => audio.setVolume(parseFloat(e.target.value))}
            className="w-16 accent-primary-red"
            title="Volume"
          />
        )}
      </div>
    </div>
  );
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}