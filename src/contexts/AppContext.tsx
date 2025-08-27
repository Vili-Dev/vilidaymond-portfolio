'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useTimeTheme } from '@/hooks/useTimeTheme';
import { useAnimationSettings } from '@/hooks/usePerformance';

interface AppState {
  // Theme state
  currentTheme: any;
  
  // Performance settings
  animationSettings: {
    enableComplexAnimations: boolean;
    enableParallax: boolean;
    enableParticles: boolean;
    animationDuration: number;
    particleCount: number;
  };
  
  // UI state
  isLoading: boolean;
  activeSection: string;
  
  // User preferences
  preferences: {
    audioEnabled: boolean;
    reducedMotion: boolean;
    particlesEnabled: boolean;
    parallaxEnabled: boolean;
  };
  
  // Portfolio state
  portfolio: {
    items: any[];
    selectedCategory: string;
    viewMode: 'grid' | 'list' | 'masonry';
  };
  
  // Contact form state
  contact: {
    isSubmitting: boolean;
    lastSubmission: Date | null;
    status: 'idle' | 'submitting' | 'success' | 'error';
  };
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'UPDATE_PREFERENCE'; payload: { key: keyof AppState['preferences']; value: boolean } }
  | { type: 'SET_PORTFOLIO_CATEGORY'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: AppState['portfolio']['viewMode'] }
  | { type: 'SET_CONTACT_STATUS'; payload: AppState['contact']['status'] }
  | { type: 'UPDATE_THEME'; payload: any }
  | { type: 'UPDATE_ANIMATION_SETTINGS'; payload: AppState['animationSettings'] };

const initialState: AppState = {
  currentTheme: null,
  animationSettings: {
    enableComplexAnimations: true,
    enableParallax: true,
    enableParticles: true,
    animationDuration: 1,
    particleCount: 75
  },
  isLoading: false,
  activeSection: 'hero',
  preferences: {
    audioEnabled: false,
    reducedMotion: false,
    particlesEnabled: true,
    parallaxEnabled: true,
  },
  portfolio: {
    items: [],
    selectedCategory: 'all',
    viewMode: 'grid'
  },
  contact: {
    isSubmitting: false,
    lastSubmission: null,
    status: 'idle'
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    
    case 'UPDATE_PREFERENCE':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.payload.key]: action.payload.value
        }
      };
    
    case 'SET_PORTFOLIO_CATEGORY':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          selectedCategory: action.payload
        }
      };
    
    case 'SET_VIEW_MODE':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          viewMode: action.payload
        }
      };
    
    case 'SET_CONTACT_STATUS':
      return {
        ...state,
        contact: {
          ...state.contact,
          status: action.payload,
          isSubmitting: action.payload === 'submitting',
          lastSubmission: action.payload === 'success' ? new Date() : state.contact.lastSubmission
        }
      };
    
    case 'UPDATE_THEME':
      return { ...state, currentTheme: action.payload };
    
    case 'UPDATE_ANIMATION_SETTINGS':
      return { ...state, animationSettings: action.payload };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Convenience methods
  setLoading: (loading: boolean) => void;
  setActiveSection: (section: string) => void;
  updatePreference: (key: keyof AppState['preferences'], value: boolean) => void;
  setPortfolioCategory: (category: string) => void;
  setViewMode: (mode: AppState['portfolio']['viewMode']) => void;
  setContactStatus: (status: AppState['contact']['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Hooks for automatic state updates (only on client)
  const { currentTheme } = useTimeTheme();
  const animationSettings = useAnimationSettings();
  
  // Update theme when time changes
  useEffect(() => {
    if (currentTheme) {
      dispatch({ type: 'UPDATE_THEME', payload: currentTheme });
    }
  }, [currentTheme]);
  
  // Update animation settings based on performance
  useEffect(() => {
    if (typeof window !== 'undefined') {
      dispatch({ type: 'UPDATE_ANIMATION_SETTINGS', payload: animationSettings });
    }
  }, [animationSettings]);
  
  // Load preferences from localStorage
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('vilidaymond-preferences');
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        Object.entries(preferences).forEach(([key, value]) => {
          dispatch({
            type: 'UPDATE_PREFERENCE',
            payload: { key: key as keyof AppState['preferences'], value: value as boolean }
          });
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('vilidaymond-preferences', JSON.stringify(state.preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, [state.preferences]);

  // Convenience methods
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setActiveSection = (section: string) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: section });
  };

  const updatePreference = (key: keyof AppState['preferences'], value: boolean) => {
    dispatch({ type: 'UPDATE_PREFERENCE', payload: { key, value } });
  };

  const setPortfolioCategory = (category: string) => {
    dispatch({ type: 'SET_PORTFOLIO_CATEGORY', payload: category });
  };

  const setViewMode = (mode: AppState['portfolio']['viewMode']) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const setContactStatus = (status: AppState['contact']['status']) => {
    dispatch({ type: 'SET_CONTACT_STATUS', payload: status });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    setLoading,
    setActiveSection,
    updatePreference,
    setPortfolioCategory,
    setViewMode,
    setContactStatus
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}