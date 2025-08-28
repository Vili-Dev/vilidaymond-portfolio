import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';

interface PerformanceSettings {
  shouldRender: boolean;
  particleCount: number;
  animationQuality: 'low' | 'medium' | 'high';
  enableBlur: boolean;
  enableComplexAnimations: boolean;
}

export function usePerformanceSettings(baseParticleCount: number = 50): PerformanceSettings {
  const { state } = useApp();

  return useMemo(() => {
    const shouldRender = state.animationSettings.enableComplexAnimations && !state.preferences.reducedMotion;
    
    // Adjust particle count based on performance settings
    let particleMultiplier = 1;
    if (state.preferences.reducedMotion) particleMultiplier = 0.3;
    else if (!state.animationSettings.enableComplexAnimations) particleMultiplier = 0.5;
    
    // Determine animation quality based on device capabilities
    let animationQuality: 'low' | 'medium' | 'high' = 'high';
    if (typeof window !== 'undefined') {
      const { deviceMemory } = (navigator as any);
      const { hardwareConcurrency } = navigator;
      
      if (deviceMemory && deviceMemory < 4) animationQuality = 'low';
      else if (hardwareConcurrency && hardwareConcurrency < 4) animationQuality = 'medium';
    }

    return {
      shouldRender,
      particleCount: Math.floor(baseParticleCount * particleMultiplier),
      animationQuality,
      enableBlur: animationQuality !== 'low',
      enableComplexAnimations: state.animationSettings.enableComplexAnimations,
    };
  }, [
    state.animationSettings.enableComplexAnimations,
    state.preferences.reducedMotion,
    baseParticleCount
  ]);
}