'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  glowIntensity: number;
}

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  speed?: number;
  maxSize?: number;
  minSize?: number;
}

export default function FloatingParticles({
  count = 50,
  colors = ['#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#FFFFFF'],
  speed = 0.5,
  maxSize = 4,
  minSize = 1
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const { state } = useApp();

  const shouldRender = useMemo(() => {
    return state.animationSettings.enableParticles && !state.preferences.reducedMotion;
  }, [state.animationSettings.enableParticles, state.preferences.reducedMotion]);

  const particleCount = useMemo(() => {
    return Math.min(count, state.animationSettings.particleCount);
  }, [count, state.animationSettings.particleCount]);

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

    const createParticle = (id: number): Particle => ({
      id,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: minSize + Math.random() * (maxSize - minSize),
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      opacity: 0.1 + Math.random() * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      glowIntensity: 0.2 + Math.random() * 0.8
    });

    const initializeParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, (_, i) => createParticle(i));
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around edges
      if (particle.x < -10) particle.x = window.innerWidth + 10;
      if (particle.x > window.innerWidth + 10) particle.x = -10;
      if (particle.y < -10) particle.y = window.innerHeight + 10;
      if (particle.y > window.innerHeight + 10) particle.y = -10;

      // Subtle pulsing effect
      particle.opacity = Math.sin(Date.now() * 0.001 + particle.id) * 0.3 + 0.4;
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      
      // Create glow effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      
      gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.5, `${particle.color}${Math.floor(particle.opacity * 0.3 * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw core particle
      ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initializeParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldRender, particleCount, colors, speed, maxSize, minSize]);

  if (!shouldRender) return null;

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}