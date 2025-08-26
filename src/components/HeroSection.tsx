'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * 10;
      const rotateY = (centerX - x) / centerX * 10;
      
      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const scrollToPortfolio = () => {
    const element = document.querySelector('#portfolio');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-black via-primary-darkGray to-primary-black"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-red rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent-crimson rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-primary-red rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-accent-rose rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary-darkRed rounded-full animate-pulse delay-1500"></div>
      </div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 transition-transform duration-300 ease-out"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 text-shadow">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="block text-secondary-white"
            >
              Vili
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="block gradient-text animate-glow"
            >
              Daymond
            </motion.span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <motion.p
              whileHover={{ scale: 1.02 }}
              className="text-lg sm:text-xl lg:text-2xl text-secondary-lightGray font-light leading-relaxed mb-4 text-shadow"
            >
              Digital Artist & Creative Visionary
            </motion.p>
            <motion.p
              whileHover={{ scale: 1.01 }}
              className="text-base sm:text-lg text-secondary-gray font-light leading-relaxed text-shadow"
            >
              Crafting dark, mysterious worlds through the lens of artistic expression
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            onClick={scrollToPortfolio}
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(220, 38, 38, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 bg-gradient-to-r from-primary-red to-primary-darkRed rounded-full font-medium text-secondary-white transition-all duration-300 hover:from-primary-darkRed hover:to-primary-bloodRed glass-effect"
          >
            <span className="flex items-center gap-2">
              Explore My Work
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
            </span>
          </motion.button>

          <motion.button
            whileHover={{ 
              scale: 1.05, 
              borderColor: '#DC2626',
              color: '#DC2626'
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-secondary-gray rounded-full font-medium text-secondary-lightGray hover:border-primary-red hover:text-primary-red transition-all duration-300"
          >
            Get In Touch
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-primary-red rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-primary-red rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-primary-black/50 to-transparent pointer-events-none"></div>
    </section>
  );
}