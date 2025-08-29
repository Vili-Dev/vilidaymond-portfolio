'use client';

import { useTimeTheme } from '@/hooks/useTimeTheme';
import { useState } from 'react';

export function ThemeDebugger() {
  const { currentTheme, getThemeForTime } = useTimeTheme();
  const [isVisible, setIsVisible] = useState(false);
  
  if (typeof window === 'undefined') return null;

  const currentHour = new Date().getHours();
  const allPeriods = ['midnight', 'night', 'dawn', 'morning', 'afternoon', 'evening'] as const;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="glass-effect rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
      >
        🎨
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 glass-effect rounded-lg p-4 min-w-80 text-white">
          <h3 className="font-bold text-lg mb-3">Theme Debug Info</h3>
          
          <div className="space-y-2 text-sm">
            <div><strong>Current Hour:</strong> {currentHour}h</div>
            <div><strong>Current Period:</strong> {currentTheme.period}</div>
            <div><strong>Current Theme:</strong> {currentTheme.description}</div>
            <div><strong>Accent Color:</strong> 
              <span 
                className="inline-block w-4 h-4 rounded ml-2 border border-white/20"
                style={{ backgroundColor: currentTheme.accentColor }}
              />
              {currentTheme.accentColor}
            </div>
            <div><strong>Intensity:</strong> {currentTheme.intensity}</div>
            <div><strong>Timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
            <div><strong>Device:</strong> {navigator.userAgent.includes('iPhone') ? 'iPhone' : navigator.userAgent.includes('Android') ? 'Android' : 'Desktop'}</div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20">
            <h4 className="font-semibold mb-2">All Periods:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {allPeriods.map((period) => {
                const theme = getThemeForTime(period === 'midnight' ? 1 : 
                                             period === 'night' ? 4 : 
                                             period === 'dawn' ? 7 : 
                                             period === 'morning' ? 10 : 
                                             period === 'afternoon' ? 15 : 20);
                const isActive = period === currentTheme.period;
                
                return (
                  <div 
                    key={period}
                    className={`p-2 rounded border ${isActive ? 'border-white bg-white/10' : 'border-white/20'}`}
                  >
                    <div className="font-medium capitalize">{period}</div>
                    <div 
                      className="w-full h-2 rounded mt-1"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="mt-3 px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}