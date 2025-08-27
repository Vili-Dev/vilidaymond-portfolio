'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export function MagneticButton({ children, className = '', onClick, strength = 50 }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x);
  const springY = useSpring(y);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    x.set(deltaX * 0.3);
    y.set(deltaY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function FloatingCard({ children, className = '', intensity = 10 }: FloatingCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) / intensity);
    y.set((e.clientY - centerY) / intensity);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`transform-gpu ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ z: 50 }}
    >
      {children}
    </motion.div>
  );
}

interface PulsingElementProps {
  children: ReactNode;
  className?: string;
  pulseColor?: string;
  intensity?: number;
}

export function PulsingElement({ 
  children, 
  className = '', 
  pulseColor = 'rgba(220, 38, 38, 0.5)',
  intensity = 1 
}: PulsingElementProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 20px ${pulseColor}`,
          `0 0 40px ${pulseColor}`,
          `0 0 20px ${pulseColor}`,
        ],
      }}
      transition={{
        duration: 2 * intensity,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle, ${pulseColor} 0%, transparent 70%)`,
            `radial-gradient(circle, ${pulseColor} 0%, transparent 100%)`,
            `radial-gradient(circle, ${pulseColor} 0%, transparent 70%)`,
          ],
        }}
        transition={{
          duration: 2 * intensity,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ mixBlendMode: 'overlay' }}
      />
    </motion.div>
  );
}

interface RippleEffectProps {
  children: ReactNode;
  className?: string;
  rippleColor?: string;
}

export function RippleEffect({ children, className = '', rippleColor = '#DC2626' }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          initial={{
            width: 0,
            height: 0,
            opacity: 0.6,
            x: ripple.x,
            y: ripple.y,
          }}
          animate={{
            width: 300,
            height: 300,
            opacity: 0,
            x: ripple.x - 150,
            y: ripple.y - 150,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            backgroundColor: rippleColor,
          }}
        />
      ))}
    </motion.div>
  );
}

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: number;
}

export function GlitchText({ children, className = '', intensity = 1 }: GlitchTextProps) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      whileHover="hover"
      variants={{
        hover: {
          x: [0, -2, 2, 0],
          y: [0, 1, -1, 0],
          transition: {
            duration: 0.3,
            repeat: 2,
          }
        }
      }}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute top-0 left-0 text-primary-red opacity-70"
        variants={{
          hover: {
            x: [-2, 2, -2],
            opacity: [0, 0.7, 0],
            transition: {
              duration: 0.2,
              repeat: 3,
            }
          }
        }}
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-accent-crimson opacity-70"
        variants={{
          hover: {
            x: [2, -2, 2],
            opacity: [0, 0.7, 0],
            transition: {
              duration: 0.2,
              repeat: 3,
              delay: 0.1,
            }
          }
        }}
        style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}

interface BreathingElementProps {
  children: ReactNode;
  className?: string;
  scale?: [number, number];
  duration?: number;
}

export function BreathingElement({ 
  children, 
  className = '', 
  scale = [1, 1.02], 
  duration = 4 
}: BreathingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: scale,
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}