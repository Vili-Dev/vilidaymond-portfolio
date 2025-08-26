'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = memo(function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`absolute ${dotSizes[size]} bg-primary-red rounded-full`}
            style={{
              left: '50%',
              top: '50%',
              transformOrigin: '0 0',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default LoadingSpinner;