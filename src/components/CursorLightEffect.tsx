'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorLightEffectProps {
  intensity?: number;
  radius?: number;
  color?: string;
  followSpeed?: number;
  pulseOnClick?: boolean;
}

export default function CursorLightEffect({
  intensity = 0.6,
  radius = 300,
  color = '#DC2626',
  followSpeed = 0.3,
  pulseOnClick = true
}: CursorLightEffectProps) {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const lightRef = useRef<HTMLDivElement>(null);
  const { state } = useApp();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  const shouldRender = state.animationSettings.enableComplexAnimations && !state.preferences.reducedMotion;

  useEffect(() => {
    if (!shouldRender || typeof window === 'undefined') return;

    let moveTimer: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      x.set(e.clientX);
      y.set(e.clientY);
      
      setIsMoving(true);
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => setIsMoving(false), 100);
    };

    const handleMouseDown = () => {
      if (pulseOnClick) setIsClicking(true);
    };

    const handleMouseUp = () => {
      if (pulseOnClick) setIsClicking(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(moveTimer);
    };
  }, [shouldRender, x, y, pulseOnClick]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Main cursor light */}
      <motion.div
        ref={lightRef}
        className="fixed pointer-events-none z-40"
        style={{
          left: springX,
          top: springY,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: isClicking ? 1.5 : isMoving ? 1.2 : 1,
          opacity: intensity,
        }}
        transition={{
          scale: { duration: 0.2 },
          opacity: { duration: 0.3 },
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: radius * 2,
            height: radius * 2,
            background: `radial-gradient(circle, ${color}15 0%, ${color}08 30%, transparent 70%)`,
            filter: 'blur(20px)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      {/* Secondary glow layer */}
      <motion.div
        className="fixed pointer-events-none z-39"
        style={{
          left: springX,
          top: springY,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: isClicking ? 2 : 1.5,
          opacity: intensity * 0.3,
        }}
        transition={{
          scale: { duration: 0.4, ease: "easeOut" },
          opacity: { duration: 0.3 },
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: radius * 3,
            height: radius * 3,
            background: `radial-gradient(circle, ${color}08 0%, ${color}04 40%, transparent 80%)`,
            filter: 'blur(40px)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      {/* Pulsing core */}
      <motion.div
        className="fixed pointer-events-none z-41"
        style={{
          left: springX,
          top: springY,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [intensity * 0.8, intensity * 0.4, intensity * 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 20,
            height: 20,
            background: `radial-gradient(circle, ${color}80 0%, ${color}40 50%, transparent 100%)`,
            filter: 'blur(2px)',
          }}
        />
      </motion.div>

      {/* Trailing particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <TrailingParticle
          key={i}
          cursorPos={cursorPos}
          delay={i * 0.1}
          color={color}
          intensity={intensity}
        />
      ))}
    </>
  );
}

interface TrailingParticleProps {
  cursorPos: CursorPosition;
  delay: number;
  color: string;
  intensity: number;
}

function TrailingParticle({ cursorPos, delay, color, intensity }: TrailingParticleProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 20, damping: 15 });
  const springY = useSpring(y, { stiffness: 20, damping: 15 });

  useEffect(() => {
    const timer = setTimeout(() => {
      x.set(cursorPos.x);
      y.set(cursorPos.y);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [cursorPos, delay, x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none z-38"
      style={{
        left: springX,
        top: springY,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: [0.5, 1, 0.5],
        opacity: [0, intensity * 0.3, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      <div
        className="rounded-full"
        style={{
          width: 10,
          height: 10,
          background: `radial-gradient(circle, ${color}60 0%, transparent 100%)`,
          filter: 'blur(1px)',
        }}
      />
    </motion.div>
  );
}

interface InteractiveSpotlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  intensity?: number;
}

export function InteractiveSpotlight({
  children,
  className = '',
  spotlightColor = '#DC2626',
  spotlightSize = 200,
  intensity = 0.3
}: InteractiveSpotlightProps) {
  const [mousePos, setMousePos] = useState<CursorPosition>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { state } = useApp();

  const shouldRender = state.animationSettings.enableComplexAnimations && !state.preferences.reducedMotion;

  useEffect(() => {
    if (!shouldRender) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [shouldRender]);

  if (!shouldRender) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle ${spotlightSize}px at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}${Math.floor(intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          mixBlendMode: 'overlay',
        }}
        animate={{
          opacity: [intensity, intensity * 1.2, intensity],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

interface LightReflectionProps {
  className?: string;
  color?: string;
  angle?: number;
  width?: number;
  speed?: number;
}

export function LightReflection({
  className = '',
  color = '#FFFFFF',
  angle = 45,
  width = 100,
  speed = 3
}: LightReflectionProps) {
  const { state } = useApp();

  const shouldRender = state.animationSettings.enableComplexAnimations && !state.preferences.reducedMotion;

  if (!shouldRender) return null;

  return (
    <motion.div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      whileHover={{
        background: `linear-gradient(${angle}deg, transparent 0%, ${color}40 45%, ${color}80 50%, ${color}40 55%, transparent 100%)`,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `linear-gradient(${angle}deg, transparent 0%, ${color}20 45%, ${color}60 50%, ${color}20 55%, transparent 100%)`,
          width: `${width}%`,
          filter: 'blur(1px)',
        }}
      />
    </motion.div>
  );
}