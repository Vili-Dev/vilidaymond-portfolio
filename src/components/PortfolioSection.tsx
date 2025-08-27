'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Heart, MessageCircle, Instagram } from 'lucide-react';
import ParallaxSection from './ParallaxSection';
import { fadeInScale, staggerContainer, defaultTransition } from '@/utils/animations';
import { MagneticButton, RippleEffect } from './InteractiveElements';
import { HolographicEffect, LiquidGradient } from './EnhancedGlowEffects';
import { MorphingButton } from './MorphingButtons';
import { FogOverlay } from './AtmosphericEffects';

interface ArtworkItem {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  likes: number;
  comments: number;
  featured: boolean;
  instagramUrl?: string;
}

const portfolioItems: ArtworkItem[] = [
  {
    id: 1,
    title: "Shadows of the Soul",
    description: "A haunting exploration of inner darkness and light",
    category: "Digital Art",
    image: "/api/placeholder/400/500",
    likes: 284,
    comments: 42,
    featured: true,
    instagramUrl: "#"
  },
  {
    id: 2,
    title: "Crimson Dreams",
    description: "Where reality bleeds into fantasy",
    category: "Conceptual",
    image: "/api/placeholder/400/600",
    likes: 197,
    comments: 28,
    featured: false,
    instagramUrl: "#"
  },
  {
    id: 3,
    title: "Midnight Reverie",
    description: "The beauty found in darkness",
    category: "Portrait",
    image: "/api/placeholder/400/500",
    likes: 356,
    comments: 67,
    featured: true,
    instagramUrl: "#"
  },
  {
    id: 4,
    title: "Urban Gothic",
    description: "Modern darkness meets classical beauty",
    category: "Street Art",
    image: "/api/placeholder/400/550",
    likes: 428,
    comments: 89,
    featured: false,
    instagramUrl: "#"
  },
  {
    id: 5,
    title: "Digital Noir",
    description: "Technology meets the shadows",
    category: "Digital Art",
    image: "/api/placeholder/400/480",
    likes: 312,
    comments: 45,
    featured: true,
    instagramUrl: "#"
  },
  {
    id: 6,
    title: "Blood Moon Rising",
    description: "When the night sky burns with passion",
    category: "Landscape",
    image: "/api/placeholder/400/520",
    likes: 589,
    comments: 124,
    featured: false,
    instagramUrl: "#"
  },
];

const categories = ["All", "Digital Art", "Conceptual", "Portrait", "Street Art", "Landscape"];

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<ArtworkItem | null>(null);
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredItems = selectedCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);


  return (
    <section id="portfolio" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-darkGray via-primary-black to-primary-darkGray"></div>
      
      <FogOverlay density={0.08} animated={true} />
      
      <ParallaxSection speed={0.4}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-shadow">
              <span className="text-secondary-white">My</span>{' '}
              <span className="gradient-text">Portfolio</span>
            </h2>
            <p className="text-lg text-secondary-lightGray max-w-2xl mx-auto">
              A collection of dark artistry, mysterious visions, and creative explorations 
              that push the boundaries between light and shadow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12 max-w-4xl mx-auto"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-red text-secondary-white shadow-lg'
                    : 'bg-transparent border border-secondary-gray text-secondary-lightGray hover:border-primary-red hover:text-primary-red'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="wait">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeInScale}
                  transition={defaultTransition}
                  layout
                  whileHover={{ y: -10, rotateY: 5, rotateX: 5 }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer"
                  style={{ transformPerspective: 1000 }}
                >
                  <HolographicEffect>
                    <RippleEffect className="relative overflow-hidden rounded-2xl glass-effect hover:red-glow transition-all duration-300">
                    <div className="aspect-[4/5] bg-gradient-to-br from-secondary-gray to-primary-darkGray">
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-black/60 to-transparent"></div>
                      
                      {item.featured && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 bg-primary-red text-secondary-white text-xs font-medium rounded-full">
                            Featured
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary-black/50">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.1 }}
                          className="p-4 bg-primary-red rounded-full"
                        >
                          <ExternalLink className="w-6 h-6 text-secondary-white" />
                        </motion.div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary-red transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-secondary-lightGray text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-secondary-gray">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {item.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {item.comments}
                            </span>
                          </div>
                          
                          {item.instagramUrl && (
                            <motion.a
                              href={item.instagramUrl}
                              whileHover={{ scale: 1.2, color: '#DC2626' }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-secondary-lightGray hover:text-primary-red transition-colors duration-200"
                            >
                              <Instagram className="w-4 h-4" />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                    </RippleEffect>
                  </HolographicEffect>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-20"
          >
            <LiquidGradient>
              <MorphingButton morphType="pulse">
                <Instagram className="w-5 h-5" />
                Follow on Instagram
              </MorphingButton>
            </LiquidGradient>
          </motion.div>
        </div>
      </ParallaxSection>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-4xl w-full glass-effect rounded-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-[4/5] bg-gradient-to-br from-secondary-gray to-primary-darkGray rounded-xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-secondary-lightGray">Artwork Preview</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-display text-3xl font-bold text-secondary-white mb-4">
                    {selectedItem.title}
                  </h3>
                  <p className="text-secondary-lightGray text-lg mb-6 leading-relaxed">
                    {selectedItem.description}
                  </p>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <span className="px-3 py-1 bg-primary-red text-secondary-white text-sm font-medium rounded-full">
                      {selectedItem.category}
                    </span>
                    <div className="flex items-center space-x-4 text-secondary-gray">
                      <span className="flex items-center gap-1">
                        <Heart className="w-5 h-5" />
                        {selectedItem.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-5 h-5" />
                        {selectedItem.comments}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    {selectedItem.instagramUrl && (
                      <motion.a
                        href={selectedItem.instagramUrl}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-red rounded-full text-secondary-white font-medium hover:bg-primary-darkRed transition-colors duration-300"
                      >
                        <Instagram className="w-5 h-5" />
                        View on Instagram
                      </motion.a>
                    )}
                    
                    <motion.button
                      onClick={() => setSelectedItem(null)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 border border-secondary-gray rounded-full text-secondary-lightGray hover:border-primary-red hover:text-primary-red transition-colors duration-300"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}