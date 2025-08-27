'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

interface SmokeParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
}

interface SmokeEffectProps {
  intensity?: number;
  color?: string;
  particleCount?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'random';
}

export function SmokeEffect({ 
  intensity = 0.5, 
  color = 'rgba(220, 38, 38, 0.1)',
  particleCount = 30,
  direction = 'up' 
}: SmokeEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<SmokeParticle[]>([]);
  const { state } = useApp();

  const shouldRender = useMemo(() => {
    return state.animationSettings.enableComplexAnimations && !state.preferences.reducedMotion;
  }, [state.animationSettings.enableComplexAnimations, state.preferences.reducedMotion]);

  useEffect(() => {
    if (!shouldRender || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): SmokeParticle => {
      const baseVelocity = intensity * 2;
      
      let velocityX, velocityY;
      switch (direction) {
        case 'up':
          velocityX = (Math.random() - 0.5) * baseVelocity;
          velocityY = -Math.random() * baseVelocity - 1;
          break;
        case 'down':
          velocityX = (Math.random() - 0.5) * baseVelocity;
          velocityY = Math.random() * baseVelocity + 1;
          break;
        case 'left':
          velocityX = -Math.random() * baseVelocity - 1;
          velocityY = (Math.random() - 0.5) * baseVelocity;
          break;
        case 'right':
          velocityX = Math.random() * baseVelocity + 1;
          velocityY = (Math.random() - 0.5) * baseVelocity;
          break;
        default:
          velocityX = (Math.random() - 0.5) * baseVelocity;
          velocityY = (Math.random() - 0.5) * baseVelocity;
      }

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        opacity: Math.random() * 0.5 + 0.1,
        velocityX,
        velocityY,
        life: 0,
        maxLife: Math.random() * 200 + 100
      };
    };

    const updateParticle = (particle: SmokeParticle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.life++;
      
      // Expand and fade over time
      particle.size += 0.1;
      particle.opacity = (1 - particle.life / particle.maxLife) * 0.3;
      
      // Add some turbulence
      particle.velocityX += (Math.random() - 0.5) * 0.1;
      particle.velocityY += (Math.random() - 0.5) * 0.1;
      
      // Damping
      particle.velocityX *= 0.995;
      particle.velocityY *= 0.995;
    };

    const drawParticle = (particle: SmokeParticle) => {
      ctx.save();
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      
      gradient.addColorStop(0, `${color.replace('0.1', particle.opacity.toString())}`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add new particles
      if (particlesRef.current.length < particleCount) {
        particlesRef.current.push(createParticle());
      }
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        updateParticle(particle);
        drawParticle(particle);
        return particle.life < particle.maxLife && particle.opacity > 0.01;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldRender, intensity, color, particleCount, direction]);

  if (!shouldRender) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

interface MistEffectProps {
  intensity?: number;
  color?: string;
  speed?: number;
}

export function MistEffect({ 
  intensity = 0.3, 
  color = 'rgba(255, 255, 255, 0.05)',
  speed = 1 
}: MistEffectProps) {
  const { state } = useApp();

  const shouldRender = useMemo(() => {
    return state.animationSettings.enableComplexAnimations && !state.preferences.reducedMotion;
  }, [state.animationSettings.enableComplexAnimations, state.preferences.reducedMotion]);

  if (!shouldRender) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(ellipse 100% 50% at 0% 50%, ${color} 0%, transparent 50%)`,
              `radial-gradient(ellipse 100% 50% at 100% 50%, ${color} 0%, transparent 50%)`,
              `radial-gradient(ellipse 100% 50% at 0% 50%, ${color} 0%, transparent 50%)`,
            ],
            x: ['-50%', '150%', '-50%'],
          }}
          transition={{
            duration: 20 / speed,
            repeat: Infinity,
            ease: "linear",
            delay: i * 7,
          }}
          style={{
            filter: `blur(${20 + i * 10}px)`,
            opacity: intensity,
          }}
        />
      ))}
    </div>
  );
}

interface FogOverlayProps {
  density?: number;
  color?: string;
  animated?: boolean;
}

export function FogOverlay({ 
  density = 0.1, 
  color = 'rgba(0, 0, 0, 0.3)',
  animated = true 
}: FogOverlayProps) {
  const { state } = useApp();

  const shouldRender = useMemo(() => {
    return state.animationSettings.enableComplexAnimations && !state.preferences.reducedMotion;
  }, [state.animationSettings.enableComplexAnimations, state.preferences.reducedMotion]);

  if (!shouldRender) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <motion.div
        className="absolute inset-0"
        animate={animated ? {
          background: [
            `linear-gradient(45deg, transparent 20%, ${color} 40%, transparent 60%)`,
            `linear-gradient(90deg, transparent 30%, ${color} 50%, transparent 70%)`,
            `linear-gradient(135deg, transparent 20%, ${color} 40%, transparent 60%)`,
          ],
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: 'blur(40px)',
          opacity: density,
        }}
      />
      
      <motion.div
        className="absolute inset-0"
        animate={animated ? {
          background: [
            `radial-gradient(circle at 20% 20%, ${color} 0%, transparent 40%)`,
            `radial-gradient(circle at 80% 80%, ${color} 0%, transparent 40%)`,
            `radial-gradient(circle at 20% 20%, ${color} 0%, transparent 40%)`,
          ],
        } : {}}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: 'blur(60px)',
          opacity: density * 0.7,
        }}
      />
    </div>
  );
}

interface DepthHazeProps {
  layers?: number;
  baseColor?: string;
  intensity?: number;
}

export function DepthHaze({ 
  layers = 5, 
  baseColor = 'rgba(220, 38, 38, 0.02)',
  intensity = 0.8 
}: DepthHazeProps) {
  const { state } = useApp();

  const shouldRender = useMemo(() => {
    return state.animationSettings.enableComplexAnimations && !state.preferences.reducedMotion;
  }, [state.animationSettings.enableComplexAnimations, state.preferences.reducedMotion]);

  if (!shouldRender) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {Array.from({ length: layers }).map((_, i) => {
        const opacity = (1 - i / layers) * intensity;
        const blur = i * 10 + 5;
        const scale = 1 + i * 0.1;
        
        return (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{
              background: [
                `radial-gradient(ellipse 150% 100% at 50% 100%, ${baseColor.replace('0.02', (opacity * 0.5).toString())} 0%, transparent 70%)`,
                `radial-gradient(ellipse 120% 80% at 30% 100%, ${baseColor.replace('0.02', (opacity * 0.3).toString())} 0%, transparent 70%)`,
                `radial-gradient(ellipse 150% 100% at 70% 100%, ${baseColor.replace('0.02', (opacity * 0.4).toString())} 0%, transparent 70%)`,
                `radial-gradient(ellipse 150% 100% at 50% 100%, ${baseColor.replace('0.02', (opacity * 0.5).toString())} 0%, transparent 70%)`,
              ],
              scale: [scale, scale * 1.1, scale],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            style={{
              filter: `blur(${blur}px)`,
              opacity,
              transformOrigin: 'center bottom',
            }}
          />
        );
      })}
    </div>
  );
}