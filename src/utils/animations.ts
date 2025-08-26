import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0 
  }
};

export const fadeInScale: Variants = {
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
};

export const staggerContainer: Variants = {
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
};

export const defaultTransition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94] as const
};