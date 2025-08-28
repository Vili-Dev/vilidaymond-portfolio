import { useRef, useEffect, useCallback } from 'react';

interface AnimationFrameOptions {
  fps?: number;
  autoStart?: boolean;
  shouldRun?: boolean;
}

interface AnimationFrameHook {
  start: () => void;
  stop: () => void;
  isRunning: boolean;
  frameCount: number;
}

export function useAnimationFrame(
  callback: (deltaTime: number, frameCount: number) => void,
  options: AnimationFrameOptions = {}
): AnimationFrameHook {
  const {
    fps = 60,
    autoStart = true,
    shouldRun = true
  } = options;

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const frameCountRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const targetFrameTime = 1000 / fps;

  const animate = useCallback((time: number) => {
    if (!shouldRun) {
      stop();
      return;
    }

    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Frame rate limiting
      if (deltaTime >= targetFrameTime) {
        frameCountRef.current++;
        callback(deltaTime, frameCountRef.current);
        previousTimeRef.current = time;
      }
    } else {
      previousTimeRef.current = time;
    }

    if (isRunningRef.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [callback, shouldRun, targetFrameTime]);

  const start = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      frameCountRef.current = 0;
      previousTimeRef.current = undefined;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  useEffect(() => {
    if (autoStart && shouldRun) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, shouldRun, start, stop]);

  // Stop animation when shouldRun becomes false
  useEffect(() => {
    if (!shouldRun && isRunningRef.current) {
      stop();
    }
  }, [shouldRun, stop]);

  return {
    start,
    stop,
    isRunning: isRunningRef.current,
    frameCount: frameCountRef.current
  };
}