'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ParallaxSection from './ParallaxSection';
import { fadeInUp, staggerContainer, defaultTransition } from '@/utils/animations';
import { FloatingCard, PulsingElement } from './InteractiveElements';
import { AnimatedGradientBorder, MultiLayerGlow } from './EnhancedGlowEffects';
import { MistEffect } from './AtmosphericEffects';

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });


  return (
    <section id="about" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-black via-primary-darkGray to-primary-black"></div>
      
      <MistEffect intensity={0.2} speed={1.5} />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-red to-transparent"></div>
      
      <ParallaxSection speed={0.3}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center justify-center"
          >
            <motion.div 
              variants={fadeInUp} 
              transition={defaultTransition}
              className="order-2 lg:order-1"
            >
              <FloatingCard className="relative" intensity={8}>
                <motion.h2
                  variants={fadeInUp}
                  transition={defaultTransition}
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-shadow"
                >
                  <PulsingElement>
                    <span className="text-secondary-white">About</span>{' '}
                    <span className="gradient-text">Me</span>
                  </PulsingElement>
                </motion.h2>
                
                <motion.div 
                  variants={fadeInUp} 
                  transition={defaultTransition}
                  className="space-y-6 text-secondary-lightGray"
                >
                  <p className="text-lg leading-relaxed">
                    I am a digital artist who finds beauty in the shadows and mystery in the darkness. 
                    My work explores the intersection of light and shadow, creating atmospheric pieces 
                    that speak to the soul's deeper mysteries.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    Drawing inspiration from gothic aesthetics and contemporary digital art, I craft 
                    visual narratives that challenge perception and invite contemplation. Each piece 
                    is a journey into the unknown, a glimpse into worlds unseen.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    Through my art, I aim to evoke emotion, provoke thought, and create connections 
                    between the viewer and the mysterious realms that exist just beyond our everyday 
                    experience.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  transition={defaultTransition}
                  className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
                >
                  {[
                    { label: 'Years Creating', value: '5+' },
                    { label: 'Artworks', value: '150+' },
                    { label: 'Exhibitions', value: '12' },
                    { label: 'Awards', value: '8' },
                    { label: 'Collaborations', value: '25+' },
                    { label: 'Happy Clients', value: '100+' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center group"
                    >
                      <div className="text-2xl lg:text-3xl font-bold gradient-text mb-2 group-hover:animate-pulse">
                        {stat.value}
                      </div>
                      <div className="text-sm text-secondary-gray group-hover:text-secondary-lightGray transition-colors duration-300">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </FloatingCard>
            </motion.div>

            <motion.div 
              variants={fadeInUp} 
              transition={defaultTransition}
              className="order-1 lg:order-2"
            >
              <AnimatedGradientBorder className="relative group">
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-2xl glass-effect red-glow"
                >
                  <div className="aspect-[4/5] bg-gradient-to-br from-primary-darkGray via-secondary-gray to-primary-black">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-red/20 to-transparent opacity-50"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          boxShadow: [
                            '0 0 20px rgba(220, 38, 38, 0.3)',
                            '0 0 40px rgba(220, 38, 38, 0.6)',
                            '0 0 20px rgba(220, 38, 38, 0.3)',
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-32 h-32 bg-gradient-to-br from-primary-red to-primary-bloodRed rounded-full flex items-center justify-center"
                      >
                        <span className="text-2xl font-display text-secondary-white">VD</span>
                      </motion.div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="glass-effect rounded-lg p-4">
                        <h3 className="font-display text-xl text-secondary-white mb-1">Vili Daymond</h3>
                        <p className="text-secondary-lightGray text-sm">Digital Artist & Visionary</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-primary-red/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent-crimson/20 rounded-full blur-xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </AnimatedGradientBorder>
            </motion.div>
          </motion.div>
        </div>
      </ParallaxSection>
    </section>
  );
}