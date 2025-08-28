'use client';

import { motion } from 'framer-motion';
import { Heart, ArrowUp, Instagram, Mail, Github, ExternalLink } from 'lucide-react';

const socialLinks = [
  { 
    name: 'Instagram', 
    href: 'https://www.instagram.com/vilidaymond/', 
    icon: Instagram,
    description: 'Latest artworks & behind the scenes'
  },
  { 
    name: 'Email', 
    href: 'mailto:hello@vilidaymond.com', 
    icon: Mail,
    description: 'Get in touch for collaborations'
  },
  { 
    name: 'GitHub', 
    href: 'https://github.com/vilidaymond', 
    icon: Github,
    description: 'Code & creative experiments'
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-t from-primary-black to-primary-darkGray border-t border-secondary-gray/20 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="text-center lg:text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-6"
            >
              <h3 className="font-display text-3xl font-bold gradient-text mb-3">
                Vilidaymond
              </h3>
              <p className="text-secondary-lightGray text-lg leading-relaxed">
                Digital Artist & Creative Visionary
              </p>
              <p className="text-secondary-gray text-sm mt-2">
                Exploring the depths of mystery through art
              </p>
            </motion.div>
          </div>

          {/* Social Links Section */}
          <div className="text-center">
            <h4 className="text-xl font-semibold text-secondary-white mb-6">
              Connect & Follow
            </h4>
            <div className="flex justify-center space-x-6 mb-6">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <motion.a
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative flex flex-col items-center p-4 transition-all duration-300" style={{ marginTop: '10px' }}
                    aria-label={`Visit ${social.name}`}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <social.icon size={28} className="text-secondary-lightGray group-hover:text-primary-red transition-colors duration-300 mb-2" />
                    <span className="text-sm font-medium text-secondary-white group-hover:text-primary-red transition-colors duration-300">
                      {social.name}
                    </span>
                    {social.href.startsWith('http') && (
                      <ExternalLink size={12} className="absolute top-2 right-2 text-secondary-gray group-hover:text-primary-red/70 transition-colors duration-300" />
                    )}
                  </motion.a>
                  <p className="text-xs text-secondary-gray mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {social.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Back to Top & Info Section */}
          <div className="text-center lg:text-center flex flex-col items-center">
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-red/20 to-accent-crimson/20 hover:from-primary-red/30 hover:to-accent-crimson/30 rounded-full text-primary-red hover:text-accent-crimson transition-all duration-300 group shadow-lg hover:shadow-xl mb-6"
            >
              <ArrowUp className="w-7 h-7 group-hover:animate-bounce" />
            </motion.button>

            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-center space-x-2 text-secondary-lightGray text-sm">
                <span>© {currentYear} Vilidaymond</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-center space-x-2 text-secondary-lightGray text-sm">
                <span>Crafted with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-primary-red fill-current" />
                </motion.div>
                <span>and mystery</span>
              </div>

              <div className="text-xs text-secondary-gray space-y-1">
                <p>All artworks and content are original creations</p>
                <p>Unauthorized reproduction is prohibited</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-red to-transparent"></div>
    </footer>
  );
}