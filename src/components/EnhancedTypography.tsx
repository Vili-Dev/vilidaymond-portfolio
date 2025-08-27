'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface DynamicTextProps {
  children: string;
  className?: string;
  variant?: 'hero' | 'heading' | 'subheading' | 'body' | 'caption';
  animated?: boolean;
  glowEffect?: boolean;
}

export function DynamicText({ 
  children, 
  className = '', 
  variant = 'body',
  animated = false,
  glowEffect = false 
}: DynamicTextProps) {
  const [letterSpacing, setLetterSpacing] = useState('normal');

  useEffect(() => {
    const updateSpacing = () => {
      const baseSpacing = {
        hero: '0.05em',
        heading: '0.02em',
        subheading: '0.01em',
        body: 'normal',
        caption: '0.05em'
      };
      
      // Ajuster selon la taille de l'écran
      const screenWidth = window.innerWidth;
      const multiplier = screenWidth > 1200 ? 1.2 : screenWidth > 768 ? 1 : 0.8;
      
      const spacing = baseSpacing[variant];
      if (spacing !== 'normal') {
        const numericValue = parseFloat(spacing) * multiplier;
        setLetterSpacing(`${numericValue}em`);
      } else {
        setLetterSpacing('normal');
      }
    };

    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    
    return () => window.removeEventListener('resize', updateSpacing);
  }, [variant]);

  const variantStyles = {
    hero: 'text-4xl sm:text-6xl lg:text-8xl font-bold font-display',
    heading: 'text-2xl sm:text-3xl lg:text-4xl font-semibold font-display',
    subheading: 'text-xl sm:text-2xl lg:text-3xl font-medium font-display',
    body: 'text-base sm:text-lg font-normal',
    caption: 'text-sm font-light tracking-wider uppercase'
  };

  const glowStyles = glowEffect ? {
    textShadow: '0 0 10px rgba(220, 38, 38, 0.5), 0 0 20px rgba(220, 38, 38, 0.3), 0 0 30px rgba(220, 38, 38, 0.1)'
  } : {};

  if (animated) {
    return (
      <motion.div
        className={`${variantStyles[variant]} ${className}`}
        style={{ letterSpacing, ...glowStyles }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: "easeOut" 
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <div
      className={`${variantStyles[variant]} ${className}`}
      style={{ letterSpacing, ...glowStyles }}
    >
      {children}
    </div>
  );
}

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

export function TypewriterText({ 
  text, 
  className = '', 
  speed = 100,
  cursor = true,
  onComplete 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    if (cursor) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      
      return () => clearInterval(cursorTimer);
    }
  }, [cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          className="text-primary-red"
        >
          |
        </motion.span>
      )}
    </span>
  );
}

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animated?: boolean;
  direction?: number;
}

export function GradientText({ 
  children, 
  className = '', 
  colors = ['#DC2626', '#B91C1C', '#991B1B', '#FFFFFF'],
  animated = true,
  direction = 45 
}: GradientTextProps) {
  const gradientStyle = {
    background: `linear-gradient(${direction}deg, ${colors.join(', ')})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: animated ? '200% 200%' : '100% 100%',
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={gradientStyle}
      animate={animated ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}

interface StaggeredTextProps {
  children: string;
  className?: string;
  staggerDelay?: number;
  animation?: 'fadeInUp' | 'fadeInScale' | 'rotateIn' | 'slideIn';
}

export function StaggeredText({ 
  children, 
  className = '', 
  staggerDelay = 0.1,
  animation = 'fadeInUp' 
}: StaggeredTextProps) {
  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInScale: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 }
    },
    rotateIn: {
      initial: { opacity: 0, rotateX: -90 },
      animate: { opacity: 1, rotateX: 0 }
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    }
  };

  const words = children.split(' ');
  const selectedAnimation = animations[animation];

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          initial={selectedAnimation.initial}
          animate={selectedAnimation.animate}
          transition={{
            duration: 0.6,
            delay: index * staggerDelay,
            ease: "easeOut"
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

interface RevealTextProps {
  children: string;
  className?: string;
  revealDirection?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
}

export function RevealText({ 
  children, 
  className = '', 
  revealDirection = 'up',
  duration = 1,
  delay = 0 
}: RevealTextProps) {
  const maskDirections = {
    left: 'linear-gradient(90deg, transparent 0%, black 100%)',
    right: 'linear-gradient(270deg, transparent 0%, black 100%)',
    up: 'linear-gradient(180deg, transparent 0%, black 100%)',
    down: 'linear-gradient(0deg, transparent 0%, black 100%)'
  };

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className={className}
        initial={{ 
          WebkitMask: maskDirections[revealDirection],
          mask: maskDirections[revealDirection],
          WebkitMaskSize: '0% 100%',
          maskSize: '0% 100%'
        } as any}
        animate={{ 
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%'
        } as any}
        transition={{ 
          duration, 
          delay,
          ease: "easeInOut" 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface FloatingLettersProps {
  children: string;
  className?: string;
  intensity?: number;
}

export function FloatingLetters({ 
  children, 
  className = '', 
  intensity = 1 
}: FloatingLettersProps) {
  return (
    <div className={className}>
      {children.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            y: [0, -5 * intensity, 0, 3 * intensity, 0],
            x: [0, 2 * intensity, 0, -1 * intensity, 0],
            rotate: [0, 1 * intensity, 0, -0.5 * intensity, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}

interface ResponsiveTextProps {
  children: ReactNode;
  className?: string;
  baseSize?: number;
  scaleFactor?: number;
  minSize?: number;
  maxSize?: number;
}

export function ResponsiveText({ 
  children, 
  className = '', 
  baseSize = 16,
  scaleFactor = 0.02,
  minSize = 12,
  maxSize = 72 
}: ResponsiveTextProps) {
  const [fontSize, setFontSize] = useState(baseSize);

  useEffect(() => {
    const updateFontSize = () => {
      const screenWidth = window.innerWidth;
      const calculatedSize = baseSize + screenWidth * scaleFactor;
      const clampedSize = Math.max(minSize, Math.min(maxSize, calculatedSize));
      setFontSize(clampedSize);
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    return () => window.removeEventListener('resize', updateFontSize);
  }, [baseSize, scaleFactor, minSize, maxSize]);

  return (
    <div
      className={className}
      style={{ fontSize: `${fontSize}px` }}
    >
      {children}
    </div>
  );
}