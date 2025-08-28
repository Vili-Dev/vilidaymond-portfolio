import { useRef, useEffect, useCallback } from 'react';

interface CanvasConfig {
  width?: number;
  height?: number;
  autoResize?: boolean;
  devicePixelRatio?: boolean;
}

interface CanvasHookReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | null;
  clearCanvas: () => void;
  getCanvasDimensions: () => { width: number; height: number };
}

export function useCanvas(config: CanvasConfig = {}): CanvasHookReturn {
  const {
    width,
    height,
    autoResize = true,
    devicePixelRatio = true
  } = config;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    contextRef.current = ctx;

    const updateCanvasSize = () => {
      const displayWidth = width || window.innerWidth;
      const displayHeight = height || window.innerHeight;
      
      const dpr = devicePixelRatio ? window.devicePixelRatio || 1 : 1;
      
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();

    if (autoResize && !width && !height) {
      window.addEventListener('resize', updateCanvasSize);
      return () => window.removeEventListener('resize', updateCanvasSize);
    }
  }, [width, height, autoResize, devicePixelRatio]);

  useEffect(() => {
    const cleanup = setupCanvas();
    return cleanup;
  }, [setupCanvas]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 0, height: 0 };
    
    return {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight
    };
  }, []);

  return {
    canvasRef,
    context: contextRef.current,
    clearCanvas,
    getCanvasDimensions
  };
}