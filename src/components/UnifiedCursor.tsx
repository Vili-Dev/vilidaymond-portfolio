'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePerformanceSettings } from '@/hooks/usePerformanceSettings';

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorConfig {
  showCursor: boolean;
  showLightEffect: boolean;
  lightIntensity: number;
  lightRadius: number;
  lightColor: string;
  magneticStrength: number;
  trailEffect: boolean;
  pulseOnClick: boolean;
}

interface UnifiedCursorProps {
  config?: Partial<CursorConfig>;
}

const defaultConfig: CursorConfig = {
  showCursor: true,
  showLightEffect: true,
  lightIntensity: 0.6,
  lightRadius: 300,
  lightColor: '#DC2626',
  magneticStrength: 0.3,
  trailEffect: true,
  pulseOnClick: true,
};

interface TrailingParticleProps {
  cursorPos: CursorPosition;
  delay: number;
  color: string;
  intensity: number;
}

function TrailingParticle({ cursorPos, delay, color, intensity }: TrailingParticleProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 15, damping: 20 });
  const springY = useSpring(y, { stiffness: 15, damping: 20 });

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

export default function UnifiedCursor({ config = {} }: UnifiedCursorProps) {
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  const performance = usePerformanceSettings();
  
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'text' | 'button' | 'image'>('default');
  
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth light effect - reduce spring stiffness for Firefox
  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);
  const springLightX = useSpring(lightX, { stiffness: 30, damping: 25 });
  const springLightY = useSpring(lightY, { stiffness: 30, damping: 25 });

  const shouldRender = performance.shouldRender && performance.enableComplexAnimations;

  const moveTimerRef = useRef<NodeJS.Timeout>();
  const lastMoveTime = useRef<number>(0);
  const isFirefox = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox');
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Throttle for Firefox to reduce lag
    const now = Date.now();
    if (isFirefox && now - lastMoveTime.current < 16) return; // ~60fps for Firefox
    lastMoveTime.current = now;
    
    const newPosition = { x: e.clientX, y: e.clientY };
    setPosition(newPosition);
    
    if (mergedConfig.showLightEffect && shouldRender) {
      // Set directly without spring delay for better responsiveness
      lightX.set(e.clientX);
      lightY.set(e.clientY);
      
      setIsMoving(true);
      if (moveTimerRef.current) {
        clearTimeout(moveTimerRef.current);
      }
      moveTimerRef.current = setTimeout(() => setIsMoving(false), 100);
    }
  }, [lightX, lightY, mergedConfig.showLightEffect, shouldRender, isFirefox]);

  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    if (target.matches('button, a, [role="button"]')) {
      setCursorVariant('button');
      setIsHovering(true);
    } else if (target.matches('h1, h2, h3, h4, h5, h6, p, span, div[class*="text"]')) {
      setCursorVariant('text');
      setIsHovering(true);
    } else if (target.matches('img, [class*="image"], [class*="artwork"]')) {
      setCursorVariant('image');
      setIsHovering(true);
    } else {
      setCursorVariant('default');
      setIsHovering(false);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setCursorVariant('default');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    // Hide default cursor only if we're showing custom cursor
    if (mergedConfig.showCursor) {
      document.body.style.cursor = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave, mergedConfig.showCursor]);

  const getCursorStyles = () => {
    const baseStyles = {
      width: isClicking ? 8 : isHovering ? 40 : 20,
      height: isClicking ? 8 : isHovering ? 40 : 20,
    };

    switch (cursorVariant) {
      case 'button':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(220, 38, 38, 0.8)',
          border: '2px solid rgba(220, 38, 38, 1)',
          backdropFilter: 'blur(8px)',
        };
      case 'text':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(4px)',
        };
      case 'image':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          border: '2px solid rgba(220, 38, 38, 0.6)',
          backdropFilter: 'blur(6px)',
          width: isHovering ? 60 : 20,
          height: isHovering ? 60 : 20,
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
        };
    }
  };

  if (!shouldRender && !mergedConfig.showCursor) {
    return null;
  }

  return (
    <>
      {/* Custom Cursor */}
      {mergedConfig.showCursor && (
        <motion.div
          ref={cursorRef}
          className="fixed pointer-events-none z-50 rounded-full mix-blend-difference"
          style={{
            left: position.x - (getCursorStyles().width || 20) / 2,
            top: position.y - (getCursorStyles().height || 20) / 2,
            ...getCursorStyles(),
          }}
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        />
      )}

      {/* Light Effect */}
      {mergedConfig.showLightEffect && shouldRender && (
        <>
          {/* Main cursor light */}
          <motion.div
            className="fixed pointer-events-none z-40"
            style={{
              left: springLightX,
              top: springLightY,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: isClicking ? 1.5 : isMoving ? 1.2 : 1,
              opacity: mergedConfig.lightIntensity,
            }}
            transition={{
              scale: { duration: 0.2 },
              opacity: { duration: 0.3 },
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: mergedConfig.lightRadius * 2,
                height: mergedConfig.lightRadius * 2,
                background: `radial-gradient(circle, ${mergedConfig.lightColor}15 0%, ${mergedConfig.lightColor}08 30%, transparent 70%)`,
                filter: performance.enableBlur ? 'blur(20px)' : 'none',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>

          {/* Secondary glow layer */}
          <motion.div
            className="fixed pointer-events-none z-39"
            style={{
              left: springLightX,
              top: springLightY,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: isClicking ? 2 : 1.5,
              opacity: mergedConfig.lightIntensity * 0.3,
            }}
            transition={{
              scale: { duration: 0.4, ease: "easeOut" },
              opacity: { duration: 0.3 },
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: mergedConfig.lightRadius * 3,
                height: mergedConfig.lightRadius * 3,
                background: `radial-gradient(circle, ${mergedConfig.lightColor}08 0%, ${mergedConfig.lightColor}04 40%, transparent 80%)`,
                filter: performance.enableBlur ? 'blur(40px)' : 'none',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>

          {/* Pulsing core */}
          <motion.div
            className="fixed pointer-events-none z-41"
            style={{
              left: springLightX,
              top: springLightY,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [mergedConfig.lightIntensity * 0.8, mergedConfig.lightIntensity * 0.4, mergedConfig.lightIntensity * 0.8],
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
                background: `radial-gradient(circle, ${mergedConfig.lightColor}80 0%, ${mergedConfig.lightColor}40 50%, transparent 100%)`,
                filter: performance.enableBlur ? 'blur(2px)' : 'none',
              }}
            />
          </motion.div>

          {/* Trailing particles - reduce count for better performance */}
          {mergedConfig.trailEffect && performance.animationQuality !== 'low' && 
            Array.from({ length: performance.animationQuality === 'high' ? 3 : 2 }).map((_, i) => (
              <TrailingParticle
                key={i}
                cursorPos={position}
                delay={i * 0.15}
                color={mergedConfig.lightColor}
                intensity={mergedConfig.lightIntensity}
              />
            ))
          }
        </>
      )}
    </>
  );
}