interface PreloadOptions {
  priority?: 'high' | 'normal' | 'low';
  formats?: string[];
  sizes?: string[];
  crossOrigin?: 'anonymous' | 'use-credentials';
}

interface PreloadedImage {
  src: string;
  loaded: boolean;
  error: boolean;
  element?: HTMLImageElement;
}

class ImagePreloader {
  private cache = new Map<string, PreloadedImage>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();
  private observer?: IntersectionObserver;
  private priorityQueue: { src: string; priority: number; options: PreloadOptions }[] = [];
  private isProcessingQueue = false;

  constructor() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              this.preload(src, { priority: 'high' });
              this.observer?.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );
  }

  private getPriorityScore(priority: PreloadOptions['priority']): number {
    switch (priority) {
      case 'high': return 3;
      case 'normal': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }

  private processQueue() {
    if (this.isProcessingQueue || this.priorityQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    // Sort by priority
    this.priorityQueue.sort((a, b) => b.priority - a.priority);

    // Process up to 3 images concurrently
    const concurrent = Math.min(3, this.priorityQueue.length);
    const toProcess = this.priorityQueue.splice(0, concurrent);

    Promise.allSettled(
      toProcess.map(({ src, options }) => this.loadImage(src, options))
    ).finally(() => {
      this.isProcessingQueue = false;
      // Continue processing if there are more items
      if (this.priorityQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    });
  }

  private async loadImage(src: string, options: PreloadOptions = {}): Promise<HTMLImageElement> {
    // Check if already loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Check cache
    const cached = this.cache.get(src);
    if (cached) {
      if (cached.loaded && cached.element) {
        return cached.element;
      }
      if (cached.error) {
        throw new Error(`Failed to load image: ${src}`);
      }
    }

    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      if (options.crossOrigin) {
        img.crossOrigin = options.crossOrigin;
      }

      // Set up event handlers
      const cleanup = () => {
        this.loadingPromises.delete(src);
      };

      img.onload = () => {
        this.cache.set(src, {
          src,
          loaded: true,
          error: false,
          element: img
        });
        cleanup();
        resolve(img);
      };

      img.onerror = () => {
        this.cache.set(src, {
          src,
          loaded: false,
          error: true
        });
        cleanup();
        reject(new Error(`Failed to load image: ${src}`));
      };

      // Start loading
      img.src = src;
    });

    this.loadingPromises.set(src, loadPromise);
    return loadPromise;
  }

  public preload(src: string, options: PreloadOptions = {}): Promise<HTMLImageElement> {
    const priority = this.getPriorityScore(options.priority);
    
    // Add to queue
    this.priorityQueue.push({ src, priority, options });
    
    // Start processing
    this.processQueue();
    
    // Return the loading promise
    return this.loadingPromises.get(src) || this.loadImage(src, options);
  }

  public preloadMultiple(sources: Array<{ src: string; options?: PreloadOptions }>): Promise<HTMLImageElement[]> {
    const promises = sources.map(({ src, options = {} }) => {
      return this.preload(src, options).catch(() => null); // Don't fail all if one fails
    });

    return Promise.all(promises).then(results => 
      results.filter((img): img is HTMLImageElement => img !== null)
    );
  }

  public isLoaded(src: string): boolean {
    const cached = this.cache.get(src);
    return cached?.loaded === true;
  }

  public isLoading(src: string): boolean {
    return this.loadingPromises.has(src);
  }

  public preloadCriticalImages(sources: string[]): Promise<void> {
    return new Promise((resolve) => {
      const promises = sources.map(src => 
        this.preload(src, { priority: 'high' }).catch(() => null)
      );

      Promise.allSettled(promises).then(() => resolve());
    });
  }

  public observeImage(img: HTMLImageElement, src: string) {
    if (this.observer && src) {
      img.dataset.src = src;
      this.observer.observe(img);
    }
  }

  public preloadImageFormats(baseSrc: string, formats: string[] = ['webp', 'avif', 'jpg']): Promise<string> {
    return new Promise((resolve, reject) => {
      const tryFormat = (index: number) => {
        if (index >= formats.length) {
          reject(new Error(`No supported format found for ${baseSrc}`));
          return;
        }

        const format = formats[index];
        const src = baseSrc.replace(/\.[^.]+$/, `.${format}`);
        
        this.preload(src)
          .then(() => resolve(src))
          .catch(() => tryFormat(index + 1));
      };

      tryFormat(0);
    });
  }

  public clear(): void {
    this.cache.clear();
    this.loadingPromises.clear();
    this.priorityQueue.length = 0;
  }

  public getStats() {
    const loaded = Array.from(this.cache.values()).filter(img => img.loaded).length;
    const failed = Array.from(this.cache.values()).filter(img => img.error).length;
    const loading = this.loadingPromises.size;

    return {
      loaded,
      failed,
      loading,
      queued: this.priorityQueue.length,
      cached: this.cache.size
    };
  }
}

// Singleton instance
export const imagePreloader = new ImagePreloader();

// React hook for image preloading
export function useImagePreloader() {
  return {
    preload: imagePreloader.preload.bind(imagePreloader),
    preloadMultiple: imagePreloader.preloadMultiple.bind(imagePreloader),
    isLoaded: imagePreloader.isLoaded.bind(imagePreloader),
    isLoading: imagePreloader.isLoading.bind(imagePreloader),
    observeImage: imagePreloader.observeImage.bind(imagePreloader),
    getStats: imagePreloader.getStats.bind(imagePreloader)
  };
}