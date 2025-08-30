import { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface PerformanceSettings {
  shouldRender: boolean;
  particleCount: number;
  animationQuality: 'low' | 'medium' | 'high';
  enableBlur: boolean;
  enableComplexAnimations: boolean;
  frameRate: number;
  isMobile: boolean;
  isFirefox: boolean;
  animationDuration: number;
}

export function usePerformanceSettings(baseParticleCount: number = 50): PerformanceSettings {
  const { state } = useApp();
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isFirefox: false,
    isHydrated: false
  });

  // Handle device detection after hydration to prevent SSR mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDeviceInfo({
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        isFirefox: /Firefox/i.test(navigator.userAgent),
        isHydrated: true
      });
    }
  }, []);

  return useMemo(() => {
    // Use device info from state, defaulting to safe values during SSR
    const { isMobile, isFirefox, isHydrated } = deviceInfo;
    
    const shouldRender = state.animationSettings.enableComplexAnimations && !state.preferences.reducedMotion;
    
    // Adaptive particle count based on device (only apply after hydration)
    let particleCount = baseParticleCount;
    if (isHydrated) {
      if (isMobile) {
        particleCount = 15; // Reduced for mobile
      } else if (isFirefox) {
        particleCount = 25; // Reduced for Firefox
      }
    }
    
    // Apply additional multipliers
    let particleMultiplier = 1;
    if (state.preferences.reducedMotion) particleMultiplier = 0.3;
    else if (!state.animationSettings.enableComplexAnimations) particleMultiplier = 0.5;
    
    // Determine animation quality and frame rate based on device (only apply after hydration)
    let animationQuality: 'low' | 'medium' | 'high' = 'high';
    let frameRate = 60;
    let animationDuration = 20; // seconds
    
    if (isHydrated) {
      if (isMobile) {
        animationQuality = 'low';
        frameRate = 60;
        animationDuration = 40; // Slower animation on mobile for smoother performance
      } else if (isFirefox) {
        animationQuality = 'medium';
        frameRate = 60;
        animationDuration = 30;
      }
    }
    
    // Additional device capability checks (only after hydration)
    if (isHydrated && typeof window !== 'undefined') {
      const { deviceMemory } = (navigator as any);
      const { hardwareConcurrency } = navigator;
      
      if (deviceMemory && deviceMemory < 4) {
        animationQuality = 'low';
        frameRate = Math.min(frameRate, 60);
      } else if (hardwareConcurrency && hardwareConcurrency < 4) {
        animationQuality = animationQuality === 'high' ? 'medium' : animationQuality;
        frameRate = Math.min(frameRate, 60);
      }
    }

    return {
      shouldRender,
      particleCount: Math.floor(particleCount * particleMultiplier),
      animationQuality,
      enableBlur: animationQuality !== 'low' && !(isHydrated && isMobile) && !(isHydrated && isFirefox),
      enableComplexAnimations: state.animationSettings.enableComplexAnimations,
      frameRate,
      isMobile,
      isFirefox,
      animationDuration,
    };
  }, [
    state.animationSettings.enableComplexAnimations,
    state.preferences.reducedMotion,
    baseParticleCount,
    deviceInfo
  ]);
}