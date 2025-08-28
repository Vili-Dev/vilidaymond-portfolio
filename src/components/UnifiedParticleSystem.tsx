'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';
import { usePerformanceSettings } from '@/hooks/usePerformanceSettings';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  glowIntensity?: number;
}

interface ParticleSystemConfig {
  type: 'floating' | 'networked' | 'simple';
  count: number;
  colors: string[];
  speed: number;
  maxSize: number;
  minSize: number;
  effects: {
    glow: boolean;
    connections: boolean;
    trails: boolean;
  };
}

interface UnifiedParticleSystemProps {
  config?: Partial<ParticleSystemConfig>;
  className?: string;
}

const defaultConfig: ParticleSystemConfig = {
  type: 'floating',
  count: 50,
  colors: ['#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#FFFFFF'],
  speed: 0.5,
  maxSize: 4,
  minSize: 1,
  effects: {
    glow: true,
    connections: false,
    trails: false,
  },
};

export default function UnifiedParticleSystem({ 
  config = {}, 
  className = '' 
}: UnifiedParticleSystemProps) {
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  const particlesRef = useRef<Particle[]>([]);
  const performance = usePerformanceSettings(mergedConfig.count);
  const { canvasRef, context, clearCanvas, getCanvasDimensions } = useCanvas();

  const effectiveConfig = useMemo(() => ({
    ...mergedConfig,
    count: performance.particleCount,
    effects: {
      ...mergedConfig.effects,
      glow: mergedConfig.effects.glow && performance.enableBlur,
    }
  }), [mergedConfig, performance]);

  const createParticle = useCallback((id: number): Particle => {
    const { width, height } = getCanvasDimensions();
    const color = effectiveConfig.colors[Math.floor(Math.random() * effectiveConfig.colors.length)];
    
    return {
      id,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * effectiveConfig.speed,
      vy: (Math.random() - 0.5) * effectiveConfig.speed,
      size: Math.random() * (effectiveConfig.maxSize - effectiveConfig.minSize) + effectiveConfig.minSize,
      opacity: Math.random() * 0.8 + 0.2,
      life: 0,
      maxLife: Math.random() * 300 + 200,
      color,
      glowIntensity: Math.random() * 0.5 + 0.5,
    };
  }, [effectiveConfig, getCanvasDimensions]);

  const initializeParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: effectiveConfig.count }, (_, i) => 
      createParticle(i)
    );
  }, [effectiveConfig.count, createParticle]);

  const updateParticle = useCallback((particle: Particle) => {
    const { width, height } = getCanvasDimensions();
    
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life += 1;

    // Boundary wrapping
    if (particle.x < 0) particle.x = width;
    if (particle.x > width) particle.x = 0;
    if (particle.y < 0) particle.y = height;
    if (particle.y > height) particle.y = 0;

    // Lifecycle management
    if (effectiveConfig.type === 'networked') {
      particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);
    } else {
      // Floating particles maintain opacity with slight variation
      particle.opacity = 0.3 + 0.4 * Math.sin(particle.life * 0.01);
    }

    // Reset particle if it dies (for networked type)
    if (particle.life >= particle.maxLife && effectiveConfig.type === 'networked') {
      const newParticle = createParticle(particle.id);
      Object.assign(particle, newParticle);
    }
  }, [effectiveConfig, getCanvasDimensions, createParticle]);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;

    if (effectiveConfig.effects.glow) {
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.size * (particle.glowIntensity || 1) * 2;
    }

    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [effectiveConfig.effects.glow]);

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!effectiveConfig.effects.connections) return;

    const particles = particlesRef.current;
    const maxDistance = 100;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;
          
          ctx.save();
          ctx.strokeStyle = `rgba(220, 38, 38, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }, [effectiveConfig.effects.connections]);

  const animate = useCallback((deltaTime: number) => {
    if (!context) return;

    clearCanvas();
    
    // Update and draw particles
    particlesRef.current.forEach(particle => {
      updateParticle(particle);
      drawParticle(context, particle);
    });

    // Draw connections if enabled
    drawConnections(context);
  }, [context, clearCanvas, updateParticle, drawParticle, drawConnections]);

  const { start, stop } = useAnimationFrame(animate, {
    fps: performance.animationQuality === 'low' ? 30 : 60,
    shouldRun: performance.shouldRender
  });

  // Initialize particles when config changes
  useEffect(() => {
    if (performance.shouldRender) {
      initializeParticles();
    }
  }, [initializeParticles, performance.shouldRender]);

  // Start/stop animation based on performance settings
  useEffect(() => {
    if (performance.shouldRender) {
      start();
    } else {
      stop();
    }

    return () => stop();
  }, [performance.shouldRender, start, stop]);

  if (!performance.shouldRender) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-10 ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}