'use client';

import { useEffect } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { useApp } from '@/contexts/AppContext';

interface TimeThemeProviderProps {
  children: React.ReactNode;
}

export default function TimeThemeProvider({ children }: TimeThemeProviderProps) {
  const { currentTheme } = useTimeTheme();
  const { updatePreference } = useApp();

  useEffect(() => {
    if (!currentTheme) return;

    // Apply theme to document root for CSS custom properties
    const root = document.documentElement;
    
    // Update CSS custom properties
    root.style.setProperty('--theme-primary', currentTheme.primaryColor);
    root.style.setProperty('--theme-accent', currentTheme.accentColor);
    root.style.setProperty('--theme-intensity', currentTheme.intensity.toString());

    // Apply theme-based classes
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${currentTheme.period}`);

    // Update particle system based on time
    const particleElements = document.querySelectorAll('.particle-canvas');
    particleElements.forEach((element) => {
      const canvas = element as HTMLCanvasElement;
      if (canvas && canvas.style) {
        canvas.style.filter = getParticleFilter(currentTheme.period);
        canvas.style.opacity = (currentTheme.intensity * 0.8).toString();
      }
    });

    // Update glass effects
    const glassElements = document.querySelectorAll('.glass-effect');
    glassElements.forEach((element) => {
      const el = element as HTMLElement;
      if (el.style) {
        el.style.borderColor = `${currentTheme.accentColor}40`;
        el.style.background = `rgba(26, 26, 26, ${0.6 + currentTheme.intensity * 0.2})`;
      }
    });

    // Update gradient text
    const gradientElements = document.querySelectorAll('.gradient-text');
    gradientElements.forEach((element) => {
      const el = element as HTMLElement;
      if (el.style) {
        el.style.background = getGradientForPeriod(currentTheme.period);
        el.style.backgroundClip = 'text';
        el.style.webkitBackgroundClip = 'text';
      }
    });

    // Update navigation glow
    const navElements = document.querySelectorAll('nav');
    navElements.forEach((element) => {
      const el = element as HTMLElement;
      if (el.style) {
        el.style.boxShadow = `0 2px 20px ${currentTheme.accentColor}20`;
      }
    });

    console.log(`Applied theme: ${currentTheme.period} (${currentTheme.description})`);

  }, [currentTheme]);

  // Handle system theme preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Portfolio is always dark, but we can adjust intensity
      const isDark = mediaQuery.matches;
      if (!isDark) {
        // Slightly reduce intensity for light preference users
        document.documentElement.style.setProperty(
          '--theme-intensity-modifier', 
          '0.8'
        );
      } else {
        document.documentElement.style.setProperty(
          '--theme-intensity-modifier', 
          '1.0'
        );
      }
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Smooth theme transitions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.body.classList.add('theme-transition');
    
    return () => {
      document.body.classList.remove('theme-transition');
    };
  }, []);

  return <>{children}</>;
}

function getParticleFilter(period: string): string {
  switch (period) {
    case 'midnight':
      return 'hue-rotate(240deg) brightness(0.8) contrast(1.2)';
    case 'night':
      return 'hue-rotate(0deg) brightness(1) contrast(1)';
    case 'dawn':
      return 'hue-rotate(10deg) brightness(1.1) contrast(1.1)';
    case 'morning':
      return 'hue-rotate(20deg) brightness(1.2) contrast(1.1)';
    case 'afternoon':
      return 'hue-rotate(-10deg) brightness(1.1) contrast(1)';
    case 'evening':
      return 'hue-rotate(-20deg) brightness(0.9) contrast(1.1)';
    default:
      return 'none';
  }
}

function getGradientForPeriod(period: string): string {
  switch (period) {
    case 'midnight':
      return 'linear-gradient(45deg, #1E1B4B, #3730A3, #1E1B4B)';
    case 'night':
      return 'linear-gradient(45deg, #991B1B, #DC2626, #EF4444)';
    case 'dawn':
      return 'linear-gradient(45deg, #DC2626, #EF4444, #F87171)';
    case 'morning':
      return 'linear-gradient(45deg, #EF4444, #F87171, #FCA5A5)';
    case 'afternoon':
      return 'linear-gradient(45deg, #F87171, #FCA5A5, #F87171)';
    case 'evening':
      return 'linear-gradient(45deg, #B91C1C, #DC2626, #991B1B)';
    default:
      return 'linear-gradient(45deg, #DC2626, #EF4444, #F87171)';
  }
}

// Time indicator component (optional)
export function TimeIndicator() {
  const { currentTheme, nextTransition } = useTimeTheme();

  if (!currentTheme) return null;

  const timeUntilTransition = nextTransition.getTime() - new Date().getTime();
  const hoursUntilTransition = Math.floor(timeUntilTransition / (1000 * 60 * 60));
  const minutesUntilTransition = Math.floor((timeUntilTransition % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="fixed top-4 left-4 z-40 glass-effect rounded-lg p-3 text-sm opacity-75 hover:opacity-100 transition-opacity">
      <div className="text-secondary-white font-medium">
        {currentTheme.description}
      </div>
      <div className="text-secondary-lightGray text-xs mt-1">
        Next: {hoursUntilTransition}h {minutesUntilTransition}m
      </div>
      <div className="flex items-center mt-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: currentTheme.accentColor }}
        />
        <div className="ml-2 text-xs text-secondary-lightGray">
          {currentTheme.period}
        </div>
      </div>
    </div>
  );
}