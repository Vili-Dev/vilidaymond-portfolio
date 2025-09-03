'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Heart, MessageCircle, Instagram } from 'lucide-react';
import ParallaxSection from './ParallaxSection';
import { useAnimations } from '@/utils/animations';
import { MagneticButton, RippleEffect } from './InteractiveElements';
import { HolographicEffect, LiquidGradient } from './EnhancedGlowEffects';
import { MorphingButton } from './MorphingButtons';
import { FogOverlay } from './AtmosphericEffects';

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface ArtworkItem {
  id: string;
  title: string;
  description: string;
  image: string;
  instagramUrl: string;
  timestamp: string;
}

export default function PortfolioSection() {
  const { fadeInScale, staggerContainer, defaultTransition } = useAnimations();
  const [selectedItem, setSelectedItem] = useState<ArtworkItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<ArtworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Function to extract title from Instagram caption
  const extractTitle = (caption: string): string => {
    if (!caption) return 'Untitled Artwork';
    
    // Try to extract first sentence or first meaningful phrase
    const sentences = caption.split(/[.!?]/);
    if (sentences[0] && sentences[0].length > 3) {
      return sentences[0].trim().substring(0, 50);
    }
    
    // Fallback to first words
    const words = caption.split(' ').slice(0, 6).join(' ');
    return words.length > 3 ? words : 'Untitled Artwork';
  };

  // Function to clean Instagram caption for description
  const extractDescription = (caption: string): string => {
    if (!caption) return 'AI-generated artwork created with ComfyUI and Photoshop';
    
    // Remove hashtags and clean up
    const cleaned = caption
      .replace(/#\w+/g, '') // Remove hashtags
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    return cleaned.substring(0, 120) || 'AI-generated artwork created with ComfyUI and Photoshop';
  };

  // Fetch Instagram posts
  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/.netlify/functions/instagram');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch Instagram posts');
        }
        
        // Transform Instagram posts to ArtworkItem format
        const transformedItems: ArtworkItem[] = data.data.map((post: InstagramPost) => ({
          id: post.id,
          title: extractTitle(post.caption || ''),
          description: extractDescription(post.caption || ''),
          image: post.media_url,
          instagramUrl: post.permalink,
          timestamp: post.timestamp
        }));
        
        setPortfolioItems(transformedItems);
        console.log('Portfolio items loaded:', transformedItems.length, transformedItems);
      } catch (err) {
        console.error('Error fetching Instagram posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);


  return (
    <section id="portfolio" className="relative py-20 lg:py-32 flex flex-col items-center" style={{ marginTop: '50px' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary-darkGray via-primary-black to-primary-darkGray"></div>
      
      <FogOverlay density={0.08} animated={true} />
      
      <ParallaxSection speed={0.4}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20 max-w-5xl mx-auto"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-shadow">
              <span className="text-secondary-white">My</span>{' '}
              <span className="gradient-text">Portfolio</span>
            </h2>
            <p className="text-lg text-secondary-lightGray mx-auto">
              A showcase of AI-generated artworks, ComfyUI workflows, and Photoshop enhancements 
              that demonstrate the fusion of artificial intelligence and human creativity.
            </p>
          </motion.div>


          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto justify-items-center"
            >
              {[...Array(6)].map((_, index) => (
                <div key={index} className="relative overflow-hidden rounded-2xl glass-effect">
                  <div className="aspect-[4/5] bg-gradient-to-br from-secondary-gray to-primary-darkGray animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="h-6 bg-secondary-gray rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-secondary-darkGray rounded mb-4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="glass-effect rounded-2xl p-8">
                <h3 className="text-xl text-secondary-white mb-4">Unable to Load Portfolio</h3>
                <p className="text-secondary-lightGray mb-6">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-primary-red rounded-full text-secondary-white font-medium hover:bg-primary-darkRed transition-colors duration-300"
                >
                  Retry
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto justify-items-center"
            >
              {console.log('Rendering portfolio items:', portfolioItems.length)}
              {portfolioItems.map((item) => (
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
                      <div className="aspect-[4/5] relative bg-gradient-to-br from-secondary-gray to-primary-darkGray">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover relative z-10"
                          onError={(e) => {
                            // Fallback to gradient background if image fails to load
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-black/80 to-transparent z-20"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary-black/50 z-30">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1.1 }}
                            className="p-4 bg-primary-red rounded-full"
                          >
                            <ExternalLink className="w-6 h-6 text-secondary-white" />
                          </motion.div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-30">
                          <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary-red transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-secondary-lightGray text-sm mb-4 line-clamp-2">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-secondary-gray">
                              {new Date(item.timestamp).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            
                            <motion.a
                              href={item.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.2, color: '#DC2626' }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-secondary-lightGray hover:text-primary-red transition-colors duration-200"
                              aria-label="View on Instagram"
                            >
                              <Instagram className="w-4 h-4" />
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </RippleEffect>
                  </HolographicEffect>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-24 w-full"
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
                <div className="aspect-[4/5] rounded-xl overflow-hidden relative bg-gradient-to-br from-secondary-gray to-primary-darkGray flex items-center justify-center">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title}
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <span className="text-secondary-lightGray">Loading artwork...</span>
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
                    <div className="text-secondary-gray">
                      <span className="text-sm">Posted on </span>
                      <span className="text-secondary-lightGray">
                        {new Date(selectedItem.timestamp).toLocaleDateString('en-US', { 
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <motion.a
                      href={selectedItem.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-red rounded-full text-secondary-white font-medium hover:bg-primary-darkRed transition-colors duration-300"
                    >
                      <Instagram className="w-5 h-5" />
                      View on Instagram
                    </motion.a>
                    
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