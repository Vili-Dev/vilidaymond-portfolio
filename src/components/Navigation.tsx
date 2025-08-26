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

const socialLinks = [
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Email', href: 'mailto:hello@vilidaymond.com', icon: Mail },
  { name: 'GitHub', href: '#', icon: Github },
];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl lg:text-2xl font-display font-bold"
            >
              <span className="gradient-text">Vilidaymond</span>
            </motion.div>

            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  whileHover={{ scale: 1.1, color: '#DC2626' }}
                  whileTap={{ scale: 0.95 }}
                  className="text-secondary-lightGray hover:text-primary-red transition-colors duration-200 font-medium"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.2, color: '#DC2626' }}
                  whileTap={{ scale: 0.9 }}
                  className="text-secondary-lightGray hover:text-primary-red transition-colors duration-200"
                  aria-label={`Visit ${social.name}`}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-secondary-white"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            <div className="glass-effect h-full flex flex-col justify-center items-center space-y-8">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-3xl font-display text-secondary-white hover:text-primary-red transition-colors duration-200"
                >
                  {item.name}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex space-x-6 pt-8"
              >
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.3, color: '#DC2626' }}
                    whileTap={{ scale: 0.9 }}
                    className="text-secondary-lightGray hover:text-primary-red transition-colors duration-200"
                  >
                    <social.icon size={28} />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}