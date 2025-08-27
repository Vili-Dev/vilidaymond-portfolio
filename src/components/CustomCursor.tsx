'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'text' | 'button' | 'image'>('default');
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
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
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorVariant('default');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, []);

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
          borderColor: '#DC2626',
          boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
        };
      case 'text':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: '#FFFFFF',
          width: 2,
          height: 20,
        };
      case 'image':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(220, 38, 38, 0.3)',
          borderColor: '#DC2626',
          width: 60,
          height: 60,
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        };
    }
  };

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x - (isHovering ? 20 : 10),
          y: position.y - (isHovering ? 20 : 10),
          ...getCursorStyles(),
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 0.5,
        }}
        style={{
          border: '2px solid',
          borderRadius: cursorVariant === 'text' ? '1px' : '50%',
          backdropFilter: 'blur(2px)',
        }}
      />
      
      {/* Cursor Trail */}
      <motion.div
        className="cursor-trail fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.8,
        }}
        style={{
          width: 4,
          height: 4,
          backgroundColor: 'rgba(220, 38, 38, 0.4)',
          borderRadius: '50%',
          filter: 'blur(1px)',
        }}
      />
    </>
  );
}