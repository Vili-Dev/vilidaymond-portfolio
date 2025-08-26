import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAudioOptions {
  preload?: boolean;
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
}

export function useAudio(src: string, options: UseAudioOptions = {}) {
  const {
    preload = true,
    volume = 0.5,
    loop = false,
    autoplay = false
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;
    audio.preload = preload ? 'auto' : 'none';

    audioRef.current = audio;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    if (autoplay) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.pause();
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, [src, volume, loop, preload, autoplay]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
  }, [duration]);

  const setVolume = useCallback((vol: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = Math.max(0, Math.min(vol, 1));
  }, []);

  return {
    isLoaded,
    isPlaying,
    duration,
    currentTime,
    play,
    pause,
    stop,
    seek,
    setVolume
  };
}

// Hook for UI sound effects
export function useUIAudio() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);

  // Check user preference for audio
  useEffect(() => {
    const preference = localStorage.getItem('vilidaymond-audio-enabled');
    setIsEnabled(preference === 'true');
  }, []);

  const playHoverSound = useCallback(() => {
    if (!isEnabled) return;
    
    // Create subtle hover sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [isEnabled, volume]);

  const playClickSound = useCallback(() => {
    if (!isEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.15, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  }, [isEnabled, volume]);

  const toggleAudio = useCallback(() => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('vilidaymond-audio-enabled', newState.toString());
  }, [isEnabled]);

  return {
    isEnabled,
    volume,
    setVolume,
    toggleAudio,
    playHoverSound,
    playClickSound
  };
}