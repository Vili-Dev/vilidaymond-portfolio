import { useState, useEffect, useCallback } from 'react';

interface GyroscopeData {
  alpha: number; // Z-axis rotation (0-360 degrees)
  beta: number;  // X-axis rotation (-180 to 180 degrees)
  gamma: number; // Y-axis rotation (-90 to 90 degrees)
}

interface UseGyroscopeOptions {
  enabled?: boolean;
  sensitivity?: number; // 0-1, how sensitive the parallax effect should be
  throttleMs?: number;
}

export function useGyroscope(options: UseGyroscopeOptions = {}) {
  const {
    enabled = true,
    sensitivity = 0.5,
    throttleMs = 16 // ~60fps
  } = options;

  const [gyroscopeData, setGyroscopeData] = useState<GyroscopeData>({
    alpha: 0,
    beta: 0,
    gamma: 0
  });

  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [lastUpdate, setLastUpdate] = useState(0);

  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setIsSupported(false);
      return false;
    }

    // Check if permission is needed (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        setPermission(permissionState);
        
        if (permissionState === 'granted') {
          setIsSupported(true);
          return true;
        }
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setPermission('denied');
      }
    } else {
      // Permission not needed or not supported
      setIsSupported(true);
      setPermission('granted');
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    if (!enabled || !isSupported || permission !== 'granted') return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleMs) return;

      const { alpha, beta, gamma } = event;
      
      if (alpha !== null && beta !== null && gamma !== null) {
        setGyroscopeData({ alpha, beta, gamma });
        setLastUpdate(now);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [enabled, isSupported, permission, throttleMs, lastUpdate]);

  // Calculate parallax values based on gyroscope data
  const getParallaxValues = useCallback((multiplier = 1) => {
    const { beta, gamma } = gyroscopeData;
    
    // Convert device orientation to parallax values
    // Beta: front-back tilt (-180 to 180) -> Y parallax
    // Gamma: left-right tilt (-90 to 90) -> X parallax
    
    const maxTilt = 30; // Maximum tilt angle to consider
    const normalizedX = Math.max(-1, Math.min(1, gamma / maxTilt));
    const normalizedY = Math.max(-1, Math.min(1, beta / maxTilt));
    
    return {
      x: normalizedX * sensitivity * multiplier,
      y: normalizedY * sensitivity * multiplier
    };
  }, [gyroscopeData, sensitivity]);

  return {
    gyroscopeData,
    isSupported,
    permission,
    requestPermission,
    getParallaxValues
  };
}