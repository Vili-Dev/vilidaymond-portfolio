'use client';

import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-t from-primary-black to-primary-darkGray border-t border-secondary-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <h3 className="font-display text-2xl font-bold gradient-text mb-2">
              Vilidaymond
            </h3>
            <p className="text-secondary-lightGray text-sm">
              Digital Artist & Creative Visionary
            </p>
          </motion.div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-primary-red/20 hover:bg-primary-red/30 rounded-full flex items-center justify-center text-primary-red hover:text-accent-crimson transition-all duration-300 group"
          >
            <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
          </motion.button>

          <div className="flex items-center space-x-2 text-secondary-lightGray text-sm">
            <span>© {currentYear} Vilidaymond. Crafted with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-primary-red fill-current" />
            </motion.div>
            <span>and mystery</span>
          </div>

          <div className="text-center text-xs text-secondary-gray">
            <p>All artworks and content are original creations.</p>
            <p className="mt-1">Unauthorized reproduction is prohibited.</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-red to-transparent"></div>
    </footer>
  );
}