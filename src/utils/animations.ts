import { Variants } from 'framer-motion';
import { useMemo } from 'react';

export const useAnimations = () => {
  const fadeInUp = useMemo<Variants>(() => ({
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0
    }
  }), []);

  const fadeInScale = useMemo<Variants>(() => ({
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  }), []);

  const staggerContainer = useMemo<Variants>(() => ({
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8,
      }
    }
  }), []);

  const defaultTransition = useMemo(() => ({
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94] as const
  }), []);

  return {
    fadeInUp,
    fadeInScale,
    staggerContainer,
    defaultTransition
  };
};