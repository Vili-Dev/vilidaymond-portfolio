'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Mail, Github } from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Contact', href: '#contact' },
];

// Les liens sociaux sont maintenant dans le Footer

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-effect red-glow' : 'bg-transparent'
        }`}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center lg:justify-around items-center h-18 lg:h-24 relative">
            {/* Logo - Desktop */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="lg:relative lg:left-auto text-xl lg:text-2xl font-display font-bold"
            >
              <span className="gradient-text">Vilidaymond</span>
            </motion.div>

            {/* Navigation Menu - Desktop - Centré */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="flex items-center">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative text-secondary-white hover:text-primary-red transition-all duration-300 font-medium text-lg tracking-wide group px-2 py-1"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-red to-accent-crimson group-hover:w-full transition-all duration-300"></span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Contact CTA - Desktop */}
            <div className="hidden lg:block">
              <motion.button
                onClick={() => handleNavClick('#contact')}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-primary-red to-primary-darkRed hover:from-primary-darkRed hover:to-accent-crimson text-white font-semibold rounded-lg transition-all duration-300 shadow-lg border border-transparent hover:border-accent-rose"
              >
                Let's Talk
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-0 lg:hidden text-secondary-white p-2"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="glass-effect h-full flex flex-col justify-center items-center py-20">
              <div className="flex flex-col items-center space-y-12">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative text-4xl font-display text-secondary-white hover:text-primary-red transition-all duration-300 group py-3 px-6"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary-red to-accent-crimson group-hover:w-full transition-all duration-300"></span>
                  </motion.button>
                ))}

                {/* Contact CTA - Mobile */}
                <motion.button
                  onClick={() => handleNavClick('#contact')}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-gradient-to-r from-primary-red to-primary-darkRed hover:from-primary-darkRed hover:to-accent-crimson text-white font-semibold text-xl rounded-xl shadow-xl mt-8 border border-transparent hover:border-accent-rose transition-all duration-300"
                >
                  Let's Talk
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}