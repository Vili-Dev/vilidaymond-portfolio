import { useState, useEffect } from 'react';

interface TimeTheme {
  period: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight';
  intensity: number; // 0-1 scale for effect intensity
  primaryColor: string;
  accentColor: string;
  description: string;
}

const timeThemes: Record<TimeTheme['period'], Omit<TimeTheme, 'period'>> = {
  midnight: {
    intensity: 1.0,
    primaryColor: '#0A0A0A',
    accentColor: '#1E1B4B', // Deep indigo
    description: 'Mystérieuse profondeur nocturne'
  },
  night: {
    intensity: 0.9,
    primaryColor: '#0A0A0A',
    accentColor: '#991B1B', // Blood red (current)
    description: 'Obscurité rouge sang'
  },
  dawn: {
    intensity: 0.6,
    primaryColor: '#1A1A1A',
    accentColor: '#DC2626', // Brighter red
    description: 'Éveil cramoisi'
  },
  morning: {
    intensity: 0.7,
    primaryColor: '#1A1A1A',
    accentColor: '#EF4444', // Crimson
    description: 'Énergie rouge éclatant'
  },
  afternoon: {
    intensity: 0.8,
    primaryColor: '#0A0A0A',
    accentColor: '#F87171', // Rose
    description: 'Intensité rouge rosé'
  },
  evening: {
    intensity: 0.9,
    primaryColor: '#0A0A0A',
    accentColor: '#B91C1C', // Dark red
    description: 'Crépuscule rouge sombre'
  }
};

export function useTimeTheme() {
  const [currentTheme, setCurrentTheme] = useState<TimeTheme>(() => {
    const hour = new Date().getHours();
    const period = getTimePeriod(hour);
    return {
      period,
      ...timeThemes[period]
    };
  });

  const [nextTransition, setNextTransition] = useState<Date>(() => {
    return getNextTransitionTime();
  });

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      const period = getTimePeriod(hour);
      
      setCurrentTheme({
        period,
        ...timeThemes[period]
      });
      
      setNextTransition(getNextTransitionTime());
    };

    // Update theme immediately
    updateTheme();

    // Set up interval to check for theme changes every minute
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    currentTheme,
    nextTransition,
    getThemeForTime: (hour: number): TimeTheme => {
      const period = getTimePeriod(hour);
      return {
        period,
        ...timeThemes[period]
      };
    }
  };
}

function getTimePeriod(hour: number): TimeTheme['period'] {
  if (hour >= 0 && hour < 2) return 'midnight';
  if (hour >= 2 && hour < 6) return 'night';
  if (hour >= 6 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

function getNextTransitionTime(): Date {
  const now = new Date();
  const currentHour = now.getHours();
  const transitionHours = [0, 2, 6, 9, 12, 18, 22];
  
  // Find next transition hour
  let nextHour = transitionHours.find(hour => hour > currentHour);
  
  if (!nextHour) {
    // Next transition is tomorrow at midnight
    nextHour = 0;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
  
  const nextTransition = new Date(now);
  nextTransition.setHours(nextHour, 0, 0, 0);
  return nextTransition;
}