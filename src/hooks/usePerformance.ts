import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  connectionType: string | null;
  reducedMotion: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number;
}

export function usePerformance(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    batteryLevel: null,
    batteryCharging: null,
    connectionType: null,
    reducedMotion: false,
    deviceMemory: null,
    hardwareConcurrency: typeof window !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMetrics = async () => {
      // Check for reduced motion preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Battery API
      let batteryLevel = null;
      let batteryCharging = null;
      
      try {
        // @ts-ignore - Battery API is experimental
        const battery = await navigator.getBattery?.();
        if (battery) {
          batteryLevel = battery.level;
          batteryCharging = battery.charging;
        }
      } catch (error) {
        // Battery API not supported
      }

      // Network Information API
      let connectionType = null;
      try {
        // @ts-ignore - Network Information API
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          connectionType = connection.effectiveType || connection.type;
        }
      } catch (error) {
        // Network Information API not supported
      }

      // Device Memory API
      let deviceMemory = null;
      try {
        // @ts-ignore - Device Memory API
        deviceMemory = navigator.deviceMemory;
      } catch (error) {
        // Device Memory API not supported
      }

      setMetrics({
        batteryLevel,
        batteryCharging,
        connectionType,
        reducedMotion: mediaQuery.matches,
        deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency || 4
      });

      // Listen for changes
      const handleMotionChange = () => {
        setMetrics(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));
      };

      mediaQuery.addEventListener('change', handleMotionChange);

      return () => {
        mediaQuery.removeEventListener('change', handleMotionChange);
      };
    };

    updateMetrics();
  }, []);

  return metrics;
}

export function useAnimationSettings() {
  const performance = usePerformance();
  
  const shouldReduceAnimations = 
    performance.reducedMotion ||
    (performance.batteryLevel !== null && performance.batteryLevel < 0.2 && !performance.batteryCharging) ||
    performance.connectionType === 'slow-2g' ||
    (performance.deviceMemory !== null && performance.deviceMemory <= 2) ||
    performance.hardwareConcurrency <= 2;

  return {
    enableComplexAnimations: !shouldReduceAnimations,
    enableParallax: !shouldReduceAnimations,
    enableParticles: !shouldReduceAnimations,
    animationDuration: shouldReduceAnimations ? 0.1 : 1,
    particleCount: shouldReduceAnimations ? 10 : 75
  };
}