import { useState, useEffect, useCallback } from 'react';

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface InstagramData {
  posts: InstagramPost[];
  loading: boolean;
  error: string | null;
  cached: boolean;
  source: 'api' | 'mock' | null;
  lastUpdated: Date | null;
  totalFetched: number;
}

interface UseInstagramOptions {
  limit?: number;
  autoFetch?: boolean;
  refreshInterval?: number;
  retryOnError?: boolean;
  maxRetries?: number;
}

export function useInstagram(options: UseInstagramOptions = {}) {
  const {
    limit = 12,
    autoFetch = true,
    refreshInterval = 30 * 60 * 1000, // 30 minutes
    retryOnError = true,
    maxRetries = 3
  } = options;

  const [data, setData] = useState<InstagramData>({
    posts: [],
    loading: false,
    error: null,
    cached: false,
    source: null,
    lastUpdated: null,
    totalFetched: 0
  });

  const [retryCount, setRetryCount] = useState(0);

  const fetchPosts = useCallback(async (forceRefresh = false) => {
    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        ...(forceRefresh && { refresh: 'true' })
      });

      const response = await fetch(`/api/instagram?${searchParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': forceRefresh ? 'no-cache' : 'max-age=1800' // 30 min cache
        }
      });

      if (!response.ok) {
        throw new Error(`Instagram API responded with status ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch Instagram posts');
      }

      setData({
        posts: result.data || [],
        loading: false,
        error: null,
        cached: result.cached || false,
        source: result.source || 'api',
        lastUpdated: new Date(),
        totalFetched: result.totalFetched || 0
      });

      setRetryCount(0);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      // Retry logic
      if (retryOnError && retryCount < maxRetries) {
        console.log(`Instagram fetch failed, retrying... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
        
        // Exponential backoff
        setTimeout(() => {
          fetchPosts(forceRefresh);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        console.error('Instagram fetch failed after all retries:', errorMessage);
      }
    }
  }, [limit, retryOnError, maxRetries, retryCount]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchPosts();
    }
  }, [autoFetch, fetchPosts]);

  // Auto-refresh interval
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      if (!data.loading) {
        fetchPosts(false); // Don't force refresh, use cache
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, data.loading, fetchPosts]);

  const refresh = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  const retry = useCallback(() => {
    setRetryCount(0);
    fetchPosts(true);
  }, [fetchPosts]);

  // Get posts by category (based on hashtags in caption)
  const getPostsByCategory = useCallback((category: string) => {
    if (!category || category === 'all') return data.posts;
    
    return data.posts.filter(post => {
      const caption = post.caption?.toLowerCase() || '';
      
      switch (category.toLowerCase()) {
        case 'digital':
          return caption.includes('#digitalart') || caption.includes('#digital');
        case 'portrait':
          return caption.includes('#portrait') || caption.includes('#darkart');
        case 'conceptual':
          return caption.includes('#conceptual') || caption.includes('#surreal');
        case 'street':
          return caption.includes('#street') || caption.includes('#urban');
        case 'landscape':
          return caption.includes('#landscape') || caption.includes('#moody');
        default:
          return caption.includes(`#${category.toLowerCase()}`);
      }
    });
  }, [data.posts]);

  // Get recent posts (last 7 days)
  const getRecentPosts = useCallback(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return data.posts.filter(post => {
      const postDate = new Date(post.timestamp);
      return postDate > weekAgo;
    });
  }, [data.posts]);

  // Get featured posts (with most engagement indicators in captions)
  const getFeaturedPosts = useCallback(() => {
    return data.posts
      .filter(post => {
        const caption = post.caption?.toLowerCase() || '';
        return caption.includes('featured') || 
               caption.includes('vilidaymondart') ||
               caption.length > 100; // Longer captions usually indicate more important posts
      })
      .slice(0, 6);
  }, [data.posts]);

  return {
    ...data,
    // Actions
    refresh,
    retry,
    fetchPosts,
    
    // Computed data
    hasError: !!data.error,
    isEmpty: data.posts.length === 0 && !data.loading,
    isStale: data.lastUpdated ? 
      (Date.now() - data.lastUpdated.getTime()) > refreshInterval : 
      true,
    
    // Filtered data
    getPostsByCategory,
    getRecentPosts,
    getFeaturedPosts,
    
    // Stats
    stats: {
      total: data.posts.length,
      recent: getRecentPosts().length,
      featured: getFeaturedPosts().length,
      categories: {
        digital: getPostsByCategory('digital').length,
        portrait: getPostsByCategory('portrait').length,
        conceptual: getPostsByCategory('conceptual').length,
        street: getPostsByCategory('street').length,
        landscape: getPostsByCategory('landscape').length,
      }
    }
  };
}