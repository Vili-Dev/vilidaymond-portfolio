'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedGradientProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
}

export function AnimatedGradientBorder({ 
  children, 
  className = '', 
  colors = ['#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'],
  duration = 3 
}: AnimatedGradientProps) {
  return (
    <motion.div
      className={`relative p-[2px] rounded-2xl ${className}`}
      animate={{
        background: [
          `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`,
          `linear-gradient(90deg, ${colors[1]}, ${colors[2]}, ${colors[3]}, ${colors[0]})`,
          `linear-gradient(180deg, ${colors[2]}, ${colors[3]}, ${colors[0]}, ${colors[1]})`,
          `linear-gradient(270deg, ${colors[3]}, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
          `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="h-full w-full rounded-2xl bg-primary-darkGray">
        {children}
      </div>
    </motion.div>
  );
}

interface MultiLayerGlowProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export function MultiLayerGlow({ 
  children, 
  className = '', 
  glowColor = '#DC2626',
  intensity = 1 
}: MultiLayerGlowProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      animate={{
        filter: [
          `drop-shadow(0 0 ${10 * intensity}px ${glowColor}) drop-shadow(0 0 ${20 * intensity}px ${glowColor}40) drop-shadow(0 0 ${40 * intensity}px ${glowColor}20)`,
          `drop-shadow(0 0 ${15 * intensity}px ${glowColor}) drop-shadow(0 0 ${30 * intensity}px ${glowColor}60) drop-shadow(0 0 ${60 * intensity}px ${glowColor}30)`,
          `drop-shadow(0 0 ${10 * intensity}px ${glowColor}) drop-shadow(0 0 ${20 * intensity}px ${glowColor}40) drop-shadow(0 0 ${40 * intensity}px ${glowColor}20)`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
      
      {/* Additional glow layers */}
      <div className="absolute inset-0 rounded-inherit pointer-events-none">
        <motion.div
          className="absolute inset-0 rounded-inherit"
          animate={{
            boxShadow: [
              `inset 0 0 ${20 * intensity}px ${glowColor}10`,
              `inset 0 0 ${30 * intensity}px ${glowColor}20`,
              `inset 0 0 ${20 * intensity}px ${glowColor}10`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}

interface PulsatingGradientProps {
  children: ReactNode;
  className?: string;
  fromColor?: string;
  toColor?: string;
  duration?: number;
}

export function PulsatingGradientText({ 
  children, 
  className = '', 
  fromColor = '#DC2626',
  toColor = '#FFFFFF',
  duration = 2 
}: PulsatingGradientProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        background: [
          `linear-gradient(45deg, ${fromColor}, ${toColor})`,
          `linear-gradient(90deg, ${toColor}, ${fromColor})`,
          `linear-gradient(135deg, ${fromColor}, ${toColor})`,
          `linear-gradient(180deg, ${toColor}, ${fromColor})`,
          `linear-gradient(45deg, ${fromColor}, ${toColor})`,
        ]
      } as any}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </motion.div>
  );
}

interface HolographicEffectProps {
  children: ReactNode;
  className?: string;
}

export function HolographicEffect({ children, className = '' }: HolographicEffectProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover="hover"
    >
      {children}
      
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={{
          hover: {
            background: [
              'linear-gradient(45deg, transparent 30%, rgba(220, 38, 38, 0.3) 50%, transparent 70%)',
              'linear-gradient(90deg, transparent 30%, rgba(220, 38, 38, 0.3) 50%, transparent 70%)',
              'linear-gradient(135deg, transparent 30%, rgba(220, 38, 38, 0.3) 50%, transparent 70%)',
            ],
          }
        }}
        transition={{
          duration: 0.6,
          repeat: 2,
        }}
      />
      
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={{
          hover: {
            background: [
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            ],
            x: ['-100%', '100%'],
          }
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        style={{
          width: '200%',
          marginLeft: '-50%',
        }}
      />
    </motion.div>
  );
}

interface NeonGlowProps {
  children: ReactNode;
  className?: string;
  neonColor?: string;
  flickerIntensity?: number;
}

export function NeonGlow({ 
  children, 
  className = '', 
  neonColor = '#DC2626',
  flickerIntensity = 0.1 
}: NeonGlowProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        textShadow: [
          `0 0 5px ${neonColor}, 0 0 10px ${neonColor}, 0 0 20px ${neonColor}`,
          `0 0 2px ${neonColor}, 0 0 8px ${neonColor}, 0 0 15px ${neonColor}`,
          `0 0 5px ${neonColor}, 0 0 10px ${neonColor}, 0 0 20px ${neonColor}`,
        ],
        filter: [
          `brightness(1) saturate(1.2)`,
          `brightness(0.9) saturate(1)`,
          `brightness(1) saturate(1.2)`,
        ],
      }}
      transition={{
        duration: 0.1,
        repeat: Infinity,
        repeatType: "mirror",
      }}
      style={{
        color: neonColor,
      }}
    >
      {children}
      
      {/* Flickering effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [1, 0.8, 1, 0.9, 1],
        }}
        transition={{
          duration: Math.random() * 2 + 1,
          repeat: Infinity,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface LiquidGradientProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
}

export function LiquidGradient({ 
  children, 
  className = '', 
  colors = ['#DC2626', '#B91C1C', '#991B1B'] 
}: LiquidGradientProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      animate={{
        background: [
          `radial-gradient(circle at 20% 50%, ${colors[0]} 20%, transparent 50%), 
           radial-gradient(circle at 80% 20%, ${colors[1]} 20%, transparent 50%), 
           radial-gradient(circle at 40% 80%, ${colors[2]} 20%, transparent 50%)`,
          `radial-gradient(circle at 80% 30%, ${colors[0]} 20%, transparent 50%), 
           radial-gradient(circle at 20% 80%, ${colors[1]} 20%, transparent 50%), 
           radial-gradient(circle at 60% 20%, ${colors[2]} 20%, transparent 50%)`,
          `radial-gradient(circle at 40% 70%, ${colors[0]} 20%, transparent 50%), 
           radial-gradient(circle at 70% 40%, ${colors[1]} 20%, transparent 50%), 
           radial-gradient(circle at 20% 30%, ${colors[2]} 20%, transparent 50%)`,
        ],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}