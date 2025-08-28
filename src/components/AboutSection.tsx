'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ParallaxSection from './ParallaxSection';
import { useAnimations } from '@/utils/animations';
import { FloatingCard, PulsingElement } from './InteractiveElements';
import { AnimatedGradientBorder, MultiLayerGlow } from './EnhancedGlowEffects';
import { MistEffect } from './AtmosphericEffects';

export default function AboutSection() {
  const { fadeInUp, staggerContainer, defaultTransition } = useAnimations();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });


  return (
    <section id="about" className="relative py-20 lg:py-32 mt-32 lg:mt-40 mb-32 lg:mb-40">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-black via-primary-darkGray to-primary-black"></div>
      
      <MistEffect intensity={0.2} speed={1.5} />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-red to-transparent"></div>
      
      <ParallaxSection speed={0.3}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 justify-center flex">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-24 items-center justify-center max-w-7xl mx-auto"
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
                    I am an AI artist who harnesses the power of artificial intelligence to create 
                    captivating visual experiences. Using ComfyUI as my primary creative tool, I craft 
                    intricate workflows that transform imagination into stunning digital art.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    My expertise lies in combining the precision of AI-generated imagery with the 
                    refined touch of Photoshop post-processing. This hybrid approach allows me to 
                    maintain creative control while leveraging AI's infinite possibilities.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    From concept art to final masterpiece, I bridge the gap between human creativity 
                    and artificial intelligence, creating works that push the boundaries of what's 
                    possible in digital art.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  transition={defaultTransition}
                  className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center"
                >
                  {[
                    { label: 'Years with AI', value: '3+' },
                    { label: 'AI Artworks', value: '500+' },
                    { label: 'ComfyUI Workflows', value: '50+' },
                    { label: 'Photoshop Projects', value: '200+' },
                    { label: 'AI Models Trained', value: '15+' },
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
                        <span className="text-2xl font-display text-secondary-white">Vili</span>
                      </motion.div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="glass-effect rounded-lg p-4">
                        <h3 className="font-display text-xl text-secondary-white mb-1">Vili Daymond</h3>
                        <p className="text-secondary-lightGray text-sm">AI Artist & ComfyUI Specialist</p>
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