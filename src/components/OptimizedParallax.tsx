'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { useScroll, useTransform, motion, useAnimationFrame } from 'framer-motion';
import { useGyroscope } from '@/hooks/useGyroscope';
import { useAnimationSettings } from '@/hooks/usePerformance';
import { useApp } from '@/contexts/AppContext';

interface OptimizedParallaxProps {
  children: ReactNode;
  offset?: number;
  speed?: number;
  enable3D?: boolean;
  enableGyroscope?: boolean;
  className?: string;
  layers?: Array<{
    content: ReactNode;
    speed: number;
    zIndex?: number;
  }>;
}

export default function OptimizedParallax({
  children,
  offset = 50,
  speed = 0.5,
  enable3D = false,
  enableGyroscope = false,
  className = '',
  layers = []
}: OptimizedParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const animationSettings = useAnimationSettings();
  const { state } = useApp();
  const gyroscope = useGyroscope({ 
    enabled: enableGyroscope && animationSettings.enableParallax,
    sensitivity: 0.3 
  });

  // Transform values for parallax
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [offset, -offset]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.5, 1, 1, 0.5]
  );

  // 3D transform values
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [5, 0, -5]
  );

  const rotateY = useTransform(
    scrollYProgress,
    [0, 1],
    [-2, 2]
  );

  // Gyroscope-based transforms
  const gyroTransform = useRef({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  useAnimationFrame(() => {
    if (typeof window !== 'undefined' && enableGyroscope && gyroscope.isSupported && animationSettings.enableParallax) {
      const { x, y } = gyroscope.getParallaxValues(10);
      gyroTransform.current = {
        x: x,
        y: y,
        rotateX: y * 2,
        rotateY: x * 2
      };
    }
  });

  // Battery-conscious mode
  const shouldReduceEffects = 
    !animationSettings.enableParallax ||
    state.preferences.reducedMotion;

  if (shouldReduceEffects) {
    return (
      <div ref={containerRef} className={`${className}`}>
        {children}
        {layers.map((layer, index) => (
          <div key={index} style={{ zIndex: layer.zIndex }}>
            {layer.content}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative ${enable3D ? 'parallax-3d' : ''} ${className}`}
    >
      {/* Main content */}
      <motion.div
        className="parallax-element"
        style={{
          y: animationSettings.enableComplexAnimations ? y : 0,
          opacity: animationSettings.enableComplexAnimations ? opacity : 1,
          ...(enable3D && animationSettings.enableComplexAnimations ? {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000
          } : {}),
          ...(enableGyroscope && animationSettings.enableParallax ? {
            x: gyroTransform.current.x,
            rotateX: `${gyroTransform.current.rotateX}deg`,
            rotateY: `${gyroTransform.current.rotateY}deg`
          } : {})
        }}
      >
        {children}
      </motion.div>

      {/* Parallax layers */}
      {layers.map((layer, index) => {
        const layerY = useTransform(
          scrollYProgress,
          [0, 1],
          [offset * layer.speed, -offset * layer.speed]
        );

        return (
          <motion.div
            key={index}
            className="parallax-layer"
            style={{
              zIndex: layer.zIndex || index + 1,
              y: animationSettings.enableComplexAnimations ? layerY : 0,
              ...(enableGyroscope && animationSettings.enableParallax ? {
                x: gyroTransform.current.x * (layer.speed * 0.5),
              } : {})
            }}
          >
            {layer.content}
          </motion.div>
        );
      })}

      {/* Gyroscope permission button */}
      {enableGyroscope && 
       gyroscope.permission === 'prompt' && 
       typeof window !== 'undefined' && 
       'DeviceOrientationEvent' in window && (
        <button
          onClick={gyroscope.requestPermission}
          className="fixed bottom-4 right-4 bg-primary-red hover:bg-primary-darkRed text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-50"
        >
          Enable 3D Effects
        </button>
      )}
    </div>
  );
}