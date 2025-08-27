'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-display font-bold gradient-text mb-4">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-red to-accent-crimson mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-secondary-white">
              Page Introuvable
            </h2>
            <p className="text-secondary-lightGray text-lg leading-relaxed">
              La page que vous recherchez semble avoir disparu dans les ombres.
              <br />
              Elle n&apos;existe peut-être plus ou a été déplacée.
            </p>
          </div>

          {/* Navigation Options */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-primary-red hover:bg-primary-darkRed text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Retour à l&apos;Accueil
            </Link>
            
            <Link
              href="#portfolio"
              className="inline-block px-8 py-3 border border-secondary-gray hover:border-secondary-white text-secondary-white hover:text-white font-medium rounded-lg transition-all duration-300"
            >
              Voir le Portfolio
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 opacity-30">
            <div className="flex justify-center space-x-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary-red rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}