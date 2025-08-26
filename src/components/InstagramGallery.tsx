'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInstagram } from '@/hooks/useInstagram';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useImagePreloader } from '@/utils/imagePreloader';
import { useApp } from '@/contexts/AppContext';
import EnhancedErrorBoundary, { FeatureErrorBoundary } from './EnhancedErrorBoundary';

interface InstagramGalleryProps {
  limit?: number;
  showHeader?: boolean;
  categories?: string[];
  viewMode?: 'grid' | 'masonry' | 'carousel';
  className?: string;
}

export default function InstagramGallery({
  limit = 12,
  showHeader = true,
  categories = ['all', 'digital', 'portrait', 'conceptual', 'street', 'landscape'],
  viewMode: initialViewMode = 'grid',
  className = ''
}: InstagramGalleryProps) {
  const {
    posts,
    loading,
    error,
    source,
    cached,
    refresh,
    retry,
    stats,
    getPostsByCategory,
    getFeaturedPosts
  } = useInstagram({ limit });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { preloadMultiple } = useImagePreloader();
  const { state } = useApp();

  // Preload images when posts load
  useEffect(() => {
    if (posts.length > 0) {
      const imagesToPreload = posts
        .slice(0, 6) // Preload first 6 images
        .map(post => ({
          src: post.media_url,
          options: { priority: 'high' as const }
        }));
      
      preloadMultiple(imagesToPreload);
    }
  }, [posts, preloadMultiple]);

  const filteredPosts = selectedCategory === 'featured' 
    ? getFeaturedPosts() 
    : getPostsByCategory(selectedCategory);

  const [containerRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true
  });

  if (!isVisible) {
    return (
      <div ref={containerRef} className={`min-h-96 ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-secondary-lightGray">
            Loading Instagram gallery...
          </div>
        </div>
      </div>
    );
  }

  if (error && !posts.length) {
    return (
      <FeatureErrorBoundary feature="Instagram Gallery">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-primary-red/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-secondary-lightGray mb-4">Unable to load Instagram posts</p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-primary-red hover:bg-primary-darkRed text-white rounded-lg transition-colors hover-optimized"
            data-audio-click
          >
            Try Again
          </button>
        </div>
      </FeatureErrorBoundary>
    );
  }

  return (
    <div ref={containerRef} className={`${className}`}>
      {showHeader && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-secondary-white mb-2">
                Latest from{' '}
                <a 
                  href="https://www.instagram.com/vilidaymond/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gradient-text hover:opacity-80 transition-opacity"
                  data-audio-hover
                >
                  @vilidaymond
                </a>
              </h2>
              <p className="text-secondary-lightGray">
                {source === 'mock' 
                  ? `Curated selection of dark artistic visions (${posts.length} posts)`
                  : `${posts.length} recent posts${cached ? ' (cached)' : ''}`
                }
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              {/* View Mode Toggle */}
              <div className="flex bg-primary-darkGray rounded-lg p-1">
                {['grid', 'masonry'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      viewMode === mode
                        ? 'bg-primary-red text-white'
                        : 'text-secondary-lightGray hover:text-secondary-white'
                    }`}
                    data-audio-click
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <button
                onClick={refresh}
                disabled={loading}
                className="p-2 text-secondary-lightGray hover:text-secondary-white disabled:opacity-50 transition-colors hover-optimized"
                title="Refresh"
                data-audio-click
              >
                <svg 
                  className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-2">
            {[...categories, 'featured'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all hover-optimized ${
                  selectedCategory === category
                    ? 'bg-primary-red text-white shadow-lg'
                    : 'bg-primary-darkGray text-secondary-lightGray hover:bg-secondary-gray hover:text-secondary-white'
                }`}
                data-audio-click
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                <span className="ml-2 text-xs opacity-70">
                  {category === 'all' ? posts.length : 
                   category === 'featured' ? getFeaturedPosts().length :
                   getPostsByCategory(category).length}
                </span>
              </button>
            ))}
          </div>

          {/* Stats */}
          {stats.total > 0 && (
            <div className="text-xs text-secondary-lightGray">
              Showing {filteredPosts.length} of {stats.total} posts
              {source === 'api' && ' • Live from Instagram'}
              {source === 'mock' && ' • Demo content'}
            </div>
          )}
        </motion.div>
      )}

      {/* Gallery Grid */}
      {loading && posts.length === 0 ? (
        <LoadingSkeleton />
      ) : (
        <InstagramGrid
          posts={filteredPosts}
          viewMode={viewMode}
          onPostClick={setSelectedPost}
        />
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedPost && (
          <InstagramModal 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
          />
        )}
      </AnimatePresence>

      {/* Load More Button */}
      {filteredPosts.length > 0 && posts.length >= limit && (
        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/vilidaymond/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all hover-optimized"
            data-audio-click
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            View More on Instagram
          </a>
        </div>
      )}
    </div>
  );
}

// Sub-components
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="aspect-square skeleton-loading rounded-lg" />
      ))}
    </div>
  );
}

function InstagramGrid({ 
  posts, 
  viewMode, 
  onPostClick 
}: { 
  posts: any[], 
  viewMode: string, 
  onPostClick: (post: any) => void 
}) {
  const gridClass = viewMode === 'masonry' 
    ? 'columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'
    : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

  return (
    <motion.div 
      className={gridClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          className={`relative group cursor-pointer overflow-hidden rounded-lg bg-primary-darkGray ${
            viewMode === 'grid' ? 'aspect-square' : ''
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => onPostClick(post)}
          data-audio-hover
          data-audio-click
        >
          <img
            src={post.thumbnail_url || post.media_url}
            alt={post.caption?.slice(0, 50) || 'Instagram post'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm line-clamp-2">
                {post.caption?.slice(0, 100)}...
              </p>
              <div className="flex items-center mt-2 text-xs text-gray-300">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                {new Date(post.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function InstagramModal({ post, onClose }: { post: any, onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl max-h-[90vh] glass-effect rounded-lg overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          data-audio-click
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          <div className="flex-1 flex items-center justify-center bg-black">
            <img
              src={post.media_url}
              alt={post.caption}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>

          <div className="lg:w-80 p-6 bg-primary-darkGray overflow-y-auto">
            <div className="mb-4">
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-red hover:text-primary-darkRed transition-colors"
                data-audio-hover
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                View on Instagram
              </a>
            </div>

            {post.caption && (
              <div className="mb-4">
                <p className="text-secondary-white text-sm leading-relaxed">
                  {post.caption}
                </p>
              </div>
            )}

            <div className="text-xs text-secondary-lightGray">
              {new Date(post.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}